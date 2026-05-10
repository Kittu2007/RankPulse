import { useState, useMemo } from "react";
import { toast } from "sonner";
import { aiComplete, hasAiKey, aiEmbed } from "@/lib/nvidia";
import { getKeywordSets, saveKeywordSet, deleteKeywordSet, type KeywordSet } from "@/lib/storage";
import { Copy, Trash2, Plus, Key } from "lucide-react";

type Platform = 'ig' | 'li' | 'x';
interface Keyword { rank: number; term: string; vol: number; trend: string; diff: 'hard' | 'med' | 'easy'; plats: Platform[]; }

const KEYWORDS_PROMPT = `You are a social media keyword research expert. Generate 10 trending and high-volume keywords for a user in the "[NICHE]" niche.
Return ONLY a JSON array with objects:
{
  "term": "keyword",
  "vol": number (0-100),
  "trend": string (e.g. "+34%" or "stable"),
  "diff": "easy"|"med"|"hard",
  "plats": string[] (from 'ig','li','x')
}
Be specific to the niche.`;

function cosineSim(a: number[], b: number[]): number {
  const dot = a.reduce((s, v, i) => s + v * b[i], 0);
  const magA = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
  const magB = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
  return dot / (magA * magB);
}

export default function KeywordsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Platforms');
  const [keywords, setKeywords] = useState<Keyword[]>(() => {
    try { return JSON.parse(localStorage.getItem('rp_keywords_data') || '[]'); }
    catch { return []; }
  });
  const [sets, setSets] = useState<KeywordSet[]>(() => getKeywordSets());
  const [niche] = useState(() => localStorage.getItem("rp_user_niche") || "Social Media Marketing");
  const [searching, setSearching] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [showNewSet, setShowNewSet] = useState(false);
  const [newSetName, setNewSetName] = useState('');
  const [newSetPlatform, setNewSetPlatform] = useState<string>('ig');
  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(new Set());
  const [similarMap, setSimilarMap] = useState<Record<string, string[]>>({});
  const [embedLoading, setEmbedLoading] = useState<string | null>(null);

  const handleGenerateKeywords = async () => {
    setGenerating(true);
    try {
      const raw = await aiComplete([
        { role: "user", content: KEYWORDS_PROMPT.replace('[NICHE]', niche) }
      ], { reasoning_effort: "high" });
      const match = raw.match(/\[.*\]/s);
      if (!match) throw new Error("Invalid AI response");
      const data = JSON.parse(match[0]);
      const ranked = data.map((k: any, i: number) => ({ ...k, rank: i + 1 }));
      setKeywords(ranked);
      localStorage.setItem('rp_keywords_data', JSON.stringify(ranked));
      toast.success(`Generated ${data.length} keywords for ${niche}`);
    } catch (err: any) {
      toast.error("Generation failed: " + err.message);
    } finally {
      setGenerating(false);
    }
  };

  const filters = ['All Platforms','Instagram','LinkedIn','X / Twitter'];

  const filteredKeywords = useMemo(() => {
    let list = keywords;
    if (activeFilter === 'Instagram') list = list.filter(k => k.plats.includes('ig'));
    else if (activeFilter === 'LinkedIn') list = list.filter(k => k.plats.includes('li'));
    else if (activeFilter === 'X / Twitter') list = list.filter(k => k.plats.includes('x'));

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(k => k.term.toLowerCase().includes(q));
    }
    return list;
  }, [keywords, activeFilter, searchQuery]);

  const trendingKeywords = useMemo(() => {
    return [...keywords]
      .filter(k => k.trend.startsWith('+'))
      .sort((a, b) => parseInt(b.trend.replace('+', '').replace('%', '')) - parseInt(a.trend.replace('+', '').replace('%', '')))
      .slice(0, 3)
      .map(k => ({ term: k.term, trend: k.trend, hot: parseInt(k.trend.replace('+', '').replace('%', '')) > 25 }));
  }, [keywords]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) { toast.error("Enter a keyword to search."); return; }
    setSearching(true);

    if (!hasAiKey()) {
      // Offline / fallback: generate synthetic results from the query
      const q = searchQuery.toLowerCase().trim();
      const platCode: Platform = activeFilter === 'Instagram' ? 'ig' : activeFilter === 'LinkedIn' ? 'li' : activeFilter === 'X / Twitter' ? 'x' : 'ig';
      const newResults: Keyword[] = [
        { rank: 1, term: q, vol: Math.floor(Math.random()*40)+60, trend: `+${Math.floor(Math.random()*30)+5}%`, diff: 'easy', plats: [platCode] },
        { rank: 2, term: `${q} tips`, vol: Math.floor(Math.random()*30)+50, trend: `+${Math.floor(Math.random()*20)+3}%`, diff: 'easy', plats: [platCode] },
        { rank: 3, term: `${q} strategy`, vol: Math.floor(Math.random()*25)+40, trend: 'stable', diff: 'med', plats: [platCode, 'li'] },
        { rank: 4, term: `best ${q}`, vol: Math.floor(Math.random()*20)+35, trend: `+${Math.floor(Math.random()*15)+2}%`, diff: 'med', plats: [platCode] },
        { rank: 5, term: `${q} 2026`, vol: Math.floor(Math.random()*20)+30, trend: `+${Math.floor(Math.random()*25)+10}%`, diff: 'hard', plats: [platCode, 'x'] },
      ];
      setKeywords(newResults);
      localStorage.setItem('rp_keywords_data', JSON.stringify(newResults));
      toast.success(`Found ${newResults.length} keywords for "${searchQuery}"`);
      setSearching(false);
      return;
    }

    try {
      const raw = await aiComplete([
        { role: "system", content: `You are a social media keyword research expert for the ${niche} niche. Generate keyword research data. Return ONLY a JSON array with objects: {term: string, vol: number (0-100), trend: string (like '+34%' or '-8%' or 'stable'), diff: 'easy'|'med'|'hard', plats: string[] (from 'ig','li','x')}. No other text.` },
        { role: "user", content: `Research 8 keywords related to "${searchQuery}". Return JSON only.` },
      ]);
      const match = raw.match(/\[.*\]/s);
      if (match) {
        const parsed = JSON.parse(match[0]);
        const ranked = parsed.map((k: any, i: number) => ({ ...k, rank: i + 1 }));
        setKeywords(ranked);
        localStorage.setItem('rp_keywords_data', JSON.stringify(ranked));
        toast.success(`Found ${parsed.length} keywords for "${searchQuery}"`);
      }
    } catch (err) { console.error(err); toast.error("Keyword search failed."); }
    setSearching(false);
  };

  const toggleSelectKeyword = (term: string) => {
    setSelectedKeywords(prev => {
      const next = new Set(prev);
      if (next.has(term)) next.delete(term); else next.add(term);
      return next;
    });
  };

  const findSimilar = async (term: string) => {
    if (!hasAiKey()) return;
    setEmbedLoading(term);
    try {
      const otherKeywords = keywords.filter(k => k.term !== term);
      
      // Attempt 1: High-Speed Embedding Similarity
      try {
        const allEmbeds = await aiEmbed([term, ...otherKeywords.map(k => k.term)]);
        const targetVec = allEmbeds[0];
        const otherVecs = allEmbeds.slice(1);

        const scored = otherKeywords.map((k, i) => ({
          term: k.term, score: cosineSim(targetVec, otherVecs[i]),
        })).sort((a, b) => b.score - a.score).slice(0, 3).map(k => k.term);
        setSimilarMap(prev => ({ ...prev, [term]: scored }));
        return;
      } catch (embedError) {
        console.warn("Embedding similarity failed, falling back to LLM reasoning:", embedError);
      }

      // Attempt 2: LLM Fallback (Reasoning about similarity)
      const raw = await aiComplete([
        { role: "system", content: "You are an SEO expert. Given a target keyword and a list of other keywords, find the top 3 most semantically similar or related keywords from the list. Return ONLY the terms as a comma-separated list." },
        { role: "user", content: `Target: "${term}"\nList: ${otherKeywords.map(k => k.term).join(", ")}` }
      ]);
      const scored = raw.split(",").map(t => t.trim()).filter(t => otherKeywords.some(k => k.term === t));
      setSimilarMap(prev => ({ ...prev, [term]: scored }));
    } catch (e: any) {
      console.error(e);
      toast.error(`Similarity error: ${e.message || "Unknown error"}`);
    } finally { setEmbedLoading(null); }
  };

  const handleCreateSet = () => {
    if (!newSetName.trim()) { toast.error("Enter a set name."); return; }
    if (selectedKeywords.size === 0) { toast.error("Select at least one keyword."); return; }
    const newSet: KeywordSet = {
      id: Date.now(),
      name: newSetName.trim(),
      platform: newSetPlatform,
      keywords: Array.from(selectedKeywords),
      created_at: new Date().toISOString(),
    };
    saveKeywordSet(newSet);
    setSets(getKeywordSets());
    setShowNewSet(false);
    setNewSetName('');
    setSelectedKeywords(new Set());
    toast.success(`Set "${newSet.name}" created with ${newSet.keywords.length} keywords`);
  };

  const handleDeleteSet = (id: number) => {
    deleteKeywordSet(id);
    setSets(getKeywordSets());
    toast.success("Set deleted");
  };

  const handleCopyKeywords = (kws: string[]) => {
    navigator.clipboard.writeText(kws.join(', '));
    toast.success("Keywords copied!");
  };

  return (
    <div className="page-transition min-h-screen flex flex-col bg-[var(--bg)]">
      {/* Page header — stacks on small screens */}
      <div className="page-header flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
        <div>
          <div className="page-kicker">Discover what ranks</div>
          <div className="d4">Keyword Research</div>
        </div>
        <div className="flex gap-2 h-[42px] w-full sm:w-auto">
          <input className="input flex-1 sm:w-[200px] sm:flex-none" placeholder="Search keywords..."
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()} />
          <button className="btn btn-red px-4 sm:px-6 font-bold text-sm shrink-0" onClick={handleSearch} disabled={searching}>
            {searching ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      {/* Main grid — stacks on mobile */}
      <div className="flex flex-col md:grid md:grid-cols-[1fr_280px] flex-1 relative">
        <div className="border-b-2 md:border-b-0 md:border-r-2 border-[var(--black)] flex flex-col">
          {/* Filter bar — wraps on mobile */}
          <div className="p-3 border-b-2 border-b-[var(--black)] flex flex-wrap gap-2 items-center">
            <span className="label-sm text-[#888]">Filter:</span>
            {filters.map((f) => (
              <button key={f} onClick={() => setActiveFilter(f)}
                className={`btn btn-sm ${activeFilter === f ? 'bg-[var(--black)] text-white' : 'btn-outline'} text-xs font-bold px-3 py-1.5`}>{f}</button>
            ))}
            <span className="body-sm text-[#888] text-xs font-bold sm:ml-auto">Showing {filteredKeywords.length} keywords</span>
          </div>

          {/* Table header */}
          <div className="hidden sm:flex items-center gap-3 p-[10px_16px] border-b-2 border-b-[var(--black)] bg-[var(--black)] text-white">
            <div className="w-[28px] text-[10px] font-bold tracking-[2px] uppercase">✓</div>
            <div className="min-w-[28px] text-[10px] font-bold tracking-[2px] uppercase">#</div>
            <div className="flex-1 text-[10px] font-bold tracking-[2px] uppercase">Keyword</div>
            <div className="w-[100px] text-[10px] font-bold tracking-[2px] uppercase">Volume</div>
            <div className="w-[64px] text-[10px] font-bold tracking-[2px] uppercase">Trend</div>
            <div className="w-[60px] text-[10px] font-bold tracking-[2px] uppercase">Diff.</div>
            <div className="w-[80px] text-[10px] font-bold tracking-[2px] uppercase">Platforms</div>
          </div>

          {/* Desktop rows */}
          <div className="hidden sm:flex flex-col bg-white flex-1">
            {filteredKeywords.map(k => (
              <div key={k.rank} className="flex flex-col">
                <div className={`flex items-center gap-3 p-[10px_16px] border-b border-b-[#eaeaea] hover:bg-[#f8f8f8] transition-colors cursor-pointer ${selectedKeywords.has(k.term) ? 'bg-[#eff6ff]' : ''}`}
                  onClick={() => toggleSelectKeyword(k.term)}>
                  <div className="w-[28px]">
                    <input type="checkbox" checked={selectedKeywords.has(k.term)} readOnly className="cursor-pointer" />
                  </div>
                  <div className="min-w-[28px] text-[18px] font-bold" style={{ fontFamily: 'var(--font-d)' }}>{String(k.rank).padStart(2,'0')}</div>
                  <div className="flex-1 text-sm font-bold flex items-center gap-2">
                    {k.term}
                    <button className="btn btn-outline btn-sm text-[9px] px-2 py-0.5" onClick={(e) => { e.stopPropagation(); findSimilar(k.term); }} disabled={embedLoading === k.term}>
                      {embedLoading === k.term ? "..." : "Similar"}
                    </button>
                  </div>
                  <div className="w-[100px] flex items-center gap-1.5">
                    <div className="w-[64px] h-[6px] border border-[var(--black)] bg-[var(--bg)] relative">
                      <div className="absolute left-0 top-0 bottom-0 bg-[var(--red)]" style={{ width: k.vol + '%' }}></div>
                    </div>
                    <span className="text-[10px] font-bold">{k.vol}/100</span>
                  </div>
                  <div className="w-[64px]">
                    <span className={`text-[11px] font-bold px-1.5 py-0.5 border ${k.trend.startsWith('+') ? 'bg-[#ebfbf0] text-[#166534] border-[#22c55e]' : k.trend === 'stable' ? 'bg-[#f0f0f0] text-[#555] border-[#ccc]' : 'bg-[#fef2f2] text-[#991b1b] border-[#ef4444]'}`}>{k.trend}</span>
                  </div>
                  <div className="w-[60px]">
                    <span className={`text-[10px] font-bold uppercase tracking-[1px] px-1.5 py-0.5 border-2 ${k.diff === 'hard' ? 'text-[#ef4444] border-[#ef4444]' : k.diff === 'med' ? 'text-[#f59e0b] border-[#f59e0b]' : 'text-[#22c55e] border-[#22c55e]'}`}>{k.diff}</span>
                  </div>
                  <div className="w-[80px] flex gap-1 flex-wrap">
                    {k.plats.map(p => (
                      <span key={p} className={`text-[8px] font-bold uppercase tracking-wider px-[4px] py-[1px] border text-white ${p === 'ig' ? 'bg-[#d946ef] border-[#a21caf]' : p === 'li' ? 'bg-[#3b82f6] border-[#1d4ed8]' : 'bg-[#111] border-[#000]'}`}>{p}</span>
                    ))}
                  </div>
                </div>
                {similarMap[k.term] && (
                  <div className="p-[8px_16px] bg-[#fdfdfd] border-b border-b-[#eaeaea] flex items-center gap-2">
                    <span className="text-[10px] font-bold text-[var(--red)] uppercase tracking-[1px]">Similar:</span>
                    {similarMap[k.term].map(sim => (
                      <span key={sim} className="text-xs font-bold px-2 py-0.5 bg-[var(--bg)] border border-[var(--black)]">{sim}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {filteredKeywords.length === 0 && (
              <div className="p-12 text-center border-4 border-dashed border-[#ccc] m-6 bg-[var(--bg)]">
                <Key className="h-12 w-12 mx-auto mb-4 text-[#888]" />
                <p className="text-lg font-black uppercase mb-2" style={{ fontFamily: 'var(--font-d)' }}>No Keywords Yet</p>
                <p className="text-xs text-[#888] mb-6 max-w-xs mx-auto">Explore trending keywords for your niche: <span className="text-[var(--red)] font-bold">{niche}</span></p>
                <button className="btn btn-red px-8 py-3" onClick={handleGenerateKeywords} disabled={generating}>
                  {generating ? "Generate Trending Keywords →" : "Generate Trending Keywords →"}
                </button>
              </div>
            )}
          </div>

          {/* Mobile card list */}
          <div className="sm:hidden flex flex-col bg-white flex-1">
            {filteredKeywords.map(k => (
              <div key={k.rank} className={`p-4 border-b border-b-[#eaeaea] cursor-pointer ${selectedKeywords.has(k.term) ? 'bg-[#eff6ff]' : ''}`}
                onClick={() => toggleSelectKeyword(k.term)}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={selectedKeywords.has(k.term)} readOnly className="cursor-pointer" />
                    <span className="text-xs text-[#888] font-bold">{String(k.rank).padStart(2,'0')}</span>
                    <span className="text-sm font-bold">{k.term}</span>
                  </div>
                  <span className={`text-[11px] font-bold px-1.5 py-0.5 border ${k.trend.startsWith('+') ? 'bg-[#ebfbf0] text-[#166534] border-[#22c55e]' : k.trend === 'stable' ? 'bg-[#f0f0f0] text-[#555] border-[#ccc]' : 'bg-[#fef2f2] text-[#991b1b] border-[#ef4444]'}`}>{k.trend}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 flex-1">
                    <div className="flex-1 h-[5px] border border-[var(--black)] bg-[var(--bg)] relative">
                      <div className="absolute left-0 top-0 bottom-0 bg-[var(--red)]" style={{ width: k.vol + '%' }}></div>
                    </div>
                    <span className="text-[10px] font-bold shrink-0">{k.vol}/100</span>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-[1px] px-1.5 py-0.5 border-2 ${k.diff === 'hard' ? 'text-[#ef4444] border-[#ef4444]' : k.diff === 'med' ? 'text-[#f59e0b] border-[#f59e0b]' : 'text-[#22c55e] border-[#22c55e]'}`}>{k.diff}</span>
                  <div className="flex gap-1">
                    {k.plats.map(p => (
                      <span key={p} className={`text-[8px] font-bold uppercase tracking-wider px-[4px] py-[1px] border text-white ${p === 'ig' ? 'bg-[#d946ef] border-[#a21caf]' : p === 'li' ? 'bg-[#3b82f6] border-[#1d4ed8]' : 'bg-[#111] border-[#000]'}`}>{p}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Selected keyword actions */}
          {selectedKeywords.size > 0 && (
            <div className="p-3 border-t-2 border-t-[var(--black)] bg-white flex items-center gap-3 flex-wrap">
              <span className="text-xs font-bold text-[#888]">{selectedKeywords.size} selected</span>
              <button className="btn btn-red btn-sm text-xs" onClick={() => setShowNewSet(true)}>
                <Plus className="h-3 w-3 mr-1" /> Save as Set
              </button>
              <button className="btn btn-outline btn-sm text-xs" onClick={() => handleCopyKeywords(Array.from(selectedKeywords))}>
                <Copy className="h-3 w-3 mr-1" /> Copy
              </button>
              <button className="btn btn-outline btn-sm text-xs" onClick={() => setSelectedKeywords(new Set())}>Clear</button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="bg-[#fafafa]">
          <div className="p-4 border-b-2 border-b-[var(--black)]">
            <div className="label-sm text-[var(--red)] mb-3">Trending Now</div>
            {trendingKeywords.map((k, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-b-[#eaeaea] last:border-b-0">
                <span className="text-xs font-bold">{k.term}</span>
                <div className="flex gap-2 items-center">
                  {k.hot && <span className="bg-[var(--red)] text-white text-[8px] font-bold uppercase tracking-wide px-1.5 py-0.5">HOT</span>}
                  <span className={`text-[10px] font-bold ${k.trend.startsWith('+') ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>{k.trend}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-b-2 border-b-[var(--black)] bg-white">
            <div className="label-sm text-[var(--black)] mb-3">Keyword Sets</div>
            {sets.length === 0 ? (
              <div className="text-xs text-[#888] py-2">No sets yet. Select keywords and save as a set.</div>
            ) : sets.map((s) => (
              <div key={s.id} className="flex justify-between items-center py-2 border-b border-b-[#eaeaea] last:border-b-0 group">
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate">{s.name}</div>
                  <div className="flex gap-1 mt-1">
                    <span className={`text-[8px] font-bold uppercase tracking-wider px-[4px] py-[1px] border text-white inline-block ${s.platform === 'ig' ? 'bg-[#d946ef] border-[#a21caf]' : s.platform === 'li' ? 'bg-[#3b82f6] border-[#1d4ed8]' : 'bg-[#111] border-[#000]'}`}>{s.platform}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-[#888]">{s.keywords.length} kw</span>
                  <button className="opacity-0 group-hover:opacity-100 text-[#888] hover:text-[var(--red)]" onClick={() => handleCopyKeywords(s.keywords)}>
                    <Copy className="h-3 w-3" />
                  </button>
                  <button className="opacity-0 group-hover:opacity-100 text-[#888] hover:text-[var(--red)]" onClick={() => handleDeleteSet(s.id)}>
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
            <button className="btn btn-outline btn-sm w-full mt-4 justify-center font-bold text-xs" onClick={() => setShowNewSet(true)}>+ Create Set</button>
          </div>
        </div>
      </div>

      {/* New Set Modal */}
      {showNewSet && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowNewSet(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white border-2 border-[var(--black)] shadow-[8px_8px_0_var(--black)] p-6 w-full max-w-sm">
              <div className="text-lg font-black uppercase mb-4" style={{ fontFamily: 'var(--font-d)' }}>Create Keyword Set</div>
              <div className="mb-3">
                <label className="label-sm mb-1 block">Set Name</label>
                <input className="input" value={newSetName} onChange={e => setNewSetName(e.target.value)} placeholder="e.g., Fitness Content Set" />
              </div>
              <div className="mb-3">
                <label className="label-sm mb-1 block">Platform</label>
                <select className="input cursor-pointer" value={newSetPlatform} onChange={e => setNewSetPlatform(e.target.value)}>
                  <option value="ig">Instagram</option>
                  <option value="li">LinkedIn</option>
                  <option value="x">X / Twitter</option>
                </select>
              </div>
              <div className="text-xs text-[#888] mb-4">{selectedKeywords.size} keywords selected</div>
              <div className="flex gap-2">
                <button className="btn btn-red flex-1 justify-center" onClick={handleCreateSet}>Create Set</button>
                <button className="btn btn-outline flex-1 justify-center" onClick={() => setShowNewSet(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
