import { Link } from "wouter";
import { useRef, useEffect, useState } from "react";
import {
  BarChart2, Key, Tag, Users, Calendar, User,
  TrendingUp, Sparkles, Settings, ArrowRight,
  Zap, Shield, Clock, ChevronRight
} from "lucide-react";
import { useScrollReveal, useCountUp } from "@/hooks/useScrollReveal";

const features = [
  { Icon: BarChart2, title: "Content Analyser", desc: "Paste any caption and get an instant SEO score. Every parameter from Instagram watch time hooks to LinkedIn Depth Score.", color: "#e63946" },
  { Icon: Key, title: "Keyword Research", desc: "Platform-specific keyword explorer. Find what your audience searches on each network.", color: "#7eb8f7" },
  { Icon: Tag, title: "Hashtag Intelligence", desc: "Not just volume — banned tag detection, trend velocity, competition score, platform-specific set builder.", color: "#ff8fab" },
  { Icon: Users, title: "Competitor Tracker", desc: "Add up to 10 competitors. Track their top content, posting frequency, and keyword themes.", color: "#4ade80" },
  { Icon: Calendar, title: "Post Scheduler + SEO", desc: "Every post runs through the SEO engine before it goes live. Built-in optimal time suggestions.", color: "#fbbf24" },
  { Icon: User, title: "Profile SEO Auditor", desc: "Your bio, headline, about section, skills — all scored against platform-specific algorithms.", color: "#a78bfa" },
  { Icon: TrendingUp, title: "Analytics & Reporting", desc: "90-day history. Engagement trends, reach graphs, keyword rank tracking, SEO score over time.", color: "#34d399" },
  { Icon: Sparkles, title: "AI Content Studio", desc: "5 pre-scored post ideas per day. Each generated for your niche and pre-optimised by the SEO engine.", color: "#f472b6" },
  { Icon: Settings, title: "Admin Dashboard", desc: "Full platform management — user oversight, SEO engine config, API health monitoring, feature flags.", color: "#94a3b8" },
];

const steps = [
  { n: "01", Icon: Zap, title: "Paste Your Content", desc: "Drop in any caption, bio, or post. Our engine reads it instantly." },
  { n: "02", Icon: Shield, title: "Get Your SEO Score", desc: "17 parameters analysed in real time. See exactly what hurts your reach." },
  { n: "03", Icon: TrendingUp, title: "Fix & Rank Higher", desc: "Follow the fixes. Watch your reach climb. Repeat every post." },
];

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const { ref, visible } = useScrollReveal(0.3);
  const value = useCountUp(target, 1600, visible);
  return (
    <div ref={ref} className="ms-num">
      {value}{suffix}
    </div>
  );
}

