interface Competitor { handle: string; name: string; ig: number; li: number; x: number; posts: number; eng: string; gap: string[]; }

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
      <div className="page-header flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
        <div>
          <div className="page-kicker">See where you stand</div>
          <div className="d4">Competitor Tracker</div>
        </div>
        <button className="btn btn-red px-6 font-bold text-sm self-start sm:self-auto">+ Add Competitor</button>
      </div>

      {/* Score Banner — wraps on mobile */}
      <div className="bg-[var(--black)] border-b-2 border-b-[var(--black)] p-4 sm:p-[16px_32px] flex flex-wrap items-center gap-4 sm:gap-8">
        <div>
          <div className="text-[10px] font-bold tracking-[2px] uppercase text-[#888] mb-1">Your Score</div>
          <div className="text-[36px] text-[var(--red)] leading-none" style={{ fontFamily: 'var(--font-d)' }}>78.4</div>
        </div>
        <div className="hidden sm:block flex-1 h-[2px] bg-[#333]" />
        <div className="text-center">
          <div className="text-[10px] font-bold tracking-[2px] uppercase text-[#888] mb-1">Market Avg</div>
          <div className="text-[36px] text-[#888] leading-none" style={{ fontFamily: 'var(--font-d)' }}>75.2</div>
        </div>
        <div className="hidden sm:block flex-1 h-[2px] bg-[#333]" />
        <div className="sm:text-right">
          <div className="text-[10px] font-bold tracking-[2px] uppercase text-[#888] mb-1">Top Competitor</div>
          <div className="text-[36px] text-[#4ade80] leading-none" style={{ fontFamily: 'var(--font-d)' }}>91.0</div>
        </div>
      </div>

      {/* Main grid — stacks on mobile */}
      <div className="flex flex-col md:grid md:grid-cols-[1fr_320px] flex-1">
        <div className="border-b-2 md:border-b-0 md:border-r-2 border-[var(--black)] p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-[3px] bg-[var(--red)]" />
            <span className="text-sm font-bold uppercase tracking-[2px]">Tracked Competitors</span>
          </div>
          <div className="flex flex-col gap-4">
            {comps.map((c, i) => (
              <div key={i} className="border-2 border-[var(--black)] bg-white shadow-[4px_4px_0_var(--black)] p-4 sm:p-5">
                <div className="flex items-start justify-between mb-4 gap-3">
                  <div className="min-w-0">
                    <div className="text-[15px] sm:text-[16px] font-black uppercase leading-tight" style={{ fontFamily: 'var(--font-d)' }}>{c.name}</div>
                    <div className="text-xs text-[#888] font-bold mt-0.5 truncate">{c.handle} · {c.posts} posts/mo · {c.eng} engagement</div>
                  </div>
                  <button className="btn btn-outline btn-sm text-xs shrink-0">View Profile</button>
                </div>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {c.ig > 0 && <div className="border border-[#eaeaea] p-2 sm:p-3 text-center"><div className="text-[10px] font-bold text-[#d946ef] uppercase tracking-wide mb-1">Instagram</div><div className="text-[22px] sm:text-[24px] font-black" style={{ fontFamily: 'var(--font-d)' }}>{c.ig}</div></div>}
                  {c.li > 0 && <div className="border border-[#eaeaea] p-2 sm:p-3 text-center"><div className="text-[10px] font-bold text-[#3b82f6] uppercase tracking-wide mb-1">LinkedIn</div><div className="text-[22px] sm:text-[24px] font-black" style={{ fontFamily: 'var(--font-d)' }}>{c.li}</div></div>}
                  {c.x > 0 && <div className="border border-[#eaeaea] p-2 sm:p-3 text-center"><div className="text-[10px] font-bold text-[#555] uppercase tracking-wide mb-1">X / Twitter</div><div className="text-[22px] sm:text-[24px] font-black" style={{ fontFamily: 'var(--font-d)' }}>{c.x}</div></div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 sm:p-6 bg-[#fafafa]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-[3px] bg-[var(--red)]" />
            <span className="text-sm font-bold uppercase tracking-[2px]">Keyword Gaps</span>
          </div>
          <div className="flex flex-col gap-3">
            {gaps.map((g, i) => (
              <div key={i} className="border-2 border-[var(--black)] bg-white p-4">
                <div className="text-sm font-black mb-1">"{g.kw}"</div>
                <div className="text-[11px] text-[#888] mb-2">Competitor ranks: {g.comps.join(', ')}</div>
                <div className="text-[11px] font-bold text-[#16a34a] border-l-2 border-l-[#22c55e] pl-2">{g.action}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
