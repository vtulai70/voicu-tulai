import { buildSystemPrompt } from "@/lib/twin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = "openai/gpt-oss-120b";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const MAX_MESSAGES = 20;
const MAX_CHARS = 2000;

// Best-effort in-memory rate limit: N requests per window per IP. State is per server instance
// (soft on serverless); the OpenRouter credit cap is the hard backstop.
const WINDOW_MS = 5 * 60 * 1000;
const MAX_REQUESTS = 30;
const SWEEP_THRESHOLD = 1000;
const hits = new Map<string, number[]>();

function sweep(now: number) {
  for (const [ip, times] of hits) {
    if (now - times[times.length - 1] >= WINDOW_MS) hits.delete(ip);
  }
}

function rateLimited(ip: string) {
  const now = Date.now();
  if (hits.size > SWEEP_THRESHOLD) sweep(now);
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_REQUESTS;
}

/**
 * Only accept same-origin JSON. Requiring application/json forces a CORS preflight (which fails,
 * since we send no CORS headers), so other sites can't make visitors' browsers spend our credits
 * with "simple" text/plain POSTs. Sec-Fetch-Site is an extra check in modern browsers;
 * non-browser clients don't send it.
 */
function rejectCrossSite(req: Request): Response | null {
  const type = req.headers.get("content-type") ?? "";
  if (!type.toLowerCase().startsWith("application/json")) return json(415, "Unsupported content type.");
  const site = req.headers.get("sec-fetch-site");
  if (site && site !== "same-origin" && site !== "none") return json(403, "Forbidden.");
  return null;
}

type ChatMessage = { role: "user" | "assistant"; content: string };

function parseMessages(body: unknown): ChatMessage[] | null {
  if (!body || typeof body !== "object" || !Array.isArray((body as { messages?: unknown }).messages)) return null;
  const raw = (body as { messages: unknown[] }).messages.slice(-MAX_MESSAGES);
  const out: ChatMessage[] = [];
  for (const m of raw) {
    if (!m || typeof m !== "object") return null;
    const { role, content } = m as { role?: unknown; content?: unknown };
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return null;
    const trimmed = content.trim().slice(0, MAX_CHARS);
    if (trimmed) out.push({ role, content: trimmed });
  }
  if (!out.length || out[out.length - 1].role !== "user") return null;
  return out;
}

// gpt-oss emits narrow/no-break spaces and non-breaking hyphens that render oddly in web fonts.
const normalize = (t: string) => t.replace(/[\u00A0\u202F\u2007]/g, " ").replace(/[\u2010\u2011]/g, "-");

const json = (status: number, error: string) =>
  new Response(JSON.stringify({ error }), { status, headers: { "Content-Type": "application/json" } });

export async function POST(req: Request) {
  const rejected = rejectCrossSite(req);
  if (rejected) return rejected;

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return json(500, "The digital twin is not configured.");

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited(ip)) return json(429, "Too many messages. Please wait a few minutes and try again.");

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json(400, "Invalid request.");
  }
  const messages = parseMessages(body);
  if (!messages) return json(400, "Invalid request.");

  let upstream: Response;
  try {
    upstream = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": req.headers.get("origin") ?? "http://localhost:3000",
        "X-Title": "Voicu Tulai Digital Twin",
      },
      body: JSON.stringify({
        model: MODEL,
        stream: true,
        temperature: 0.3,
        max_tokens: 1200,
        reasoning: { effort: "low", exclude: true },
        messages: [{ role: "system", content: buildSystemPrompt() }, ...messages],
      }),
      signal: req.signal,
    });
  } catch {
    return json(502, "Couldn't reach the AI service. Please try again.");
  }

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "");
    console.error(`[chat] OpenRouter ${upstream.status}: ${detail.slice(0, 500)}`);
    return json(502, "The digital twin is unavailable right now. Please try again shortly.");
  }

  // Convert OpenRouter's SSE stream into a plain text stream of content deltas.
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  const reader = upstream.body.getReader();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let buffer = "";
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          let nl: number;
          while ((nl = buffer.indexOf("\n")) !== -1) {
            const line = buffer.slice(0, nl).trim();
            buffer = buffer.slice(nl + 1);
            if (!line.startsWith("data:")) continue; // skips ": OPENROUTER PROCESSING" keep-alives
            const data = line.slice(5).trim();
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.error) {
                console.error("[chat] stream error:", parsed.error);
                controller.enqueue(encoder.encode("\n\n_Sorry, something went wrong. Please try again._"));
                continue;
              }
              const delta: string | undefined = parsed.choices?.[0]?.delta?.content;
              if (delta) controller.enqueue(encoder.encode(normalize(delta)));
            } catch {
              // partial or non-JSON line; ignore
            }
          }
        }
      } catch (err) {
        if (!req.signal.aborted) console.error("[chat] stream failed:", err);
      } finally {
        controller.close();
      }
    },
    cancel() {
      reader.cancel().catch(() => {});
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}
