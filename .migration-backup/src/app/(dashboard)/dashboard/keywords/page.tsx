"use client";

import { useState } from "react";

type Platform = 'ig' | 'li' | 'x';

interface Keyword {
  rank: number;
  term: string;
  vol: number;
  trend: string;
  diff: 'hard' | 'med' | 'easy';
  plats: Platform[];
}

export default function KeywordsPage() {
  const keywords: Keyword[] = [
    {rank:1,term:'social media tips',vol:92,trend:'+34%',diff:'easy',plats:['ig','li','x']},
    {rank:2,term:'instagram reels 2026',vol:88,trend:'+22%',diff:'med',plats:['ig']},
    {rank:3,term:'content strategy',vol:75,trend:'stable',diff:'med',plats:['ig','li']},
    {rank:4,term:'linkedin growth',vol:70,trend:'+18%',diff:'med',plats:['li']},
    {rank:5,term:'arm workout home',vol:68,trend:'+41%',diff:'easy',plats:['ig']},
    {rank:6,term:'twitter algorithm 2026',vol:60,trend:'-8%',diff:'hard',plats:['x']},
    {rank:7,term:'social seo',vol:55,trend:'+29%',diff:'easy',plats:['ig','li','x']},
    {rank:8,term:'reel ideas for creators',vol:52,trend:'+16%',diff:'easy',plats:['ig']},
    {rank:9,term:'b2b content marketing',vol:48,trend:'+12%',diff:'hard',plats:['li']},
    {rank:10,term:'hashag strategy 2026',vol:44,trend:'+8%',diff:'med',plats:['ig','x']},
  ];

  const trending = [
    {term:'arm workout home',trend:'+41%',hot:true},
    {term:'social media tips',trend:'+34%',hot:true},
    {term:'social seo',trend:'+29%',hot:false},
  ];

  const sets = [
    {name:'Fitness Content Set',count:12,plat:'ig'},
    {name:'LinkedIn B2B Set',count:8,plat:'li'},
    {name:'X Growth Set',count:6,plat:'x'},
  ];

  const [activeFilter, setActiveFilter] = useState('All Platforms');
  const filters = ['All Platforms','Instagram','LinkedIn','X / Twitter'];

  return (
    <div className="page-transition min-h-screen flex flex-col bg-[var(--bg)]">
      {/* Header */}
      <div className="page-header border-b-2 border-b-[var(--black)] p-[24px_32px] flex items-center justify-between">
        <div className="page-title-group">
          <div className="page-kicker text-[10px] text-[var(--red)] uppercase tracking-[2px] font-bold mb-1">Discover what ranks</div>
          <div className="d4 text-[40px] leading-none uppercase" style={{ fontFamily: 'var(--font-d)' }}>Keyword Research</div>
        </div>
        <div className="flex gap-2 h-[42px]">
          <input className="input" placeholder="Search keywords..." style={{ width: '240px' }} />
          <button className="btn btn-red px-6 font-bold text-sm">Search</button>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_280px] max-[900px]:grid-cols-1 flex-1 relative">
        <div className="border-r-2 border-r-[var(--black)] flex flex-col">
          {/* Filters */}
          <div className="p-[12px_16px] border-b-2 border-b-[var(--black)] flex gap-2 items-center">
            <span className="label-sm text-[#888] text-[10px] font-bold tracking-[2px] uppercase">Filter:</span>
            {filters.map((f, i) => (
              <button 
                key={f} 
                onClick={() => setActiveFilter(f)}
                className={`btn btn-sm ${activeFilter === f ? 'bg-[var(--black)] text-white' : 'btn-outline'} text-xs font-bold px-3 py-1.5`}
              >
                {f}
              </button>
            ))}
            <span className="ml-auto body-sm text-[#888] text-xs font-bold">Showing {keywords.length} of 2,847 keywords</span>
          </div>

          {/* Table Header */}
          <div className="flex items-center gap-3 p-[10px_16px] border-b-2 border-b-[var(--black)] bg-[var(--black)] text-white">
            <div className="min-w-[28px] text-[10px] font-bold tracking-[2px] uppercase">#</div>
            <div className="flex-1 text-[10px] font-bold tracking-[2px] uppercase">Keyword</div>
            <div className="w-[100px] text-[10px] font-bold tracking-[2px] uppercase">Volume</div>
            <div className="w-[64px] text-[10px] font-bold tracking-[2px] uppercase">Trend</div>
            <div className="w-[60px] text-[10px] font-bold tracking-[2px] uppercase">Diff.</div>
            <div className="w-[80px] text-[10px] font-bold tracking-[2px] uppercase">Platforms</div>
          </div>

          {/* Table Rows */}
          <div className="flex flex-col bg-white flex-1">
            {keywords.map(k => (
              <div key={k.rank} className="flex items-center gap-3 p-[10px_16px] border-b border-b-[#eaeaea] hover:bg-[#f8f8f8] transition-colors">
                <div className="min-w-[28px] text-[18px] font-bold" style={{ fontFamily: 'var(--font-d)' }}>{String(k.rank).padStart(2, '0')}</div>
                <div className="flex-1 text-sm font-bold">{k.term}</div>
                <div className="w-[100px] flex items-center gap-1.5">
                  <div className="w-[64px] h-[6px] border border-[var(--black)] bg-[var(--bg)] relative">
                    <div className="absolute left-0 top-0 bottom-0 bg-[var(--red)]" style={{ width: k.vol + '%' }}></div>
                  </div>
                  <span className="text-[10px] font-bold">{k.vol}/100</span>
                </div>
                <div className="w-[64px]">
                  <span className={`text-[11px] font-bold px-1.5 py-0.5 border ${k.trend.startsWith('+') ? 'bg-[#ebfbf0] text-[#166534] border-[#22c55e]' : k.trend === 'stable' ? 'bg-[#f0f0f0] text-[#555] border-[#ccc]' : 'bg-[#fef2f2] text-[#991b1b] border-[#ef4444]'}`}>
                    {k.trend}
                  </span>
                </div>
                <div className="w-[60px]">
                  <span className={`text-[10px] font-bold uppercase tracking-[1px] px-1.5 py-0.5 border-2 ${k.diff === 'hard' ? 'text-[#ef4444] border-[#ef4444]' : k.diff === 'med' ? 'text-[#f59e0b] border-[#f59e0b]' : 'text-[#22c55e] border-[#22c55e]'}`}>
                    {k.diff}
                  </span>
                </div>
                <div className="w-[80px] flex gap-1">
                  {k.plats.map(p => (
                    <span key={p} className={`text-[8px] font-bold uppercase tracking-wider px-[4px] py-[1px] border text-white ${p === 'ig' ? 'bg-[#d946ef] border-[#a21caf]' : p === 'li' ? 'bg-[#3b82f6] border-[#1d4ed8]' : 'bg-[#111] border-[#000]'}`}>
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div className="bg-[#fafafa]">
          {/* Trending */}
          <div className="p-4 border-b-2 border-b-[var(--black)]">
            <div className="label-sm text-[10px] font-bold tracking-[2px] uppercase text-[var(--red)] mb-3">Trending Now</div>
            <div className="flex flex-col gap-0">
              {trending.map((k, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-b-[#eaeaea] last:border-b-0">
                  <span className="text-xs font-bold">{k.term}</span>
                  <div className="flex gap-2 items-center">
                    {k.hot && <span className="bg-[var(--red)] text-white text-[8px] font-bold uppercase tracking-wide px-1.5 py-0.5">HOT</span>}
                    <span className={`text-[10px] font-bold ${k.trend.startsWith('+') ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>{k.trend}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Keyword Sets */}
          <div className="p-4 border-b-2 border-b-[var(--black)] bg-white">
            <div className="label-sm text-[10px] font-bold tracking-[2px] uppercase text-[var(--black)] mb-3">Keyword Sets</div>
            <div className="flex flex-col gap-0">
              {sets.map((s, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-b-[#eaeaea] last:border-b-0 cursor-pointer hover:bg-[#f8f8f8]">
                  <div>
                    <div className="text-xs font-bold">{s.name}</div>
                    <span className={`text-[8px] font-bold uppercase tracking-wider px-[4px] py-[1px] border text-white inline-block mt-1 ${s.plat === 'ig' ? 'bg-[#d946ef] border-[#a21caf]' : s.plat === 'li' ? 'bg-[#3b82f6] border-[#1d4ed8]' : 'bg-[#111] border-[#000]'}`}>
                      {s.plat}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-[#888]">{s.count} keywords</span>
                </div>
              ))}
            </div>
            <button className="btn btn-outline btn-sm w-full mt-4 justify-center font-bold text-xs">
              + Create Set
            </button>
          </div>

          {/* Competitor Gap */}
          <div className="p-4">
            <div className="label-sm text-[10px] font-bold tracking-[2px] uppercase text-[var(--black)] mb-3">Keyword Gap vs Competitors</div>
            <div className="border-l-4 border-l-[var(--red)] bg-[#fff5f5] p-3 border border-r-[#eaeaea] border-y-[#eaeaea]">
              <div className="label-sm text-[10px] font-bold tracking-[2px] uppercase text-[var(--red)] mb-1">OPPORTUNITY FOUND</div>
              <div className="text-xs text-[#555] font-bold">"fitness creator tips" — your top competitor ranks for this keyword. You don't.</div>
            </div>
            <button className="btn btn-red btn-sm w-full mt-3 justify-center font-bold text-xs">
              View Competitor Analysis →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
