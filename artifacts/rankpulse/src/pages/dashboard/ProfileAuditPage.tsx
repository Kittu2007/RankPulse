import { useState, useMemo } from "react";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { aiComplete, hasAiKey } from "@/lib/nvidia";

type AuditItem = { field: string; status: 'ok' | 'warn' | 'err'; detail: string; fix?: string };
type AuditSection = { section: string; items: AuditItem[] };

function getInitialAuditSections(): AuditSection[] {
  return []; // Start empty, wait for user input
}

const AUDIT_PROMPT = `You are a social media profile optimization expert. Generate a detailed SEO audit for a [PLATFORM] profile for a user in the "[NICHE]" niche (handle: [HANDLE]).
Return ONLY a JSON object with this structure:
{
  "sections": [
    {
      "section": "Section Name",
      "items": [
        { "field": "Field Name", "status": "ok"|"warn"|"err", "detail": "Specific detail about the current state", "fix": "Specific action to fix" }
      ]
    }
  ]
}
Generate 3 sections with 3-4 items each. Be realistic and specific to the niche.`;

export default function ProfileAuditPage() {
  const [activePlatform, setActivePlatform] = useState('Instagram');
  const [handle, setHandle] = useState('');
  const [niche, setNiche] = useState(() => localStorage.getItem("rp_user_niche") || "");
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResults, setAuditResults] = useState<Record<string, AuditSection[]>>(() => {
    try { return JSON.parse(localStorage.getItem('rp_audit_results') || '{}'); }
    catch { return {}; }
  });
  const [fixingItems, setFixingItems] = useState<Set<string>>(new Set());
  const [fixedItems, setFixedItems] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem('rp_audit_fixed') || '[]')); }
    catch { return new Set(); }
  });
  
  const platforms = ['Instagram', 'LinkedIn', 'X / Twitter'];

  const sections = useMemo(() => auditResults[activePlatform] || [], [auditResults, activePlatform]);

  const handleRunAudit = async () => {
    if (!handle.trim()) { toast.error("Please enter your handle (e.g. @username)"); return; }
    if (!niche.trim()) { toast.error("Please enter your niche in Settings or here."); return; }
    
    setIsAuditing(true);
    try {
      const prompt = AUDIT_PROMPT
        .replace('[PLATFORM]', activePlatform)
        .replace('[NICHE]', niche)
        .replace('[HANDLE]', handle);
      
      const raw = await aiComplete([{ role: "user", content: prompt }], { reasoning_effort: "high" });
      const match = raw.match(/\{.*\}/s);
      if (!match) throw new Error("Invalid AI response format");
      
      const data = JSON.parse(match[0]);
      const newResults = { ...auditResults, [activePlatform]: data.sections };
      setAuditResults(newResults);
      localStorage.setItem('rp_audit_results', JSON.stringify(newResults));
      toast.success(`${activePlatform} audit complete!`);
    } catch (err: any) {
      console.error(err);
      toast.error("Audit failed: " + err.message);
    } finally {
      setIsAuditing(false);
    }
  };
...
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
  const overallScore = allItems.length > 0 ? Math.round((okCount / allItems.length) * 100) : 0;
...

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

      {/* Audit Setup if no results */}
      {sections.length === 0 && (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="card max-w-md w-full p-8 text-center border-4 border-[var(--black)] shadow-[12px_12px_0_var(--black)]">
            <Shield className="h-12 w-12 mx-auto mb-4 text-[var(--red)]" />
            <div className="text-2xl font-black uppercase mb-2" style={{ fontFamily: 'var(--font-d)' }}>Run {activePlatform} Audit</div>
            <p className="text-sm text-[#888] mb-6">Enter your details and our AI will perform a deep SEO audit of your profile visibility.</p>
            
            <div className="text-left mb-4">
              <label className="label-sm block mb-1">Your Handle</label>
              <input className="input" placeholder="@yourhandle" value={handle} onChange={e => setHandle(e.target.value)} />
            </div>
            
            <div className="text-left mb-6">
              <label className="label-sm block mb-1">Your Niche</label>
              <input className="input" placeholder="e.g. Fitness & Wellness" value={niche} onChange={e => setNiche(e.target.value)} />
            </div>

            <button className="btn btn-red w-full justify-center py-4 font-bold text-lg" onClick={handleRunAudit} disabled={isAuditing}>
              {isAuditing ? "Auditing Profile..." : "Start Deep Audit →"}
            </button>
          </div>
        </div>
      )}

      {/* Main grid — stacks on mobile */}
      {sections.length > 0 && (
        <div className="flex flex-col md:grid md:grid-cols-[1fr_280px] flex-1">
          <div className="border-b-2 md:border-b-0 md:border-r-2 border-[var(--black)] bg-white">
            <div className="p-4 bg-[var(--bg)] border-b-2 border-b-[var(--black)] flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider">Auditing: <span className="text-[var(--red)]">{handle}</span></span>
                <span className="text-xs text-[#888]">|</span>
                <span className="text-xs font-bold uppercase tracking-wider">Niche: <span className="text-[var(--red)]">{niche}</span></span>
              </div>
              <button className="btn btn-outline btn-sm text-[10px]" onClick={() => setAuditResults(prev => { const n = {...prev}; delete n[activePlatform]; return n; })}>New Audit</button>
            </div>
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
