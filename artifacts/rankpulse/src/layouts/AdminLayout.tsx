import { Link, useLocation } from "wouter";
import { BarChart2, Users, Settings, Activity, Flag, ArrowLeft } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [pathname] = useLocation();

  const navItems = [
    { icon: BarChart2, label: "Overview", href: "/admin" },
    { icon: Users, label: "User Management", href: "/admin/users" },
    { icon: Settings, label: "SEO Engine Config", href: "/admin/seo-config" },
    { icon: Activity, label: "API Health", href: "/admin/api-health" },
    { icon: Flag, label: "Feature Flags", href: "/admin/flags" },
  ];

  return (
    <div className="admin-shell bg-[#f5f2e8] min-h-screen flex text-[var(--black)]">
      <div className="admin-sidebar w-[200px] border-r-2 border-[var(--black)] bg-white flex flex-col shrink-0 relative shadow-[4px_0px_0px_var(--black)] z-10">
        <div className="p-[14px_16px] border-b-2 border-[var(--black)] mb-2 bg-[var(--black)]">
          <div className="text-[10px] font-bold uppercase tracking-[2px] text-white">ADMIN PANEL</div>
        </div>
        {navItems.map((item, i) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={i}
              href={item.href}
              className={`sidebar-item flex items-center gap-3 p-[10px_16px] text-sm font-bold border-b border-[#eaeaea] last:border-b-0 hover:bg-[#fafafa] transition-colors ${
                isActive ? "bg-[var(--black)] text-white hover:bg-[var(--black)]" : "text-[var(--black)]"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
        <Link
          href="/dashboard"
          className="sidebar-item flex items-center gap-3 p-[16px] text-sm font-bold border-t-2 border-[var(--black)] bg-[#f8f8f8] hover:bg-[#eaeaea] transition-colors mt-auto absolute bottom-0 w-full"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" />
          <span>Back to App</span>
        </Link>
      </div>
      <div className="admin-main flex-1 flex flex-col min-w-0 bg-[#f5f2e8]">
        {children}
      </div>
    </div>
  );
}
