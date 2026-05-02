/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

type Idea = { score: number; title: string; hook: string; tags: string[]; format: string; };

export default function AiStudioPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [niche, setNiche] = useState("Fitness / Home Workouts");
  const [platform, setPlatform] = useState("Instagram (Reels)");
  const [style, setStyle] = useState("Educational");

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
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche, platform, style })
      });
      if (!res.ok) throw new Error("Failed to generate");
      const data = await res.json();
      if (data.ideas) {
        const platCode = platform.toLowerCase().includes('linkedin') ? 'li' : platform.toLowerCase().includes('x') ? 'x' : 'ig';
        setIdeas(data.ideas.map((i: any) => ({ ...i, tags: [platCode], format: style })));
      }
    } catch (err) { console.error(err); alert("Failed to generate ideas."); }
    setIsGenerating(false);
  };

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
      <div className="page-header flex items-center justify-between flex-wrap gap-4">
        <div><div className="page-kicker">Pre-scored content ideas, daily</div><div className="d4">AI Content Studio</div></div>
        <div className="flex gap-2 items-center">
          <button className="btn btn-outline btn-sm font-bold text-xs uppercase bg-white">Regenerate Ideas</button>
          <button className="btn btn-red btn-sm font-bold text-xs uppercase px-6">+ Create Brief</button>
        </div>
      </div>

      <div className="flex flex-1 max-md:flex-col">
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
                        <span key={idx} className={`text-[9px] font-bold uppercase tracking-wider px-[6px] py-[1px] border ${getPlatformColors(t)}`}>{t}</span>
                      ))}
                      <span className="text-[9px] font-bold uppercase tracking-wider px-[6px] py-[1px] border border-[#ccc] text-[#888] bg-[#f0f0f0]">{idea.format}</span>
                    </div>
                    <div className="text-[16px] font-bold text-[var(--black)] mb-2 leading-snug">{idea.title}</div>
                    <div className="text-[12px] text-[#555] italic">{idea.hook}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[48px] text-[var(--red)] font-black leading-none" style={{ fontFamily: 'var(--font-d)' }}>{idea.score}</div>
                    <div className="text-[10px] text-[#888] font-bold uppercase tracking-[1px]">SEO Score</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-red btn-sm px-5 text-xs">Use This Idea →</button>
                  <button className="btn btn-outline btn-sm px-5 text-xs">Save</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Brief Generator */}
        <div className="w-[280px] max-md:w-full shrink-0 bg-white border-l-2 border-[var(--black)] max-md:border-l-0 max-md:border-t-2 flex flex-col">
          <div className="p-[14px_20px] border-b-2 border-[var(--black)] bg-[#fafafa]">
            <span className="text-[11px] font-bold uppercase tracking-[2px] text-[var(--black)]">Content Brief</span>
          </div>
          <div className="p-5 flex flex-col gap-5 flex-1">
            <div>
              <label className="label-sm mb-2 block">Your Niche</label>
              <input className="input text-xs" value={niche} onChange={(e) => setNiche(e.target.value)} />
            </div>
            <div>
              <label className="label-sm mb-2 block">Platform</label>
              <select className="input text-xs cursor-pointer" value={platform} onChange={(e) => setPlatform(e.target.value)}>
                <option>Instagram (Reels)</option><option>LinkedIn</option><option>X / Twitter</option>
              </select>
            </div>
            <div>
              <label className="label-sm mb-2 block">Content Style</label>
              <select className="input text-xs cursor-pointer" value={style} onChange={(e) => setStyle(e.target.value)}>
                <option>Educational</option><option>Motivational</option><option>Controversial</option><option>Storytelling</option>
              </select>
            </div>
            <button className="btn btn-red w-full justify-center text-xs" onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating ? "Generating..." : "Generate 5 Ideas →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
