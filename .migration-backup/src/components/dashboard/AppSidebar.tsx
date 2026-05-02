
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  Heart,
  Users,
  Calendar,
  BarChart,
  Settings,
  Shield,
  Bot,
  Tags,
  UserCheck,
  FileText,
  Server,
  Flag,
} from "lucide-react";
import { cn } from "@/lib/utils";

const dashboardNavItems = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "/dashboard/analyser", label: "Analyser", icon: Search },
  { href: "/dashboard/keywords", label: "Keywords", icon: Tags },
  { href: "/dashboard/hashtags", label: "Hashtags", icon: Heart },
  { href: "/dashboard/competitors", label: "Competitors", icon: Users },
  { href: "/dashboard/scheduler", label: "Scheduler", icon: Calendar },
  { href: "/dashboard/profile-audit", label: "Audit", icon: UserCheck },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart },
  { href: "/dashboard/ai-studio", label: "AI Studio", icon: Bot },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

const adminNavItems = [
    { href: "/admin/admin", label: "Admin Overview", icon: Shield },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/seo-config", label: "SEO Config", icon: FileText },
    { href: "/admin/api-health", label: "API Health", icon: Server },
    { href: "/admin/flags", label: "Flags", icon: Flag },
];

export function AppSidebar() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const navItems = isAdmin ? adminNavItems : dashboardNavItems;

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Shield className="h-6 w-6" />
            <span className="">RankPulse</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  pathname === href && "bg-muted text-primary"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
