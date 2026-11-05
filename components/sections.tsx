import {
  career,
  certifications,
  competencies,
  contact,
  currentFocus,
  earlierRoles,
  education,
  hobbies,
  pillars,
  portfolio,
  profile,
  stats,
  tools,
  volunteering,
} from "@/lib/data";
import { CountUp, HeroGlow, LocalTime, Reveal, SpotlightCard } from "./interactive";
import { OpenTwinButton } from "./twin-chat";

/* ---------- shared bits ---------- */

function SectionLabel({ index, label }: { index: string; label: string }) {
  return (
    <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
      <span className="text-acid">{index}</span>
      <span className="h-px w-8 bg-line-strong" />
      <span>{label}</span>
    </div>
  );
}

function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={`h-3.5 w-3.5 ${className}`} aria-hidden>
      <path d="M4 12 12 4M5.5 4H12v6.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/* ---------- hero ---------- */

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden pt-16">
      <div aria-hidden className="bg-grid mask-fade absolute inset-0" />
      <HeroGlow />

      {/* status rail */}
      <div className="relative mx-auto mt-8 flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-5 font-mono text-[11px] uppercase tracking-[0.2em] text-muted md:px-8">
        <span className="rise" style={{ "--delay": "100ms" } as React.CSSProperties}>
          <span className="flex items-center gap-2.5">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-acid" />
            {profile.title}
          </span>
        </span>
        <span className="rise" style={{ "--delay": "200ms" } as React.CSSProperties}>
          <span className="flex items-center gap-3">
            <span>{profile.location}</span>
            <span className="text-faint">/</span>
            <span>
              <LocalTime /> PT
            </span>
          </span>
        </span>
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-5 py-16 md:px-8">
        <h1 className="font-display text-[clamp(2.3rem,8.4vw,8rem)] font-medium leading-[0.92] tracking-[-0.045em]">
          <span className="block">
            <span className="rise text-gradient -mb-[0.16em] pb-[0.16em]" style={{ "--delay": "250ms" } as React.CSSProperties}>
              Engineering leader
            </span>
          </span>
          <span className="block">
            <span className="rise text-gradient -mb-[0.16em] pb-[0.16em]" style={{ "--delay": "380ms" } as React.CSSProperties}>
              building the{" "}
              <em className="font-serif font-normal italic tracking-[-0.02em] text-acid [-webkit-text-fill-color:var(--color-acid)]">
                systems
              </em>
            </span>
          </span>
          <span className="block">
            <span className="rise text-gradient -mb-[0.16em] pb-[0.16em]" style={{ "--delay": "510ms" } as React.CSSProperties}>
              that ship software.
            </span>
          </span>
        </h1>

        <div className="mt-14 grid items-end gap-10 lg:grid-cols-12">
          <div className="rise lg:col-span-6" style={{ "--delay": "700ms" } as React.CSSProperties}>
            <p className="max-w-xl text-lg leading-relaxed text-muted md:text-xl">
              I&apos;m <span className="text-fg">{profile.name}</span>. {profile.tagline}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#journey"
                className="group inline-flex items-center gap-3 bg-acid px-6 py-3.5 font-mono text-[12px] font-medium uppercase tracking-[0.16em] text-ink transition-all hover:bg-white"
              >
                Career journey
                <Arrow className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <OpenTwinButton className="group inline-flex items-center gap-3 border border-line-strong px-6 py-3.5 font-mono text-[12px] uppercase tracking-[0.16em] text-fg transition-colors hover:border-acid hover:text-acid">
                <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-acid" />
                Ask my AI twin
              </OpenTwinButton>
            </div>
          </div>

          <div className="rise lg:col-span-5 lg:col-start-8" style={{ "--delay": "850ms" } as React.CSSProperties}>
            <Terminal />
          </div>
        </div>
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl items-center justify-between px-5 pb-8 font-mono text-[10px] uppercase tracking-[0.25em] text-faint md:px-8">
        <span>Scroll</span>
        <span className="hidden sm:block">Nokia → HERE → Salesforce / Tableau</span>
        <span>2026</span>
      </div>
    </section>
  );
}

