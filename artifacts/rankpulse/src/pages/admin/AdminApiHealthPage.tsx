import { hasAiKey } from "@/lib/nvidia";

export default function AdminApiHealthPage() {
  const apis = [
    { api: 'Instagram Graph API (Simulated)', status: 'live', quota: '2,847 / 5,000 req/hr', latency: '124ms', errors: '0', pct: 57 },
    { api: 'LinkedIn API v2 (Simulated)', status: 'live', quota: '891 / 2,000 req/hr', latency: '188ms', errors: '2', pct: 44 },
    { api: 'X API v2 (Simulated)', status: 'warn', quota: '1,987 / 2,000 req/hr', latency: '211ms', errors: '0', pct: 99 },
    { api: 'NVIDIA NIM AI', status: hasAiKey() ? 'live' : 'err', quota: hasAiKey() ? 'Active' : 'Missing API Key', latency: hasAiKey() ? '180ms' : '—', errors: hasAiKey() ? '0' : '1', pct: hasAiKey() ? 12 : 100 },
    { api: 'Firebase Database (Simulated)', status: 'live', quota: '342 MB / 500 MB', latency: '24ms', errors: '0', pct: 68 },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-[20px_24px] border-b-2 border-b-[var(--black)] bg-[#f5f2e8] flex justify-between items-center">
        <div>
          <div className="text-[10px] font-bold tracking-[2px] uppercase text-[var(--red)] mb-1">Platform API Monitoring</div>
          <div className="text-[32px] leading-none text-[var(--black)] uppercase" style={{ fontFamily: 'var(--font-d)' }}>API Health Dashboard</div>
        </div>
        <button className="btn btn-outline btn-sm font-bold text-[10px] uppercase bg-white">Refresh</button>
      </div>
      <div className="p-[24px]">
        {apis.map((a, i) => {
          const isWarning = a.pct >= 90;
          return (
            <div key={i} className={`border-2 ${isWarning ? 'border-[var(--red)]' : 'border-[var(--black)]'} bg-white shadow-[4px_4px_0px_var(--black)] p-[20px] mb-[16px] flex flex-col md:flex-row gap-5 items-start md:items-center`}>
              <div className="flex items-start gap-4 min-w-[280px]">
                <div className={`mt-1.5 w-3 h-3 rounded-full border border-black ${a.status === 'live' ? 'bg-[#22c55e]' : a.status === 'warn' ? 'bg-[#f59e0b]' : 'bg-[#ef4444]'}`}></div>
                <div>
                  <div className="text-[20px] leading-none uppercase mb-2" style={{ fontFamily: 'var(--font-d)' }}>{a.api}</div>
                  <div className="text-[11px] font-bold text-[#666] uppercase tracking-[1px]">{a.quota}</div>
                </div>
              </div>
              <div className="flex-1 w-full px-0 md:px-6">
                <div className="w-full h-2.5 bg-[#eaeaea] border border-[#ddd] overflow-hidden mb-1.5 relative">
                  <div className={`absolute left-0 top-0 bottom-0 ${isWarning ? 'bg-[var(--red)]' : a.pct >= 70 ? 'bg-[#f59e0b]' : 'bg-[#22c55e]'}`} style={{ width: `${a.pct}%` }}></div>
                </div>
                <div className="text-[10px] font-bold text-[#888]">{a.pct}% quota used</div>
              </div>
              <div className="flex items-center gap-6 justify-end text-right min-w-[200px]">
                <div><div className="text-[10px] font-bold uppercase tracking-[1px] text-[#888] mb-1">Latency</div><div className="text-[20px] leading-none" style={{ fontFamily: 'var(--font-d)' }}>{a.latency}</div></div>
                <div><div className="text-[10px] font-bold uppercase tracking-[1px] text-[#888] mb-1">Errors</div><div className="text-[20px] leading-none" style={{ fontFamily: 'var(--font-d)', color: parseInt(a.errors) > 0 ? 'var(--red)' : '#16a34a' }}>{a.errors}</div></div>
                {isWarning && <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 border border-[var(--red)] bg-[#fee2e2] text-[var(--red)]">NEAR LIMIT</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
