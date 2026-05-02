"use client";

import Link from "next/link";

export default function AnalyticsPage() {
  const bars = [38, 52, 61, 48, 74, 80, 88, 77, 65, 82, 91, 78];
  const labels = ['Mar 30', 'Apr 1', 'Apr 2', 'Apr 3', 'Apr 4', 'Apr 5', 'Apr 6', 'Apr 7', 'Apr 8', 'Apr 9', 'Apr 10', 'Today'];

  const platformData = [
    { plat: 'Instagram', score: 82, prev: 79, color: 'var(--ig)' },
    { plat: 'LinkedIn', score: 74, prev: 73, color: 'var(--li)' },
    { plat: 'X / Twitter', score: 79, prev: 76, color: '#555' },
  ];

  const topPosts = [
    { text: 'Hot take: X algorithm is predictable', plat: 'x', score: 88, reach: '34K' },
    { text: '5 arm moves, no equipment needed', plat: 'ig', score: 81, reach: '22K' },
    { text: 'What I learned from 6mo of posting', plat: 'li', score: 77, reach: '18K' },
  ];

  const weeklyReach = [
    { week: 'Apr 7–10', reach: '24,200', eng: '3.4%', score: 78, pen: 3, top: 'Instagram' },
    { week: 'Mar 31–Apr 6', reach: '20,500', eng: '2.8%', score: 74, pen: 5, top: 'X / Twitter' },
    { week: 'Mar 24–30', reach: '18,800', eng: '3.1%', score: 71, pen: 4, top: 'Instagram' },
    { week: 'Mar 17–23', reach: '16,200', eng: '2.6%', score: 68, pen: 6, top: 'LinkedIn' },
  ];

  const getPlatformColors = (plat: string) => {
    switch (plat) {
      case 'ig': return 'bg-[#fdf4ff] border-[#d946ef] text-[#a21caf]';
      case 'li': return 'bg-[#eff6ff] border-[#3b82f6] text-[#1d4ed8]';
      case 'x': return 'bg-[#f3f4f6] border-[#111] text-[#000]';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  return (
    <div className="page-transition min-h-screen flex flex-col bg-[var(--bg)]">
      {/* Header */}
      <div className="page-header border-b-2 border-b-[var(--black)] p-[24px_32px] flex items-center justify-between flex-wrap gap-4">
        <div className="page-title-group">
          <div className="page-kicker text-[10px] text-[var(--red)] uppercase tracking-[2px] font-bold mb-1">Track your growth</div>
          <div className="d4 text-[40px] leading-none uppercase" style={{ fontFamily: 'var(--font-d)' }}>Analytics & Reporting</div>
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          <select className="input h-9 py-0 text-xs font-bold uppercase tracking-wider w-auto cursor-pointer">
            <option>Last 14 Days</option>
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
          </select>
          <button className="btn btn-outline btn-sm font-bold text-xs uppercase bg-white">Export PDF</button>
          <button className="btn btn-outline btn-sm font-bold text-xs uppercase bg-white">Export CSV</button>
        </div>
      </div>

      {/* METRIC STRIP */}
      <div className="flex flex-wrap border-b-2 border-b-[var(--black)]">
        <div className="flex-1 p-[20px_24px] border-r-2 border-r-[var(--black)] bg-[var(--black)] flex flex-col justify-center min-w-[200px]">
          <div className="text-[48px] text-white leading-none tracking-[-1px] mb-1" style={{ fontFamily: 'var(--font-d)' }}>78.4</div>
          <div className="text-[12px] font-bold uppercase tracking-[1px] text-[#888] mb-1">Avg SEO Score</div>
          <div className="text-[11px] font-bold text-[#4ade80]">↑ +4.2 vs prev period</div>
        </div>
        <div className="flex-1 p-[20px_24px] border-r-2 border-r-[var(--black)] bg-white flex flex-col justify-center min-w-[200px]">
          <div className="text-[48px] text-[#16a34a] leading-none tracking-[-1px] mb-1" style={{ fontFamily: 'var(--font-d)' }}>+18%</div>
          <div className="text-[12px] font-bold uppercase tracking-[1px] text-[#333] mb-1">Reach Growth</div>
          <div className="text-[11px] font-bold text-[#16a34a]">↑ Up from 6% last period</div>
        </div>
        <div className="flex-1 p-[20px_24px] border-r-2 border-r-[var(--black)] bg-[var(--black)] flex flex-col justify-center min-w-[200px]">
          <div className="text-[48px] text-[#f59e0b] leading-none tracking-[-1px] mb-1" style={{ fontFamily: 'var(--font-d)' }}>3.4%</div>
          <div className="text-[12px] font-bold uppercase tracking-[1px] text-[#888] mb-1">Avg Engagement</div>
          <div className="text-[11px] font-bold text-[#4ade80]">↑ +0.6% vs prev period</div>
        </div>
        <div className="flex-1 p-[20px_24px] bg-white flex flex-col justify-center min-w-[200px]">
          <div className="text-[48px] text-[var(--red)] leading-none tracking-[-1px] mb-1" style={{ fontFamily: 'var(--font-d)' }}>3</div>
          <div className="text-[12px] font-bold uppercase tracking-[1px] text-[#333] mb-1">Penalties Fixed</div>
          <div className="text-[11px] font-bold text-[#888]">2 new added</div>
        </div>
      </div>

      <div className="p-[32px] flex-1">
        {/* SEO Score Over Time */}
        <div className="border-2 border-[var(--black)] p-[24px] mb-[20px] bg-white shadow-[4px_4px_0px_var(--black)]">
          <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
            <div>
              <div className="text-[11px] font-bold text-[var(--red)] uppercase tracking-[2px] mb-2">SEO Score Trend</div>
              <div className="text-[28px] uppercase leading-none" style={{ fontFamily: 'var(--font-d)' }}>Last 12 Days</div>
            </div>
            <div className="flex gap-2">
              {['IG', 'LI', 'X', 'All'].map((p, i) => (
                <button key={i} className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider border-2 border-[var(--black)] transition-colors ${i === 3 ? 'bg-[var(--black)] text-white' : 'bg-white hover:bg-[#fafafa]'}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-end gap-2 h-[160px] max-w-full overflow-x-auto pb-4">
            {bars.map((b, i) => {
              const colorClass = b >= 80 ? 'bg-[#22c55e]' : b >= 60 ? 'bg-[#f59e0b]' : 'bg-[var(--red)]';
              const textColorClass = b >= 80 ? 'text-[#16a34a]' : b >= 60 ? 'text-[#d97706]' : 'text-[var(--red)]';
              
              return (
                <div key={i} className="flex-1 flex flex-col items-center justify-end min-w-[40px]">
                  <div className={`text-[10px] font-bold mb-1 ${textColorClass}`}>{b}</div>
                  <div className={`w-full ${colorClass} transition-all duration-300 border border-[rgba(0,0,0,0.1)]`} style={{ height: b * 1.2 + 'px' }}></div>
                  <div className="text-[9px] font-bold uppercase tracking-wide text-[#888] mt-2 whitespace-nowrap">{labels[i]}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Platform Comparison Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-[20px]">
          {/* Platforms */}
          <div className="border-2 border-[var(--black)] p-[24px] bg-white shadow-[4px_4px_0px_var(--black)]">
            <div className="text-[11px] font-bold text-[var(--red)] uppercase tracking-[2px] mb-6">Platform SEO Comparison</div>
            <div className="flex flex-col gap-6">
              {platformData.map((p, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-2 items-center">
                    <span className="text-[13px] font-bold uppercase tracking-wide text-[var(--black)]">{p.plat}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[24px] leading-none tracking-[-1px]" style={{ fontFamily: 'var(--font-d)', color: p.color }}>{p.score}</span>
                      <span className="text-[11px] font-bold text-[#16a34a]">+{p.score - p.prev}</span>
                    </div>
                  </div>
                  <div className="w-full h-[6px] bg-[#e8e4d0] border border-[rgba(0,0,0,0.05)] relative">
                    <div className="absolute left-0 top-0 bottom-0" style={{ width: p.score + '%', backgroundColor: p.color }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Posts */}
          <div className="border-2 border-[var(--black)] p-[24px] bg-white shadow-[4px_4px_0px_var(--black)] flex flex-col">
            <div className="text-[11px] font-bold text-[var(--red)] uppercase tracking-[2px] mb-4">Top Performing Posts</div>
            <div className="flex flex-col flex-1 justify-center">
              {topPosts.map((p, i) => (
                <div key={i} className={`flex items-center gap-4 py-3 ${i < 2 ? 'border-b border-[#eaeaea]' : ''}`}>
                  <span className="text-[24px] leading-none text-[var(--red)] tracking-[-1px] min-w-[30px]" style={{ fontFamily: 'var(--font-d)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1">
                    <div className="text-[12px] font-bold mb-1 text-[var(--black)]">{p.text}</div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[8px] font-bold uppercase tracking-wider px-[4px] py-[1px] border ${getPlatformColors(p.plat)}`}>
                        {p.plat}
                      </span>
                      <span className="text-[10px] font-bold text-[#888]">{p.reach} reach</span>
                    </div>
                  </div>
                  <span className="text-[24px] leading-none text-[#16a34a] tracking-[-1px]" style={{ fontFamily: 'var(--font-d)' }}>{p.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reach Table */}
        <div className="border-2 border-[var(--black)] p-[24px] bg-white shadow-[4px_4px_0px_var(--black)] w-full overflow-x-auto">
          <div className="text-[11px] font-bold text-[var(--red)] uppercase tracking-[2px] mb-6">Reach & Engagement — Weekly</div>
          <table className="w-full min-w-[700px] text-left border-collapse">
            <thead>
              <tr className="bg-[var(--black)]">
                <th className="p-3 text-[10px] uppercase tracking-[2px] text-white">Week</th>
                <th className="p-3 text-[10px] uppercase tracking-[2px] text-white">Total Reach</th>
                <th className="p-3 text-[10px] uppercase tracking-[2px] text-white">Avg Engagement</th>
                <th className="p-3 text-[10px] uppercase tracking-[2px] text-white">Avg SEO Score</th>
                <th className="p-3 text-[10px] uppercase tracking-[2px] text-white">Penalties</th>
                <th className="p-3 text-[10px] uppercase tracking-[2px] text-white">Top Platform</th>
              </tr>
            </thead>
            <tbody>
              {weeklyReach.map((r, i) => (
                <tr key={i} className="border-b border-[#eaeaea] hover:bg-[#fafafa]">
                  <td className="p-3 text-[12px] font-bold text-[var(--black)]">{r.week}</td>
                  <td className="p-3 text-[13px] font-medium text-[var(--black)]">{r.reach}</td>
                  <td className="p-3">
                    <span className={`text-[12px] font-bold ${parseFloat(r.eng) >= 3 ? 'text-[#16a34a]' : 'text-[#d97706]'}`}>{r.eng}</span>
                  </td>
                  <td className="p-3">
                    <span className={`text-[20px] leading-none tracking-[-1px] ${r.score >= 75 ? 'text-[#16a34a]' : 'text-[#d97706]'}`} style={{ fontFamily: 'var(--font-d)' }}>
                      {r.score}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="text-[14px] font-bold text-[var(--red)]">{r.pen}</span>
                  </td>
                  <td className="p-3">
                    <span className="text-[11px] font-bold px-[6px] py-[2px] border bg-gray-100 uppercase tracking-widest">{r.top}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
