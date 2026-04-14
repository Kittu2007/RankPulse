import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "RankPulse — Social Media SEO Intelligence",
  description:
    "Algorithm-native SEO scoring for Instagram, LinkedIn & X. Built on verified 2026 ranking signals — watch time, DM sends, Depth Score, TweepCred.",
};

export default function LandingPage() {
  return (
    <div className="page-transition">
      {/* ── HERO ── */}
      <div className="flex flex-col lg:grid border-b-2 border-[var(--black)]" style={{ gridTemplateColumns: "1fr 340px", minHeight: "420px" }}>
        {/* Left */}
        <div className="p-12 px-10 border-r-2 border-[var(--black)]">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-6 h-[3px] bg-[var(--red)]" />
            <span className="label-sm text-[var(--red)]">Social Media SEO Intelligence — 2026</span>
          </div>
          <div className="d1 mb-4">
            SEO THAT
            <br />
            <span className="inv">ACTUALLY</span>
            <br />
            <span className="acc">WORKS.</span>
          </div>
          <p className="body-text mb-5 max-w-[480px] text-[#444]">
            Algorithm-native SEO scoring for Instagram, LinkedIn &amp; X. Built on verified 2026
            ranking signals — watch time, DM sends, Depth Score, TweepCred. Not opinions. The real
            algorithm.
          </p>
          <div className="flex gap-0 border-2 border-[var(--black)] w-fit mb-6">
            <span className="platform-tag bg-[var(--black)] border-none text-[#ff8fab] tracking-[1.5px]">
              INSTAGRAM
            </span>
            <span className="platform-tag bg-[var(--black)] border-none border-l border-l-[#333] text-[#7eb8f7] tracking-[1.5px]">
              LINKEDIN
            </span>
            <span className="platform-tag bg-[#222] border-none border-l border-l-[#333] text-[#aaa] tracking-[1.5px]">
              X / TWITTER
            </span>
          </div>
          <div className="flex gap-0">
            <Link href="/signup" className="btn btn-red btn-lg">
              Analyse My Content
            </Link>
            <Link href="#features" className="btn btn-outline btn-lg" style={{ borderLeft: "none" }}>
              See How It Works
            </Link>
          </div>
          <div className="mt-7 flex gap-5">
            <div>
              <span className="label-sm text-[var(--red)]">FREE</span>
              <br />
              <span className="body-sm">No credit card ever</span>
            </div>
            <div>
              <span className="label-sm">ACCURATE</span>
              <br />
              <span className="body-sm">2026 algo signals</span>
            </div>
            <div>
              <span className="label-sm">FAST</span>
              <br />
              <span className="body-sm">Results in seconds</span>
            </div>
          </div>
        </div>

        {/* Right — Score Panel */}
        <div className="flex flex-col bg-[var(--black)]">
          <div className="p-6 border-b-2 border-[var(--black)]">
            <div className="label-sm text-[#555] mb-1">Overall SEO Health</div>
            <div className="text-[var(--red)] leading-none" style={{ fontFamily: "var(--font-d)", fontSize: "104px", letterSpacing: "-4px" }}>
              78
            </div>
            <div className="label-sm text-[#555]">/ 100 — GOOD · Updated just now</div>
          </div>
          <div className="grid grid-cols-3 border-b-2 border-[var(--black)]">
            {[
              { label: "INSTAGRAM", score: "82", color: "#ff8fab" },
              { label: "LINKEDIN", score: "74", color: "#7eb8f7" },
              { label: "X / TW", score: "79", color: "#888" },
            ].map((p, i) => (
              <div
                key={p.label}
                className={`p-3.5 px-3 text-center ${i < 2 ? "border-r border-r-[#222]" : ""}`}
              >
                <div className="label-sm mb-1.5" style={{ color: p.color }}>
                  {p.label}
                </div>
                <div className="text-[var(--bg)]" style={{ fontFamily: "var(--font-d)", fontSize: "36px", letterSpacing: "-1px" }}>
                  {p.score}
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 border-b-2 border-[var(--black)]">
            <div className="p-3 border-r border-r-[#222]">
              <div className="text-[var(--bg)]" style={{ fontFamily: "var(--font-d)", fontSize: "28px" }}>24K</div>
              <div className="label-sm text-[#555]">Est Reach</div>
            </div>
            <div className="p-3">
              <div className="text-[var(--red)]" style={{ fontFamily: "var(--font-d)", fontSize: "28px" }}>3</div>
              <div className="label-sm text-[#555]">Penalties</div>
            </div>
            <div className="p-3 border-r border-r-[#222] border-t border-t-[#222]">
              <div className="text-[#4ade80]" style={{ fontFamily: "var(--font-d)", fontSize: "28px" }}>+18%</div>
              <div className="label-sm text-[#555]">Growth</div>
            </div>
            <div className="p-3 border-t border-t-[#222]">
              <div className="text-[var(--bg)]" style={{ fontFamily: "var(--font-d)", fontSize: "28px" }}>91</div>
              <div className="label-sm text-[#555]">Keyword Score</div>
            </div>
          </div>
          <Link
            href="/signup"
            className="px-4 py-3 bg-[var(--red)] cursor-pointer flex justify-between items-center"
          >
            <span className="label-sm text-[var(--bg)]">Run Your Free Scan Now</span>
            <span className="text-[var(--bg)] text-lg">→</span>
          </Link>
        </div>
      </div>

      {/* ── METRIC STRIP ── */}
      <div className="metric-strip">
        <div className="ms-cell">
          <div className="ms-num c-white">3</div>
          <div className="ms-label">Platforms Covered</div>
          <div className="ms-delta flat">IG · LI · X</div>
        </div>
        <div className="ms-cell">
          <div className="ms-num c-red">17</div>
          <div className="ms-label">SEO Parameters</div>
          <div className="ms-delta up">↑ 2026 Updated</div>
        </div>
        <div className="ms-cell">
          <div className="ms-num c-green">100%</div>
          <div className="ms-label">Free Forever</div>
          <div className="ms-delta flat">No credit card</div>
        </div>
        <div className="ms-cell">
          <div className="ms-num c-amber">0</div>
          <div className="ms-label">Guesswork</div>
          <div className="ms-delta flat">Pure algorithm data</div>
        </div>
      </div>

      {/* ── FEATURES SECTION ── */}
      <div id="features" className="px-10 pt-10 border-b-2 border-[var(--black)]">
        <div className="flex items-center gap-3 mb-1.5">
          <div className="w-7 h-[3px] bg-[var(--red)]" />
          <span className="label-sm text-[var(--red)]">Everything You Need</span>
        </div>
        <div className="d3 mb-4">BUILT FOR SERIOUS CREATORS.</div>
      </div>
      <div className="grid grid-cols-3 border-t-2 border-[var(--black)]">
        {[
          { icon: "📊", title: "Content Analyser", desc: "Paste any caption and get an instant SEO score. Every parameter from Instagram watch time hooks to LinkedIn Depth Score." },
          { icon: "🔑", title: "Keyword Research", desc: "Platform-specific keyword explorer. Find what your audience searches on each network." },
          { icon: "🏷️", title: "Hashtag Intelligence", desc: "Not just volume — banned tag detection, trend velocity, competition score, platform-specific set builder." },
          { icon: "👥", title: "Competitor Tracker", desc: "Add up to 10 competitors. Track their top content, posting frequency, and keyword themes." },
          { icon: "📅", title: "Post Scheduler + SEO", desc: "Every post runs through the SEO engine before it goes live. Built-in optimal time suggestions." },
          { icon: "👤", title: "Profile SEO Auditor", desc: "Your bio, headline, about section, skills — all scored against platform-specific algorithms." },
          { icon: "📈", title: "Analytics & Reporting", desc: "90-day history. Engagement trends, reach graphs, keyword rank tracking, SEO score over time." },
          { icon: "✨", title: "AI Content Studio", desc: "5 pre-scored post ideas per day. Each generated for your niche and pre-optimised by the SEO engine." },
          { icon: "⚙️", title: "Admin Dashboard", desc: "Full platform management — user oversight, SEO engine config, API health monitoring, feature flags." },
        ].map((f, i) => (
          <div
            key={f.title}
            className={`p-7 px-6 border-r-2 border-b-2 border-[var(--black)] ${
              (i + 1) % 3 === 0 ? "!border-r-0" : ""
            } ${i >= 6 ? "!border-b-0" : ""}`}
          >
            <div className="w-9 h-9 border-2 border-[var(--black)] flex items-center justify-center text-lg mb-3.5 bg-white">
              {f.icon}
            </div>
            <div className="h3 mb-2">{f.title}</div>
            <div className="body-sm">{f.desc}</div>
          </div>
        ))}
      </div>

      {/* ── CTA BANNER ── */}
      <div className="bg-[var(--black)] border-t-2 border-b-2 border-[var(--black)] p-10 flex items-center justify-between">
        <div>
          <div className="d3 mb-2 text-[var(--bg)]">READY TO RANK HIGHER?</div>
          <div className="body-text text-[#666]">Free. No credit card. Built on open infrastructure.</div>
        </div>
        <div className="flex gap-0">
          <Link href="/signup" className="btn btn-red btn-lg">
            Start For Free →
          </Link>
          <Link href="/dashboard" className="btn btn-outline btn-lg text-[var(--bg)] !border-[#444]" style={{ borderLeft: "none" }}>
            View Demo
          </Link>
        </div>
      </div>
    </div>
  );
}
