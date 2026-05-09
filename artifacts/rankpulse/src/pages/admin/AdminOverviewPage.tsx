import { useState, useEffect } from "react";

export default function AdminOverviewPage() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('rp_users') || '[]');
      setUsers(stored);
    } catch {
      setUsers([]);
    }
  }, []);

  const metrics = [
    { n: users.length.toString(), l: 'Total Users', d: 'From local storage', c: 'text-white' },
    { n: Math.floor(users.length * 0.49).toString(), l: 'Monthly Active', d: '49% MAU rate (simulated)', c: 'text-[#16a34a]' },
    { n: '0', l: 'Revenue', d: 'Free platform', c: 'text-[#f59e0b]' },
    { n: '3', l: 'Open Bugs', d: '↓ Fixed 2 today', c: 'text-[var(--red)]' },
  ];
  const apiHealth = [
    { api: 'Instagram API', status: 'live', rate: '2,847 / 5,000/hr', pct: 57 },
    { api: 'LinkedIn API', status: 'live', rate: '891 / 2,000/hr', pct: 44 },
    { api: 'X API v2', status: 'warn', rate: '1,987 / 2,000/hr', pct: 99 },
    { api: 'OpenAI API', status: 'live', rate: '342 / 1,000/hr', pct: 34 },
    { api: 'Supabase DB', status: 'live', rate: '24ms avg latency', pct: 0 },
  ];
  const recentUsers = users.length > 0 
    ? users.slice(-4).reverse() 
    : [
        { name: 'Rohan K.', email: 'rohan@...', plat: 'ig', score: 72, joined: '2h ago' },
        { name: 'Sanya M.', email: 'sanya@...', plat: 'li', score: 65, joined: '4h ago' },
        { name: 'Arjun P.', email: 'arjun@...', plat: 'x', score: 80, joined: '6h ago' },
        { name: 'Priya S.', email: 'priya@...', plat: 'ig', score: 58, joined: '8h ago' },
      ];

  return (
    <div className="flex flex-col min-h-screen pb-10">
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

      {/* Metrics */}
      <div className="grid grid-cols-4 border-b-2 border-[var(--black)] max-md:grid-cols-2">
        {metrics.map((m, i) => (
          <div key={i} className={`p-[20px_24px] border-r-2 border-r-[var(--black)] ${i === 0 ? 'bg-[var(--black)]' : 'bg-[#f5f2e8]'}`}>
            <div className={`text-[40px] font-black leading-none tracking-[-1px] mb-1 ${i === 0 ? 'text-white' : m.c}`} style={{ fontFamily: 'var(--font-d)' }}>{m.n}</div>
            <div className={`text-[10px] font-bold uppercase tracking-[2px] mb-1 ${i === 0 ? 'text-[#888]' : 'text-[#555]'}`}>{m.l}</div>
            <div className={`text-[11px] font-bold ${i === 0 ? 'text-[#555]' : 'text-[#888]'}`}>{m.d}</div>
          </div>
        ))}
      </div>

      <div className="p-[24px] grid grid-cols-[1fr_320px] gap-6 max-[900px]:grid-cols-1">
        {/* API Health */}
        <div>
          <div className="flex items-center gap-3 mb-4"><div className="w-6 h-[3px] bg-[var(--red)]" /><span className="text-sm font-bold uppercase tracking-[2px]">API Health</span></div>
          <div className="flex flex-col gap-3">
            {apiHealth.map((a, i) => (
              <div key={i} className={`border-2 ${a.pct >= 90 ? 'border-[var(--red)]' : 'border-[var(--black)]'} bg-white p-4 flex items-center gap-4`}>
                <div className={`w-2.5 h-2.5 rounded-full border border-black ${a.status === 'live' ? 'bg-[#22c55e]' : 'bg-[#f59e0b]'}`}></div>
                <div className="flex-1">
                  <div className="text-sm font-bold">{a.api}</div>
                  <div className="text-[10px] text-[#888] font-bold mt-0.5">{a.rate}</div>
                  {a.pct > 0 && (
                    <div className="w-full h-1.5 bg-[#eaeaea] mt-2">
                      <div className={`h-full ${a.pct >= 90 ? 'bg-[var(--red)]' : a.pct >= 70 ? 'bg-[#f59e0b]' : 'bg-[#22c55e]'}`} style={{ width: `${a.pct}%` }}></div>
                    </div>
                  )}
                </div>
                {a.pct >= 90 && <span className="text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 border border-[var(--red)] bg-[#fee2e2] text-[var(--red)]">NEAR LIMIT</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div>
          <div className="flex items-center gap-3 mb-4"><div className="w-6 h-[3px] bg-[var(--red)]" /><span className="text-sm font-bold uppercase tracking-[2px]">Recent Signups</span></div>
          <div className="flex flex-col gap-3">
            {recentUsers.map((u, i) => (
              <div key={i} className="border-2 border-[var(--black)] bg-white p-4 flex items-center gap-3">
                <div className="flex-1">
                  <div className="text-sm font-bold">{u.name}</div>
                  <div className="text-[10px] text-[#888]">{u.email} · {u.joined}</div>
                </div>
                <span className={`text-[8px] font-bold uppercase tracking-wider px-[4px] py-[1px] border text-white ${u.plat === 'ig' ? 'bg-[#d946ef] border-[#a21caf]' : u.plat === 'li' ? 'bg-[#3b82f6] border-[#1d4ed8]' : 'bg-[#111] border-[#000]'}`}>{u.plat}</span>
                <span className="text-[18px] font-black text-[var(--red)]" style={{ fontFamily: 'var(--font-d)' }}>{u.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
