import { useState } from "react";
import { toast } from "sonner";
import { getScheduledPosts, saveScheduledPost, removeScheduledPost, type ScheduledPost } from "@/lib/storage";
import { X as XIcon, Plus } from "lucide-react";

export default function SchedulerPage() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const [posts, setPosts] = useState<ScheduledPost[]>(() => {
    const saved = getScheduledPosts();
    if (saved.length === 0) {
      // Seed with defaults
      const defaults: ScheduledPost[] = [
        { id: 1, day: 2, platform: 'ig', text: 'Arm workout reel', score: 81, created_at: new Date().toISOString() },
        { id: 2, day: 5, platform: 'li', text: 'LinkedIn article', score: 74, created_at: new Date().toISOString() },
        { id: 3, day: 8, platform: 'ig', text: 'Transformation post', score: 77, created_at: new Date().toISOString() },
        { id: 4, day: 9, platform: 'x', text: 'Hot take thread', score: 88, created_at: new Date().toISOString() },
        { id: 5, day: 12, platform: 'ig', text: 'Tutorial carousel', score: 82, created_at: new Date().toISOString() },
        { id: 6, day: 15, platform: 'li', text: 'Industry insight', score: 70, created_at: new Date().toISOString() },
        { id: 7, day: 16, platform: 'x', text: 'Poll + discussion', score: 76, created_at: new Date().toISOString() },
        { id: 8, day: 19, platform: 'ig', text: 'Q&A story backup', score: 68, created_at: new Date().toISOString() },
        { id: 9, day: 22, platform: 'ig', text: 'New reel drop', score: 85, created_at: new Date().toISOString() },
        { id: 10, day: 23, platform: 'li', text: 'Behind the scenes', score: 72, created_at: new Date().toISOString() },
      ];
      defaults.forEach(d => saveScheduledPost(d));
      return defaults;
    }
    return saved;
  });

  const [showModal, setShowModal] = useState(false);
  const [editDay, setEditDay] = useState(1);
  const [newText, setNewText] = useState('');
  const [newPlatform, setNewPlatform] = useState('ig');

  const optimalTimes = [
    { plat: 'Instagram', times: ['7–9 AM', '12–2 PM', '6–8 PM'], best: 'Tue, Wed, Thu' },
    { plat: 'LinkedIn', times: ['7–9 AM', '12–1 PM'], best: 'Tue, Wed' },
    { plat: 'X / Twitter', times: ['8–10 AM', '6–8 PM'], best: 'Wed, Fri' },
  ];

  const getPlatColor = (type: string) => type === 'ig' ? 'bg-[#fdf4ff] border-[#d946ef] text-[#a21caf]' : type === 'li' ? 'bg-[#eff6ff] border-[#3b82f6] text-[#1d4ed8]' : 'bg-[#f3f4f6] border-[#111] text-[#000]';

  const openScheduleModal = (day?: number) => {
    setEditDay(day ?? 1);
    setNewText('');
    setNewPlatform('ig');
    setShowModal(true);
  };

  const handleAddPost = () => {
    if (!newText.trim()) { toast.error("Enter post content."); return; }
    const post: ScheduledPost = {
      id: Date.now(),
      day: editDay,
      platform: newPlatform,
      text: newText.trim(),
      score: Math.floor(Math.random() * 25) + 65,
      created_at: new Date().toISOString(),
    };
    saveScheduledPost(post);
    setPosts(getScheduledPosts());
    setShowModal(false);
    toast.success(`Post scheduled for day ${editDay}`);
  };

  const handleDeletePost = (id: number) => {
    removeScheduledPost(id);
    setPosts(getScheduledPosts());
    toast.success("Post removed");
  };

  const upcomingQueue = posts
    .sort((a, b) => a.day - b.day)
    .slice(0, 5);

  return (
    <div className="page-transition min-h-screen flex flex-col bg-[var(--bg)]">
      <div className="page-header flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
        <div>
          <div className="page-kicker">Plan with SEO built in</div>
          <div className="d4">Post Scheduler</div>
        </div>
        <button className="btn btn-red px-6 font-bold text-sm self-start sm:self-auto" onClick={() => openScheduleModal()}>
          <Plus className="h-4 w-4 mr-1" /> Schedule Post
        </button>
      </div>

      {/* Main grid — stacks on mobile */}
      <div className="flex flex-col md:grid md:grid-cols-[1fr_280px] flex-1">
        <div className="border-b-2 md:border-b-0 md:border-r-2 border-[var(--black)] p-4 sm:p-6">
          {/* Calendar — horizontal scroll on small screens */}
          <div className="overflow-x-auto mb-6">
            <div className="min-w-[420px]">
              <div className="grid grid-cols-7 border-2 border-[var(--black)]">
                {days.map(d => (
                  <div key={d} className="p-2 text-center text-[10px] font-bold uppercase tracking-[2px] bg-[var(--black)] text-white border-r border-r-[#333] last:border-r-0">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 border-2 border-t-0 border-[var(--black)]">
                {Array.from({ length: 28 }, (_, i) => i + 1).map(day => {
                  const dayPosts = posts.filter(p => p.day === day);
                  return (
                    <div key={day}
                      className="min-h-[64px] sm:min-h-[80px] p-1.5 sm:p-2 border-r border-b border-[#eaeaea] last-of-type:border-r-0 hover:bg-[#f8f8f8] transition-colors cursor-pointer group"
                      onClick={() => openScheduleModal(day)}>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#888] mb-1">{day}</span>
                        <span className="text-[#ccc] group-hover:text-[var(--red)] text-xs hidden group-hover:block">+</span>
                      </div>
                      {dayPosts.map(post => (
                        <div key={post.id} className={`text-[7px] sm:text-[8px] font-bold uppercase px-1 sm:px-1.5 py-1 border ${getPlatColor(post.platform)} leading-tight mb-0.5 relative group/post`}>
                          {post.text}
                          <button
                            className="absolute -top-1 -right-1 bg-[var(--red)] text-white rounded-full w-3 h-3 flex items-center justify-center opacity-0 group-hover/post:opacity-100 transition-opacity"
                            onClick={(e) => { e.stopPropagation(); handleDeletePost(post.id); }}>
                            <XIcon className="h-2 w-2" />
                          </button>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Optimal Times — responsive grid */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-[3px] bg-[var(--red)]" />
            <span className="text-sm font-bold uppercase tracking-[2px]">Optimal Posting Times</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

        {/* Queue sidebar */}
        <div className="bg-[#fafafa] p-4 sm:p-6">
          <div className="label-sm text-[var(--red)] mb-4">Upcoming Queue</div>
          <div className="flex flex-col gap-3">
            {upcomingQueue.length === 0 ? (
              <div className="text-xs text-[#888] py-2">No posts scheduled yet.</div>
            ) : upcomingQueue.map((q) => (
              <div key={q.id} className="border-2 border-[var(--black)] bg-white p-4 shadow-[2px_2px_0_var(--black)] group relative">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[8px] font-bold uppercase tracking-wider px-[6px] py-[2px] border ${getPlatColor(q.platform)}`}>{q.platform}</span>
                  <span className="text-[18px] font-black text-[var(--red)]" style={{ fontFamily: 'var(--font-d)' }}>{q.score ?? '—'}</span>
                </div>
                <div className="text-xs font-bold mb-1">{q.text}</div>
                <div className="text-[10px] text-[#888] font-bold">Day {q.day}</div>
                <button
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-[#888] hover:text-[var(--red)] transition-opacity"
                  onClick={() => handleDeletePost(q.id)}>
                  <XIcon className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
          <div className="text-[10px] text-[#888] font-bold mt-4 text-center">{posts.length} total posts scheduled</div>
        </div>
      </div>

      {/* Schedule Modal */}
      {showModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowModal(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white border-2 border-[var(--black)] shadow-[8px_8px_0_var(--black)] p-6 w-full max-w-sm">
              <div className="text-lg font-black uppercase mb-4" style={{ fontFamily: 'var(--font-d)' }}>Schedule Post — Day {editDay}</div>
              <div className="mb-3">
                <label className="label-sm mb-1 block">Platform</label>
                <select className="input cursor-pointer" value={newPlatform} onChange={e => setNewPlatform(e.target.value)}>
                  <option value="ig">Instagram</option>
                  <option value="li">LinkedIn</option>
                  <option value="x">X / Twitter</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="label-sm mb-1 block">Content</label>
                <textarea className="input min-h-[80px] resize-none" value={newText} onChange={e => setNewText(e.target.value)} placeholder="What are you posting?" />
              </div>
              <div className="flex gap-2">
                <button className="btn btn-red flex-1 justify-center" onClick={handleAddPost}>Schedule</button>
                <button className="btn btn-outline flex-1 justify-center" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
