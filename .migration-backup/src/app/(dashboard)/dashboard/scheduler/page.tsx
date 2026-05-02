"use client";



interface Post {
  type: string;
  text: string;
}

export default function SchedulerPage() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const posts: Record<number, Post> = {
    2: { type: 'ig', text: 'Arm workout reel' },
    5: { type: 'li', text: 'LinkedIn article' },
    8: { type: 'ig', text: 'Transformation post' },
    9: { type: 'x', text: 'Hot take thread' },
    12: { type: 'ig', text: 'Tutorial carousel' },
    15: { type: 'li', text: 'Industry insight' },
    16: { type: 'x', text: 'Poll + discussion' },
    19: { type: 'ig', text: 'Q&A story backup' },
    22: { type: 'ig', text: 'New reel drop' },
    23: { type: 'li', text: 'Behind the scenes' },
  };

  const optimalTimes = [
    { plat: 'Instagram', times: ['7–9 AM', '12–2 PM', '6–8 PM'], best: 'Tue, Wed, Thu' },
    { plat: 'LinkedIn', times: ['7–9 AM', '12–1 PM'], best: 'Tue, Wed' },
    { plat: 'X / Twitter', times: ['8–10 AM', '6–8 PM'], best: 'Wed, Fri' },
  ];

  const upcomingQueue = [
    { date: 'Apr 12', text: 'Arm workout reel', plat: 'ig', score: 81 },
    { date: 'Apr 14', text: 'LinkedIn article drop', plat: 'li', score: 74 },
    { date: 'Apr 15', text: 'Hot take thread', plat: 'x', score: 88 },
    { date: 'Apr 16', text: 'Tutorial carousel', plat: 'ig', score: 77 },
  ];

  const thisMonth = [
    { l: 'Posts Scheduled', v: '10' },
    { l: 'Instagram', v: '5 posts' },
    { l: 'LinkedIn', v: '3 posts' },
    { l: 'X / Twitter', v: '2 posts' },
    { l: 'Avg SEO Score', v: '80.2' },
  ];

  const getPlatformColors = (type: string) => {
    switch (type) {
      case 'ig': return 'bg-[#fdf4ff] border-[#d946ef] text-[#a21caf]';
      case 'li': return 'bg-[#eff6ff] border-[#3b82f6] text-[#1d4ed8]';
      case 'x': return 'bg-[#f3f4f6] border-[#111] text-[#000]';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  return (
    <div className="page-transition min-h-screen flex flex-col bg-[var(--bg)]">
      {/* Header */}
      <div className="page-header border-b-2 border-b-[var(--black)] p-[24px_32px] flex items-center justify-between">
        <div className="page-title-group">
          <div className="page-kicker text-[10px] text-[var(--red)] uppercase tracking-[2px] font-bold mb-1">Plan with SEO built in</div>
          <div className="d4 text-[40px] leading-none uppercase" style={{ fontFamily: 'var(--font-d)' }}>Post Scheduler</div>
        </div>
        <div className="flex gap-2 items-center">
          <button className="btn btn-outline btn-sm font-bold text-xs">← April</button>
          <button className="btn btn-black btn-sm font-bold text-xs bg-[var(--black)] text-white">Today</button>
          <button className="btn btn-outline btn-sm font-bold text-xs">May →</button>
          <button className="btn btn-red font-bold text-sm px-6">+ Schedule Post</button>
        </div>
      </div>

      <div className="flex flex-1 max-md:flex-col">
        {/* Calendar */}
        <div className="flex-1 border-r-2 border-r-[var(--black)] max-md:border-r-0 max-md:border-b-2 flex flex-col">
          <div className="grid grid-cols-7 border-b-2 border-b-[var(--black)] bg-[var(--black)]">
            {days.map((d, i) => (
              <div key={i} className="p-[10px] text-center text-[10px] font-bold uppercase tracking-[2px] text-white border-r border-[#333] last:border-r-0">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 flex-1 border-b-2 border-[var(--black)]">
            {Array.from({ length: 35 }).map((_, idx) => {
              const date = idx - 1;
              const dayNum = date + 1;
              const hasPost = posts[dayNum];
              const isToday = dayNum === 11;

              if (dayNum < 1 || dayNum > 30) {
                return <div key={idx} className="bg-[#f9f7f0] opacity-40 border-r border-b border-[#eaeaea]"></div>;
              }

              return (
                <div key={idx} className={`relative p-2 border-r border-b border-[#eaeaea] min-h-[120px] transition-colors hover:bg-white flex flex-col z-0 shadow-none ${isToday ? 'bg-[#fff5f5]' : 'bg-transparent'}`}>
                  <div className={`text-[12px] font-bold mb-2 ${isToday ? 'text-[var(--red)]' : 'text-[#888]'}`}>
                    {dayNum}{isToday ? ' ●' : ''}
                  </div>
                  {hasPost && (
                    <div className={`mt-auto p-2 border text-[10px] font-bold leading-snug cursor-pointer ${getPlatformColors(hasPost.type)}`}>
                      {hasPost.text}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-[300px] max-md:w-full bg-white flex flex-col">
          <div className="p-5 border-b-2 border-b-[var(--black)]">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-4 h-[3px] bg-[var(--red)]" />
              <span className="text-[12px] font-bold tracking-[2px] uppercase text-[var(--red)]">Optimal Posting Times</span>
            </div>
            {optimalTimes.map((p, i) => (
              <div key={i} className="py-3 border-b border-[#eaeaea] last:border-b-0">
                <div className="text-[11px] font-bold uppercase tracking-[1px] mb-1.5">{p.plat}</div>
                <div className="text-[13px] font-bold mb-1">{p.times.join(' · ')}</div>
                <div className="text-[11px] font-bold text-[#888]">Best days: {p.best}</div>
              </div>
            ))}
          </div>

          <div className="p-5 border-b-2 border-b-[var(--black)]">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-4 h-[3px] bg-[var(--black)]" />
              <span className="text-[12px] font-bold tracking-[2px] uppercase">Upcoming Queue</span>
            </div>
            {upcomingQueue.map((p, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-[#eaeaea] last:border-b-0">
                <div className="w-10 text-[9px] text-[#888] font-bold uppercase tracking-wider">{p.date}</div>
                <div className="flex-1 text-[11px] font-bold truncate">{p.text}</div>
                <span className={`text-[7px] font-bold uppercase tracking-wider px-[4px] py-[2px] border text-white ${
                  p.plat === 'ig' ? 'bg-[#d946ef] border-[#a21caf]' : 
                  p.plat === 'li' ? 'bg-[#3b82f6] border-[#1d4ed8]' : 
                  'bg-[#111] border-[#000]'
                }`}>
                  {p.plat}
                </span>
                <span className={`text-[16px] tracking-[-1px] w-[20px] text-right font-bold w-6 ${p.score >= 80 ? 'text-[#16a34a]' : p.score >= 60 ? 'text-[#f59e0b]' : 'text-[var(--red)]'}`} style={{ fontFamily: 'var(--font-d)' }}>
                  {p.score}
                </span>
              </div>
            ))}
          </div>

          <div className="p-5 flex-1 bg-[#f8f8f8]">
            <div className="text-[11px] font-bold uppercase tracking-[2px] text-[#888] mb-4">This Month</div>
            {thisMonth.map((s, i) => (
              <div key={i} className="flex justify-between py-2 border-b border-[#eaeaea] last:border-b-0">
                <span className="text-[11px] font-bold text-[#555]">{s.l}</span>
                <span className="text-[11px] font-bold text-[var(--black)]">{s.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
