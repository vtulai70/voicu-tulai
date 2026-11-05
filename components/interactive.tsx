"use client";

import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";
import { nav, profile } from "@/lib/data";

/** Fades/rises children into view once when scrolled into the viewport. */
export function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  as?: ElementType;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`reveal ${className}`} style={{ "--delay": `${delay}ms` } as CSSProperties}>
      {children}
    </Tag>
  );
}

/** Animates a number from 0 to `value` when visible. */
export function CountUp({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(value);
      return;
    }
    let raf = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const dur = 1600;
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / dur);
        const eased = 1 - Math.pow(1 - p, 4);
        setN(Math.round(eased * value));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);
  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {n}
      {suffix}
    </span>
  );
}

/** Wraps content in a card whose glow follows the cursor. */
export function SpotlightCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      className={`spotlight ${className}`}
    >
      {children}
    </div>
  );
}

/** Large ambient glow in the hero that drifts toward the cursor. */
export function HeroGlow() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let tx = 0.62, ty = 0.38, x = tx, y = ty;
    const onMove = (e: PointerEvent) => {
      tx = e.clientX / window.innerWidth;
      ty = e.clientY / window.innerHeight;
    };
    const loop = () => {
      x += (tx - x) * 0.04;
      y += (ty - y) * 0.04;
      ref.current?.style.setProperty("transform", `translate3d(${(x - 0.5) * 18}vw, ${(y - 0.5) * 14}vh, 0)`);
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div ref={ref} className="absolute left-1/2 top-1/3 -ml-[30vw] -mt-[30vw] h-[60vw] w-[60vw] will-change-transform">
        <div className="h-full w-full rounded-full bg-[radial-gradient(circle,rgba(212,255,58,0.13),rgba(92,225,230,0.05)_40%,transparent_68%)] blur-2xl" />
      </div>
    </div>
  );
}

/** Live local clock for the hero status line. */
export function LocalTime() {
  const [t, setT] = useState<string>("");
  useEffect(() => {
    const fmt = () =>
      new Intl.DateTimeFormat("en-CA", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "America/Vancouver",
      }).format(new Date());
    setT(fmt());
    const id = setInterval(() => setT(fmt()), 15_000);
    return () => clearInterval(id);
  }, []);
  return <span className="tabular-nums">{t || "--:--"}</span>;
}

/** Sticky top navigation with scroll progress, active-section tracking and mobile menu. */
export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const h = document.documentElement;
      const p = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const sections = nav
      .map((n) => document.getElementById(n.id))
      .filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open ? "border-b border-line bg-ink/75 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
        <a href="#top" className="group flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="grid h-8 w-8 place-items-center border border-line-strong font-display text-[13px] font-bold tracking-tight transition-colors group-hover:border-acid group-hover:text-acid">
            VT
          </span>
          <span className="hidden font-mono text-[11px] uppercase tracking-[0.2em] text-muted sm:block">
            {profile.name}
          </span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((n, i) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              className={`relative px-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors ${
                active === n.id ? "text-fg" : "text-muted hover:text-fg"
              }`}
            >
              <span className="mr-1.5 text-faint">0{i + 1}</span>
              {n.label}
              <span
                className={`absolute inset-x-3 -bottom-px h-px bg-acid transition-transform duration-500 ${
                  active === n.id ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          className="hidden items-center gap-2 border border-acid/40 bg-acid/5 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-acid transition-all hover:bg-acid hover:text-ink md:inline-flex"
        >
          <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-acid" />
          Let&apos;s talk
        </a>

        <button
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="relative grid h-10 w-10 place-items-center border border-line-strong md:hidden"
        >
          <span className={`absolute h-px w-4 bg-fg transition-transform ${open ? "rotate-45" : "-translate-y-1"}`} />
          <span className={`absolute h-px w-4 bg-fg transition-transform ${open ? "-rotate-45" : "translate-y-1"}`} />
        </button>
      </div>

      <div ref={barRef} className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-acid/70" />

      {open && (
        <nav className="h-[calc(100dvh-4rem)] border-t border-line px-5 pt-8 md:hidden">
          {nav.map((n, i) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              onClick={() => setOpen(false)}
              className="flex items-baseline gap-4 border-b border-line py-5 font-display text-3xl tracking-tight"
            >
              <span className="font-mono text-xs text-acid">0{i + 1}</span>
              {n.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
