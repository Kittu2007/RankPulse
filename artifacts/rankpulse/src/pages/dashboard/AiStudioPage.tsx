/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { aiComplete, hasAiKey } from "@/lib/nvidia";
import { saveIdea, getSavedIdeas, removeSavedIdea, type SavedIdea } from "@/lib/storage";
import { Bookmark, BookmarkCheck, Trash2 } from "lucide-react";

type Idea = { score: number; title: string; hook: string; tags: string[]; format: string; };

export default function AiStudioPage() {
  const [, navigate] = useLocation();
  const [isGenerating, setIsGenerating] = useState(false);
  const [niche, setNiche] = useState("Fitness / Home Workouts");
  const [platform, setPlatform] = useState("Instagram (Reels)");
  const [style, setStyle] = useState("Educational");
  const [savedIdeas, setSavedIdeas] = useState<SavedIdea[]>(() => getSavedIdeas());
  const [activeTab, setActiveTab] = useState<'generate' | 'saved'>('generate');

  const [ideas, setIdeas] = useState<Idea[]>([
    { score: 92, title: '"5 arm moves that hit EVERY angle (no equipment)"', hook: 'This gets DMs. Lead with the result, not the exercise.', tags: ['ig'], format: 'Reel' },
    { score: 88, title: '"The one LinkedIn mistake killing your reach in 2026"', hook: 'Controversy + specificity = depth score gold.', tags: ['li'], format: 'Long-form Post' },
    { score: 86, title: '"Hot take: the X algorithm rewards this one behaviour 150x more than likes"', hook: 'Use the +75 reply weight as your hook. Cite the source.', tags: ['x'], format: 'Thread' },
    { score: 83, title: '"What 6 months of daily Instagram posting taught me (brutal truth)"', hook: 'Personal transformation + data = DM-worthy content.', tags: ['ig', 'li'], format: 'Carousel' },
    { score: 79, title: '"3 hashtags you\'re using that are banned on Instagram right now"', hook: 'Fear + utility. Creators WILL DM this to others.', tags: ['ig'], format: 'Reel / Carousel' },
  ]);

  const handleGenerate = async () => {
    setIsGenerating(true);

    if (!hasAiKey()) {
      const platCode = platform.toLowerCase().includes('linkedin') ? 'li' : platform.toLowerCase().includes('x') ? 'x' : 'ig';
      setIdeas([
        { score: 88, title: `"${niche}: The ${style} guide nobody tells you"`, hook: "Lead with data or transformation. Use numbers in the first 3 words.", tags: [platCode], format: style },
        { score: 82, title: `"Why most ${niche} content fails in 2026"`, hook: "Controversy + specificity = depth score gold.", tags: [platCode], format: style },
        { score: 78, title: `"${style} ${niche} breakdown — algorithm approved"`, hook: "Platform-specific format signals. Cite the source.", tags: [platCode], format: style },
        { score: 74, title: `"5 ${niche} mistakes killing your ${platform} reach"`, hook: "Fear + utility drives DM shares.", tags: [platCode], format: style },
        { score: 70, title: `"Hot take: ${niche} creators are doing this wrong"`, hook: "Personal transformation + data = DM-worthy content.", tags: [platCode], format: style },
      ]);
      setIsGenerating(false);
      toast.success("Ideas generated (template mode)");
      return;
    }

    try {
      const raw = await aiComplete([
        {
          role: "system",
          content: `You are a social media SEO expert. Generate high-performance, pre-scored content ideas for ${platform}. 
Each idea must include:
1. title: A punchy headline using a "Curiosity Gap" or "Negative Hook".
2. hook: A specific explanation of why this works for the algorithm (e.g., "Dwell time anchor", "Shareability multiplier").
3. score: A realistic SEO score from 85-98 based on current platform trends.

Return ONLY a JSON array with these objects. No other text.`,
        },
        {
          role: "user",
          content: `Generate 5 ${style} content ideas for niche: "${niche}" on ${platform}. Return JSON array only.`,
        },
      ], { reasoning_effort: "high" });

      const match = raw.match(/\[.*\]/s);
      if (match) {
        const parsed = JSON.parse(match[0]);
        const platCode = platform.toLowerCase().includes('linkedin') ? 'li' : platform.toLowerCase().includes('x') ? 'x' : 'ig';
        setIdeas(parsed.map((i: any) => ({ ...i, tags: [platCode], format: style })));
        toast.success("Ideas generated!");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(`Failed to generate ideas: ${err.message}`);
    }
    setIsGenerating(false);
  };

  const handleSaveIdea = (idea: Idea) => {
    const saved: SavedIdea = {
      id: Date.now(),
      score: idea.score,
      title: idea.title,
      hook: idea.hook,
      tags: idea.tags,
      format: idea.format,
      saved_at: new Date().toISOString(),
    };
    saveIdea(saved);
    setSavedIdeas(getSavedIdeas());
    toast.success("Idea saved!");
  };

  const handleRemoveSavedIdea = (id: number) => {
    removeSavedIdea(id);
    setSavedIdeas(getSavedIdeas());
    toast.success("Idea removed");
  };

  const handleUseIdea = (idea: Idea) => {
    // Pre-fill the analyzer with this idea's title/hook as caption text
    const text = `${idea.title.replace(/"/g, '')}\n\n${idea.hook}`;
    localStorage.setItem("rp_analyzer_prefill", text);
    navigate("/dashboard/analyzer");
    toast.success("Idea sent to Analyser — score it!");
  };

  const isIdeaSaved = (title: string) => savedIdeas.some(s => s.title === title);

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
      <div className="page-header flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
        <div>
          <div className="page-kicker">Pre-scored content ideas, daily</div>
          <div className="d4">AI Content Studio</div>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex border-2 border-[var(--black)]">
            <button className={`px-3 py-1.5 text-xs font-bold ${activeTab === 'generate' ? 'bg-[var(--black)] text-white' : 'bg-white'}`}
              onClick={() => setActiveTab('generate')}>Generate</button>
            <button className={`px-3 py-1.5 text-xs font-bold border-l-2 border-[var(--black)] ${activeTab === 'saved' ? 'bg-[var(--black)] text-white' : 'bg-white'}`}
              onClick={() => setActiveTab('saved')}>Saved ({savedIdeas.length})</button>
          </div>
          {activeTab === 'generate' && (
            <button className="btn btn-outline btn-sm font-bold text-xs uppercase bg-white" onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating ? "Generating..." : "Regenerate Ideas"}
            </button>
          )}
        </div>
      </div>

      {/* Main layout — stacks on mobile, side-by-side on md+ */}
      <div className="flex flex-col-reverse md:flex-row flex-1">
        {/* Ideas list */}
        <div className="flex-1 flex flex-col border-t-2 md:border-t-0 md:border-r-2 border-[var(--black)] bg-[#f9f9f9]">
          <div className="p-3 sm:p-[14px_20px] border-b-2 border-[var(--black)] flex items-center justify-between bg-[var(--black)]">
            <span className="text-[11px] font-bold uppercase tracking-[2px] text-[#aaa]">
              {activeTab === 'generate' ? 'Generated Content Ideas' : 'Saved Ideas'}
            </span>
            <span className="text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 border border-[#4ade80] text-[#4ade80]">
              {activeTab === 'generate' ? `${ideas.length} / 5 Generated` : `${savedIdeas.length} Saved`}
            </span>
          </div>
          <div className="p-4 sm:p-6 flex flex-col gap-4 sm:gap-6 w-full max-w-[800px] mx-auto">
            {activeTab === 'generate' ? ideas.map((idea, i) => (
              <div key={i} className="border-2 border-[var(--black)] shadow-[4px_4px_0px_var(--black)] bg-white p-4 sm:p-5 flex flex-col">
                <div className="flex flex-col sm:flex-row gap-4 justify-between border-b border-[#eaeaea] pb-4 mb-4">
                  <div className="flex-1">
                    <div className="flex gap-2 mb-3 items-center flex-wrap">
                      {idea.tags.map((t, idx) => (
                        <span key={idx} className={`text-[9px] font-bold uppercase tracking-wider px-[6px] py-[1px] border ${getPlatformColors(t)}`}>{t}</span>
                      ))}
                      <span className="text-[9px] font-bold uppercase tracking-wider px-[6px] py-[1px] border border-[#ccc] text-[#888] bg-[#f0f0f0]">{idea.format}</span>
                    </div>
                    <div className="text-[15px] sm:text-[16px] font-bold text-[var(--black)] mb-2 leading-snug">{idea.title}</div>
                    <div className="text-[12px] text-[#555] italic">{idea.hook}</div>
                  </div>
                  <div className="sm:text-right shrink-0 flex sm:flex-col items-center sm:items-end gap-2">
                    <div className="text-[42px] sm:text-[48px] text-[var(--red)] font-black leading-none" style={{ fontFamily: 'var(--font-d)' }}>{idea.score}</div>
                    <div className="text-[10px] text-[#888] font-bold uppercase tracking-[1px]">SEO Score</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button className="btn btn-red btn-sm px-5 text-xs" onClick={() => handleUseIdea(idea)}>Use This Idea →</button>
                  <button className={`btn btn-outline btn-sm px-5 text-xs flex items-center gap-1 ${isIdeaSaved(idea.title) ? 'bg-[#ebfbf0] border-[#22c55e] text-[#166534]' : ''}`}
                    onClick={() => handleSaveIdea(idea)} disabled={isIdeaSaved(idea.title)}>
                    {isIdeaSaved(idea.title) ? <><BookmarkCheck className="h-3 w-3" /> Saved</> : <><Bookmark className="h-3 w-3" /> Save</>}
                  </button>
                </div>
              </div>
            )) : savedIdeas.length === 0 ? (
              <div className="text-center py-12 text-[#888]">
                <p className="text-sm font-bold mb-2">No saved ideas yet</p>
                <p className="text-xs">Generate ideas and click "Save" to keep them here.</p>
              </div>
            ) : savedIdeas.map((idea) => (
              <div key={idea.id} className="border-2 border-[var(--black)] shadow-[4px_4px_0px_var(--black)] bg-white p-4 sm:p-5 flex flex-col">
                <div className="flex flex-col sm:flex-row gap-4 justify-between border-b border-[#eaeaea] pb-4 mb-4">
                  <div className="flex-1">
                    <div className="flex gap-2 mb-3 items-center flex-wrap">
                      {idea.tags.map((t, idx) => (
                        <span key={idx} className={`text-[9px] font-bold uppercase tracking-wider px-[6px] py-[1px] border ${getPlatformColors(t)}`}>{t}</span>
                      ))}
                      <span className="text-[9px] font-bold uppercase tracking-wider px-[6px] py-[1px] border border-[#ccc] text-[#888] bg-[#f0f0f0]">{idea.format}</span>
                    </div>
                    <div className="text-[15px] sm:text-[16px] font-bold text-[var(--black)] mb-2 leading-snug">{idea.title}</div>
                    <div className="text-[12px] text-[#555] italic">{idea.hook}</div>
                  </div>
                  <div className="sm:text-right shrink-0 flex sm:flex-col items-center sm:items-end gap-2">
                    <div className="text-[42px] sm:text-[48px] text-[var(--red)] font-black leading-none" style={{ fontFamily: 'var(--font-d)' }}>{idea.score}</div>
                    <div className="text-[10px] text-[#888] font-bold uppercase tracking-[1px]">SEO Score</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button className="btn btn-red btn-sm px-5 text-xs" onClick={() => handleUseIdea(idea)}>Use This Idea →</button>
                  <button className="btn btn-outline btn-sm px-5 text-xs flex items-center gap-1 text-[var(--red)]" onClick={() => handleRemoveSavedIdea(idea.id)}>
                    <Trash2 className="h-3 w-3" /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Brief Generator — full width on mobile, sidebar on md+ */}
        <div className="w-full md:w-[280px] shrink-0 bg-white border-b-2 md:border-b-0 md:border-l-0 border-[var(--black)] flex flex-col">
          <div className="p-3 sm:p-[14px_20px] border-b-2 border-[var(--black)] bg-[#fafafa]">
            <span className="text-[11px] font-bold uppercase tracking-[2px] text-[var(--black)]">Content Brief</span>
          </div>
          <div className="p-4 sm:p-5 flex flex-col gap-4 sm:gap-5 sm:flex-1">
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
