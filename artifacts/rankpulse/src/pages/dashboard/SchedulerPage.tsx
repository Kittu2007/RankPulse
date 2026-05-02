interface Post { type: string; text: string; }

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
  const getPlatColor = (type: string) => type === 'ig' ? 'bg-[#fdf4ff] border-[#d946ef] text-[#a21caf]' : type === 'li' ? 'bg-[#eff6ff] border-[#3b82f6] text-[#1d4ed8]' : 'bg-[#f3f4f6] border-[#111] text-[#000]';

  return (
    <div className="page-transition min-h-screen flex flex-col bg-[var(--bg)]">
      <div className="page-header flex items-center justify-between">
        <div><div className="page-kicker">Plan with SEO built in</div><div className="d4">Post Scheduler</div></div>
        <button className="btn btn-red px-6 font-bold text-sm">+ Schedule Post</button>
      </div>

      <div className="grid grid-cols-[1fr_280px] max-[900px]:grid-cols-1 flex-1">
        <div className="border-r-2 border-r-[var(--black)] p-[24px]">
          {/* Calendar Header */}
          <div className="grid grid-cols-7 border-2 border-[var(--black)] mb-0">
            {days.map(d => (
              <div key={d} className="p-2 text-center text-[10px] font-bold uppercase tracking-[2px] bg-[var(--black)] text-white border-r border-r-[#333] last:border-r-0">{d}</div>
            ))}
          </div>
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 border-2 border-t-0 border-[var(--black)] mb-6">
            {Array.from({ length: 28 }, (_, i) => i + 1).map(day => {
              const post = posts[day];
              return (
                <div key={day} className="min-h-[80px] p-2 border-r border-b border-[#eaeaea] last-of-type:border-r-0 hover:bg-[#f8f8f8] transition-colors">
                  <div className="text-[11px] font-bold text-[#888] mb-1">{day}</div>
                  {post && (
                    <div className={`text-[8px] font-bold uppercase px-1.5 py-1 border ${getPlatColor(post.type)} leading-tight`}>
                      {post.text}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Optimal Times */}
          <div className="flex items-center gap-3 mb-4"><div className="w-6 h-[3px] bg-[var(--red)]" /><span className="text-sm font-bold uppercase tracking-[2px]">Optimal Posting Times</span></div>
          <div className="grid grid-cols-3 gap-4">
            {optimalTimes.map((t, i) => (
              <div key={i} className="border-2 border-[var(--black)] bg-white p-4">
                <div className="text-[11px] font-bold uppercase tracking-[2px] text-[#888] mb-2">{t.plat}</div>
                {t.times.map((time, j) => (
                  <div key={j} className="text-xs font-bold py-1 border-b border-[#eaeaea] last:border-b-0">{time}</div>
                ))}
                <div className="text-[10px] text-[#888] mt-2">Best days: {t.best}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#fafafa] p-[24px]">
          <div className="label-sm text-[var(--red)] mb-4">Upcoming Queue</div>
          <div className="flex flex-col gap-3">
            {upcomingQueue.map((q, i) => (
              <div key={i} className="border-2 border-[var(--black)] bg-white p-4 shadow-[2px_2px_0_var(--black)]">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[8px] font-bold uppercase tracking-wider px-[6px] py-[2px] border ${getPlatColor(q.plat)}`}>{q.plat}</span>
                  <span className="text-[18px] font-black text-[var(--red)]" style={{ fontFamily: 'var(--font-d)' }}>{q.score}</span>
                </div>
                <div className="text-xs font-bold mb-1">{q.text}</div>
                <div className="text-[10px] text-[#888] font-bold">{q.date}</div>
              </div>
            ))}
          </div>
          <button className="btn btn-outline btn-sm w-full mt-4 justify-center font-bold text-xs">View Full Queue</button>
        </div>
      </div>
    </div>
  );
}
