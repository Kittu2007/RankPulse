"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
}

const publicItems: NavItem[] = [
  { label: "Features", href: "/features" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const dashboardItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Analyser", href: "/dashboard/analyzer" },
  { label: "Keywords", href: "/dashboard/keywords" },
  { label: "Hashtags", href: "/dashboard/hashtags" },
  { label: "Competitors", href: "/dashboard/competitors" },
  { label: "Scheduler", href: "/dashboard/scheduler" },
  { label: "Analytics", href: "/dashboard/analytics" },
  { label: "AI Studio", href: "/dashboard/ai-studio" },
];

interface TopNavProps {
  variant?: "public" | "dashboard";
}

export default function TopNav({ variant = "public" }: TopNavProps) {
  const pathname = usePathname();
  const items = variant === "dashboard" ? dashboardItems : publicItems;
  const logoHref = variant === "dashboard" ? "/dashboard" : "/";

  return (
    <nav
      id="top-nav"
      className="flex items-stretch border-b-2 border-[var(--black)] bg-[var(--black)] h-[52px] sticky top-0 z-[100]"
    >
      {/* Logo */}
      <Link
        href={logoHref}
        className="flex items-center border-r-2 border-[var(--black)] cursor-pointer"
      >
        <div className="flex items-center">
          <div className="bg-[var(--red)] px-2.5 py-1 flex items-center mx-3 my-2">
            <div
              className="font-display text-2xl tracking-[3px] text-[var(--bg)] leading-none"
              style={{ fontFamily: "var(--font-d)" }}
            >
              RANK
              <br />
              PULSE
            </div>
          </div>
          <div className="text-[8px] text-[#555] tracking-[2px] pr-2.5 leading-[1.3]">
            SOCIAL
            <br />
            SEO
          </div>
        </div>
      </Link>

      {/* Nav Items */}
      <div className="flex flex-1">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 text-[11px] font-semibold tracking-[0.5px] border-r border-[#222] transition-all duration-150 uppercase whitespace-nowrap ${
                isActive
                  ? "text-[var(--bg)] bg-[#1a1a1a] border-b-2 border-b-[var(--red)]"
                  : "text-[#888] hover:text-[#ccc] hover:bg-[#1a1a1a]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 px-3.5 ml-auto border-l border-[#222]">
        {variant === "dashboard" ? (
          <>
            <Link href="/admin" className="btn btn-outline btn-sm">
              Admin
            </Link>
            <div
              className="w-8 h-8 bg-[var(--red)] border-2 border-[var(--black)] flex items-center justify-center cursor-pointer"
            >
              <span className="label-sm text-white">K</span>
            </div>
          </>
        ) : (
          <>
            <Link href="/login" className="btn btn-ghost btn-sm">
              Sign In
            </Link>
            <Link href="/signup" className="btn btn-red btn-sm">
              Start Free →
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
