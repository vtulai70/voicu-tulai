import { career, earlierRoles } from "./data";

export type Lane = { name: string; start: number; end: number; current: boolean };

const year = (end: number | "Present") => (end === "Present" ? new Date().getFullYear() : end);

/**
 * One lane per employer for the career timeline chart, derived from `career` and `earlierRoles`
 * so the chart can't drift from the role list. Roles at the same employer merge into one span.
 */
export function careerLanes(): Lane[] {
  const spans = new Map<string, { start: number; end: number }>();
  const add = (name: string, start: number, end: number) => {
    const s = spans.get(name);
    spans.set(name, s ? { start: Math.min(s.start, start), end: Math.max(s.end, end) } : { start, end });
  };
  career.forEach((r) => add(r.org ? `${r.company} / ${r.org}` : r.company, r.start, year(r.end)));
  earlierRoles.forEach((r) => add(r.company, r.start, r.end));

  const latestEnd = Math.max(...[...spans.values()].map((s) => s.end));
  return [...spans.entries()]
    .map(([name, s]) => ({ name, ...s, current: s.end === latestEnd }))
    .sort((a, b) => b.start - a.start || b.end - a.end);
}

/** First and last year across all roles. */
export function careerRange(lanes: Lane[]) {
  return {
    start: Math.min(...lanes.map((l) => l.start)),
    end: Math.max(...lanes.map((l) => l.end)),
  };
}

/** Axis ticks every 5 years from the start, always ending on the last year. */
export function careerTicks(start: number, end: number) {
  const ticks: number[] = [];
  for (let t = start; t <= end - 3; t += 5) ticks.push(t);
  ticks.push(end);
  return ticks;
}
