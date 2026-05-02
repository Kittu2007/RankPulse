"use client";

import { useState } from "react";

export default function ProfileAuditPage() {
  const [activePlatform, setActivePlatform] = useState('Instagram');
  const platforms = ['Instagram', 'LinkedIn', 'X / Twitter'];

  const sections = [
    {
      section: 'Profile Basics', items: [
        { field: 'Username', status: 'ok', detail: '@yourhandle — clean, brandable, searchable' },
        { field: 'Profile Photo', status: 'ok', detail: 'Professional photo detected. High contrast, face visible.' },
        { field: 'Display Name', status: 'warn', detail: 'No keywords in display name. Add your niche (e.g. "Kittu | Fitness Creator")' },
        { field: 'Account Category', status: 'ok', detail: 'Set to "Creator" — correct for algorithmic classification' },
        { field: 'Verified Status', status: 'warn', detail: 'Account not verified. Verification improves trust signals.' },
      ]
    },
    {
      section: 'Bio & Keywords', items: [
        { field: 'Bio Keywords', status: 'err', detail: 'CRITICAL: Bio has 0 of your 3 target keywords. Instagram indexes bio text for search.' },
        { field: 'Bio Length', status: 'ok', detail: '148/150 characters used — good utilisation' },
        { field: 'Link in Bio', status: 'ok', detail: 'Active link detected. Use a link aggregator for multiple destinations.' },
        { field: 'Call to Action', status: 'warn', detail: 'No clear CTA in bio. Add "↓ Free workout guide" or similar.' },
        { field: 'Story Highlights', status: 'err', detail: 'No story highlights active. Highlights signal account authority to the algorithm.' },
      ]
    },
    {
      section: 'Content Signals', items: [
        { field: 'Posting Frequency', status: 'warn', detail: '3 posts/week detected. Target: 4+ to maintain topic cluster membership.' },
        { field: 'Content Originality', status: 'ok', detail: 'No watermarked or duplicate content in last 30 posts.' },
        { field: 'Reels vs Static Ratio', status: 'ok', detail: '68% Reels — good. Reels drive discovery, carousels drive engagement.' },
        { field: 'Hashtag Consistency', status: 'err', detail: '3 banned hashtags found in recent posts (#viral, #f4f, #likeforlike). Remove immediately.' },
        { field: 'Alt Text Usage', status: 'err', detail: 'Only 2% of posts have alt text. This is a critical SEO miss. Enable for all posts.' },
      ]
    },
  ];

  return (
    <div className="page-transition min-h-screen flex flex-col bg-[var(--bg)]">
      {/* Header */}
      <div className="page-header border-b-2 border-b-[var(--black)] p-[24px_32px] flex items-center justify-between">
        <div className="page-title-group">
          <div className="page-kicker text-[10px] text-[var(--red)] uppercase tracking-[2px] font-bold mb-1">Is your profile working for you?</div>
          <div className="d4 text-[40px] leading-none uppercase" style={{ fontFamily: 'var(--font-d)' }}>Profile SEO Auditor</div>
        </div>
        <div className="flex border-2 border-[var(--black)] bg-white">
          {platforms.map((p, i) => (
            <button
              key={i}
              onClick={() => setActivePlatform(p)}
              className={`px-4 py-2 text-xs font-bold transition-colors border-r-2 border-[var(--black)] last:border-r-0 ${
                activePlatform === p ? 'bg-[var(--black)] text-white' : 'bg-transparent text-[var(--black)] hover:bg-[#fafafa]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="p-[32px] bg-[var(--bg)] flex-1">
        {/* Overall Score */}
        <div className="grid grid-cols-[auto_1fr] max-md:grid-cols-1 gap-5 border-2 border-[var(--black)] p-[20px] mb-[16px] bg-[var(--black)] shadow-[4px_4px_0px_var(--red)]">
          <div className="flex items-center gap-5">
            <div className="w-[80px] h-[80px] rounded-full border-4 border-[var(--red)] flex flex-col items-center justify-center bg-white">
              <div className="text-[32px] leading-none text-[var(--red)] tracking-[-1px]" style={{ fontFamily: 'var(--font-d)' }}>72</div>
              <div className="text-[9px] font-bold text-[#888] uppercase tracking-wide">/ 100</div>
            </div>
            <div>
              <div className="text-[14px] leading-none tracking-[1px] text-white uppercase mb-1" style={{ fontFamily: 'var(--font-d)' }}>{activePlatform.toUpperCase()} PROFILE</div>
              <div className="text-[12px] font-bold text-[#888] mb-2">@yourhandle · Creator account · 12.4K followers</div>
              <div className="flex gap-2">
                <span className="text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 border border-[#ef4444] bg-[#fee2e2] text-[#991b1b]">5 Issues</span>
                <span className="text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 border border-[#f59e0b] bg-[#fef3c7] text-[#92400e]">3 Warnings</span>
                <span className="text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 border border-[#4ade80] text-[#4ade80]">8 Good</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-start md:justify-end gap-3 max-md:mt-4">
            <button className="btn btn-red px-4 font-bold text-xs uppercase tracking-wide">Auto-Fix with AI →</button>
            <button className="px-4 py-2 text-xs font-bold uppercase tracking-wide text-white border-2 border-transparent hover:border-[#333] transition-colors">Export Report</button>
          </div>
        </div>

        {/* Profile Fields */}
        <div className="flex flex-col gap-6">
          {sections.map((s, idx) => (
            <div key={idx} className="border-2 border-[var(--black)] bg-white shadow-[4px_4px_0px_var(--black)]">
              <div className="p-[16px_20px] border-b-2 border-b-[var(--black)] bg-[#fafafa] flex justify-between items-center">
                <div className="text-[20px] leading-none uppercase text-[var(--black)]" style={{ fontFamily: 'var(--font-d)' }}>{s.section}</div>
                <div className="flex gap-2">
                  {['ok', 'warn', 'err'].map((t) => {
                    const count = s.items.filter(i => i.status === t).length;
                    if (count === 0) return null;
                    const styleClass = t === 'ok' ? 'bg-[#dcfce7] text-[#166534] border-[#22c55e]'
                      : t === 'warn' ? 'bg-[#fef3c7] text-[#92400e] border-[#f59e0b]'
                      : 'bg-[#fee2e2] text-[#991b1b] border-[#ef4444]';
                    return (
                      <span key={t} className={`text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 border ${styleClass}`}>
                        {count} {t === 'ok' ? 'Good' : t === 'warn' ? 'Warn' : 'Issue'}
                      </span>
                    );
                  })}
                </div>
              </div>
              <div>
                {s.items.map((item, i) => (
                  <div key={i} className="p-[16px_20px] border-b border-[#eaeaea] last:border-b-0 flex items-start gap-4 hover:bg-[#fafafa] transition-colors">
                    <div className={`mt-0.5 w-6 h-6 flex items-center justify-center border-[2px] font-bold text-sm ${
                      item.status === 'ok' ? 'border-[#22c55e] text-[#16a34a] bg-[#dcfce7]' :
                      item.status === 'warn' ? 'border-[#f59e0b] text-[#d97706] bg-[#fef3c7]' :
                      'border-[#ef4444] text-[#dc2626] bg-[#fee2e2]'
                    }`}>
                      {item.status === 'ok' ? '✓' : item.status === 'warn' ? '!' : '✗'}
                    </div>
                    <div className="flex-1">
                      <div className="text-[13px] font-bold text-[var(--black)] mb-1">{item.field}</div>
                      <div className={`text-[12px] font-bold ${item.status === 'err' ? 'text-[var(--red)]' : 'text-[#666]'}`}>{item.detail}</div>
                    </div>
                    {item.status !== 'ok' && (
                      <button className="btn btn-outline btn-sm bg-white font-bold text-xs">Fix →</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
