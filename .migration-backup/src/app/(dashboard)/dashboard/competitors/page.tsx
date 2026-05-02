"use client";

import Link from "next/link";

interface Competitor {
  handle: string;
  name: string;
  ig: number;
  li: number;
  x: number;
  posts: number;
  eng: string;
  gap: string[];
}

export default function CompetitorsPage() {
  const comps: Competitor[] = [
    {handle:'@fitnesswithsarah',name:'Fitness With Sarah',ig:87,li:0,x:74,posts:42,eng:'4.2%',gap:['arm workout tips','no equipment workout']},
    {handle:'@socialmediaguru',name:'Social Media Guru',ig:91,li:82,x:88,posts:38,eng:'3.8%',gap:['linkedin algorithm','content strategy b2b']},
    {handle:'@creatortips',name:'Creator Tips Hub',ig:84,li:65,x:79,posts:55,eng:'5.1%',gap:['reel ideas 2026','creator economy']},
  ];

  const gaps = [
    {kw:'arm workout tips',comps:['@fitnesswithsarah'],action:'Add to caption, target IG'},
    {kw:'no equipment workout',comps:['@fitnesswithsarah','@creatortips'],action:'High opportunity — start immediately'},
    {kw:'reel ideas 2026',comps:['@creatortips'],action:'Use in hashtag + caption KW'},
    {kw:'linkedin algorithm',comps:['@socialmediaguru'],action:'Write a LinkedIn article targeting this'},
    {kw:'content strategy b2b',comps:['@socialmediaguru'],action:'Create LinkedIn carousel on this topic'},
  ];

  return (
    <div className="page-transition min-h-screen flex flex-col bg-[var(--bg)]">
      {/* Header */}
      <div className="page-header border-b-2 border-b-[var(--black)] p-[24px_32px] flex items-center justify-between">
        <div className="page-title-group">
          <div className="page-kicker text-[10px] text-[var(--red)] uppercase tracking-[2px] font-bold mb-1">See where you stand</div>
          <div className="d4 text-[40px] leading-none uppercase" style={{ fontFamily: 'var(--font-d)' }}>Competitor Tracker</div>
        </div>
        <button className="btn btn-red px-6 font-bold text-sm">+ Add Competitor</button>
      </div>

      {/* Your Score vs Theirs */}
      <div className="bg-[var(--black)] border-b-2 border-b-[var(--black)] p-[16px_32px] flex items-center gap-8">
        <div>
          <div className="text-[10px] font-bold tracking-[2px] uppercase text-[#888] mb-1">Your Score</div>
          <div className="text-[36px] text-[var(--red)] leading-none tracking-[-1px]" style={{ fontFamily: 'var(--font-d)' }}>78.4</div>
        </div>
        <div className="flex-1 h-[2px] bg-[#333]" />
        <div className="text-center">
          <div className="text-[10px] font-bold tracking-[2px] uppercase text-[#888] mb-1">Market Avg</div>
          <div className="text-[36px] text-[#888] leading-none tracking-[-1px]" style={{ fontFamily: 'var(--font-d)' }}>75.2</div>
        </div>
        <div className="flex-1 h-[2px] bg-[#333]" />
        <div className="text-right">
          <div className="text-[10px] font-bold tracking-[2px] uppercase text-[#888] mb-1">Top Competitor</div>
          <div className="text-[36px] text-[#4ade80] leading-none tracking-[-1px]" style={{ fontFamily: 'var(--font-d)' }}>91.0</div>
        </div>
      </div>

      {/* Competitors List */}
      <div className="p-[24px_32px] bg-white flex-1">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-6 h-[3px] bg-[var(--black)]" />
          <span className="text-sm font-bold uppercase tracking-[2px]">Tracked Competitors ({comps.length} / 10)</span>
        </div>
        
        <div className="flex flex-col gap-4">
          {comps.map((c, idx) => (
            <div key={idx} className="border-2 border-[var(--black)] shadow-[4px_4px_0px_var(--black)] bg-[var(--bg)] flex flex-col md:flex-row">
              {/* Header Box */}
              <div className="p-4 border-b-2 md:border-b-0 md:border-r-2 border-[var(--black)] flex-1 flex items-center gap-4 bg-[#fafafa]">
                <div className="w-12 h-12 bg-[var(--black)] text-white text-xl font-bold flex items-center justify-center uppercase" style={{ fontFamily: 'var(--font-d)' }}>
                  {c.name[0]}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-[var(--black)]">{c.name}</div>
                  <div className="text-xs font-bold text-[#888] mt-0.5">{c.handle}</div>
                </div>
                <div className="flex gap-1 items-center mr-4">
                  {c.ig > 0 && <span className="text-[9px] font-bold uppercase tracking-wider px-[6px] py-[2px] border text-white bg-[#d946ef] border-[#a21caf]">IG: {c.ig}</span>}
                  {c.li > 0 && <span className="text-[9px] font-bold uppercase tracking-wider px-[6px] py-[2px] border text-white bg-[#3b82f6] border-[#1d4ed8]">LI: {c.li}</span>}
                  {c.x > 0 && <span className="text-[9px] font-bold uppercase tracking-wider px-[6px] py-[2px] border text-white bg-[#111] border-[#000]">X: {c.x}</span>}
                </div>
                <button className="btn btn-outline btn-sm bg-white font-bold text-xs border-2">View Detail</button>
              </div>

              {/* Metrics Box */}
              <div className="flex max-md:flex-col md:w-[60%] flex-wrap">
                <div className="flex-1 p-4 border-b-2 md:border-b-0 md:border-r-2 border-[var(--black)] bg-white text-center flex flex-col justify-center">
                  <div className="text-[28px] text-[var(--black)] leading-none" style={{ fontFamily: 'var(--font-d)' }}>{c.posts}</div>
                  <div className="text-[9px] font-bold text-[#888] uppercase tracking-[1px] mt-2">Posts / month</div>
                </div>
                <div className="flex-1 p-4 border-b-2 md:border-b-0 md:border-r-2 border-[var(--black)] bg-white text-center flex flex-col justify-center">
                  <div className="text-[28px] text-[var(--black)] leading-none" style={{ fontFamily: 'var(--font-d)' }}>{c.eng}</div>
                  <div className="text-[9px] font-bold text-[#888] uppercase tracking-[1px] mt-2">Avg Engagement</div>
                </div>
                <div className="p-4 border-b-2 md:border-b-0 md:border-r-2 border-[var(--black)] bg-white flex flex-col justify-center min-w-[180px]">
                  <div className="flex flex-col gap-1">
                    {c.gap.slice(0, 1).map((g, i) => (
                      <div key={i} className="text-[11px] font-bold text-[var(--red)]">• {g}</div>
                    ))}
                  </div>
                  <div className="text-[9px] font-bold text-[#888] uppercase tracking-[1px] mt-2">Keyword Gaps (You Missing)</div>
                </div>
                <div className="flex-1 p-4 bg-white flex items-center justify-center min-w-[120px]">
                  <button className="btn btn-red btn-sm font-bold text-xs w-full justify-center">Close Gap →</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Gap Analysis */}
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-6 h-[3px] bg-[var(--red)]" />
            <span className="text-sm font-bold uppercase tracking-[2px]">Keyword Gap Analysis — All Competitors</span>
          </div>

          <div className="border-2 border-[var(--black)] bg-white">
            <div className="grid grid-cols-[1fr_200px_300px] max-md:grid-cols-1 border-b-2 border-[var(--black)] bg-[var(--black)] p-[12px_16px]">
              <div className="text-[10px] font-bold uppercase tracking-[2px] text-white">Keyword</div>
              <div className="text-[10px] font-bold uppercase tracking-[2px] text-white max-md:hidden">Competitor Ranks</div>
              <div className="text-[10px] font-bold uppercase tracking-[2px] text-white max-md:hidden">Action</div>
            </div>

            {gaps.map((g, i) => (
              <div key={i} className={`grid grid-cols-[1fr_200px_300px] max-md:grid-cols-1 p-[12px_16px] ${i < gaps.length - 1 ? 'border-b border-[#eaeaea]' : ''} hover:bg-[#fafafa]`}>
                <div className="text-[13px] font-bold text-[var(--black)]">{g.kw}</div>
                <div className="flex flex-wrap gap-2 items-center">
                  {g.comps.map((c, j) => (
                    <span key={j} className="text-[9px] font-bold bg-[#fee2e2] text-[var(--red)] px-2 py-0.5 border border-[var(--red)] tracking-wide">{c}</span>
                  ))}
                </div>
                <div className="text-[11px] font-bold text-[var(--red)] flex items-center">{g.action}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
