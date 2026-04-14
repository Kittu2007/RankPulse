"use client";

import { useState } from "react";

type Platform = 'ig' | 'li' | 'x';

interface Hashtag {
  name: string;
  vol: number;
  comp: 'high' | 'med' | 'low';
  trend: string;
  banned: boolean;
  plat: Platform;
}

export default function HashtagsPage() {
  const tags: Hashtag[] = [
    {name:'#armworkout',vol:94,comp:'high',trend:'+12%',banned:false,plat:'ig'},
    {name:'#homeworkout',vol:90,comp:'high',trend:'+8%',banned:false,plat:'ig'},
    {name:'#fitnesscreator',vol:76,comp:'med',trend:'+34%',banned:false,plat:'ig'},
    {name:'#contentcreator',vol:85,comp:'high',trend:'-3%',banned:false,plat:'ig'},
    {name:'#linkedinmarketing',vol:72,comp:'med',trend:'+22%',banned:false,plat:'li'},
    {name:'#socialmediatips',vol:88,comp:'high',trend:'+6%',banned:false,plat:'ig'},
    {name:'#growthhacking',vol:55,comp:'med',trend:'stable',banned:false,plat:'x'},
    {name:'#viral',vol:98,comp:'high',trend:'-',banned:true,plat:'ig'},
    {name:'#follow4follow',vol:80,comp:'high',trend:'-',banned:true,plat:'ig'},
    {name:'#gymlife',vol:78,comp:'med',trend:'+4%',banned:false,plat:'ig'},
  ];

  const sets = [
    {name:'Arm Workout Set',tags:['#armworkout','#homeworkout','#fitnesscreator','#noequipment'],plat:'ig'},
    {name:'Creator Set',tags:['#contentcreator','#socialmediatips','#creatoreconomy'],plat:'ig'},
  ];

  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All','Instagram','LinkedIn','X'];

  return (
    <div className="page-transition min-h-screen flex flex-col bg-[var(--bg)]">
      {/* Header */}
      <div className="page-header border-b-2 border-b-[var(--black)] p-[24px_32px] flex items-center justify-between">
        <div className="page-title-group">
          <div className="page-kicker text-[10px] text-[var(--red)] uppercase tracking-[2px] font-bold mb-1">Hashtag Intelligence</div>
          <div className="d4 text-[40px] leading-none uppercase" style={{ fontFamily: 'var(--font-d)' }}>Hashtag Research</div>
        </div>
        <div className="flex gap-2 h-[42px]">
          <input className="input" placeholder="Search hashtags..." style={{ width: '220px' }} />
          <button className="btn btn-red px-6 font-bold text-sm">Search</button>
          <button className="btn btn-outline px-6 font-bold text-sm">Switch to Keywords</button>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_260px] max-[900px]:grid-cols-1 flex-1 relative">
        <div className="border-r-2 border-r-[var(--black)] flex flex-col">
          {/* Filters */}
          <div className="p-[10px_16px] border-b-2 border-b-[var(--black)] flex gap-2 items-center bg-white">
            {filters.map((f, i) => (
              <button 
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`btn btn-sm ${activeFilter === f ? 'bg-[var(--black)] text-white' : 'btn-outline'} text-xs font-bold px-3 py-1.5`}
              >
                {f}
              </button>
            ))}
            <span className="ml-auto flex items-center">
              <span className="bg-[var(--red)] text-white text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-sm mr-3">2 Banned</span>
              <span className="body-sm text-[#888] text-xs font-bold">10 hashtags shown</span>
            </span>
          </div>

          {/* Table Header */}
          <div className="flex items-center gap-3 p-[10px_16px] border-b-2 border-b-[var(--black)] bg-[var(--black)] text-white">
            <div className="flex-1 text-[10px] font-bold tracking-[2px] uppercase">Hashtag</div>
            <div className="w-[120px] text-[10px] font-bold tracking-[2px] uppercase">Volume</div>
            <div className="w-[80px] text-[10px] font-bold tracking-[2px] uppercase">Trend</div>
            <div className="w-[72px] text-[10px] font-bold tracking-[2px] uppercase">Compet.</div>
            <div className="w-[60px] text-[10px] font-bold tracking-[2px] uppercase">Platform</div>
          </div>

          {/* Table Rows */}
          <div className="flex flex-col bg-white flex-1">
            {tags.map((t, idx) => (
              <div 
                key={idx} 
                className={`flex items-center gap-3 p-[10px_16px] border-b border-b-[#eaeaea] transition-colors ${t.banned ? 'bg-[#fff5f5]' : 'hover:bg-[#f8f8f8]'}`}
              >
                <div className={`flex-1 text-sm font-bold flex items-center ${t.banned ? 'text-[var(--red)] line-through' : 'text-[var(--black)]'}`}>
                  {t.name}
                  {t.banned && <span className="ml-2 bg-[var(--red)] text-white text-[8px] px-1 font-bold tracking-widest no-underline">BANNED</span>}
                </div>
                <div className="w-[120px] flex items-center gap-1.5">
                  <div className="w-[72px] h-[6px] border border-[var(--black)] bg-[var(--bg)] relative">
                    <div className={`absolute left-0 top-0 bottom-0 ${t.banned ? 'bg-[var(--red)]' : 'bg-[var(--black)]'}`} style={{ width: t.vol + '%' }}></div>
                  </div>
                  <span className={`text-[10px] font-bold ${t.banned ? 'text-[var(--red)]' : ''}`}>{t.vol}/100</span>
                </div>
                <div className="w-[80px]">
                  <span className={`text-[11px] font-bold px-1.5 py-0.5 border ${
                    t.banned ? 'bg-[#fef2f2] text-[#991b1b] border-[#ef4444]' : 
                    t.trend.startsWith('+') ? 'bg-[#ebfbf0] text-[#166534] border-[#22c55e]' : 
                    t.trend === 'stable' ? 'bg-[#f0f0f0] text-[#555] border-[#ccc]' : 'bg-[#fef2f2] text-[#991b1b] border-[#ef4444]'
                  }`}>
                    {t.banned ? 'AVOID' : t.trend}
                  </span>
                </div>
                <div className="w-[72px]">
                  <span className={`text-[10px] font-bold uppercase tracking-[1px] px-1.5 py-0.5 border-2 ${t.comp === 'high' ? 'text-[#ef4444] border-[#ef4444]' : t.comp === 'med' ? 'text-[#f59e0b] border-[#f59e0b]' : 'text-[#22c55e] border-[#22c55e]'}`}>
                    {t.comp}
                  </span>
                </div>
                <div className="w-[60px] flex">
                  <span className={`text-[8px] font-bold uppercase tracking-wider px-[6px] py-[1px] border text-white ${t.plat === 'ig' ? 'bg-[#d946ef] border-[#a21caf]' : t.plat === 'li' ? 'bg-[#3b82f6] border-[#1d4ed8]' : 'bg-[#111] border-[#000]'}`}>
                    {t.plat}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div className="bg-[#fafafa]">
          {/* My Hashtag Sets */}
          <div className="p-4 border-b-2 border-b-[var(--black)]">
            <div className="label-sm text-[10px] font-bold tracking-[2px] uppercase text-[var(--red)] mb-3">My Hashtag Sets</div>
            {sets.map((s, i) => (
              <div key={i} className="border-2 border-[var(--black)] p-3 mb-2 bg-white flex flex-col gap-2 shadow-[2px_2px_0px_var(--black)]">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold leading-tight">{s.name}</span>
                  <span className={`text-[8px] font-bold uppercase tracking-wider px-[4px] py-[1px] border text-white ${s.plat === 'ig' ? 'bg-[#d946ef] border-[#a21caf]' : s.plat === 'li' ? 'bg-[#3b82f6] border-[#1d4ed8]' : 'bg-[#111] border-[#000]'}`}>
                    {s.plat}
                  </span>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {s.tags.map(t => (
                    <span key={t} className="text-[9px] font-bold bg-[var(--bg)] border border-[#ccc] px-1.5 py-0.5 whitespace-nowrap">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            <button className="btn btn-outline btn-sm w-full mt-3 justify-center font-bold text-xs bg-white">
              + Create Set
            </button>
          </div>

          {/* Banned Tag Checker */}
          <div className="p-4">
            <div className="label-sm text-[10px] font-bold tracking-[2px] uppercase text-[var(--red)] mb-3">Banned Tag Checker</div>
            
            <div className="border-l-4 border-l-[var(--red)] bg-[#fff5f5] p-3 border border-r-[#eaeaea] border-y-[#eaeaea] mb-2">
              <div className="label-sm text-[10px] font-bold tracking-[2px] uppercase text-[var(--red)] mb-1">2 BANNED TAGS IN LIBRARY</div>
              <div className="text-xs text-[#555] font-bold">#viral and #follow4follow are banned on Instagram. Using these suppresses your entire post's reach.</div>
            </div>

            <div className="border-l-4 border-l-[#22c55e] bg-[#ebfbf0] p-3 border border-r-[#eaeaea] border-y-[#eaeaea]">
              <div className="label-sm text-[10px] font-bold tracking-[2px] uppercase text-[#16a34a] mb-1">8 CLEAN TAGS</div>
              <div className="text-xs text-[#555] font-bold">Your other hashtags are safe to use across platforms.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
