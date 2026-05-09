import { Link } from "wouter";
import { BarChart2, Key, Hash, Calendar, Bot, Users, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { formatDistanceToNow } from "date-fns";

interface SavedAnalysis {
  id: number;
  platform: string;
  content_text: string;
  overall_score: number;
  created_at: string;
}

export default function DashboardHome() {
  const { user } = useAuth();
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);
  const [scores, setScores] = useState({
    overall: 0,
    instagram: 0,
    linkedin: 0,
    x: 0,
  });

  useEffect(() => {
    // Load saved analyses from localStorage
    try {
      const saved: SavedAnalysis[] = JSON.parse(localStorage.getItem("rp_analyses") || "[]");
      setAnalyses(saved.slice(0, 10));

      // Calculate average scores from saved data
      if (saved.length > 0) {
        const igScores = saved.filter(a => a.platform === "instagram").map(a => a.overall_score);
        const liScores = saved.filter(a => a.platform === "linkedin").map(a => a.overall_score);
        const xScores = saved.filter(a => a.platform === "x").map(a => a.overall_score);
        const allScores = saved.map(a => a.overall_score);

        const avg = (arr: number[]) => arr.length > 0 ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;

        setScores({
          overall: avg(allScores),
          instagram: avg(igScores),
          linkedin: avg(liScores),
          x: avg(xScores),
        });
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  const platformLabel = (p: string) => {
    switch (p) {
      case "instagram": return "Instagram";
      case "linkedin": return "LinkedIn";
      case "x": return "X / Twitter";
      default: return p;
    }
  };

  const platformTag = (p: string) => {
    switch (p) {
      case "instagram": return "tag-ig";
      case "linkedin": return "tag-li";
      case "x": return "tag-x";
      default: return "";
    }
  };

  const hasData = analyses.length > 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Greeting */}
      <div className="card p-5 bg-[var(--black)] text-white border-[var(--black)]">
        <div className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--red)] mb-1">Welcome back</div>
        <div className="text-xl font-black uppercase" style={{ fontFamily: "var(--font-d)" }}>
          {user?.displayName || user?.email?.split("@")[0] || "Creator"}
        </div>
        <p className="text-xs text-[#888] mt-1">
          {hasData
            ? `You have ${analyses.length} saved ${analyses.length === 1 ? "analysis" : "analyses"}. Keep optimising!`
            : "Start by analysing your first post in the Content Analyser."}
        </p>
      </div>

      {/* Score cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Overall Score", value: hasData ? String(scores.overall) : "—" },
          { title: "Instagram Score", value: hasData && scores.instagram > 0 ? String(scores.instagram) : "—" },
          { title: "LinkedIn Score", value: hasData && scores.linkedin > 0 ? String(scores.linkedin) : "—" },
          { title: "X / Twitter Score", value: hasData && scores.x > 0 ? String(scores.x) : "—" },
        ].map((card) => (
          <div key={card.title} className="card p-5">
            <div className="label-sm text-[#888] mb-2">{card.title}</div>
            <div className="text-[48px] font-black leading-none" style={{ fontFamily: "var(--font-d)" }}>{card.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {card.value === "—" ? "No data yet" : "Average from analyses"}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Analyses */}
      <div className="card overflow-x-auto">
        <div className="flex items-center gap-2 mb-4">
          <div className="sh-accent" />
          <span className="sh-title">Recent Analyses</span>
        </div>
        {hasData ? (
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
              {analyses.map((a) => (
                <tr key={a.id} className="border-b border-[#eaeaea]">
                  <td className="p-3"><span className={`platform-tag ${platformTag(a.platform)}`}>{platformLabel(a.platform)}</span></td>
                  <td className="p-3 font-bold">{a.overall_score}</td>
                  <td className="p-3 max-w-xs truncate text-[#555]">{a.content_text.slice(0, 80)}...</td>
                  <td className="p-3 text-[#888] text-xs">{formatDistanceToNow(new Date(a.created_at), { addSuffix: true })}</td>
                  <td className="p-3"><Link href="/dashboard/analyzer" className="btn btn-outline btn-sm">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8 text-[#888]">
            <p className="text-sm font-bold mb-2">No analyses yet</p>
            <p className="text-xs mb-4">Head to the Content Analyser to score your first post.</p>
            <Link href="/dashboard/analyzer" className="btn btn-red btn-sm">Analyse Your First Post →</Link>
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: "/dashboard/analyzer", Icon: BarChart2, title: "Content Analyser", desc: "Score your next post" },
          { href: "/dashboard/scheduler", Icon: Calendar, title: "Scheduler", desc: "Plan your SEO content" },
          { href: "/dashboard/ai-studio", Icon: Bot, title: "AI Studio", desc: "Pre-scored content ideas" },
          { href: "/dashboard/keywords", Icon: Key, title: "Keyword Research", desc: "Find ranking keywords" },
          { href: "/dashboard/hashtags", Icon: Hash, title: "Hashtag Bank", desc: "Build your hashtag sets" },
          { href: "/dashboard/competitors", Icon: Users, title: "Competitors", desc: "Track performance gaps" },
          { href: "/dashboard/profile-audit", Icon: Shield, title: "Profile Audit", desc: "Optimize your bio" },
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
