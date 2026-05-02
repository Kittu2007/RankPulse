import { Link } from "wouter";
import { BarChart2, Key, Hash } from "lucide-react";

export default function DashboardHome() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Overall Score", value: "82", sub: "+3.2% from last week" },
          { title: "Instagram Score", value: "82", sub: "+1.1% this week" },
          { title: "LinkedIn Score", value: "74", sub: "Stable" },
          { title: "X / Twitter Score", value: "79", sub: "+2.8% this week" },
        ].map((card) => (
          <div key={card.title} className="card p-5">
            <div className="label-sm text-[#888] mb-2">{card.title}</div>
            <div className="text-[48px] font-black leading-none" style={{ fontFamily: "var(--font-d)" }}>{card.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="card overflow-x-auto">
        <div className="flex items-center gap-2 mb-4">
          <div className="sh-accent" />
          <span className="sh-title">Recent Analyses</span>
        </div>
        <table className="w-full border-collapse text-sm min-w-[500px]">
          <thead>
            <tr className="border-b-2 border-[var(--black)]">
              <th className="text-left p-3 text-[10px] font-bold uppercase tracking-[2px]">Platform</th>
              <th className="text-left p-3 text-[10px] font-bold uppercase tracking-[2px]">Score</th>
              <th className="text-left p-3 text-[10px] font-bold uppercase tracking-[2px]">Caption</th>
              <th className="text-left p-3 text-[10px] font-bold uppercase tracking-[2px]">Date</th>
              <th className="text-left p-3 text-[10px] font-bold uppercase tracking-[2px]"></th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[#eaeaea]">
              <td className="p-3"><span className="platform-tag tag-ig">Instagram</span></td>
              <td className="p-3 font-bold">88</td>
              <td className="p-3 max-w-xs truncate text-[#555]">The secret to perfect content is...</td>
              <td className="p-3 text-[#888] text-xs">2 hours ago</td>
              <td className="p-3"><Link href="/dashboard/analyzer" className="btn btn-outline btn-sm">View</Link></td>
            </tr>
            <tr className="border-b border-[#eaeaea]">
              <td className="p-3"><span className="platform-tag tag-li">LinkedIn</span></td>
              <td className="p-3 font-bold">74</td>
              <td className="p-3 max-w-xs truncate text-[#555]">Why most B2B content fails to generate leads...</td>
              <td className="p-3 text-[#888] text-xs">Yesterday</td>
              <td className="p-3"><Link href="/dashboard/analyzer" className="btn btn-outline btn-sm">View</Link></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: "/dashboard/analyzer", Icon: BarChart2, title: "Content Analyser", desc: "Score your next post" },
          { href: "/dashboard/keywords", Icon: Key, title: "Keyword Research", desc: "Find ranking keywords" },
          { href: "/dashboard/hashtags", Icon: Hash, title: "Hashtag Generator", desc: "Build your hashtag set" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="card flex items-center gap-4 cursor-pointer hover:shadow-[6px_6px_0_var(--black)] transition-shadow"
          >
            <div className="w-10 h-10 border-2 border-[var(--black)] flex items-center justify-center bg-[var(--bg)] shrink-0">
              <item.Icon className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-sm">{item.title}</div>
              <div className="text-xs text-[#888]">{item.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