function Terminal() {
  const rows: [string, React.ReactNode][] = [
    ["role", <span key="r" className="text-fg">&quot;{profile.title}&quot;</span>],
    ["focus", <span key="f">[<span className="text-signal">devex</span>, <span className="text-signal">delivery</span>, <span className="text-signal">ai-native-sdlc</span>]</span>],
    ["scale", <span key="s" className="text-fg">5 teams · 30+ engineers</span>],
    ["stack", <span key="k">aws · k8s · terraform · langgraph</span>],
    ["rating", <span key="t" className="text-acid">top performer</span>],
  ];
  return (
    <div className="brackets border border-line bg-ink-2/80 backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">profile.yaml</span>
      </div>
      <div className="space-y-1.5 p-5 font-mono text-[12.5px] leading-relaxed text-muted">
        <div>
          <span className="text-acid">~/voicu</span> <span className="text-faint">$</span> cat profile.yaml
        </div>
        {rows.map(([k, v]) => (
          <div key={k} className="flex gap-3">
            <span className="w-16 shrink-0 text-faint">{k}:</span>
            <span className="min-w-0">{v}</span>
          </div>
        ))}
        <div className="pt-1">
          <span className="text-acid">~/voicu</span> <span className="text-faint">$</span>{" "}
          <span className="inline-block h-3.5 w-2 translate-y-0.5 animate-blink bg-acid" />
        </div>
      </div>
    </div>
  );
}

/* ---------- stats + marquee ---------- */

