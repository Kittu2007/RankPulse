export default function AnalyticsPage() {
  const bars = [38, 52, 61, 48, 74, 80, 88, 77, 65, 82, 91, 78];
  const labels = ['Mar 30', 'Apr 1', 'Apr 2', 'Apr 3', 'Apr 4', 'Apr 5', 'Apr 6', 'Apr 7', 'Apr 8', 'Apr 9', 'Apr 10', 'Today'];
  const platformData = [
    { plat: 'Instagram', score: 82, prev: 79, color: 'var(--ig)' },
    { plat: 'LinkedIn', score: 74, prev: 73, color: 'var(--li)' },
    { plat: 'X / Twitter', score: 79, prev: 76, color: '#555' },
  ];
  const weeklyReach = [
    { week: 'Apr 7–10', reach: '24,200', eng: '3.4%', score: 78, pen: 3, top: 'Instagram' },
    { week: 'Mar 31–Apr 6', reach: '20,500', eng: '2.8%', score: 74, pen: 5, top: 'X / Twitter' },
    { week: 'Mar 24–30', reach: '18,800', eng: '3.1%', score: 71, pen: 4, top: 'Instagram' },
    { week: 'Mar 17–23', reach: '16,200', eng: '2.6%', score: 68, pen: 6, top: 'LinkedIn' },
  ];

  return (
    <div className="page-transition min-h-screen flex flex-col bg-[var(--bg)]">
      {/* Header — wraps on mobile */}
      <div className="page-header flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
        <div>
          <div className="page-kicker">Track your growth</div>
          <div className="d4">Analytics & Reporting</div>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <select className="input h-9 py-0 text-xs font-bold uppercase tracking-wider w-auto cursor-pointer">
            <option>Last 14 Days</option><option>Last 30 Days</option><option>Last 90 Days</option>
          </select>
          <button className="btn btn-outline btn-sm font-bold text-xs uppercase bg-white">Export PDF</button>
          <button className="btn btn-outline btn-sm font-bold text-xs uppercase bg-white">Export CSV</button>
        </div>
      </div>

      {/* Metric Strip — wraps on mobile */}
      <div className="grid grid-cols-2 sm:grid-cols-4 border-b-2 border-b-[var(--black)]">
        <div className="p-4 sm:p-[20px_24px] border-r-2 border-r-[var(--black)] border-b-2 sm:border-b-0 border-b-[var(--black)] bg-[var(--black)] flex flex-col justify-center">
          <div className="text-[36px] sm:text-[48px] text-white leading-none tracking-[-1px] mb-1" style={{ fontFamily: 'var(--font-d)' }}>78.4</div>
          <div className="text-[11px] font-bold uppercase tracking-[1px] text-[#888] mb-1">Avg SEO Score</div>
          <div className="text-[11px] text-[#4ade80] font-bold">↑ +4.2 from last period</div>
        </div>
        <div className="p-4 sm:p-[20px_24px] border-r-0 sm:border-r-2 border-r-[var(--black)] border-b-2 sm:border-b-0 border-b-[var(--black)] flex flex-col justify-center bg-[var(--bg)]">
          <div className="text-[36px] sm:text-[48px] leading-none tracking-[-1px] mb-1" style={{ fontFamily: 'var(--font-d)' }}>24K</div>
          <div className="text-[11px] font-bold uppercase tracking-[1px] text-[#888] mb-1">Estimated Reach</div>
          <div className="text-[11px] text-[#4ade80] font-bold">↑ +18% this week</div>
        </div>
        <div className="p-4 sm:p-[20px_24px] border-r-2 border-r-[var(--black)] flex flex-col justify-center bg-[var(--bg)]">
          <div className="text-[36px] sm:text-[48px] text-[var(--red)] leading-none tracking-[-1px] mb-1" style={{ fontFamily: 'var(--font-d)' }}>3</div>
          <div className="text-[11px] font-bold uppercase tracking-[1px] text-[#888] mb-1">Active Penalties</div>
          <div className="text-[11px] text-[#f59e0b] font-bold">↓ Fixed 2 this week</div>
        </div>
        <div className="p-4 sm:p-[20px_24px] flex flex-col justify-center bg-[var(--bg)]">
          <div className="text-[36px] sm:text-[48px] leading-none tracking-[-1px] mb-1" style={{ fontFamily: 'var(--font-d)' }}>3.4%</div>
          <div className="text-[11px] font-bold uppercase tracking-[1px] text-[#888] mb-1">Avg Engagement</div>
          <div className="text-[11px] text-[#4ade80] font-bold">↑ +0.6% this week</div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-5 sm:p-8 border-b-2 border-b-[var(--black)] bg-white">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-6 h-[3px] bg-[var(--red)]" />
          <span className="text-sm font-bold uppercase tracking-[2px]">SEO Score Trend — Last 12 Days</span>
        </div>
        <div className="flex items-end gap-1 sm:gap-2 h-[100px] sm:h-[120px]">
          {bars.map((h, i) => (
            <div key={i} className="flex flex-col items-center gap-1 flex-1">
              <div className="w-full bg-[var(--red)] transition-all" style={{ height: `${h}%`, opacity: i === bars.length - 1 ? 1 : 0.6 }} />
              <span className="text-[7px] font-bold text-[#888] uppercase tracking-wide hidden sm:block">{labels[i].split(' ')[1]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Breakdown — responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-3 border-b-2 border-b-[var(--black)]">
        {platformData.map((p, i) => (
          <div key={i} className={`p-5 sm:p-6 ${i < 2 ? 'border-b-2 sm:border-b-0 sm:border-r-2 border-[var(--black)]' : ''} bg-[var(--bg)]`}>
            <div className="text-[10px] font-bold uppercase tracking-[2px] mb-3" style={{ color: p.color }}>{p.plat}</div>
            <div className="text-[52px] sm:text-[64px] font-black leading-none tracking-[-2px] mb-1" style={{ fontFamily: 'var(--font-d)', color: p.color }}>{p.score}</div>
            <div className="text-[11px] text-[#4ade80] font-bold">↑ +{p.score - p.prev} from last week</div>
          </div>
        ))}
      </div>

      {/* Weekly table — horizontal scroll on mobile */}
      <div className="p-5 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-6 h-[3px] bg-[var(--red)]" />
          <span className="text-sm font-bold uppercase tracking-[2px]">Weekly Performance History</span>
        </div>
        <div className="border-2 border-[var(--black)] bg-white shadow-[4px_4px_0_var(--black)] overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[560px]">
            <thead>
              <tr className="bg-[var(--black)]">
                {['Week', 'Est. Reach', 'Engagement', 'SEO Score', 'Penalties', 'Top Platform'].map(h => (
                  <th key={h} className="p-3 text-[10px] uppercase tracking-[2px] text-white whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weeklyReach.map((r, i) => (
                <tr key={i} className="border-b border-[#eaeaea] hover:bg-[#fafafa]">
                  <td className="p-3 sm:p-4 text-sm font-bold whitespace-nowrap">{r.week}</td>
                  <td className="p-3 sm:p-4 text-sm font-bold">{r.reach}</td>
                  <td className="p-3 sm:p-4 text-sm font-bold text-[#16a34a]">{r.eng}</td>
                  <td className="p-3 sm:p-4"><span className="text-[20px] font-black" style={{ fontFamily: 'var(--font-d)', color: r.score >= 75 ? 'var(--black)' : 'var(--red)' }}>{r.score}</span></td>
                  <td className="p-3 sm:p-4 text-[var(--red)] font-bold text-sm">{r.pen}</td>
                  <td className="p-3 sm:p-4 text-xs font-bold text-[#555] whitespace-nowrap">{r.top}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
