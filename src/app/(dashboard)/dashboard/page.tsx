"use client";

import Link from "next/link";

export default function DashboardHome() {
  const platforms = [
    {
      name: 'Instagram', score: 82, color: 'var(--ig)', tagColor: 'bg-[#d946ef] border-[#a21caf]',
      change: '+3 this week',
      params: [{ l: 'Watch Time', v: 82, c: 'hi' }, { l: 'DM Sends', v: 61, c: 'md' }, { l: 'Caption KW', v: 79, c: 'hi' }, { l: 'Alt Text', v: 38, c: 'lo' }]
    },
    {
      name: 'LinkedIn', score: 74, color: 'var(--li)', tagColor: 'bg-[#3b82f6] border-[#1d4ed8]',
      change: '+1 this week',
      params: [{ l: 'Depth Score', v: 88, c: 'hi' }, { l: 'Headline KW', v: 44, c: 'lo' }, { l: 'Comment Qual', v: 67, c: 'md' }, { l: 'Profile', v: 90, c: 'hi' }]
    },
    {
      name: 'X / Twitter', score: 79, color: '#555', tagColor: 'bg-[#111] border-[#000]',
      change: 'Stable',
      params: [{ l: 'Reply Depth', v: 91, c: 'hi' }, { l: 'RT Velocity', v: 55, c: 'md' }, { l: 'TweepCred', v: 73, c: 'hi' }, { l: 'Link Penalty', v: 0, c: 'lo' }]
    },
  ];

  const penalties = [
    { icon: '✗', type: 'err', plat: 'Instagram', platColor: 'var(--ig)', title: 'External link in caption', desc: 'Caption links suppress Explore reach by 30–50%. Move link to bio or use a Link-in-Bio tool.', link: '/dashboard/analyzer', linkText: 'Fix in Analyser →' },
    { icon: '✗', type: 'err', plat: 'LinkedIn', platColor: 'var(--li)', title: 'Headline missing target keywords', desc: 'Your headline has 0 of your 3 target buyer-intent keywords. Headline KW is the #1 LinkedIn search signal.', link: '/dashboard/profile-audit', linkText: 'Fix in Profile Audit →' },
    { icon: '⚠', type: 'warn', plat: 'X / Twitter', platColor: '#555', title: 'External link in tweet body', desc: 'X penalises links 30–50% reach. Post link in first reply instead.', link: '#', linkText: 'View Guide →' },
  ];

  const recentAnalyses = [
    { text: 'Just dropped a new reel — save this for later...', plat: 'ig', platClass: 'bg-[#d946ef] border-[#a21caf]', score: 74 },
    { text: 'Excited to share this exciting news with my LinkedIn...', plat: 'li', platClass: 'bg-[#3b82f6] border-[#1d4ed8]', score: 58 },
    { text: 'Hot take: the X algorithm is actually predictable if...', plat: 'x', platClass: 'bg-[#111] border-[#000]', score: 88 },
    { text: '5 arm workout moves that hit every angle. No...', plat: 'ig', platClass: 'bg-[#d946ef] border-[#a21caf]', score: 81 },
    { text: 'What I learned from 6 months of daily posting on...', plat: 'li', platClass: 'bg-[#3b82f6] border-[#1d4ed8]', score: 77 },
  ];

  const getStatusColor = (c: string) => {
    if (c === 'hi') return 'bg-[#22c55e]';
    if (c === 'md') return 'bg-[#f59e0b]';
    return 'bg-[var(--red)]';
  };

  const getStatusTextColor = (c: string) => {
    if (c === 'hi') return 'text-[#16a34a]';
    if (c === 'md') return 'text-[#d97706]';
    return 'text-[var(--red)]';
  };

  return (
    <div className="page-transition min-h-screen flex flex-col bg-[var(--bg)]">
      {/* Header */}
      <div className="page-header border-b-2 border-b-[var(--black)] p-[24px_32px] flex items-center justify-between">
        <div className="page-title-group">
          <div className="page-kicker text-[10px] text-[var(--red)] uppercase tracking-[2px] font-bold mb-1">Welcome back, Kittu</div>
          <div className="d4 text-[40px] leading-none uppercase" style={{ fontFamily: 'var(--font-d)' }}>Dashboard Overview</div>
        </div>
        <div className="flex gap-2 items-center">
          <Link href="/dashboard/analyzer" className="btn btn-outline btn-sm font-bold text-xs uppercase px-4">+ Analyse Post</Link>
          <Link href="/dashboard/profile-audit" className="btn btn-red btn-sm font-bold text-xs uppercase px-4">Run Full Scan</Link>
        </div>
      </div>

      {/* METRIC STRIP */}
      <div className="flex flex-wrap border-b-2 border-b-[var(--black)]">
        <div className="flex-1 p-[20px_24px] border-r-2 border-r-[var(--black)] bg-[var(--black)] flex flex-col justify-center min-w-[200px]">
          <div className="text-[48px] text-white leading-none tracking-[-1px] mb-1" style={{ fontFamily: 'var(--font-d)' }}>78.4</div>
          <div className="text-[12px] font-bold uppercase tracking-[1px] text-[#888] mb-1">Overall SEO Score</div>
          <div className="text-[11px] font-bold text-[#4ade80]">↑ +4.2 this week</div>
        </div>
        <div className="flex-1 p-[20px_24px] border-r-2 border-r-[var(--black)] bg-white flex flex-col justify-center min-w-[200px]">
          <div className="text-[48px] text-[var(--red)] leading-none tracking-[-1px] mb-1" style={{ fontFamily: 'var(--font-d)' }}>3</div>
          <div className="text-[12px] font-bold uppercase tracking-[1px] text-[#333] mb-1">Active Penalties</div>
          <div className="text-[11px] font-bold text-[#ef4444]">↓ Needs action</div>
        </div>
        <div className="flex-1 p-[20px_24px] border-r-2 border-r-[var(--black)] bg-[var(--black)] flex flex-col justify-center min-w-[200px]">
          <div className="text-[48px] text-[#4ade80] leading-none tracking-[-1px] mb-1" style={{ fontFamily: 'var(--font-d)' }}>+18%</div>
          <div className="text-[12px] font-bold uppercase tracking-[1px] text-[#888] mb-1">Reach Growth</div>
          <div className="text-[11px] font-bold text-[#4ade80]">↑ vs last week</div>
        </div>
        <div className="flex-1 p-[20px_24px] bg-white flex flex-col justify-center min-w-[200px]">
          <div className="text-[48px] text-[#f59e0b] leading-none tracking-[-1px] mb-1" style={{ fontFamily: 'var(--font-d)' }}>91</div>
          <div className="text-[12px] font-bold uppercase tracking-[1px] text-[#333] mb-1">Keyword Score</div>
          <div className="text-[11px] font-bold text-[#16a34a]">↑ On track</div>
        </div>
      </div>

      {/* PLATFORM SCORES */}
      <div className="grid grid-cols-1 md:grid-cols-3 border-b-2 border-b-[var(--black)] bg-white">
        {platforms.map((p, i) => (
          <div key={i} className={`border-r-[var(--black)] ${i < 2 ? 'border-r-2' : ''} max-md:border-b-2 max-md:border-r-0 max-md:last:border-b-0`}>
            <div className="p-[14px_16px] border-b border-b-[var(--black)] flex justify-between items-center bg-[#fafafa]">
              <span className={`text-[9px] font-bold uppercase tracking-wider px-[6px] py-[2px] border text-white ${p.tagColor}`}>{p.name}</span>
              <div className="text-right">
                <div className="text-[28px] leading-none" style={{ fontFamily: 'var(--font-d)', color: p.color, letterSpacing: '-1px' }}>{p.score}</div>
                <div className="text-[9px] uppercase tracking-wide font-bold text-[#888] mt-1">{p.change}</div>
              </div>
            </div>
            <div className="p-4">
              {p.params.map((m, j) => (
                <div key={j} className="flex items-center gap-3 mb-3 last:mb-0">
                  <span className="text-[11px] font-bold uppercase tracking-[1px] w-[90px]">{m.l}</span>
                  <div className="flex-1 h-[4px] bg-[#e8e4d0] relative">
                    <div className={`absolute left-0 top-0 bottom-0 ${getStatusColor(m.c)}`} style={{ width: m.v + "%" }}></div>
                  </div>
                  <span className={`text-[11px] font-bold w-[45px] text-right ${getStatusTextColor(m.c)}`}>{m.v > 0 ? (m.v + '%') : 'Active ✗'}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* PENALTIES & RECENT */}
      <div className="grid grid-cols-1 md:grid-cols-2 flex-1 border-b-2 border-b-[var(--black)]">
        <div className="border-r-[var(--black)] md:border-r-2 flex flex-col bg-white">
          <div className="p-4 border-b-2 border-b-[var(--black)] bg-[#f8f8f8] flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-5 h-[3px] bg-[var(--red)]" />
              <span className="text-[12px] font-bold tracking-[2px] uppercase">Active Penalties — Fix These</span>
            </div>
            <span className="bg-[#fef2f2] text-[#991b1b] border-[#ef4444] border-2 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide">3 Issues</span>
          </div>
          <div className="flex flex-col">
            {penalties.map((pen, i) => (
              <div key={i} className="flex items-start gap-4 p-4 border-b border-[#eaeaea] last:border-b-0">
                <div className={`text-[12px] font-bold mt-1 px-1.5 py-0.5 border-2 ${pen.type === 'err' ? 'bg-[#fef2f2] text-[#991b1b] border-[#ef4444]' : 'bg-[#fffbeb] text-[#92400e] border-[#f59e0b]'}`}>
                  {pen.icon}
                </div>
                <div className="flex-1">
                  <div className="text-[10px] font-bold uppercase tracking-[1px] mb-1" style={{ color: pen.platColor }}>{pen.plat}</div>
                  <div className="text-sm font-bold mb-1.5">{pen.title}</div>
                  <div className="text-[12px] text-[#555] font-bold leading-snug mb-3">{pen.desc}</div>
                  <Link href={pen.link} className="text-[10px] font-bold bg-[#f4f4f4] hover:bg-[#eaeaea] px-3 py-1.5 uppercase transition-colors">
                    {pen.linkText}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col bg-white">
          <div className="p-4 border-b-2 border-b-[var(--black)] bg-[#f8f8f8] flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-5 h-[3px] bg-[var(--black)]" />
              <span className="text-[12px] font-bold tracking-[2px] uppercase">Recent Analyses</span>
            </div>
            <Link href="/dashboard/analyzer" className="btn btn-outline btn-sm font-bold text-xs">+ New</Link>
          </div>
          <div className="flex flex-col flex-1">
            <div className="flex justify-between items-center px-4 py-2 border-b border-[var(--black)] bg-[var(--black)] text-white text-[9px] font-bold uppercase tracking-[2px]">
              <div className="flex-1">Caption Preview</div>
              <div className="w-[80px]">Platform</div>
              <div className="w-[60px] text-right">Score</div>
            </div>
            {recentAnalyses.map((r, i) => (
              <div key={i} className="flex justify-between items-center px-4 py-3 border-b border-[#eaeaea] hover:bg-[#f8f8f8]">
                <div className="flex-1 text-xs font-bold truncate pr-4 text-[#444]">{r.text}</div>
                <div className="w-[80px]">
                  <span className={`text-[8px] font-bold uppercase tracking-wider px-[5px] py-[2px] border text-white ${r.platClass}`}>
                    {r.plat}
                  </span>
                </div>
                <div className={`w-[60px] text-right text-[22px] tracking-[-1px] ${r.score >= 80 ? 'text-[#16a34a]' : r.score >= 60 ? 'text-[#f59e0b]' : 'text-[var(--red)]'}`} style={{ fontFamily: 'var(--font-d)' }}>
                  {r.score}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
