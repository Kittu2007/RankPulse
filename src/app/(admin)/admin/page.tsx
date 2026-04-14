"use client";

import Link from "next/link";

export default function AdminOverviewPage() {
  const metrics = [
    { n: '1,247', l: 'Total Users', d: '↑ +84 this week', c: 'text-white' },
    { n: '612', l: 'Monthly Active', d: '49% MAU rate', c: 'text-[#16a34a]' },
    { n: '0', l: 'Revenue', d: 'Free platform', c: 'text-[#f59e0b]' },
    { n: '3', l: 'Open Bugs', d: '↓ Fixed 2 today', c: 'text-[var(--red)]' },
  ];

  const userGrowth = [
    { date: 'Apr 10', signups: 18, active: 524 },
    { date: 'Apr 9', signups: 22, active: 511 },
    { date: 'Apr 8', signups: 14, active: 498 },
    { date: 'Apr 7', signups: 31, active: 487 },
    { date: 'Apr 6', signups: 19, active: 462 },
  ];

  const apiHealth = [
    { api: 'Instagram API', status: 'live', rate: '2,847 / 5,000/hr', pct: 57 },
    { api: 'LinkedIn API', status: 'live', rate: '891 / 2,000/hr', pct: 44 },
    { api: 'X API v2', status: 'warn', rate: '1,987 / 2,000/hr', pct: 99 },
    { api: 'OpenAI API', status: 'live', rate: '342 / 1,000/hr', pct: 34 },
    { api: 'Supabase DB', status: 'live', rate: '24ms avg latency', pct: 0 },
  ];

  const recentUsers = [
    { name: 'Rohan K.', email: 'rohan@...', plat: 'ig', score: 72, joined: '2h ago' },
    { name: 'Sanya M.', email: 'sanya@...', plat: 'li', score: 65, joined: '4h ago' },
    { name: 'Arjun P.', email: 'arjun@...', plat: 'x', score: 80, joined: '6h ago' },
    { name: 'Priya S.', email: 'priya@...', plat: 'ig', score: 58, joined: '8h ago' },
  ];

  const systemStats = [
    { l: 'Total Analyses Run', v: '18,247' },
    { l: 'Avg Analysis Time', v: '2.3s' },
    { l: 'Avg SEO Score (all users)', v: '69.4' },
    { l: 'Most Used Feature', v: 'Content Analyser' },
    { l: 'Most Used Platform', v: 'Instagram' },
    { l: 'Penalties Detected Total', v: '4,821' },
    { l: 'Supabase DB Size', v: '342 MB / 500 MB' },
    { l: 'Vercel Bandwidth', v: '8.2 GB / 100 GB' },
  ];

  return (
    <div className="flex flex-col min-h-screen pb-10">
      {/* Header */}
      <div className="p-[20px_24px] border-b-2 border-b-[var(--black)] bg-[#f5f2e8] flex justify-between items-center z-0">
        <div>
          <div className="text-[10px] font-bold tracking-[2px] uppercase text-[var(--red)] mb-1">Platform Administration</div>
          <div className="text-[32px] leading-none text-[var(--black)] uppercase" style={{ fontFamily: 'var(--font-d)' }}>Admin Overview</div>
        </div>
        <div className="flex gap-2 items-center text-[10px] font-bold uppercase tracking-widest bg-white border-2 border-[var(--black)] px-3 py-1.5 shadow-[2px_2px_0px_var(--black)]">
          <div className="w-2 h-2 rounded-full border border-black bg-[#22c55e] animate-pulse"></div>
          All Systems Live
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 bg-[var(--black)] border-b-2 border-b-[var(--black)]">
        {metrics.map((m, i) => (
          <div key={i} className={`p-[20px_24px] border-r-2 border-[#333] last:border-r-0 flex flex-col justify-center`}>
            <div className={`text-[48px] leading-none mb-1 tracking-[-1px] ${m.c}`} style={{ fontFamily: 'var(--font-d)' }}>{m.n}</div>
            <div className="text-[11px] font-bold tracking-[1px] uppercase text-[#888] mb-1">{m.l}</div>
            <div className={`text-[11px] font-bold ${m.d.startsWith('↑') ? 'text-[#4ade80]' : m.d.startsWith('↓') ? 'text-[var(--red)]' : 'text-[#888]'}`}>{m.d}</div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="p-[20px] grid grid-cols-1 lg:grid-cols-2 gap-5 z-0">
        
        {/* User Growth */}
        <div className="border-2 border-[var(--black)] bg-white shadow-[4px_4px_0px_var(--black)] flex flex-col">
          <div className="p-[12px_16px] border-b-2 border-[var(--black)] bg-[#fafafa] flex items-center gap-3">
            <div className="w-5 h-[3px] bg-[var(--red)]"></div>
            <span className="text-[12px] font-bold uppercase tracking-[2px] text-[var(--black)]">User Growth — Last 7 Days</span>
          </div>
          <div className="p-4 flex-1 flex flex-col gap-3 justify-center">
            {userGrowth.map((d, i) => (
              <div key={i} className="flex items-center gap-4 py-2 border-b border-[#eaeaea] last:border-b-0">
                <span className="text-[11px] font-bold min-w-[48px]">{d.date}</span>
                <div className="flex-1 h-3 bg-[#f0f0f0] border border-[#ddd] overflow-hidden">
                  <div className="h-full bg-[var(--red)] transition-all" style={{ width: `${(d.signups / 31) * 100}%` }}></div>
                </div>
                <span className="text-[10px] font-bold text-[#666] min-w-[120px] text-right">+{d.signups} signups · {d.active} MAU</span>
              </div>
            ))}
          </div>
        </div>

        {/* API Health */}
        <div className="border-2 border-[var(--black)] bg-white shadow-[4px_4px_0px_var(--black)] flex flex-col">
          <div className="p-[12px_16px] border-b-2 border-[var(--black)] bg-[#fafafa] flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-5 h-[3px] bg-[var(--black)]"></div>
              <span className="text-[12px] font-bold uppercase tracking-[2px] text-[var(--black)]">Platform API Health</span>
            </div>
            <Link href="/admin/api-health" className="btn btn-outline btn-sm bg-white font-bold text-[10px] uppercase">Full View →</Link>
          </div>
          <div className="p-4 flex-1 flex flex-col justify-center">
            {apiHealth.map((a, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 border-b border-[#eaeaea] last:border-b-0">
                <span className={`w-2.5 h-2.5 rounded-full border border-black ${a.status === 'live' ? 'bg-[#22c55e]' : 'bg-[#f59e0b]'}`}></span>
                <span className="text-[12px] font-bold text-[var(--black)] flex-1">{a.api}</span>
                <span className="text-[11px] font-bold text-[#666]">{a.rate}</span>
                {a.pct >= 90 && <span className="text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 border border-[var(--red)] bg-[#fee2e2] text-[var(--red)]">NEAR LIMIT</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="border-2 border-[var(--black)] bg-white shadow-[4px_4px_0px_var(--black)] flex flex-col">
          <div className="p-[12px_16px] border-b-2 border-[var(--black)] bg-[#fafafa] flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-5 h-[3px] bg-[var(--black)]"></div>
              <span className="text-[12px] font-bold uppercase tracking-[2px] text-[var(--black)]">Recent Signups</span>
            </div>
            <Link href="/admin/users" className="btn btn-outline btn-sm bg-white font-bold text-[10px] uppercase">All Users →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f0f0f0] border-b-2 border-[var(--black)]">
                  <th className="p-3 text-[10px] uppercase tracking-[2px] text-[#555]">User</th>
                  <th className="p-3 text-[10px] uppercase tracking-[2px] text-[#555]">Platform</th>
                  <th className="p-3 text-[10px] uppercase tracking-[2px] text-[#555]">Score</th>
                  <th className="p-3 text-[10px] uppercase tracking-[2px] text-[#555]">Joined</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((u, i) => (
                  <tr key={i} className="border-b border-[#eaeaea] hover:bg-[#fafafa]">
                    <td className="p-3">
                      <div className="text-[12px] font-bold text-[var(--black)]">{u.name}</div>
                      <div className="text-[10px] font-bold text-[#888]">{u.email}</div>
                    </td>
                    <td className="p-3">
                      <span className={`text-[9px] font-bold tracking-wider uppercase px-[6px] py-[2px] border bg-white ${
                        u.plat === 'ig' ? 'border-[#d946ef] text-[#a21caf]' : 
                        u.plat === 'li' ? 'border-[#3b82f6] text-[#1d4ed8]' : 
                        'border-[var(--black)] text-[var(--black)]'
                      }`}>
                        {u.plat}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`text-[18px] leading-none tracking-[-1px] ${u.score >= 70 ? 'text-[#16a34a]' : 'text-[#d97706]'}`} style={{ fontFamily: 'var(--font-d)' }}>
                        {u.score}
                      </span>
                    </td>
                    <td className="p-3 text-[10px] font-bold text-[#666]">{u.joined}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Stats */}
        <div className="border-2 border-[var(--black)] bg-white shadow-[4px_4px_0px_var(--black)] flex flex-col">
          <div className="p-[12px_16px] border-b-2 border-[var(--black)] bg-[#fafafa] flex items-center gap-3">
            <div className="w-5 h-[3px] bg-[var(--black)]"></div>
            <span className="text-[12px] font-bold uppercase tracking-[2px] text-[var(--black)]">System Stats</span>
          </div>
          <div className="p-4 flex-1 flex flex-col gap-0 justify-center">
            {systemStats.map((s, i) => (
              <div key={i} className="flex justify-between items-center py-2.5 border-b border-[#eaeaea] last:border-b-0 hover:bg-[#fafafa]">
                <span className="text-[11px] font-bold text-[#555]">{s.l}</span>
                <span className="text-[12px] font-bold text-[var(--black)] bg-[#f5f5f5] px-2 py-0.5 border border-[#eaeaea]">{s.v}</span>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
}
