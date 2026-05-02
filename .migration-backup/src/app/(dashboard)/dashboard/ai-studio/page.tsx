/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";

import Link from "next/link";
import { useState } from "react";
type Idea = {
  score: number;
  title: string;
  hook: string;
  tags: string[];
  format: string;
};

export default function AiStudioPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [niche, setNiche] = useState("Fitness / Home Workouts");
  const [platform, setPlatform] = useState("Instagram (Reels)");
  const [style, setStyle] = useState("Educational");
  const [keywords, setKeywords] = useState("");

  const [ideas, setIdeas] = useState<Idea[]>([
    { score: 92, title: '"5 arm moves that hit EVERY angle (no equipment)"', hook: 'This gets DMs. Lead with the result, not the exercise.', tags: ['ig'], format: 'Reel' },
    { score: 88, title: '"The one LinkedIn mistake killing your reach in 2026"', hook: 'Controversy + specificity = depth score gold.', tags: ['li'], format: 'Long-form Post' },
    { score: 86, title: '"Hot take: the X algorithm rewards this one behaviour 150x more than likes"', hook: 'Use the +75 reply weight as your hook. Cite the source.', tags: ['x'], format: 'Thread' },
    { score: 83, title: '"What 6 months of daily Instagram posting taught me (brutal truth)"', hook: 'Personal transformation + data = DM-worthy content.', tags: ['ig', 'li'], format: 'Carousel' },
    { score: 79, title: '"3 hashtags you\'re using that are banned on Instagram right now"', hook: 'Fear + utility. Creators WILL DM this to others.', tags: ['ig'], format: 'Reel / Carousel' },
  ]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche, platform, style, keywords })
      });
      if(!res.ok) throw new Error("Failed to generate");
      const data = await res.json();
      if(data.ideas) {
        const platCode = platform.toLowerCase().includes('linkedin') ? 'li' : platform.toLowerCase().includes('x') ? 'x' : 'ig';
        const mappedIdeas = data.ideas.map((i: any) => ({
          ...i,
          tags: [platCode],
          format: style
        }));
        setIdeas(mappedIdeas);
      }
    } catch(err) {
      console.error(err);
      alert("Failed to generate ideas. Please try again.");
    }
    setIsGenerating(false);
  };

  const savedIdeas = [
    { title: '"Why your IG reach dropped 40%"', score: 85, plat: 'ig' },
    { title: '"LinkedIn algorithm cheat sheet"', score: 88, plat: 'li' },
    { title: '"Thread: X engagement weights"', score: 91, plat: 'x' },
  ];

  const getPlatformColors = (plat: string) => {
    switch (plat) {
      case 'ig': return 'bg-[#fdf4ff] border-[#d946ef] text-[#a21caf]';
      case 'li': return 'bg-[#eff6ff] border-[#3b82f6] text-[#1d4ed8]';
      case 'x': return 'bg-[#f3f4f6] border-[#111] text-[#000]';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  return (
    <div className="page-transition min-h-screen flex flex-col bg-[var(--bg)]">
      {/* Header */}
      <div className="page-header border-b-2 border-b-[var(--black)] p-[24px_32px] flex items-center justify-between flex-wrap gap-4">
        <div className="page-title-group">
          <div className="page-kicker text-[10px] text-[var(--red)] uppercase tracking-[2px] font-bold mb-1">Pre-scored content ideas, daily</div>
          <div className="d4 text-[40px] leading-none uppercase" style={{ fontFamily: 'var(--font-d)' }}>AI Content Studio</div>
        </div>
        <div className="flex gap-2 items-center">
          <button className="btn btn-outline btn-sm font-bold text-xs uppercase bg-white">Regenerate Ideas</button>
          <button className="btn btn-red btn-sm font-bold text-xs uppercase px-6">+ Create Brief</button>
        </div>
      </div>

      <div className="flex flex-1 max-md:flex-col">
        {/* Ideas List Main Column */}
        <div className="flex-1 flex flex-col border-r-2 border-[var(--black)] max-md:border-r-0 max-md:border-b-2 bg-[#f9f9f9]">
          <div className="p-[14px_20px] border-b-2 border-[var(--black)] flex items-center justify-between bg-[var(--black)]">
            <span className="text-[11px] font-bold uppercase tracking-[2px] text-[#aaa]">Generated Content Ideas</span>
            <span className="text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 border border-[#4ade80] text-[#4ade80]">{ideas.length} / 5 Generated</span>
          </div>
          <div className="p-6 flex flex-col gap-6 w-full max-w-[800px] mx-auto">
            {ideas.map((idea, i) => (
              <div key={i} className="border-2 border-[var(--black)] shadow-[4px_4px_0px_var(--black)] bg-white p-5 flex flex-col">
                <div className="flex flex-col md:flex-row gap-4 justify-between border-b border-[#eaeaea] pb-5 mb-5">
                  <div className="flex-1">
                    <div className="flex gap-2 mb-3 items-center flex-wrap">
                      {idea.tags.map((t, idx) => (
                        <span key={idx} className={`text-[9px] font-bold uppercase tracking-wider px-[6px] py-[1px] border ${getPlatformColors(t)}`}>
                          {t}
                        </span>
                      ))}
                      <span className="text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 border border-[var(--black)] bg-[var(--black)] text-white">
                        {idea.format}
                      </span>
                    </div>
                    <div className="text-[20px] font-bold text-[var(--black)] leading-snug mb-2">{idea.title}</div>
                    <div className="text-[13px] font-bold text-[#666] leading-relaxed">
                      <span className="text-[var(--red)] uppercase tracking-wider text-[10px] mr-2">SEO HOOK:</span>
                      {idea.hook}
                    </div>
                  </div>
                  <div className="text-center md:pl-6 md:border-l border-[#eaeaea] flex flex-col justify-center items-center min-w-[100px]">
                    <div className="text-[44px] leading-none text-[#16a34a] tracking-[-2px]" style={{ fontFamily: 'var(--font-d)' }}>{idea.score}</div>
                    <div className="text-[10px] font-bold uppercase tracking-wide text-[#888] mt-1">/ 100 SEO </div>
                  </div>
                </div>
                <div className="flex gap-3 flex-wrap">
                  <button className="btn btn-red btn-sm font-bold text-xs uppercase tracking-wide px-5">Use This Idea</button>
                  <button className="btn btn-outline btn-sm font-bold text-xs uppercase tracking-wide bg-[#f4f4f4]">Expand with AI</button>
                  <button className="btn btn-outline btn-sm font-bold text-xs uppercase tracking-wide bg-[#f4f4f4]">Schedule →</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel / Interactive Brief */}
        <div className="w-[320px] max-md:w-full bg-white flex flex-col shrink-0">
          <div className="p-5 border-b-2 border-b-[var(--black)]">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-5 h-[3px] bg-[var(--red)]" />
              <span className="text-[12px] font-bold tracking-[2px] uppercase text-[var(--red)]">Content Brief</span>
            </div>
            <div className="border-2 border-[var(--black)] p-4 bg-white shadow-[2px_2px_0px_var(--black)] flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-[1px] text-[#555]">Your Niche</label>
                <input 
                  className="input h-10 px-3 text-sm font-bold text-[var(--black)] border-2 border-[#eaeaea] focus:border-[var(--red)] outline-none" 
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-[1px] text-[#555]">Target Platform</label>
                <select 
                  className="input h-10 px-3 text-sm font-bold text-[var(--black)] border-2 border-[#eaeaea] focus:border-[var(--red)] outline-none cursor-pointer"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                >
                  <option>Instagram (Reels)</option>
                  <option>LinkedIn</option>
                  <option>X / Twitter</option>
                  <option>All Platforms</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-[1px] text-[#555]">Content Style</label>
                <select 
                  className="input h-10 px-3 text-sm font-bold text-[var(--black)] border-2 border-[#eaeaea] focus:border-[var(--red)] outline-none cursor-pointer"
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                >
                  <option>Educational</option>
                  <option>Controversial / Hot Take</option>
                  <option>Personal Story</option>
                  <option>Tutorial</option>
                </select>
              </div>
              <div className="flex flex-col gap-2 mb-2">
                <label className="text-[10px] font-bold uppercase tracking-[1px] text-[#555]">Keywords to Target</label>
                <input 
                  className="input h-10 px-3 text-sm font-bold text-[var(--black)] border-2 border-[#eaeaea] focus:border-[var(--red)] outline-none" 
                  placeholder="e.g. arm workout, home fitness" 
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                />
              </div>
              <button 
                className="btn btn-red w-full font-bold text-xs uppercase tracking-wide justify-center h-11"
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? "Generating..." : "Generate 5 Ideas →"}
              </button>
            </div>
          </div>

          <div className="p-5 flex-1 bg-[#f8f8f8]">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-5 h-[3px] bg-[var(--black)]" />
              <span className="text-[11px] font-bold tracking-[2px] uppercase text-[var(--black)]">Saved Ideas (12)</span>
            </div>
            <div className="flex flex-col">
              {savedIdeas.map((s, i) => (
                <div key={i} className="flex gap-3 items-center py-3 border-b border-[#eaeaea] cursor-pointer hover:bg-white px-2 -mx-2 transition-colors">
                  <span className={`text-[8px] font-bold uppercase tracking-wider px-[4px] py-[1px] border shrink-0 ${getPlatformColors(s.plat)}`}>
                    {s.plat}
                  </span>
                  <div className="flex-1 text-[11px] font-bold text-[var(--black)] truncate">{s.title}</div>
                  <span className="text-[18px] leading-none text-[#16a34a] font-bold tracking-[-1px] shrink-0" style={{ fontFamily: 'var(--font-d)' }}>{s.score}</span>
                </div>
              ))}
            </div>
            <button className="btn btn-outline btn-sm w-full font-bold text-[10px] uppercase tracking-wide justify-center mt-6 bg-white">View All Saved →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
