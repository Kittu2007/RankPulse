import { useState } from "react";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

export default function ProfileAuditPage() {
  const [activePlatform, setActivePlatform] = useState('Instagram');
  const platforms = ['Instagram', 'LinkedIn', 'X / Twitter'];
  const sections = [
    { section: 'Profile Basics', items: [
      { field: 'Username', status: 'ok', detail: '@yourhandle — clean, brandable, searchable' },
      { field: 'Profile Photo', status: 'ok', detail: 'Professional photo detected. High contrast, face visible.' },
      { field: 'Display Name', status: 'warn', detail: 'No keywords in display name. Add your niche (e.g. "Kittu | Fitness Creator")' },
      { field: 'Account Category', status: 'ok', detail: 'Set to "Creator" — correct for algorithmic classification' },
      { field: 'Verified Status', status: 'warn', detail: 'Account not verified. Verification improves trust signals.' },
    ]},
    { section: 'Bio & Keywords', items: [
      { field: 'Bio Keywords', status: 'err', detail: 'CRITICAL: Bio has 0 of your 3 target keywords. Instagram indexes bio text for search.' },
      { field: 'Bio Length', status: 'ok', detail: '148/150 characters used — good utilisation' },
      { field: 'Link in Bio', status: 'ok', detail: 'Active link detected. Use a link aggregator for multiple destinations.' },
      { field: 'Call to Action', status: 'warn', detail: 'No clear CTA in bio. Add "↓ Free workout guide" or similar.' },
      { field: 'Story Highlights', status: 'err', detail: 'No story highlights active. Highlights signal account authority to the algorithm.' },
    ]},
    { section: 'Content Signals', items: [
      { field: 'Posting Frequency', status: 'warn', detail: '3 posts/week detected. Target: 4+ to maintain topic cluster membership.' },
      { field: 'Content Originality', status: 'ok', detail: 'No watermarked or duplicate content in last 30 posts.' },
      { field: 'Reels vs Static Ratio', status: 'ok', detail: '68% Reels — good. Reels drive discovery, carousels drive engagement.' },
      { field: 'Hashtag Consistency', status: 'err', detail: '3 banned hashtags found in recent posts (#viral, #f4f, #likeforlike). Remove immediately.' },
      { field: 'Alt Text Usage', status: 'err', detail: 'Only 2% of posts have alt text. This is a critical SEO miss. Enable for all posts.' },
    ]},
  ];

  const statusBg = { ok: 'bg-[#ebfbf0] border-[#22c55e] text-[#166534]', warn: 'bg-[#fffbeb] border-[#f59e0b] text-[#92400e]', err: 'bg-[#fef2f2] border-[#ef4444] text-[#991b1b]' };
  const StatusIcon = ({ s }: { s: string }) => s === 'ok' ? <CheckCircle2 className="h-3 w-3 inline mr-1" /> : s === 'warn' ? <AlertTriangle className="h-3 w-3 inline mr-1" /> : <XCircle className="h-3 w-3 inline mr-1" />;

  const allItems = sections.flatMap(s => s.items);
  const okCount = allItems.filter(i => i.status === 'ok').length;
  const overallScore = Math.round((okCount / allItems.length) * 100);

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
          {sections.map((sec, si) => (
            <div key={si}>
              <div className="p-3 sm:p-[14px_24px] border-b-2 border-b-[var(--black)] bg-[var(--black)] flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-[2px] text-white">{sec.section}</span>
                <span className="text-[10px] font-bold text-[#888]">{sec.items.filter(i => i.status === 'ok').length}/{sec.items.length} passed</span>
              </div>
              {sec.items.map((item, ii) => (
                <div key={ii} className="flex items-start gap-3 sm:gap-4 p-3 sm:p-[14px_24px] border-b border-b-[#eaeaea]">
                  <span className={`text-[11px] font-bold px-2 py-0.5 border-2 shrink-0 mt-0.5 flex items-center gap-1 ${statusBg[item.status as keyof typeof statusBg]}`}>
                    <StatusIcon s={item.status} />{item.status.toUpperCase()}
                  </span>
                  <div>
                    <div className="text-sm font-bold mb-0.5">{item.field}</div>
                    <div className="text-xs text-[#555] leading-relaxed">{item.detail}</div>
                  </div>
                </div>
              ))}
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
          <div className="p-4 sm:p-5 mt-auto pb-6 sm:pb-8">
            <button className="w-full btn btn-red justify-center py-3 text-sm font-bold">Fix Issues Now →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