export function Stats() {
  return (
    <section aria-label="Highlights" className="relative border-y border-line bg-ink-2">
      <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal
            key={s.label}
            delay={i * 90}
            className={`border-line px-5 py-10 md:px-8 md:py-14 ${i % 2 === 0 ? "border-r" : ""} ${
              i < 2 ? "border-b md:border-b-0" : ""
            } ${i === 1 ? "md:border-r" : ""}`}
          >
            <div className="font-display text-[2.6rem] font-medium tracking-[-0.04em] sm:text-5xl md:text-[3.25rem] lg:text-6xl xl:text-7xl">
              <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} />
            </div>
            <div className="mt-4 text-sm text-fg">{s.label}</div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-faint">{s.sub}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Marquee() {
  const items = [
    "Salesforce",
    "Tableau",
    "HERE Technologies",
    "Nokia",
    "Intrinsyc",
    "AWS",
    "Kubernetes",
    "Terraform",
    "LangGraph",
    "MCP",
    "CI/CD",
    "DORA",
  ];
  const row = [...items, ...items];
  return (
    <div aria-hidden className="mask-x overflow-hidden border-b border-line py-6">
      <div className="flex w-max animate-marquee gap-12 whitespace-nowrap">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-12 font-display text-2xl tracking-tight text-faint md:text-3xl">
            {t}
            <span className="text-acid/60">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- about ---------- */

export function About() {
  return (
    <section id="about" className="relative mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Reveal className="lg:sticky lg:top-28">
            <SectionLabel index="01" label="About" />
            <h2 className="mt-6 font-display text-4xl font-medium leading-[1.02] tracking-[-0.035em] md:text-5xl">
              Strategy with a bias for <em className="font-serif font-normal italic text-acid">action.</em>
            </h2>
          </Reveal>
        </div>

        <div className="lg:col-span-8">
          <Reveal>
            <p className="text-2xl leading-[1.45] tracking-[-0.01em] text-fg md:text-[1.75rem]">
              {profile.summary}
            </p>
          </Reveal>
          <Reveal delay={100}>
            <p className="mt-8 max-w-2xl border-l border-acid/60 pl-5 text-lg leading-relaxed text-muted">
              {profile.summaryCoda}
            </p>
          </Reveal>

          <div className="mt-16 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-3">
            {pillars.map((p, i) => (
              <Reveal key={p.index} delay={i * 110} className="bg-ink">
                <SpotlightCard className="flex h-full flex-col p-7">
                  <div className="font-mono text-[11px] tracking-[0.2em] text-acid">/{p.index}</div>
                  <h3 className="mt-6 font-display text-xl font-medium leading-snug tracking-tight">{p.title}</h3>
                  <p className="mt-4 flex-1 text-[15px] leading-relaxed text-muted">{p.body}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="border border-line px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- journey ---------- */

const START = 1997;
const END = 2026;

function CareerGantt() {
  const lanes = [
    { name: "Salesforce / Tableau", start: 2019, end: 2026, hi: true },
    { name: "HERE Technologies", start: 2012, end: 2019 },
    { name: "Nokia", start: 2004, end: 2012 },
    { name: "Intrinsyc Software", start: 2000, end: 2007 },
    { name: "CT Technologies", start: 1999, end: 2004 },
    { name: "Pinpoint Technologies", start: 1997, end: 2000 },
    { name: "Glenayre Technologies", start: 1997, end: 1998 },
  ];
  const span = END - START;
  const ticks = [1997, 2002, 2007, 2012, 2017, 2022, 2026];
  return (
    <div className="border border-line bg-ink-2 p-5 md:p-8">
      <div className="mb-6 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
        <span>Timeline · {START} to {END}</span>
        <span className="hidden sm:inline">{END - START} years · 7 companies</span>
      </div>
      <div className="space-y-3">
        {lanes.map((l, i) => {
          const left = ((l.start - START) / span) * 100;
          const width = (Math.max(l.end - l.start, 0.6) / span) * 100;
          return (
            <Reveal key={l.name} delay={i * 70} className="grid grid-cols-[7.5rem_1fr] items-center gap-4 md:grid-cols-[11rem_1fr]">
              <span className={`truncate text-[12px] md:text-[13px] ${l.hi ? "text-fg" : "text-muted"}`}>{l.name}</span>
              <div className="relative h-2.5">
                <div className="absolute inset-y-[4px] left-0 right-0 bg-line" />
                <div
                  className={`gantt-bar absolute inset-y-0 ${l.hi ? "bg-acid shadow-[0_0_20px_rgba(212,255,58,0.45)]" : "bg-white/25"}`}
                  style={{ left: `${left}%`, width: `${width}%` }}
                />
              </div>
            </Reveal>
          );
        })}
      </div>
      <div className="mt-5 grid grid-cols-[7.5rem_1fr] gap-4 md:grid-cols-[11rem_1fr]">
        <span />
        <div className="relative h-4 font-mono text-[10px] text-faint">
          {ticks.map((t) => (
            <span
              key={t}
              className={`absolute -translate-x-1/2 first:translate-x-0 last:-translate-x-full ${
                [1997, 2012, 2026].includes(t) ? "" : "hidden sm:block"
              }`}
              style={{ left: `${((t - START) / span) * 100}%` }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function yearsLabel(start: number, end: number | "Present") {
  const n = Math.max(1, (end === "Present" ? new Date().getFullYear() : end) - start);
  return `${n} ${n === 1 ? "year" : "years"}`;
}

export function Journey() {
  return (
    <section id="journey" className="relative border-t border-line">
      <div aria-hidden className="bg-grid absolute inset-0 opacity-40 [mask-image:linear-gradient(to_bottom,#000,transparent_40%)]" />
      <div className="relative mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <SectionLabel index="02" label="Career journey" />
            <h2 className="mt-6 font-display text-4xl font-medium leading-[1.02] tracking-[-0.035em] md:text-6xl">
              Three decades. One through-line:{" "}
              <em className="font-serif font-normal italic text-acid">shipping.</em>
            </h2>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-5">
            <p className="text-lg leading-relaxed text-muted">
              From embedded networking stacks and the Nokia App Store to monetization platforms at HERE and the
              AI-native delivery engine behind Tableau. Architect, product manager, and people leader.
            </p>
          </Reveal>
        </div>

        <Reveal delay={150} className="mt-16">
          <CareerGantt />
        </Reveal>

        <ol className="relative mt-24">
          <div aria-hidden className="absolute bottom-0 left-[7px] top-2 w-px bg-gradient-to-b from-acid via-line-strong to-transparent md:left-[calc(25%+7px)]" />
          {career.map((r, i) => {
            const showEra = i === 0 || career[i - 1].era !== r.era;
            return (
              <li key={`${r.company}-${r.title}`} className="relative">
                {showEra && (
                  <Reveal className="mb-6 pl-8 md:ml-[25%] md:pl-12">
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-signal">// {r.era}</span>
                  </Reveal>
                )}
                <Reveal className="group relative mb-16 grid gap-4 pl-8 md:grid-cols-4 md:gap-0 md:pl-0">
                  <span
                    aria-hidden
                    className={`absolute left-0 top-2 h-[15px] w-[15px] border bg-ink transition-colors md:left-[25%] ${
                      i === 0 ? "border-acid" : "border-line-strong group-hover:border-acid"
                    }`}
                  >
                    <span className={`absolute inset-[4px] ${i === 0 ? "bg-acid" : "bg-transparent group-hover:bg-acid"} transition-colors`} />
                  </span>

                  <div className="md:pr-10 md:text-right">
                    <div className="font-mono text-sm tabular-nums text-fg">
                      {r.start} — {r.end}
                    </div>
                    <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
                      {yearsLabel(r.start, r.end)}
                    </div>
                  </div>

                  <div className="md:col-span-3 md:pl-12">
                    <h3 className="font-display text-2xl font-medium tracking-tight md:text-3xl">{r.title}</h3>
                    <div className="mt-1.5 text-muted">
                      {r.company}
                      {r.org && <span className="text-faint"> · {r.org}</span>}
                    </div>
                    <ul className="mt-6 max-w-3xl space-y-3">
                      {r.highlights.map((h) => (
                        <li key={h} className="flex gap-4 text-[15px] leading-relaxed text-muted">
                          <span aria-hidden className="mt-[0.7em] h-px w-3 shrink-0 bg-acid/70" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {r.tags.map((t) => (
                        <span key={t} className="bg-white/[0.04] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>

        <Reveal className="md:ml-[25%] md:pl-12">
          <div className="border border-line">
            <div className="border-b border-line px-6 py-3 font-mono text-[10px] uppercase tracking-[0.22em] text-faint">
              Earlier · where it started
            </div>
            {earlierRoles.map((e) => (
              <div
                key={e.company}
                className="grid gap-1 border-b border-line px-6 py-4 last:border-b-0 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6"
              >
                <div>
                  <span className="text-fg">{e.title}</span>
                  <span className="text-muted"> · {e.company}</span>
                </div>
                <span className="font-mono text-xs tabular-nums text-faint">{e.years}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- capabilities + credentials ---------- */

export function Capabilities() {
  const groups = ["Cloud", "Code", "Data", "AI"] as const;
  return (
    <section id="capabilities" className="relative border-t border-line bg-ink-2">
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <Reveal>
          <SectionLabel index="03" label="Capabilities" />
          <h2 className="mt-6 max-w-3xl font-display text-4xl font-medium leading-[1.02] tracking-[-0.035em] md:text-6xl">
            Equal parts <em className="font-serif font-normal italic text-acid">architect</em> and operator.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <div className="h-full border border-line bg-ink">
              <div className="border-b border-line px-6 py-3 font-mono text-[10px] uppercase tracking-[0.22em] text-faint">
                Core competencies
              </div>
              <ul className="grid sm:grid-cols-2">
                {competencies.map((c, i) => (
                  <li
                    key={c}
                    className="group flex items-baseline gap-4 border-b border-line px-6 py-5 transition-colors hover:bg-white/[0.02] sm:[&:nth-child(odd)]:border-r sm:[&:nth-last-child(-n+2)]:border-b-0 [&:last-child]:border-b-0"
                  >
                    <span className="font-mono text-[11px] text-faint transition-colors group-hover:text-acid">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[15px] text-fg">{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-5">
            <div className="h-full border border-line bg-ink">
              <div className="border-b border-line px-6 py-3 font-mono text-[10px] uppercase tracking-[0.22em] text-faint">
                Tools & languages
              </div>
              <div className="space-y-6 p-6">
                {groups.map((g) => (
                  <div key={g} className="grid grid-cols-[4rem_1fr] items-start gap-4">
                    <span className="pt-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-signal">{g}</span>
                    <div className="flex flex-wrap gap-2">
                      {tools
                        .filter((t) => t.group === g)
                        .map((t) => (
                          <span
                            key={t.name}
                            className="border border-line-strong px-3 py-1.5 text-[13px] text-fg transition-colors hover:border-acid hover:text-acid"
                          >
                            {t.name}
                          </span>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* credentials */}
        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <div className="h-full border border-line bg-ink">
              <div className="flex items-center justify-between border-b border-line px-6 py-3 font-mono text-[10px] uppercase tracking-[0.22em] text-faint">
                <span>Licenses & certifications</span>
                <span className="text-acid">AI track</span>
              </div>
              <ul>
                {certifications.featured.map((c) => (
                  <li key={c} className="flex items-start gap-4 border-b border-line px-6 py-4">
                    <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 bg-acid" />
                    <span className="text-[15px] text-fg">{c}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2 p-6">
                {certifications.other.map((c) => (
                  <span key={c} className="bg-white/[0.04] px-3 py-1.5 text-[12.5px] text-muted">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          <div className="flex flex-col gap-6 lg:col-span-5">
            <Reveal delay={100}>
              <div className="relative overflow-hidden border border-line bg-ink p-6">
                <div
                  aria-hidden
                  className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(212,255,58,0.10),transparent_70%)]"
                />
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-faint">Education</div>
                <div className="mt-5 font-display text-5xl font-medium tracking-[-0.04em]">{education.degree}</div>
                <div className="mt-3 flex items-end justify-between gap-4 border-t border-line pt-4">
                  <div className="text-muted">{education.school}</div>
                  <div className="font-mono text-sm text-faint">{education.year}</div>
                </div>
              </div>
            </Reveal>
            <Reveal delay={180} className="flex-1">
              <div className="h-full border border-line bg-ink p-6">
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-faint">
                  <span>Current focus</span>
                  <span className="flex items-center gap-2 text-acid">
                    <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-acid" /> Now
                  </span>
                </div>
                <ul className="mt-5 space-y-3">
                  {currentFocus.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-[15px] text-fg">
                      <span aria-hidden className="font-mono text-acid">›</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- beyond work ---------- */

export function Beyond() {
  return (
    <section id="beyond" className="relative overflow-hidden border-t border-line">
      <div
        aria-hidden
        className="absolute -left-1/4 top-0 h-[60vw] w-[60vw] rounded-full bg-[radial-gradient(circle,rgba(92,225,230,0.07),transparent_65%)]"
      />
      <div className="relative mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <SectionLabel index="//" label="Off the clock" />
            <h2 className="mt-6 font-display text-4xl font-medium leading-[1.02] tracking-[-0.035em] md:text-6xl">
              Beyond the <em className="font-serif font-normal italic text-signal">terminal.</em>
            </h2>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-5">
            <p className="text-lg leading-relaxed text-muted">
              Away from the keyboard you&apos;ll find me underwater, out on the water, or somewhere along a trail in
              BC and Alberta.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-px border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
          {hobbies.map((h, i) => (
            <Reveal key={h.name} delay={i * 90} className="bg-ink">
              <SpotlightCard className="flex h-full flex-col p-7">
                <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                  <span className="text-signal">{String(i + 1).padStart(2, "0")}</span> · {h.name}
                </div>
                <div className="mt-10 flex items-baseline gap-3">
                  <span className="font-display text-5xl font-medium tracking-[-0.04em]">{h.stat}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">{h.statLabel}</span>
                </div>
                <p className="mt-4 text-[15px] leading-relaxed text-muted">{h.detail}</p>
                {h.places && (
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {h.places.map((pl) => (
                      <span key={pl} className="bg-white/[0.04] px-2 py-1 text-[11.5px] text-muted">
                        {pl}
                      </span>
                    ))}
                  </div>
                )}
              </SpotlightCard>
            </Reveal>
          ))}
        </div>

        <Reveal delay={100} className="mt-6">
          <div className="grid gap-6 border border-line bg-ink-2 p-6 md:grid-cols-[12rem_1fr_1fr] md:items-center md:p-7">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-faint">Giving back</div>
            {volunteering.map((v) => (
              <div key={v.role} className="flex items-start gap-3">
                <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 bg-signal" />
                <div>
                  <div className="text-fg">{v.role}</div>
                  <div className="text-sm text-muted">{v.org}</div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- portfolio ---------- */

export function Portfolio() {
  return (
    <section id="portfolio" className="relative border-t border-line">
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <SectionLabel index="04" label="Portfolio" />
            <h2 className="mt-6 font-display text-4xl font-medium leading-[1.02] tracking-[-0.035em] md:text-6xl">
              Selected work, <em className="font-serif font-normal italic text-acid">compiling.</em>
            </h2>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-5">
            <p className="text-lg leading-relaxed text-muted">
              Case studies, experiments, and writing are on the way. Each slot below goes live as the work is
              published.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {portfolio.map((p, i) => {
            const live = p.status === "live" && p.href;
            const Inner = (
              <SpotlightCard className="brackets flex h-full min-h-[240px] flex-col border border-line bg-ink-2 p-7 transition-colors group-hover:border-line-strong md:p-9">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                    <span className="text-acid">{String(i + 1).padStart(2, "0")}</span> · {p.kind}
                  </span>
                  {live ? (
                    <Arrow className="h-4 w-4 text-acid transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  ) : (
                    <span className="flex items-center gap-2 border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                      <span className="h-1 w-1 animate-blink bg-signal" />
                      Coming soon
                    </span>
                  )}
                </div>
                <h3 className="mt-auto pt-16 font-display text-3xl font-medium tracking-tight md:text-4xl">{p.title}</h3>
                <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted">{p.blurb}</p>
              </SpotlightCard>
            );
            return (
              <Reveal key={p.title} delay={(i % 2) * 120}>
                {live ? (
                  <a href={p.href} target="_blank" rel="noreferrer" className="group block h-full">
                    {Inner}
                  </a>
                ) : (
                  <div className="group h-full" aria-disabled>
                    {Inner}
                  </div>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- contact + footer ---------- */

export function Contact() {
  const links = [
    contact.email && { label: "Email", value: contact.email, href: `mailto:${contact.email}` },
    contact.linkedin && { label: "LinkedIn", value: contact.linkedin.replace(/^https?:\/\/(www\.)?/, ""), href: contact.linkedin },
    contact.github && { label: "GitHub", value: contact.github.replace(/^https?:\/\/(www\.)?/, ""), href: contact.github },
    contact.phone && { label: "Phone", value: contact.phone, href: `tel:${contact.phone.replace(/[^\d+]/g, "")}` },
  ].filter(Boolean) as { label: string; value: string; href: string }[];

  return (
    <section id="contact" className="relative overflow-hidden border-t border-line">
      <div aria-hidden className="bg-grid mask-fade absolute inset-0 opacity-70" />
      <div
        aria-hidden
        className="absolute -bottom-1/2 left-1/2 h-[80vw] w-[80vw] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(212,255,58,0.10),transparent_60%)]"
      />
      <div className="relative mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <Reveal>
          <SectionLabel index="05" label="Contact" />
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mt-8 font-display text-[clamp(3rem,10vw,9rem)] font-medium leading-[0.9] tracking-[-0.05em]">
            <span className="text-gradient">Let&apos;s build</span>
            <br />
            <span className="text-gradient">what&apos;s </span>
            <em className="font-serif font-normal italic tracking-[-0.02em] text-acid">next.</em>
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-10 max-w-xl text-lg leading-relaxed text-muted">
            Open to conversations about engineering leadership, developer platforms, and bringing AI-native workflows
            to software organizations.
          </p>
          <OpenTwinButton className="group mt-8 inline-flex items-center gap-3 border border-acid/40 bg-acid/5 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-acid transition-all hover:bg-acid hover:text-ink">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-acid group-hover:bg-ink" />
            Or ask my digital twin first
          </OpenTwinButton>
        </Reveal>

        <div
          className={`mt-14 grid gap-px border border-line bg-line ${
            { 1: "max-w-sm", 2: "sm:grid-cols-2", 3: "sm:grid-cols-2 lg:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4", 5: "sm:grid-cols-2 lg:grid-cols-5" }[links.length + 1] ?? ""
          }`}
        >
          {links.map((l, i) => (
            <Reveal key={l.label} delay={i * 80} className="bg-ink">
              <a
                href={l.href}
                target={l.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="group flex h-full flex-col justify-between gap-8 p-6 transition-colors hover:bg-acid hover:text-ink"
              >
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-faint group-hover:text-ink/70">
                  {l.label}
                  <Arrow className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <div className="truncate font-display text-lg tracking-tight">{l.value}</div>
              </a>
            </Reveal>
          ))}
          <Reveal delay={links.length * 80} className="bg-ink">
            <div className="flex h-full flex-col justify-between gap-8 p-6">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-faint">Based in</div>
              <div className="font-display text-lg tracking-tight">{contact.location}</div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 font-mono text-[10px] uppercase tracking-[0.22em] text-faint sm:flex-row sm:items-center sm:justify-between md:px-8">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-acid" /> Built with Next.js
        </span>
        <a href="#top" className="transition-colors hover:text-acid">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
