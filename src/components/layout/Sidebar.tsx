"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarSection {
  label: string;
  items: SidebarItem[];
}

interface SidebarItem {
  icon: string;
  label: string;
  href: string;
}

const sections: SidebarSection[] = [
  {
    label: "Main",
    items: [
      { icon: "📊", label: "Dashboard", href: "/dashboard" },
      { icon: "🔍", label: "Content Analyser", href: "/dashboard/analyzer" },
      { icon: "🔑", label: "Keyword Research", href: "/dashboard/keywords" },
      { icon: "#", label: "Hashtag Intel", href: "/dashboard/hashtags" },
    ],
  },
  {
    label: "Research",
    items: [
      { icon: "👥", label: "Competitors", href: "/dashboard/competitors" },
      { icon: "📅", label: "Scheduler", href: "/dashboard/scheduler" },
      { icon: "👤", label: "Profile Audit", href: "/dashboard/audit" },
    ],
  },
  {
    label: "Insights",
    items: [
      { icon: "📈", label: "Analytics", href: "/dashboard/analytics" },
      { icon: "✨", label: "AI Studio", href: "/dashboard/ai-studio" },
    ],
  },
  {
    label: "Account",
    items: [
      { icon: "⚙️", label: "Settings", href: "/dashboard/settings" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[220px] bg-[var(--black)] border-r-2 border-[var(--black)] flex flex-col shrink-0 py-2 sidebar-responsive-hide">
      {sections.map((section) => (
        <div key={section.label}>
          {/* Section Label */}
          <div className="px-4 pt-3 pb-1 text-[9px] text-[#444] tracking-[3px] font-bold uppercase">
            {section.label}
          </div>

          {/* Section Items */}
          {section.items.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 py-[9px] px-4 text-xs font-medium cursor-pointer transition-all duration-150 border-l-[3px] ${
                  isActive
                    ? "text-[var(--bg)] bg-[#1a1a1a] border-l-[var(--red)]"
                    : "text-[#777] hover:text-[#ccc] hover:bg-[#1a1a1a] border-l-transparent"
                }`}
              >
                <span className="text-[13px] shrink-0 opacity-70">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </aside>
  );
}
