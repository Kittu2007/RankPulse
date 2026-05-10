import { useState } from "react";
import { toast } from "sonner";
import { aiComplete, hasAiKey, aiOcr } from "@/lib/nvidia";
import { addCompetitor, getCompetitors, removeCompetitor, type TrackedCompetitor } from "@/lib/storage";
import { Plus, Trash2 } from "lucide-react";

interface CompetitorAnalysis {
  handle: string;
  name: string;
  ig: number;
  li: number;
  x: number;
  posts: number;
  eng: string;
  gap: string[];
}

const COMPETITORS_PROMPT = `You are a social media market research expert. Research 3 real-world competitors (or very realistic examples) for a user in the "[NICHE]" niche.
Return ONLY a JSON array with objects:
{
  "handle": "@handle",
  "name": "Display Name",
  "ig": number (0-100),
  "li": number (0-100),
  "x": number (0-100),
  "posts": number (per month),
  "eng": string (e.g. "4.5%"),
  "gap": string[] (3 keywords they rank for)
}
Be specific to the niche.`;

export default function CompetitorsPage() {
  const [comps, setComps] = useState<CompetitorAnalysis[]>(() => {
    try { return JSON.parse(localStorage.getItem('rp_competitor_analysis') || '[]'); }
    catch { return []; }
  });
  const [trackedList, setTrackedList] = useState<TrackedCompetitor[]>(() => getCompetitors());
  const [niche] = useState(() => localStorage.getItem("rp_user_niche") || "Social Media Marketing");
  const [generating, setGenerating] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHandle, setNewHandle] = useState('');
  const [newName, setNewName] = useState('');
  const [newPlatform, setNewPlatform] = useState('instagram');
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedComp, setSelectedComp] = useState<CompetitorAnalysis | null>(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrText, setOcrText] = useState('');

  const gaps = comps.flatMap(c => c.gap.map(kw => ({
    kw,
    comps: comps.filter(cc => cc.gap.includes(kw)).map(cc => cc.handle),
    action: getSuggestion(kw),
  }))).reduce((acc, g) => {
    if (!acc.find(a => a.kw === g.kw)) acc.push(g);
    return acc;
  }, [] as { kw: string; comps: string[]; action: string }[]).slice(0, 5);

  function getSuggestion(kw: string): string {
    if (kw.includes('workout') || kw.includes('fitness')) return 'Add to caption, target IG Reels';
    if (kw.includes('linkedin') || kw.includes('b2b')) return 'Write a LinkedIn article targeting this';
    if (kw.includes('reel') || kw.includes('creator')) return 'Use in hashtag + caption KW';
    return 'High opportunity — start creating content immediately';
  }

  const yourScore = comps.length > 0 ? Math.round(comps.reduce((s, c) => s + Math.max(c.ig, c.li, c.x) * 0.85, 0) / comps.length) : 0;
  const marketAvg = comps.length > 0 ? Math.round(comps.reduce((s, c) => s + (c.ig + c.li + c.x) / (c.ig > 0 ? 1 : 0 + c.li > 0 ? 1 : 0 + c.x > 0 ? 1 : 0), 0) / comps.length) : 0;
  const topScore = comps.reduce((max, c) => Math.max(max, c.ig, c.li, c.x), 0);

  const handleScreenshot = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !hasAiKey()) return;
    setOcrLoading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      const extracted = await aiOcr(base64, file.type).catch(() => '');
      // Parse username from first line if it starts with @
      const lines = extracted.split('\n').filter(Boolean);
      const handle = lines.find(l => l.trim().startsWith('@'));
      if (handle) setNewHandle(handle.trim());
      setOcrText(extracted);
      setOcrLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateComps = async () => {
    setGenerating(true);
    try {
      const raw = await aiComplete([
        { role: "user", content: COMPETITORS_PROMPT.replace('[NICHE]', niche) }
      ], { reasoning_effort: "high" });
      const match = raw.match(/\[.*\]/s);
      if (!match) throw new Error("Invalid AI response");
      const data = JSON.parse(match[0]);
      setComps(data);
      localStorage.setItem('rp_competitor_analysis', JSON.stringify(data));
      toast.success(`Generated ${data.length} competitors for ${niche}`);
    } catch (err: any) {
      toast.error("Generation failed: " + err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleAddCompetitor = async () => {
    if (!newHandle.trim() || !newName.trim()) { toast.error("Fill in all fields."); return; }
    setAnalyzing(true);

    const handle = newHandle.startsWith('@') ? newHandle : `@${newHandle}`;

    // Generate analysis — AI or fallback
    let analysis: CompetitorAnalysis;
    if (hasAiKey()) {
      try {
        const raw = await aiComplete([
          { role: "system", content: "You are a social media competitor analysis expert. Generate realistic scores. Return ONLY a JSON object: {ig: number (0-100), li: number (0-100), x: number (0-100), posts: number, eng: string (like '3.4%'), gap: string[] (2-3 keywords they rank for)}. No other text." },
          { role: "user", content: `Analyze competitor "${newName}" (${handle}) in the ${niche} niche. Return JSON only.` },
        ], { reasoning_effort: "high" });
        const match = raw.match(/\{.*\}/s);
        if (match) {
          const data = JSON.parse(match[0]);
          analysis = { handle, name: newName, ...data };
        } else {
          throw new Error("Could not parse AI response");
        }
      } catch (err: any) {
        console.error("AI Analysis Error:", err);
        analysis = { handle, name: newName, ig: Math.floor(Math.random()*25)+65, li: newPlatform === 'linkedin' ? Math.floor(Math.random()*25)+60 : 0, x: newPlatform === 'x' ? Math.floor(Math.random()*20)+65 : Math.floor(Math.random()*15)+60, posts: Math.floor(Math.random()*30)+15, eng: `${(Math.random()*3+1.5).toFixed(1)}%`, gap: [`${newName.toLowerCase().split(' ')[0]} tips`, `${newPlatform} growth`] };
      }
    } else {
      analysis = { handle, name: newName, ig: Math.floor(Math.random()*25)+65, li: newPlatform === 'linkedin' ? Math.floor(Math.random()*25)+60 : 0, x: newPlatform === 'x' ? Math.floor(Math.random()*20)+65 : Math.floor(Math.random()*15)+60, posts: Math.floor(Math.random()*30)+15, eng: `${(Math.random()*3+1.5).toFixed(1)}%`, gap: [`${newName.toLowerCase().split(' ')[0]} tips`, `${newPlatform} growth`] };
    }

    const nextComps = [...comps, analysis];
    setComps(nextComps);
    localStorage.setItem('rp_competitor_analysis', JSON.stringify(nextComps));
    addCompetitor({ id: Date.now(), handle, name: newName, platform: newPlatform, added_at: new Date().toISOString() });
    setTrackedList(getCompetitors());
    setShowAddModal(false);
    setNewHandle('');
    setNewName('');
    setAnalyzing(false);
    toast.success(`${newName} added to tracking`);
  };

  const handleRemoveCompetitor = (handle: string) => {
    setComps(prev => prev.filter(c => c.handle !== handle));
    const tracked = trackedList.find(t => t.handle === handle);
    if (tracked) { removeCompetitor(tracked.id); setTrackedList(getCompetitors()); }
    toast.success("Competitor removed");
  };

  return (
    <div className="page-transition min-h-screen flex flex-col bg-[var(--bg)]">
      <div className="page-header flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
        <div>
          <div className="page-kicker">See where you stand</div>
          <div className="d4">Competitor Tracker</div>
        </div>
        <button className="btn btn-red px-6 font-bold text-sm self-start sm:self-auto" onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-1" /> Add Competitor
        </button>
      </div>

      {/* Score Banner — wraps on mobile */}
      <div className="bg-[var(--black)] border-b-2 border-b-[var(--black)] p-4 sm:p-[16px_32px] flex flex-wrap items-center gap-4 sm:gap-8">
        <div>
          <div className="text-[10px] font-bold tracking-[2px] uppercase text-[#888] mb-1">Your Score</div>
          <div className="text-[36px] text-[var(--red)] leading-none" style={{ fontFamily: 'var(--font-d)' }}>{yourScore || '78.4'}</div>
        </div>
        <div className="hidden sm:block flex-1 h-[2px] bg-[#333]" />
        <div className="text-center">
          <div className="text-[10px] font-bold tracking-[2px] uppercase text-[#888] mb-1">Market Avg</div>
          <div className="text-[36px] text-[#888] leading-none" style={{ fontFamily: 'var(--font-d)' }}>{marketAvg || '75.2'}</div>
        </div>
        <div className="hidden sm:block flex-1 h-[2px] bg-[#333]" />
        <div className="sm:text-right">
          <div className="text-[10px] font-bold tracking-[2px] uppercase text-[#888] mb-1">Top Competitor</div>
          <div className="text-[36px] text-[#4ade80] leading-none" style={{ fontFamily: 'var(--font-d)' }}>{topScore || '91.0'}</div>
        </div>
      </div>

      {/* Main grid — stacks on mobile */}
      <div className="flex flex-col md:grid md:grid-cols-[1fr_320px] flex-1">
        <div className="border-b-2 md:border-b-0 md:border-r-2 border-[var(--black)] p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-[3px] bg-[var(--red)]" />
            <span className="text-sm font-bold uppercase tracking-[2px]">Tracked Competitors</span>
            <span className="text-[10px] font-bold text-[#888]">({comps.length})</span>
          </div>
          <div className="flex flex-col gap-4">
            {comps.length === 0 ? (
              <div className="text-center py-12 border-4 border-dashed border-[#ccc] bg-[var(--bg)] p-8">
                <Users className="h-12 w-12 mx-auto mb-4 text-[#888]" />
                <p className="text-lg font-black uppercase mb-2" style={{ fontFamily: 'var(--font-d)' }}>No Competitors Yet</p>
                <p className="text-xs text-[#888] mb-6 max-w-xs mx-auto">We need competitors to find keyword gaps. Generate a starting list based on your niche: <span className="text-[var(--red)] font-bold">{niche}</span></p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button className="btn btn-red px-8 py-3" onClick={handleGenerateComps} disabled={generating}>
                    {generating ? "Generating..." : "Generate Competitors →"}
                  </button>
                  <button className="btn btn-outline px-8 py-3" onClick={() => setShowAddModal(true)}>Add Manually</button>
                </div>
              </div>
            ) : comps.map((c, i) => (
              <div key={i} className={`border-2 border-[var(--black)] bg-white shadow-[4px_4px_0_var(--black)] p-4 sm:p-5 cursor-pointer transition-shadow hover:shadow-[6px_6px_0_var(--black)] ${selectedComp?.handle === c.handle ? 'ring-2 ring-[var(--red)]' : ''}`}
                onClick={() => setSelectedComp(selectedComp?.handle === c.handle ? null : c)}>
                <div className="flex items-start justify-between mb-4 gap-3">
                  <div className="min-w-0">
                    <div className="text-[15px] sm:text-[16px] font-black uppercase leading-tight" style={{ fontFamily: 'var(--font-d)' }}>{c.name}</div>
                    <div className="text-xs text-[#888] font-bold mt-0.5 truncate">{c.handle} · {c.posts} posts/mo · {c.eng} engagement</div>
                  </div>
                  <button className="btn btn-outline btn-sm text-xs shrink-0 group" onClick={(e) => { e.stopPropagation(); handleRemoveCompetitor(c.handle); }}>
                    <Trash2 className="h-3 w-3 mr-1" /> Remove
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {c.ig > 0 && <div className="border border-[#eaeaea] p-2 sm:p-3 text-center"><div className="text-[10px] font-bold text-[#d946ef] uppercase tracking-wide mb-1">Instagram</div><div className="text-[22px] sm:text-[24px] font-black" style={{ fontFamily: 'var(--font-d)' }}>{c.ig}</div></div>}
                  {c.li > 0 && <div className="border border-[#eaeaea] p-2 sm:p-3 text-center"><div className="text-[10px] font-bold text-[#3b82f6] uppercase tracking-wide mb-1">LinkedIn</div><div className="text-[22px] sm:text-[24px] font-black" style={{ fontFamily: 'var(--font-d)' }}>{c.li}</div></div>}
                  {c.x > 0 && <div className="border border-[#eaeaea] p-2 sm:p-3 text-center"><div className="text-[10px] font-bold text-[#555] uppercase tracking-wide mb-1">X / Twitter</div><div className="text-[22px] sm:text-[24px] font-black" style={{ fontFamily: 'var(--font-d)' }}>{c.x}</div></div>}
                </div>
                {/* Expanded detail for selected competitor */}
                {selectedComp?.handle === c.handle && (
                  <div className="mt-4 pt-4 border-t border-[#eaeaea]">
                    <div className="label-sm text-[var(--red)] mb-2">Keywords They Rank For</div>
                    <div className="flex flex-wrap gap-2">
                      {c.gap.map((kw, j) => (
                        <span key={j} className="px-2 py-1 border-2 border-[var(--black)] text-xs font-bold bg-[var(--bg)]">"{kw}"</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 sm:p-6 bg-[#fafafa]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-[3px] bg-[var(--red)]" />
            <span className="text-sm font-bold uppercase tracking-[2px]">Keyword Gaps</span>
          </div>
          <div className="flex flex-col gap-3">
            {gaps.map((g, i) => (
              <div key={i} className="border-2 border-[var(--black)] bg-white p-4">
                <div className="text-sm font-black mb-1">"{g.kw}"</div>
                <div className="text-[11px] text-[#888] mb-2">Competitor ranks: {g.comps.join(', ')}</div>
                <div className="text-[11px] font-bold text-[#16a34a] border-l-2 border-l-[#22c55e] pl-2">{g.action}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Competitor Modal */}
      {showAddModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowAddModal(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white border-2 border-[var(--black)] shadow-[8px_8px_0_var(--black)] p-6 w-full max-w-sm">
              <div className="text-lg font-black uppercase mb-4" style={{ fontFamily: 'var(--font-d)' }}>Add Competitor</div>
              <div className="mb-3">
                <label className="label-sm mb-1 block">Handle / Username</label>
                <input className="input" value={newHandle} onChange={e => setNewHandle(e.target.value)} placeholder="@fitnesswithsarah" />
              </div>
              <div className="mb-3">
                <label className="label-sm mb-1 block">Display Name</label>
                <input className="input" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Fitness With Sarah" />
              </div>
              <div className="mb-4">
                <label className="label-sm mb-1 block">Primary Platform</label>
                <select className="input cursor-pointer" value={newPlatform} onChange={e => setNewPlatform(e.target.value)}>
                  <option value="instagram">Instagram</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="x">X / Twitter</option>
                </select>
              </div>
              <div className='flex flex-col gap-1.5 mb-4'>
                <label className='label-sm'>Or upload screenshot (optional)</label>
                <input type='file' accept='image/*' onChange={handleScreenshot} className='text-xs' />
                {ocrLoading && <span className='text-xs text-[#888]'>Extracting text...</span>}
                {ocrText && <textarea className='textarea text-xs' rows={3} value={ocrText} readOnly />}
              </div>
              <div className="flex gap-2">
                <button className="btn btn-red flex-1 justify-center" onClick={handleAddCompetitor} disabled={analyzing}>
                  {analyzing ? "Analysing..." : "Add & Analyse"}
                </button>
                <button className="btn btn-outline flex-1 justify-center" onClick={() => setShowAddModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
