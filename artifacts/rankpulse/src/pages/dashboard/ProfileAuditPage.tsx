import { useState, useMemo } from "react";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { aiComplete, hasAiKey } from "@/lib/nvidia";

type AuditItem = { field: string; status: 'ok' | 'warn' | 'err'; detail: string; fix?: string };
type AuditSection = { section: string; items: AuditItem[] };

function getAuditSections(platform: string): AuditSection[] {
  if (platform === 'LinkedIn') return [
    { section: 'Profile Basics', items: [
      { field: 'Headline', status: 'warn', detail: 'Headline lacks target keywords. Add your role + specialty (e.g. "SEO Strategist | Content Marketing")', fix: 'Add 2-3 target keywords to headline' },
      { field: 'Profile Photo', status: 'ok', detail: 'Professional headshot detected. Good quality, high contrast.' },
      { field: 'Banner Image', status: 'err', detail: 'Default banner. Custom banners with contact info get 2x more profile views.', fix: 'Upload a custom branded banner' },
      { field: 'Open to Work', status: 'ok', detail: 'Creator mode active — posts get algorithmic priority.' },
    ]},
    { section: 'About & Keywords', items: [
      { field: 'About Section', status: 'warn', detail: 'About section is under 200 characters. LinkedIn indexes this heavily.', fix: 'Expand to 300+ characters with keywords' },
      { field: 'Featured Section', status: 'err', detail: 'No featured posts or media. This section appears above the fold on profile.', fix: 'Add 3 featured posts or external links' },
      { field: 'Skills', status: 'ok', detail: '12 skills listed — good coverage for endorsement signals.' },
      { field: 'Recommendations', status: 'warn', detail: 'Only 1 recommendation. Target 5+ for social proof.', fix: 'Request 4+ recommendations from connections' },
    ]},
    { section: 'Content Signals', items: [
      { field: 'Posting Frequency', status: 'warn', detail: '2 posts/week. LinkedIn rewards 3-5 posts/week.', fix: 'Increase to 3+ posts per week' },
      { field: 'Document Posts', status: 'ok', detail: 'Carousel/document posts detected — these get 3x average reach.' },
      { field: 'Engagement Response', status: 'err', detail: 'Average reply time: 6+ hours. Reply within 1 hour for algorithm boost.', fix: 'Enable notifications and reply within 1 hour' },
      { field: 'Newsletter', status: 'warn', detail: 'No LinkedIn newsletter created. Newsletters auto-notify followers.', fix: 'Create a weekly newsletter' },
    ]},
  ];

  if (platform === 'X / Twitter') return [
    { section: 'Profile Basics', items: [
      { field: 'Handle', status: 'ok', detail: 'Clean handle, no underscores or numbers. Easy to mention.' },
      { field: 'Profile Photo', status: 'ok', detail: 'Photo detected. High quality avatar increases reply rates.' },
      { field: 'Header Image', status: 'warn', detail: 'No header image. Add a branded header with your value prop.', fix: 'Upload a branded header image' },
      { field: 'Pinned Tweet', status: 'err', detail: 'No pinned tweet. Your best-performing tweet should always be pinned.', fix: 'Pin your highest-engagement tweet' },
    ]},
    { section: 'Bio & Keywords', items: [
      { field: 'Bio Keywords', status: 'warn', detail: 'Bio missing niche keywords. X indexes bio text for topic classification.', fix: 'Add 2-3 niche keywords to bio' },
      { field: 'Bio Length', status: 'ok', detail: 'Full 160 characters used — good utilisation.' },
      { field: 'Link in Bio', status: 'ok', detail: 'Active link detected.' },
      { field: 'Location', status: 'warn', detail: 'No location set. Location helps with local discovery.', fix: 'Set your city or region' },
    ]},
    { section: 'Content Signals', items: [
      { field: 'Thread Usage', status: 'err', detail: 'No threads in last 30 days. Threads get 2.5x more impressions.', fix: 'Post 1 thread per week' },
      { field: 'Reply Ratio', status: 'warn', detail: 'Reply ratio below 40%. X algorithm rewards engagement.', fix: 'Reply to 5+ tweets daily in your niche' },
      { field: 'Posting Consistency', status: 'ok', detail: '5+ tweets/day — strong consistent signal.' },
      { field: 'Media Usage', status: 'ok', detail: '60% of tweets include images — good for engagement.' },
    ]},
  ];

  // Default: Instagram
  return [
    { section: 'Profile Basics', items: [
      { field: 'Username', status: 'ok', detail: '@yourhandle — clean, brandable, searchable' },
      { field: 'Profile Photo', status: 'ok', detail: 'Professional photo detected. High contrast, face visible.' },
      { field: 'Display Name', status: 'warn', detail: 'No keywords in display name. Add your niche (e.g. "Kittu | Fitness Creator")', fix: 'Add 1-2 niche keywords to display name' },
      { field: 'Account Category', status: 'ok', detail: 'Set to "Creator" — correct for algorithmic classification' },
      { field: 'Verified Status', status: 'warn', detail: 'Account not verified. Verification improves trust signals.', fix: 'Apply for Meta Verified' },
    ]},
    { section: 'Bio & Keywords', items: [
      { field: 'Bio Keywords', status: 'err', detail: 'CRITICAL: Bio has 0 of your 3 target keywords. Instagram indexes bio text for search.', fix: 'Add target keywords to bio immediately' },
      { field: 'Bio Length', status: 'ok', detail: '148/150 characters used — good utilisation' },
      { field: 'Link in Bio', status: 'ok', detail: 'Active link detected. Use a link aggregator for multiple destinations.' },
      { field: 'Call to Action', status: 'warn', detail: 'No clear CTA in bio. Add "↓ Free workout guide" or similar.', fix: 'Add a CTA with emoji pointer' },
      { field: 'Story Highlights', status: 'err', detail: 'No story highlights active. Highlights signal account authority to the algorithm.', fix: 'Create 3-5 themed highlights' },
    ]},
    { section: 'Content Signals', items: [
      { field: 'Posting Frequency', status: 'warn', detail: '3 posts/week detected. Target: 4+ to maintain topic cluster membership.', fix: 'Increase to 4+ posts per week' },
      { field: 'Content Originality', status: 'ok', detail: 'No watermarked or duplicate content in last 30 posts.' },
      { field: 'Reels vs Static Ratio', status: 'ok', detail: '68% Reels — good. Reels drive discovery, carousels drive engagement.' },
      { field: 'Hashtag Consistency', status: 'err', detail: '3 banned hashtags found in recent posts (#viral, #f4f, #likeforlike). Remove immediately.', fix: 'Remove banned hashtags from all posts' },
      { field: 'Alt Text Usage', status: 'err', detail: 'Only 2% of posts have alt text. This is a critical SEO miss. Enable for all posts.', fix: 'Add keyword-rich alt text to all future posts' },
    ]},
  ];
}

