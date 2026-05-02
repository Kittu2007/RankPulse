import { Link, useLocation } from "wouter";
import {
  Bell, Home, LineChart, Package2, Users, Settings,
  Search, Calendar, BarChart, Bot, Hash, Shield, CircleUser
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/dashboard/analyzer", icon: Search, label: "Analyser" },
  { href: "/dashboard/ai-studio", icon: Bot, label: "AI Studio" },
  { href: "/dashboard/scheduler", icon: Calendar, label: "Scheduler" },
  { href: "/dashboard/analytics", icon: BarChart, label: "Analytics" },
  { href: "/dashboard/keywords", icon: LineChart, label: "Keywords" },
  { href: "/dashboard/hashtags", icon: Hash, label: "Hashtags" },
  { href: "/dashboard/competitors", icon: Users, label: "Competitors" },
  { href: "/dashboard/profile-audit", icon: Shield, label: "Profile Audit" },
];

function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="hidden border-r-2 border-[var(--black)] bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b-2 border-[var(--black)] px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6" />
            <span className="font-black tracking-wider">RankPulse</span>
          </Link>
          <button className="ml-auto h-8 w-8 border border-[var(--black)] flex items-center justify-center hover:bg-[#f0f0f0]">
            <Bell className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${location === href ? "bg-muted text-primary" : ""}`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <div className="border-2 border-[var(--black)] p-4">
            <div className="font-bold text-sm mb-1">Upgrade to Pro</div>
            <div className="text-xs text-muted-foreground mb-3">Unlock all features and unlimited access.</div>
            <button className="btn btn-black btn-sm w-full justify-center">Upgrade</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Header() {
  const supabase = createClient();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
    });
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <header className="flex h-14 items-center gap-4 border-b-2 border-[var(--black)] bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <div className="w-full flex-1">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search..."
            className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3 border border-[var(--black)] h-9 px-2 text-sm outline-none"
          />
        </div>
      </div>
      <div className="relative group">
        <button className="h-9 w-9 rounded-full border-2 border-[var(--black)] flex items-center justify-center hover:bg-[#f0f0f0]">
          <CircleUser className="h-5 w-5" />
        </button>
        <div className="absolute right-0 top-full mt-1 w-48 bg-white border-2 border-[var(--black)] shadow-[4px_4px_0_var(--black)] hidden group-hover:block z-50">
          <div className="px-4 py-2 text-xs font-bold border-b border-[#eaeaea]">
            {userEmail || 'My Account'}
          </div>
          <Link href="/dashboard/settings" className="block px-4 py-2 text-sm hover:bg-[#f0f0f0]">Settings</Link>
          <Link href="/admin" className="block px-4 py-2 text-sm hover:bg-[#f0f0f0]">Admin Panel</Link>
          <div className="border-t border-[#eaeaea]">
            <button onClick={handleSignOut} className="block w-full text-left px-4 py-2 text-sm hover:bg-[#f0f0f0]">Sign Out</button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-[var(--bg)]">
          {children}
        </main>
      </div>
    </div>
  );
}
