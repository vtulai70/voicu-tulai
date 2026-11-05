import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { heroTrail, profile } from "@/lib/data";

// Social preview card (LinkedIn, Slack, X, iMessage). Generated at build time.
export const alt = `${profile.name}, ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const font = (pkg: string, file: string) => readFile(join(process.cwd(), "node_modules/@fontsource", pkg, "files", file));

const ink = "#060708";
const fg = "#eceef1";
const muted = "#8b919b";
const faint = "#5a606a";
const acid = "#d4ff3a";
const line = "rgba(255,255,255,0.08)";

export default async function Image() {
  const [display, displayBold, serifItalic, mono] = await Promise.all([
    font("space-grotesk", "space-grotesk-latin-500-normal.woff"),
    font("space-grotesk", "space-grotesk-latin-700-normal.woff"),
    font("instrument-serif", "instrument-serif-latin-400-italic.woff"),
    font("jetbrains-mono", "jetbrains-mono-latin-400-normal.woff"),
  ]);

  const label = { fontFamily: "Mono", fontSize: 18, letterSpacing: 4, textTransform: "uppercase" as const };

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 64px",
          backgroundColor: ink,
          backgroundImage: `radial-gradient(circle at 78% 30%, rgba(212,255,58,0.16), transparent 45%), linear-gradient(to right, ${line} 1px, transparent 1px), linear-gradient(to bottom, ${line} 1px, transparent 1px)`,
          backgroundSize: "100% 100%, 64px 64px, 64px 64px",
          color: fg,
          fontFamily: "Display",
        }}
      >
        {/* top rail */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 56,
                height: 56,
                border: `2px solid ${acid}`,
                fontFamily: "DisplayBold",
                fontSize: 24,
              }}
            >
              VT
            </div>
            <div style={{ ...label, color: muted, display: "flex" }}>{profile.name}</div>
          </div>
          <div style={{ ...label, color: acid, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 10, height: 10, borderRadius: 10, backgroundColor: acid }} />
            {profile.title}
          </div>
        </div>

        {/* headline */}
        <div style={{ display: "flex", flexDirection: "column", fontSize: 92, lineHeight: 1, letterSpacing: -4 }}>
          <div style={{ display: "flex" }}>Engineering leader</div>
          <div style={{ display: "flex", alignItems: "baseline" }}>
            building the&nbsp;
            <span style={{ fontFamily: "Serif", color: acid, fontSize: 104, letterSpacing: -2 }}>systems</span>
          </div>
          <div style={{ display: "flex" }}>that ship software.</div>
        </div>

        {/* bottom rail */}
        <div
          style={{
            ...label,
            fontSize: 16,
            color: faint,
            display: "flex",
            justifyContent: "space-between",
            borderTop: `1px solid ${line}`,
            paddingTop: 22,
          }}
        >
          <span>{heroTrail.join("  →  ")}</span>
          <span style={{ color: muted }}>{profile.location}</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Display", data: display, weight: 500, style: "normal" },
        { name: "DisplayBold", data: displayBold, weight: 700, style: "normal" },
        { name: "Serif", data: serifItalic, weight: 400, style: "italic" },
        { name: "Mono", data: mono, weight: 400, style: "normal" },
      ],
    },
  );
}