function RevealBlock({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useScrollReveal(0.1);
  return (
    <div
      ref={ref}
      className={`reveal-block ${visible ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function HeroScore() {
  const [score, setScore] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / 1200, 1);
        const e = 1 - Math.pow(1 - p, 3);
        setScore(Math.round(e * 78));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="text-[var(--red)] leading-none hero-score-num"
      style={{ fontFamily: "var(--font-d)", fontSize: "clamp(72px,12vw,104px)", letterSpacing: "-4px" }}
    >
      {score}
    </div>
  );
}

export default function LandingPage() {
  const featuresRef = useRef<HTMLDivElement>(null);

  const scrollToFeatures = (e: React.MouseEvent) => {
    e.preventDefault();
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="page-transition overflow-x-hidden">

      {/* ── HERO ── */}
      <div className="flex flex-col lg:grid border-b-2 border-[var(--black)]" style={{ gridTemplateColumns: "1fr 340px", minHeight: "460px" }}>
        <div className="p-5 sm:p-10 border-b-2 lg:border-b-0 lg:border-r-2 border-[var(--black)]">

          <div className="flex items-center gap-2.5 mb-5 hero-badge">
            <div className="w-5 h-[3px] bg-[var(--red)]" />
            <span className="label-sm text-[var(--red)]">Social Media SEO Intelligence — 2026</span>
          </div>

          <div className="d1 mb-4 hero-headline">
            SEO THAT<br />
            <span className="inv">ACTUALLY</span><br />
            <span className="acc">WORKS.</span>
          </div>

          <p className="body-text mb-5 max-w-[480px] text-[#444] hero-sub text-[14px] sm:text-[15px]">
            Algorithm-native SEO scoring for Instagram, LinkedIn &amp; X. Built on verified 2026
            ranking signals — watch time, DM sends, Depth Score, TweepCred. Not opinions. The real algorithm.
          </p>

          <div className="flex gap-0 border-2 border-[var(--black)] w-fit mb-6 hero-platforms">
            {[
              { label: "IG", color: "#ff8fab" },
              { label: "LINKEDIN", color: "#7eb8f7" },
              { label: "X / TW", color: "#aaa", bg: "#222" },
            ].map(({ label, color, bg }) => (
              <span key={label} className="platform-tag border-none border-l border-l-[#333]" style={{ background: bg || "var(--black)", color, padding: "5px 10px" }}>
                {label}
              </span>
            ))}
          </div>

          {/* CTA buttons — stacked full-width on mobile, inline on sm+ */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 hero-cta">
            <Link href="/signup" className="btn btn-red btn-lg group w-full sm:w-auto justify-center">
              Analyse My Content
              <ArrowRight className="h-3.5 w-3.5 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <button
              onClick={scrollToFeatures}
              className="btn btn-outline btn-lg w-full sm:w-auto justify-center sm:border-l-0"
            >
              See How It Works
            </button>
          </div>

          {/* Trust stats — 3-col grid so they never wrap weirdly */}
          <div className="mt-6 grid grid-cols-3 gap-3 sm:flex sm:gap-6 hero-trust">
            {[
              { label: "FREE", sub: "No credit card ever", color: "var(--red)" },
              { label: "ACCURATE", sub: "2026 algo signals", color: "var(--black)" },
              { label: "FAST", sub: "Results in seconds", color: "var(--black)" },
            ].map(({ label, sub, color }) => (
              <div key={label} className="trust-item">
                <span className="label-sm text-[10px]" style={{ color }}>{label}</span>
                <br />
                <span className="text-[11px] sm:text-[13px] text-[#666] leading-snug">{sub}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Score Panel — compact row on mobile, full sidebar on lg */}
        <div className="flex flex-col bg-[var(--black)] hero-panel">
          {/* Mobile: horizontal score strip */}
          <div className="lg:hidden flex border-b-2 border-[#222]">
            <div className="flex-1 p-4 border-r border-[#222]">
              <div className="label-sm text-[#555] mb-1">SEO Health</div>
              <HeroScore />
              <div className="label-sm text-[#555] mt-0.5">/ 100 — GOOD</div>
            </div>
            <div className="grid grid-cols-2 flex-1">
              {[
                { val: "24K", label: "Reach", color: "var(--bg)" },
                { val: "+18%", label: "Growth", color: "#4ade80" },
              ].map(({ val, label, color }, i) => (
                <div key={label} className={`p-3 ${i === 0 ? "border-r border-[#222]" : ""}`}>
                  <div style={{ fontFamily: "var(--font-d)", fontSize: "22px", color }}>{val}</div>
                  <div className="label-sm text-[#555]">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Platform scores — hidden on mobile */}
          <div className="hidden lg:grid grid-cols-3 border-b-2 border-[#222]">
            <div className="p-6 border-b-2 border-[#222] col-span-3">
              <div className="label-sm text-[#555] mb-1">Overall SEO Health</div>
              <HeroScore />
              <div className="label-sm text-[#555]">/ 100 — GOOD · Updated just now</div>
            </div>
            {[
              { label: "INSTAGRAM", score: "82", color: "#ff8fab" },
              { label: "LINKEDIN", score: "74", color: "#7eb8f7" },
              { label: "X / TW", score: "79", color: "#888" },
            ].map((p, i) => (
              <div key={p.label} className={`p-3.5 px-3 text-center score-cell ${i < 2 ? "border-r border-r-[#222]" : ""}`}>
                <div className="label-sm mb-1.5" style={{ color: p.color }}>{p.label}</div>
                <div className="text-[var(--bg)]" style={{ fontFamily: "var(--font-d)", fontSize: "36px", letterSpacing: "-1px" }}>{p.score}</div>
              </div>
            ))}
          </div>

          <div className="hidden lg:grid grid-cols-2 border-b-2 border-[#222] flex-1">
            {[
              { val: "24K", label: "Est Reach", color: "var(--bg)" },
              { val: "3", label: "Penalties", color: "var(--red)" },
              { val: "+18%", label: "Growth", color: "#4ade80" },
              { val: "91", label: "Keyword Score", color: "var(--bg)" },
            ].map(({ val, label, color }, i) => (
              <div key={label} className={`p-3 stat-cell ${i % 2 === 0 ? "border-r border-r-[#222]" : ""} ${i >= 2 ? "border-t border-t-[#222]" : ""}`}>
                <div style={{ fontFamily: "var(--font-d)", fontSize: "28px", color }}>{val}</div>
                <div className="label-sm text-[#555]">{label}</div>
              </div>
            ))}
          </div>

          <Link href="/signup" className="px-4 py-3.5 bg-[var(--red)] cursor-pointer flex justify-between items-center group panel-cta">
            <span className="label-sm text-[var(--bg)]">Run Your Free Scan Now</span>
            <ArrowRight className="h-4 w-4 text-[var(--bg)] transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* ── METRIC STRIP ── */}
      <div className="metric-strip">
        {[
          { target: 3, suffix: "", label: "Platforms Covered", delta: "IG · LI · X", cls: "flat", isText: false },
          { target: 17, suffix: "", label: "SEO Parameters", delta: "↑ 2026 Updated", cls: "up", isText: false },
          { target: 100, suffix: "%", label: "Free Forever", delta: "No credit card", cls: "flat", isText: false },
          { target: 0, suffix: "", label: "Guesswork", delta: "Pure algorithm data", cls: "flat", isText: false },
        ].map(({ target, suffix, label, delta, cls }, i) => (
          <RevealBlock key={label} delay={i * 80} className="ms-cell">
            <AnimatedCounter target={target} suffix={suffix} />
            <div className="ms-label">{label}</div>
            <div className={`ms-delta ${cls}`}>{delta}</div>
          </RevealBlock>
        ))}
      </div>

      {/* ── HOW IT WORKS ── */}
      <div className="border-b-2 border-[var(--black)] bg-white">
        <RevealBlock className="px-6 sm:px-10 pt-12 pb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-[3px] bg-[var(--red)]" />
            <span className="label-sm text-[var(--red)]">Simple Process</span>
          </div>
          <div className="d3 mb-2">HOW IT WORKS.</div>
        </RevealBlock>

        <div className="grid grid-cols-1 sm:grid-cols-3 border-t-2 border-[var(--black)]">
          {steps.map(({ n, Icon, title, desc }, i) => (
            <RevealBlock
              key={n}
              delay={i * 120}
              className={`p-8 sm:p-10 ${i < 2 ? "sm:border-r-2 border-b-2 sm:border-b-0 border-[var(--black)]" : ""}`}
            >
              <div className="flex items-start gap-4 mb-5">
                <span className="text-[var(--red)] font-black text-[11px] tracking-[2px] mt-1">{n}</span>
                <div className="w-10 h-10 border-2 border-[var(--black)] flex items-center justify-center bg-[var(--bg)] step-icon">
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="h3 mb-2">{title}</div>
              <div className="body-sm text-[#555]">{desc}</div>
              {i < steps.length - 1 && (
                <div className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10">
                  <ChevronRight className="h-5 w-5 text-[#ccc]" />
                </div>
              )}
            </RevealBlock>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <div ref={featuresRef} id="features" className="px-6 sm:px-10 pt-12 border-b-2 border-[var(--black)]">
        <RevealBlock>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-[3px] bg-[var(--red)]" />
            <span className="label-sm text-[var(--red)]">Everything You Need</span>
          </div>
          <div className="d3 mb-4">BUILT FOR SERIOUS CREATORS.</div>
        </RevealBlock>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t-2 border-[var(--black)]">
        {features.map(({ Icon, title, desc, color }, i) => (
          <RevealBlock
            key={title}
            delay={(i % 3) * 80}
            className={[
              "feature-card p-6 sm:p-8 border-b-2 border-[var(--black)]",
              (i + 1) % 2 !== 0 ? "sm:border-r-2 lg:border-r-0" : "",
              (i + 1) % 3 !== 0 ? "lg:border-r-2" : "",
              (i + 1) % 2 !== 0 && (i + 1) % 3 !== 0 ? "sm:border-r-2 lg:border-r-2" : "",
              (i + 1) % 3 === 0 ? "lg:border-r-0" : "",
              i >= 6 ? "lg:border-b-0" : "",
              i >= 7 ? "sm:border-b-0" : "",
            ].join(" ")}
          >
            <div
              className="w-10 h-10 border-2 border-[var(--black)] flex items-center justify-center mb-4 feature-icon"
              style={{ "--icon-color": color } as React.CSSProperties}
            >
              <Icon className="h-4 w-4 transition-colors duration-200" />
            </div>
            <div className="h3 mb-2">{title}</div>
            <div className="body-sm text-[#555] leading-relaxed">{desc}</div>
          </RevealBlock>
        ))}
      </div>

      {/* ── SOCIAL PROOF STRIP ── */}
      <RevealBlock className="border-b-2 border-[var(--black)] overflow-hidden bg-[var(--bg)]">
        <div className="px-6 sm:px-10 py-10 flex flex-col sm:flex-row items-start sm:items-center gap-8">
          <div className="shrink-0">
            <div className="label-sm text-[var(--red)] mb-1">What creators are saying</div>
            <div className="d4 text-[var(--black)]">REAL RESULTS.</div>
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { quote: "My reach went from 800 to 14K in 3 weeks. The score explained exactly why my posts were failing.", handle: "@fitnesswithriya" },
              { quote: "LinkedIn impressions tripled after I fixed just 2 things the analyser flagged. Jaw-dropping.", handle: "@b2bwithkarim" },
              { quote: "Banned hashtags I had no idea about. Removing them alone bumped my IG reach by 40%.", handle: "@contentbysasha" },
            ].map(({ quote, handle }) => (
              <div key={handle} className="testimonial-card border-2 border-[var(--black)] bg-white p-4">
                <p className="text-xs leading-relaxed text-[#333] mb-3 italic">"{quote}"</p>
                <span className="label-sm text-[#888]">{handle}</span>
              </div>
            ))}
          </div>
        </div>
      </RevealBlock>

      {/* ── FINAL CTA ── */}
      <RevealBlock>
        <div className="bg-[var(--black)] border-t-2 border-[var(--black)] p-10 sm:p-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div>
            <div className="label-sm text-[var(--red)] mb-3">Start for free</div>
            <div className="d3 mb-3 text-[var(--bg)] max-w-[480px]">READY TO RANK HIGHER?</div>
            <div className="body-text text-[#555]">Free. No credit card. Built on open infrastructure.</div>
          </div>
          <div className="flex flex-col gap-3 shrink-0">
            <Link href="/signup" className="btn btn-red btn-lg btn-arrow group justify-center">
              Start For Free
              <ArrowRight className="h-3.5 w-3.5 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link href="/dashboard" className="btn btn-outline btn-lg text-[var(--bg)] !border-[#333] justify-center hover:!bg-[#1a1a1a]">
              View Demo
            </Link>
          </div>
        </div>
      </RevealBlock>

    </div>
  );
}
