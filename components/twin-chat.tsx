"use client";

import { Fragment, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { profile } from "@/lib/data";

type Msg = { role: "user" | "assistant"; content: string };

export const OPEN_TWIN_EVENT = "twin:open";

const SUGGESTIONS = [
  "What's your leadership style?",
  "How did you modernize CI/CD at Tableau?",
  "What do you do outside of work?",
  "How are you bringing AI into software delivery?",
];

/* ---------- tiny, safe markdown: paragraphs, "- " bullets, **bold** ---------- */

function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") && part.length > 4 ? (
      <strong key={i} className="font-medium text-fg">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <Fragment key={i}>{part.replace(/(^|\s)_([^_]+)_(?=\s|$)/g, "$1$2")}</Fragment>
    ),
  );
}

function Rich({ text }: { text: string }) {
  const blocks: ReactNode[] = [];
  let list: string[] = [];
  const flush = () => {
    if (!list.length) return;
    blocks.push(
      <ul key={`l${blocks.length}`} className="space-y-1.5">
        {list.map((li, i) => (
          <li key={i} className="flex gap-2.5">
            <span aria-hidden className="mt-[0.7em] h-px w-2.5 shrink-0 bg-acid/80" />
            <span>{inline(li)}</span>
          </li>
        ))}
      </ul>,
    );
    list = [];
  };
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    const bullet = line.match(/^(?:[-*•]|\d+[.)])\s+(.*)$/);
    if (bullet) {
      list.push(bullet[1]);
    } else {
      flush();
      if (line) blocks.push(<p key={`p${blocks.length}`}>{inline(line.replace(/^#+\s*/, ""))}</p>);
    }
  }
  flush();
  return <div className="space-y-3">{blocks}</div>;
}

/* ---------- component ---------- */

export function TwinChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_TWIN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_TWIN_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 250);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, streaming]);

  const send = useCallback(
    async (text: string, base: Msg[] = messages) => {
      const content = text.trim();
      if (!content || streaming) return;
      setError(null);
      const history: Msg[] = [...base, { role: "user", content }];
      setMessages([...history, { role: "assistant", content: "" }]);
      setInput("");
      setStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history }),
          signal: controller.signal,
        });
        if (!res.ok || !res.body) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Something went wrong. Please try again.");
        }
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          setMessages([...history, { role: "assistant", content: acc }]);
        }
        if (!acc.trim()) throw new Error("No response received. Please try again.");
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          setMessages((m) => (m[m.length - 1]?.content ? m : m.slice(0, -1)));
        } else {
          setMessages(history);
          setError((err as Error).message);
        }
      } finally {
        setStreaming(false);
        abortRef.current = null;
      }
    },
    [messages, streaming],
  );

  const reset = () => {
    abortRef.current?.abort();
    setMessages([]);
    setError(null);
    inputRef.current?.focus();
  };

  return (
    <>
      {/* launcher */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Chat with my digital twin"
        className={`group fixed bottom-5 right-5 z-[55] flex items-center gap-3 border border-acid/40 bg-ink/85 py-2 pl-2 pr-2 shadow-[0_10px_40px_-10px_rgba(212,255,58,0.35)] backdrop-blur-xl transition-all duration-500 hover:border-acid sm:pr-5 ${
          open ? "pointer-events-none translate-y-4 opacity-0" : "opacity-100"
        }`}
      >
        <Avatar size="sm" />
        <span className="hidden text-left sm:block">
          <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-acid">Digital twin</span>
          <span className="block text-[13px] text-fg">Ask me anything</span>
        </span>
      </button>

      {/* panel */}
      <div
        role="dialog"
        aria-modal="false"
        aria-label="Digital twin chat"
        aria-hidden={!open}
        className={`fixed inset-0 z-[56] flex flex-col border-line bg-ink-2/95 backdrop-blur-2xl transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] sm:inset-auto sm:bottom-5 sm:right-5 sm:h-[min(680px,calc(100dvh-2.5rem))] sm:w-[420px] sm:border sm:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] ${
          open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
        }`}
      >
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-acid/70 to-transparent" />

        {/* header */}
        <div className="flex items-center gap-3 border-b border-line px-4 py-3.5">
          <Avatar size="md" />
          <div className="min-w-0 flex-1">
            <div className="font-display text-[15px] font-medium tracking-tight">{profile.firstName}&apos;s Digital Twin</div>
            <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
              <span className={`h-1.5 w-1.5 rounded-full ${streaming ? "animate-blink bg-signal" : "bg-acid"}`} />
              {streaming ? "Thinking" : "AI · Online"}
            </div>
          </div>
          {messages.length > 0 && (
            <IconButton label="New conversation" onClick={reset}>
              <path d="M3 8a5 5 0 1 0 1.5-3.5M3 3v2.5h2.5" />
            </IconButton>
          )}
          <IconButton label="Close chat" onClick={() => setOpen(false)}>
            <path d="M4 4l8 8M12 4l-8 8" />
          </IconButton>
        </div>

        {/* messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain px-4 py-5">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col">
              <div className="border border-line bg-ink/60 p-4 text-[14px] leading-relaxed text-muted">
                <p>
                  Hi, I&apos;m <span className="text-fg">{profile.firstName}&apos;s digital twin</span>, an AI trained on
                  my career history. Ask me about my experience, how I lead teams, or how I&apos;m bringing AI into
                  software delivery.
                </p>
              </div>
              <div className="mt-auto pt-6">
                <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-faint">Try asking</div>
                <div className="flex flex-col gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="group flex items-center justify-between gap-3 border border-line px-3.5 py-2.5 text-left text-[13.5px] text-fg transition-colors hover:border-acid/60 hover:bg-acid/[0.04]"
                    >
                      {s}
                      <span className="font-mono text-faint transition-colors group-hover:text-acid">→</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5" aria-live="polite">
              {messages.map((m, i) =>
                m.role === "user" ? (
                  <div key={i} className="flex justify-end">
                    <div className="max-w-[85%] whitespace-pre-wrap border border-acid/25 bg-acid/[0.07] px-3.5 py-2.5 text-[14px] leading-relaxed text-fg">
                      {m.content}
                    </div>
                  </div>
                ) : (
                  <div key={i} className="flex gap-3">
                    <div className="mt-0.5 shrink-0">
                      <Avatar size="xs" />
                    </div>
                    <div className="min-w-0 flex-1 text-[14px] leading-relaxed text-muted">
                      {m.content ? (
                        <>
                          <Rich text={m.content} />
                          {streaming && i === messages.length - 1 && (
                            <span className="ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 animate-blink bg-acid" />
                          )}
                        </>
                      ) : (
                        <TypingDots />
                      )}
                    </div>
                  </div>
                ),
              )}
              {error && (
                <div className="flex items-start justify-between gap-3 border border-red-400/30 bg-red-400/[0.06] px-3.5 py-2.5 text-[13px] text-red-200">
                  <span>{error}</span>
                  <button
                    className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-red-200/80 hover:text-red-100"
                    onClick={() => {
                      const last = messages[messages.length - 1];
                      if (last?.role === "user") send(last.content, messages.slice(0, -1));
                    }}
                  >
                    Retry
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* composer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="border-t border-line p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
        >
          <div className="flex items-end gap-2 border border-line-strong bg-ink/70 p-1.5 transition-colors focus-within:border-acid/60">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  send(input);
                }
              }}
              rows={1}
              maxLength={2000}
              placeholder="Ask about my career…"
              aria-label="Message"
              className="max-h-[140px] min-h-[38px] flex-1 resize-none bg-transparent px-2.5 py-2 text-[14px] text-fg outline-none placeholder:text-faint"
            />
            {streaming ? (
              <button
                type="button"
                onClick={() => abortRef.current?.abort()}
                aria-label="Stop generating"
                className="grid h-[38px] w-[38px] shrink-0 place-items-center border border-line-strong text-fg transition-colors hover:border-fg"
              >
                <span className="h-2.5 w-2.5 bg-current" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                aria-label="Send message"
                className="grid h-[38px] w-[38px] shrink-0 place-items-center bg-acid text-ink transition-all hover:bg-white disabled:bg-white/10 disabled:text-faint"
              >
                <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4" aria-hidden>
                  <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </button>
            )}
          </div>
          <p className="mt-2 px-1 font-mono text-[9.5px] uppercase tracking-[0.16em] text-faint">
            AI-generated · may be imperfect · verify key details
          </p>
        </form>
      </div>
    </>
  );
}

/** Button that opens the twin from anywhere on the page. */
export function OpenTwinButton({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(OPEN_TWIN_EVENT))}>
      {children}
    </button>
  );
}

function Avatar({ size }: { size: "xs" | "sm" | "md" }) {
  const dims = { xs: "h-6 w-6 text-[9px]", sm: "h-9 w-9 text-[11px]", md: "h-10 w-10 text-[12px]" }[size];
  return (
    <span className={`relative grid shrink-0 place-items-center border border-acid/50 bg-ink font-display font-bold tracking-tight text-fg ${dims}`}>
      VT
      {size !== "xs" && (
        <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 animate-pulse-dot rounded-full border border-ink bg-acid" />
      )}
    </span>
  );
}

function IconButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="grid h-8 w-8 place-items-center border border-transparent text-muted transition-colors hover:border-line-strong hover:text-fg"
    >
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-4 w-4" aria-hidden>
        {children}
      </svg>
    </button>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-2" aria-label="Typing">
      {[0, 150, 300].map((d) => (
        <span
          key={d}
          className="h-1.5 w-1.5 animate-blink rounded-full bg-acid/80"
          style={{ animationDelay: `${d}ms` }}
        />
      ))}
    </span>
  );
}
