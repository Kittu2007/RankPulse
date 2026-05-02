import { Link, useLocation } from "wouter";
import {
  Bell, Home, Search, Calendar, BarChart2, Bot, Hash,
  Users, Shield, Key, CircleUser, Menu, X, TrendingUp, Settings
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/dashboard/analyzer", icon: Search, label: "Analyser" },
  { href: "/dashboard/ai-studio", icon: Bot, label: "AI Studio" },
  { href: "/dashboard/scheduler", icon: Calendar, label: "Scheduler" },
  { href: "/dashboard/analytics", icon: BarChart2, label: "Analytics" },
  { href: "/dashboard/keywords", icon: Key, label: "Keywords" },
  { href: "/dashboard/hashtags", icon: Hash, label: "Hashtags" },
  { href: "/dashboard/competitors", icon: Users, label: "Competitors" },
  { href: "/dashboard/profile-audit", icon: Shield, label: "Profile Audit" },
];

function NavLink({ href, icon: Icon, label, onClick }: { href: string; icon: React.ElementType; label: string; onClick?: () => void }) {
  const [location] = useLocation();
  const isActive = location === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[1.5px] transition-colors ${
        isActive
          ? "bg-[var(--red)] text-white"
          : "text-[#aaa] hover:text-white hover:bg-[#1a1a1a]"
      }`}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {label}
    </Link>
  );
}

function Sidebar({ onClose }: { onClose?: () => void }) {
  return (
    <div className="flex h-full flex-col bg-[var(--black)]">
      {/* Logo */}
      <div className="flex h-14 items-center justify-between border-b border-[#222] px-4 lg:h-[60px]">
        <Link href="/" className="flex items-center gap-0" onClick={onClose}>
          <div className="bg-[var(--red)] px-1.5 py-0.5">
            <span className="text-[13px] tracking-[2px] text-white font-black" style={{ fontFamily: "var(--font-d)" }}>RANKPULSE</span>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <button className="h-8 w-8 border border-[#333] flex items-center justify-center text-[#888] hover:text-white hover:border-[#555] transition-colors">
            <Bell className="h-3.5 w-3.5" />
          </button>
          {onClose && (
            <button onClick={onClose} className="h-8 w-8 border border-[#333] flex items-center justify-center text-[#888] hover:text-white md:hidden">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto py-2">
        <nav className="flex flex-col">
          {navItems.map(({ href, icon, label }) => (
            <NavLink key={href} href={href} icon={icon} label={label} onClick={onClose} />
          ))}
        </nav>
      </div>

      {/* Upgrade card */}
      <div className="p-4 border-t border-[#222]">
        <div className="border border-[#333] p-3 bg-[#111]">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingUp className="h-3 w-3 text-[var(--red)]" />
            <span className="text-[10px] font-bold uppercase tracking-[1.5px] text-white">Upgrade to Pro</span>
          </div>
          <div className="text-[10px] text-[#666] mb-3">Unlock all features and unlimited access.</div>
          <button className="btn btn-red btn-sm w-full justify-center text-[10px] tracking-[1px]">UPGRADE</button>
        </div>
      </div>
    </div>
  );
}

function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const supabase = createClient();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
    });
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <header className="flex h-14 items-center gap-3 border-b-2 border-[var(--black)] bg-white px-4 lg:h-[60px]">
      {/* Mobile menu toggle */}
      <button
        onClick={onMenuClick}
        className="h-9 w-9 border-2 border-[var(--black)] flex items-center justify-center md:hidden shrink-0"
      >
        <Menu className="h-4 w-4" />
      </button>

      {/* Search */}
      <div className="flex-1">
        <div className="relative max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#aaa]" />
          <input
            type="search"
            placeholder="Search..."
            className="w-full bg-[var(--bg)] pl-8 border border-[#ddd] h-9 px-2 text-sm outline-none focus:border-[var(--black)] transition-colors"
          />
        </div>
      </div>

      {/* User menu */}
      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="h-9 w-9 rounded-full border-2 border-[var(--black)] flex items-center justify-center hover:bg-[#f0f0f0] transition-colors"
        >
          <CircleUser className="h-5 w-5" />
        </button>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 top-full mt-1 w-52 bg-white border-2 border-[var(--black)] shadow-[4px_4px_0_var(--black)] z-50">
              <div className="px-4 py-2.5 text-[10px] font-bold border-b border-[#eaeaea] uppercase tracking-[1px] text-[#888] truncate">
                {userEmail || "My Account"}
              </div>
              <Link href="/dashboard/settings" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold hover:bg-[var(--bg)] transition-colors">
                <Settings className="h-3.5 w-3.5" /> Settings
              </Link>
              <Link href="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold hover:bg-[var(--bg)] transition-colors">
                <Shield className="h-3.5 w-3.5" /> Admin Panel
              </Link>
              <div className="border-t border-[#eaeaea]">
                <button onClick={handleSignOut} className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-bold hover:bg-[var(--bg)] transition-colors text-[var(--red)]">
                  Sign Out
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full">
      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-[220px] lg:w-[260px] shrink-0 flex-col border-r-2 border-[var(--black)]">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed left-0 top-0 bottom-0 w-[260px] z-50 md:hidden">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-[var(--bg)]">
          {children}
        </main>
      </div>
    </div>
  );
}
