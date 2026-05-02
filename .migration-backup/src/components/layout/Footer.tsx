import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[var(--black)] border-t-2 border-[var(--black)] px-10 pt-12 pb-6">
      {/* Footer Grid */}
      <div className="grid gap-8 mb-10" style={{ gridTemplateColumns: "1.5fr 1fr 1fr 1fr" }}>
        {/* Brand */}
        <div>
          <div className="text-[28px] tracking-[2px] text-[var(--bg)] mb-2.5" style={{ fontFamily: "var(--font-d)" }}>
            RANK<span className="text-[var(--red)]">PULSE</span>
          </div>
          <div className="text-xs text-[#555] leading-[1.6] max-w-[240px]">
            Algorithm-native SEO intelligence for Instagram, LinkedIn, and X.
            Built on verified 2026 ranking signals — free forever.
          </div>
          <div className="mt-4 flex gap-2">
            <span className="platform-tag tag-ig">Instagram</span>
            <span className="platform-tag tag-li">LinkedIn</span>
            <span className="platform-tag tag-x">X</span>
          </div>
        </div>

        {/* Product */}
        <div>
          <div className="text-[9px] font-bold tracking-[3px] uppercase text-[#888] mb-3.5">
            Product
          </div>
          {[
            { label: "Features", href: "/features" },
            { label: "Content Analyser", href: "/dashboard/analyzer" },
            { label: "Keyword Research", href: "/dashboard/keywords" },
            { label: "Hashtag Intelligence", href: "/dashboard/hashtags" },
            { label: "Competitor Tracker", href: "/dashboard/competitors" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-xs text-[#666] mb-2 cursor-pointer hover:text-[var(--bg)] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Platform */}
        <div>
          <div className="text-[9px] font-bold tracking-[3px] uppercase text-[#888] mb-3.5">
            Platform
          </div>
          {[
            "Instagram SEO Guide",
            "LinkedIn SEO Guide",
            "X / Twitter SEO Guide",
            "Algorithm Updates",
            "2026 Ranking Signals",
          ].map((label) => (
            <span
              key={label}
              className="block text-xs text-[#666] mb-2 cursor-pointer hover:text-[var(--bg)] transition-colors"
            >
              {label}
            </span>
          ))}
        </div>

        {/* Company */}
        <div>
          <div className="text-[9px] font-bold tracking-[3px] uppercase text-[#888] mb-3.5">
            Company
          </div>
          {[
            { label: "About", href: "/about" },
            { label: "Contact", href: "/contact" },
            { label: "Changelog", href: "#" },
            { label: "Privacy Policy", href: "#" },
            { label: "Terms of Service", href: "#" },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="block text-xs text-[#666] mb-2 cursor-pointer hover:text-[var(--bg)] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-[#222] pt-5 flex justify-between items-center">
        <div className="text-[11px] text-[#444] tracking-[0.5px]">
          © 2026 RankPulse. Built free on Supabase + Vercel. Open infrastructure.
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#4ade80] tracking-[1.5px] uppercase">
          <div className="w-[7px] h-[7px] rounded-full bg-[#4ade80]" />
          All Systems Live
        </div>
      </div>

      <footer className="p-4 border-t text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} RankPulse. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-2">
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:underline">
            Terms of Service
          </Link>
        </div>
      </footer>
    </footer>
  );
}
