import { Link } from "wouter";
import { useState } from "react";
import { Menu, X } from "lucide-react";

function TopNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="border-b-2 border-[var(--black)] bg-[var(--bg)]">
      <div className="flex items-center justify-between px-5 sm:px-10 py-4">
        <Link href="/" className="font-black text-lg tracking-[2px] uppercase shrink-0" style={{ fontFamily: 'var(--font-d)' }}>
          RANK<span style={{ color: 'var(--red)' }}>PULSE</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-0">
          <Link href="/#features" className="btn btn-outline border-0 text-xs px-5">Features</Link>
          <Link href="/pricing" className="btn btn-outline border-0 text-xs px-5">Pricing</Link>
          <Link href="/login" className="btn btn-outline text-xs px-5">Sign In</Link>
          <Link href="/signup" className="btn btn-red text-xs px-5 ml-2">Get Started</Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden h-9 w-9 border-2 border-[var(--black)] flex items-center justify-center"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="sm:hidden border-t-2 border-[var(--black)] flex flex-col bg-[var(--bg)]">
          <Link href="/#features" onClick={() => setOpen(false)} className="px-5 py-3 text-sm font-bold border-b border-[#e0ddd0] hover:bg-[#ede9da]">Features</Link>
          <Link href="/pricing" onClick={() => setOpen(false)} className="px-5 py-3 text-sm font-bold border-b border-[#e0ddd0] hover:bg-[#ede9da]">Pricing</Link>
          <Link href="/login" onClick={() => setOpen(false)} className="px-5 py-3 text-sm font-bold border-b border-[#e0ddd0] hover:bg-[#ede9da]">Sign In</Link>
          <Link href="/signup" onClick={() => setOpen(false)} className="m-4 btn btn-red justify-center">Get Started</Link>
        </div>
      )}
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-[var(--black)] border-t-2 border-[var(--black)] px-5 sm:px-10 pt-10 pb-6">
      <div className="grid gap-8 mb-10 grid-cols-2 sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <div className="text-[28px] tracking-[2px] text-[var(--bg)] mb-2.5" style={{ fontFamily: "var(--font-d)" }}>
            RANK<span style={{ color: 'var(--red)' }}>PULSE</span>
          </div>
          <div className="text-xs text-[#555] leading-[1.6] max-w-[240px]">
            Algorithm-native SEO intelligence for Instagram, LinkedIn, and X.
            Built on verified 2026 ranking signals — free forever.
          </div>
          <div className="mt-4 flex gap-2 flex-wrap">
            <span className="platform-tag tag-ig">Instagram</span>
            <span className="platform-tag tag-li">LinkedIn</span>
            <span className="platform-tag tag-x">X</span>
          </div>
        </div>
        <div>
          <div className="text-[9px] font-bold tracking-[3px] uppercase text-[#888] mb-3.5">Product</div>
          {[
            { label: "Features", href: "/features" },
            { label: "Content Analyser", href: "/dashboard/analyzer" },
            { label: "Keyword Research", href: "/dashboard/keywords" },
            { label: "Hashtag Intelligence", href: "/dashboard/hashtags" },
            { label: "Competitor Tracker", href: "/dashboard/competitors" },
          ].map((link) => (
            <Link key={link.href} href={link.href} className="block text-xs text-[#666] mb-2 hover:text-[var(--bg)] transition-colors">
              {link.label}
            </Link>
          ))}
        </div>
        <div>
          <div className="text-[9px] font-bold tracking-[3px] uppercase text-[#888] mb-3.5">Platform</div>
          {["Instagram SEO Guide", "LinkedIn SEO Guide", "X / Twitter SEO Guide", "Algorithm Updates", "2026 Ranking Signals"].map((label) => (
            <span key={label} className="block text-xs text-[#666] mb-2 cursor-pointer hover:text-[var(--bg)] transition-colors">{label}</span>
          ))}
        </div>
        <div>
          <div className="text-[9px] font-bold tracking-[3px] uppercase text-[#888] mb-3.5">Company</div>
          {[{ label: "Privacy Policy", href: "/privacy" }, { label: "Terms of Service", href: "/terms" }].map((link) => (
            <Link key={link.label} href={link.href} className="block text-xs text-[#666] mb-2 hover:text-[var(--bg)] transition-colors">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="border-t border-[#222] pt-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="text-[11px] text-[#444] tracking-[0.5px]">© 2026 RankPulse. Built on open infrastructure.</div>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#4ade80] tracking-[1.5px] uppercase">
          <div className="w-[7px] h-[7px] rounded-full bg-[#4ade80]" />
          All Systems Live
        </div>
      </div>
    </footer>
  );
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)]">
      <TopNav />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