export default function ProfileAuditPage() {
  const [activePlatform, setActivePlatform] = useState('Instagram');
  const [fixingItems, setFixingItems] = useState<Set<string>>(new Set());
  const [fixedItems, setFixedItems] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem('rp_audit_fixed') || '[]')); }
    catch { return new Set(); }
  });
  const platforms = ['Instagram', 'LinkedIn', 'X / Twitter'];

  const sections = useMemo(() => getAuditSections(activePlatform), [activePlatform]);

  // Apply "fixed" overrides
  const processedSections = useMemo(() => {
    return sections.map(sec => ({
      ...sec,
      items: sec.items.map(item => {
        const key = `${activePlatform}-${item.field}`;
        if (fixedItems.has(key)) return { ...item, status: 'ok' as const, detail: `✓ Fixed! ${item.detail.split('.')[0]}.` };
        return item;
      }),
    }));
  }, [sections, fixedItems, activePlatform]);

  const statusBg = { ok: 'bg-[#ebfbf0] border-[#22c55e] text-[#166534]', warn: 'bg-[#fffbeb] border-[#f59e0b] text-[#92400e]', err: 'bg-[#fef2f2] border-[#ef4444] text-[#991b1b]' };
  const StatusIcon = ({ s }: { s: string }) => s === 'ok' ? <CheckCircle2 className="h-3 w-3 inline mr-1" /> : s === 'warn' ? <AlertTriangle className="h-3 w-3 inline mr-1" /> : <XCircle className="h-3 w-3 inline mr-1" />;

  const allItems = processedSections.flatMap(s => s.items);
  const okCount = allItems.filter(i => i.status === 'ok').length;
  const overallScore = Math.round((okCount / allItems.length) * 100);

  const handleFixItem = async (item: AuditItem) => {
    const key = `${activePlatform}-${item.field}`;
    if (fixedItems.has(key)) return;
    setFixingItems(prev => new Set([...prev, key]));

    if (hasAiKey() && item.fix) {
      try {
        const raw = await aiComplete([
          { role: "system", content: "You are a social media profile optimization expert. Give a concise 2-sentence action plan." },
          { role: "user", content: `Fix this profile issue: ${item.field} — ${item.detail}. Suggestion: ${item.fix}` },
        ]);
        toast.success(raw.slice(0, 200));
      } catch {
        toast.success(item.fix || "Mark as resolved");
      }
    } else {
      toast.success(item.fix || "Marked as fixed!");
    }

    setFixedItems(prev => {
      const next = new Set(prev);
      next.add(key);
      localStorage.setItem('rp_audit_fixed', JSON.stringify(Array.from(next)));
      return next;
    });
    setFixingItems(prev => { const next = new Set(prev); next.delete(key); return next; });
  };

  const handleFixAll = () => {
    const issueItems = allItems.filter(i => i.status !== 'ok');
    issueItems.forEach(item => {
      const key = `${activePlatform}-${item.field}`;
      setFixedItems(prev => {
        const next = new Set(prev);
        next.add(key);
        localStorage.setItem('rp_audit_fixed', JSON.stringify(Array.from(next)));
        return next;
      });
    });
    toast.success(`${issueItems.length} issues marked as resolved!`);
  };

  return (
    <div className="page-transition min-h-screen flex flex-col bg-[var(--bg)]">
      {/* Page header — stacks on mobile */}
      <div className="page-header flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
        <div>
          <div className="page-kicker">Is your profile working for you?</div>
          <div className="d4">Profile SEO Auditor</div>
        </div>
        {/* Platform tabs — wrap on very small screens */}
        <div className="flex flex-wrap border-2 border-[var(--black)] bg-white self-start sm:self-auto">
          {platforms.map((p, i) => (
            <button key={i} onClick={() => setActivePlatform(p)}
              className={`px-3 sm:px-4 py-2 text-xs font-bold transition-colors border-r-2 border-[var(--black)] last:border-r-0 ${activePlatform === p ? 'bg-[var(--black)] text-white' : 'bg-transparent text-[var(--black)] hover:bg-[#fafafa]'}`}>{p}</button>
          ))}
        </div>
      </div>

      {/* Main grid — stacks on mobile */}
      <div className="flex flex-col md:grid md:grid-cols-[1fr_280px] flex-1">
        <div className="border-b-2 md:border-b-0 md:border-r-2 border-[var(--black)] bg-white">
          {processedSections.map((sec, si) => (
            <div key={si}>
              <div className="p-3 sm:p-[14px_24px] border-b-2 border-b-[var(--black)] bg-[var(--black)] flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-[2px] text-white">{sec.section}</span>
                <span className="text-[10px] font-bold text-[#888]">{sec.items.filter(i => i.status === 'ok').length}/{sec.items.length} passed</span>
              </div>
              {sec.items.map((item, ii) => {
                const key = `${activePlatform}-${item.field}`;
                const isFixing = fixingItems.has(key);
                return (
                  <div key={ii} className="flex items-start gap-3 sm:gap-4 p-3 sm:p-[14px_24px] border-b border-b-[#eaeaea]">
                    <span className={`text-[11px] font-bold px-2 py-0.5 border-2 shrink-0 mt-0.5 flex items-center gap-1 ${statusBg[item.status]}`}>
                      <StatusIcon s={item.status} />{item.status.toUpperCase()}
                    </span>
                    <div className="flex-1">
                      <div className="text-sm font-bold mb-0.5">{item.field}</div>
                      <div className="text-xs text-[#555] leading-relaxed">{item.detail}</div>
                      {item.status !== 'ok' && item.fix && (
                        <button
                          className="mt-2 text-[10px] font-bold text-[var(--red)] hover:underline uppercase tracking-wider"
                          onClick={() => handleFixItem(item)}
                          disabled={isFixing}>
                          {isFixing ? "Fixing..." : `→ ${item.fix}`}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Score sidebar */}
        <div className="bg-[var(--black)] flex flex-col">
          <div className="p-5 sm:p-6 text-center border-b border-b-[#222]">
            <div className="text-[10px] uppercase tracking-[2px] font-bold text-[#888] mb-2">Profile Score</div>
            <div className="text-[70px] sm:text-[80px] leading-none text-[var(--red)]" style={{ fontFamily: 'var(--font-d)' }}>{overallScore}</div>
            <div className="text-[10px] uppercase tracking-[2px] font-bold text-[#888] mt-2">/ 100 — {overallScore >= 70 ? 'GOOD' : overallScore >= 50 ? 'AVERAGE' : 'NEEDS WORK'}</div>
          </div>
          <div className="p-4 sm:p-5">
            <div className="text-[10px] uppercase tracking-[2px] font-bold text-[#888] mb-3">Quick Stats</div>
            {[
              { l: 'Passed Checks', v: `${okCount}/${allItems.length}`, c: 'text-[#4ade80]' },
              { l: 'Warnings', v: allItems.filter(i => i.status === 'warn').length.toString(), c: 'text-[#f59e0b]' },
              { l: 'Critical Issues', v: allItems.filter(i => i.status === 'err').length.toString(), c: 'text-[var(--red)]' },
            ].map((stat, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-b-[#1a1a1a]">
                <span className="text-[11px] text-[#888]">{stat.l}</span>
                <span className={`text-sm font-bold ${stat.c}`}>{stat.v}</span>
              </div>
            ))}
          </div>
          <div className="p-4 sm:p-5">
            <div className="text-[10px] uppercase tracking-[2px] font-bold text-[#888] mb-3">Platform</div>
            <div className="text-sm font-bold text-white">{activePlatform}</div>
          </div>
          <div className="p-4 sm:p-5 mt-auto pb-6 sm:pb-8">
            <button className="w-full btn btn-red justify-center py-3 text-sm font-bold" onClick={handleFixAll}
              disabled={allItems.every(i => i.status === 'ok')}>
              {allItems.every(i => i.status === 'ok') ? 'All Issues Fixed ✓' : 'Fix All Issues →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
