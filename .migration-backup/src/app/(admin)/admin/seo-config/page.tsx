"use client";

export default function AdminSeoConfigPage() {
  const configs = [
    {
      plat: 'Instagram', color: 'var(--ig)', bg: '#fdf4ff', border: '#d946ef', params: [
        { n: 'Watch Time', w: 30 }, { n: 'DM Sends/Reach', w: 25 }, { n: 'Caption Keywords', w: 10 },
        { n: 'Hashtag Strategy', w: 8 }, { n: 'Alt Text', w: 5 }, { n: 'Profile Completeness', w: 4 },
        { n: 'Posting Consistency', w: 3 }, { n: 'Content Originality', w: 5 },
      ]
    },
    {
      plat: 'LinkedIn', color: 'var(--li)', bg: '#eff6ff', border: '#3b82f6', params: [
        { n: 'Depth Score', w: 28 }, { n: 'Headline Keywords', w: 18 }, { n: 'Comment Quality', w: 15 },
        { n: 'Topic Authority', w: 12 }, { n: 'Profile Complete', w: 10 }, { n: 'About Keywords', w: 7 },
        { n: 'Skill Endorsements', w: 5 }, { n: 'Link Strategy', w: 3 },
      ]
    },
    {
      plat: 'X / Twitter', color: '#111', bg: '#f9f9f9', border: '#111', params: [
        { n: 'Reply Depth', w: 25 }, { n: 'RT Velocity', w: 20 }, { n: 'TweepCred', w: 18 },
        { n: 'KW/Hashtag Match', w: 12 }, { n: 'Link Penalty', w: 10 }, { n: 'Content Format', w: 8 },
        { n: 'Recency Score', w: 5 }, { n: 'Grok Cluster', w: 2 },
      ]
    },
  ];

  return (
    <div className="flex flex-col min-h-screen pb-10">
      {/* Header */}
      <div className="p-[20px_24px] border-b-2 border-b-[var(--black)] bg-[#f5f2e8] flex justify-between items-center flex-wrap gap-4 z-0">
        <div>
          <div className="text-[10px] font-bold tracking-[2px] uppercase text-[var(--red)] mb-1">Algorithm Configuration</div>
          <div className="text-[32px] leading-none text-[var(--black)] uppercase" style={{ fontFamily: 'var(--font-d)' }}>SEO Engine Config</div>
        </div>
        <div className="flex gap-2 items-center">
          <button className="btn btn-outline btn-sm font-bold text-[10px] uppercase tracking-wide bg-white">Reset to Default</button>
          <button className="btn btn-red btn-sm font-bold text-[10px] uppercase tracking-wide px-5 text-white">Save & Deploy</button>
        </div>
      </div>

      <div className="p-[24px] grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {configs.map((p, i) => {
          const totalWeight = p.params.reduce((a, b) => a + b.w, 0);
          return (
            <div key={i} className="border-2 border-[var(--black)] bg-white shadow-[4px_4px_0px_var(--black)] flex flex-col">
              <div className="p-[16px_20px] border-b-2 border-[var(--black)] flex items-center justify-between" style={{ backgroundColor: p.bg }}>
                <span className="text-[14px] font-bold uppercase tracking-[2px]" style={{ color: p.color }}>{p.plat} Parameters</span>
                <span className="w-2.5 h-2.5 rounded-full border border-black bg-white shadow-sm"></span>
              </div>
              <div className="flex flex-col flex-1">
                {p.params.map((m, idx) => (
                  <div key={idx} className="flex justify-between items-center py-3 px-5 border-b border-[#eaeaea]">
                    <span className="text-[12px] font-bold text-[var(--black)] flex-1">{m.n}</span>
                    <div className="flex items-center gap-1.5">
                      <input 
                        type="number" 
                        className="input h-8 px-2 text-center text-[12px] font-bold border-2 border-[var(--black)] focus:border-[var(--red)] outline-none rounded-none w-[64px]" 
                        defaultValue={m.w} 
                      />
                      <span className="text-[12px] font-bold text-[#888]">%</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-[16px_20px] border-t-2 border-[var(--black)] bg-[#fafafa] flex justify-between items-center mt-auto">
                <span className="text-[11px] font-bold uppercase tracking-[2px] text-[#555]">Total:</span>
                <div className="flex items-center gap-2">
                  <span className={`text-[16px] font-bold ${totalWeight === 100 ? 'text-[#16a34a]' : 'text-[var(--red)]'}`}>{totalWeight}%</span>
                  {totalWeight === 100 && <span className="text-[12px] text-[#16a34a] font-bold">✓</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
