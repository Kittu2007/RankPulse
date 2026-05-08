/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo, useEffect } from "react";
import { analyzeInstagram } from "@/lib/seo/instagram";
import { analyzeLinkedIn } from "@/lib/seo/linkedin";
import { analyzeX } from "@/lib/seo/x";
import type { SEOAnalysisResult } from "@/lib/seo/types";
import { aiStream, hasAiKey } from "@/lib/nvidia";
import { toast } from "sonner";
import { Check, AlertTriangle, X as XIcon } from "lucide-react";

type Platform = 'instagram' | 'linkedin' | 'x';

export default function AnalyzerPage() {
  const [platform, setPlatform] = useState<Platform>('instagram');
  const [text, setText] = useState("Just dropped a new reel — save this for later if you want quick arm workouts at home. No equipment needed. These 5 moves hit triceps, biceps and shoulders. Try them today! Link in bio for full program.");

  // Check for prefilled content from AI Studio "Use This Idea"
  useEffect(() => {
    const prefill = localStorage.getItem("rp_analyzer_prefill");
    if (prefill) {
      setText(prefill);
      localStorage.removeItem("rp_analyzer_prefill");
      toast.success("Idea loaded — see your score!");
    }
  }, []);

  const analysis = useMemo<SEOAnalysisResult>(() => {
    switch (platform) {
      case 'instagram': return analyzeInstagram(text);
      case 'linkedin': return analyzeLinkedIn(text);
      case 'x': return analyzeX(text);
    }
  }, [platform, text]);

  const [isSaving, setIsSaving] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);

  const handleRewrite = async () => {
    if (!text.trim()) return;
    setIsRewriting(true);
    const originalText = text;
    setText("");

    if (!hasAiKey()) {
      setText(originalText + "\n\n[AI Rewrite not configured — add VITE_NVIDIA_API_KEY to .env.local]");
      setIsRewriting(false);
      return;
    }

    try {
      let newText = "";
      let platformInstructions = "";
      if (platform === 'instagram') {
        platformInstructions = "- Hook: Include a question ('?'), 'how to', or 'wait' in the first line.\n- CTA: Include 'share', 'send', or 'tag a friend'.\n- Length: Must be at least 130 characters.\n- HASHTAGS (MANDATORY): You MUST append exactly 3 to 5 relevant hashtags at the very end of the caption. Example: #keyword1 #keyword2 #keyword3\n- Links: Do NOT include any URLs or links in the caption.";
      } else if (platform === 'linkedin') {
        platformInstructions = "- Length: Write between 1200 and 2000 characters.\n- Formatting: Use at least 5 line breaks for readability.\n- Engagement: Include a question ('?') to prompt comments.\n- Links: Do NOT include any URLs or links in the body.\n- Restrictions: Do NOT use engagement bait like 'like if you agree', 'comment yes', or 'comment below'.";
      } else if (platform === 'x') {
        platformInstructions = "- Length: Keep it under 100 characters.\n- Engagement: Include a question ('?'), 'thoughts', or 'why do you' to invite replies.\n- HASHTAGS (MANDATORY): You MUST append exactly 1 or 2 relevant hashtags at the very end. Example: #keyword\n- Links: Do NOT include any URLs or links in the tweet.";
      }

      await aiStream(
        [
          {
            role: "system",
            content: `You are a social media SEO expert. Rewrite this content to maximize its ${platform} algorithm score. Current score: ${analysis.overallScore}/100. 
            
CRITICAL ALGORITHM REQUIREMENTS TO HIT 100/100:
${platformInstructions}

Output ONLY the rewritten text without any quotes, preambles, or explanations. Make it sound natural and engaging.`,
          },
          { role: "user", content: originalText },
        ],
        (chunk) => {
          newText += chunk;
          setText(newText);
        }
      );
    } catch (err: any) {
      console.error(err);
      setText(originalText);
      alert(`AI Rewrite failed: ${err.message}`);
    }
    setIsRewriting(false);
  };

  const handleSaveAnalysis = async () => {
    if (!text.trim()) return;
    setIsSaving(true);
    try {
      // Save to localStorage for now (Supabase data layer can be re-added later)
      const saved = JSON.parse(localStorage.getItem("rp_analyses") || "[]");
      saved.unshift({
        id: Date.now(),
        platform,
        content_text: text,
        overall_score: analysis.overallScore,
        parameter_scores: analysis.parameters,
        penalties: analysis.penalties,
        suggestions: analysis.improvements,
        created_at: new Date().toISOString(),
      });
      // Keep last 50
      localStorage.setItem("rp_analyses", JSON.stringify(saved.slice(0, 50)));
      toast.success(`Analysis saved — Score: ${analysis.overallScore}/100`);
    } catch (err) { console.error(err); toast.error("Failed to save analysis."); }
    setIsSaving(false);
  };

  return (
    <div className="page-transition min-h-screen flex flex-col bg-[var(--bg)]">
      {/* Page header — stacks on mobile */}
      <div className="page-header flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
        <div>
          <div className="page-kicker">Real-time SEO scoring</div>
          <div className="d4">Content Analyser</div>
        </div>
        {/* Platform tabs — scroll on very small screens */}
        <div className="flex gap-0 border-2 border-[var(--black)] overflow-x-auto shrink-0 self-start sm:self-auto">
          {(['instagram', 'linkedin', 'x'] as const).map(p => (
            <button key={p}
              className={`btn ${platform === p ? 'bg-[var(--black)] text-white' : 'bg-white hover:bg-[#f0f0f0]'} rounded-none border-0 border-r-2 last:border-r-0 border-r-[var(--black)] px-4 sm:px-6 h-[42px] flex items-center shrink-0`}
              onClick={() => setPlatform(p)}
            >
              <span className="font-bold text-xs sm:text-sm tracking-wide whitespace-nowrap">
                {p === 'instagram' ? 'Instagram' : p === 'linkedin' ? 'LinkedIn' : 'X / Twitter'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main grid — single col on mobile, side-by-side on md+ */}
      <div className="flex flex-col md:grid md:grid-cols-[1fr_300px] lg:grid-cols-[1fr_320px] flex-1 relative">
        <div className="border-b-2 md:border-b-0 md:border-r-2 border-[var(--black)] flex flex-col">
          <div className="p-4 sm:p-5 border-b-2 border-b-[var(--black)] bg-white">
            <div className="label-sm mb-2">Paste Caption or Post Text</div>
            <textarea
              className="textarea w-full min-h-[120px] sm:min-h-[140px] p-3 sm:p-4 border-2 border-[var(--black)] bg-[var(--bg)] resize-none outline-none focus:border-[var(--red)] text-sm mb-3"
              rows={5}
              placeholder="Paste your Instagram caption, LinkedIn post, or tweet here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="flex flex-wrap gap-2 items-center">
              <button className="btn btn-red px-4 py-2 font-bold text-sm" onClick={handleSaveAnalysis} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Analysis →"}
              </button>
              <button className="btn btn-outline px-4 py-2 font-bold text-sm" onClick={handleRewrite} disabled={isRewriting || !text.trim()}>
                {isRewriting ? "Rewriting..." : "AI Rewrite"}
              </button>
              <button className="btn btn-outline px-4 py-2 font-bold text-sm" onClick={() => setText('')}>Clear</button>
              <span className="body-sm ml-auto text-xs text-[#888] font-bold">{text.length} chars</span>
            </div>
          </div>

          <div className="p-4 border-b-2 border-b-[var(--black)] bg-[#fafafa]">
            <div className="label-sm mb-3">Detected Issues &amp; Signals</div>
            <div className="flex flex-wrap gap-2">
              {analysis.penalties.map((flag, i) => (
                <span key={i} className={`px-2 py-1 text-[11px] font-bold uppercase tracking-wide border-2 flex items-center gap-1.5 ${
                  flag.type === 'ok' ? 'bg-[#ebfbf0] text-[#166534] border-[#22c55e]' :
                  flag.type === 'warn' ? 'bg-[#fffbeb] text-[#92400e] border-[#f59e0b]' :
                  'bg-[#fef2f2] text-[#991b1b] border-[#ef4444]'
                }`}>
                  {flag.type === 'ok' ? <Check className="h-3 w-3" /> : flag.type === 'warn' ? <AlertTriangle className="h-3 w-3" /> : <XIcon className="h-3 w-3" />}
                  {flag.message}
                </span>
              ))}
            </div>
          </div>

          <div className="flex-1 bg-white">
            <div className="p-4 sm:p-5 border-b-2 border-b-[var(--black)] bg-[#f8f8f8]">
              <div className="flex items-center gap-3">
                <div className="w-6 h-[3px] bg-[var(--red)]" />
                <span className="text-sm font-bold uppercase tracking-[2px]">
                  Parameter Breakdown — {platform === 'instagram' ? 'Instagram' : platform === 'linkedin' ? 'LinkedIn' : 'X / Twitter'}
                </span>
              </div>
            </div>
            <div>
              {analysis.parameters.map((p, i) => (
                <div key={i} className="p-4 border-b border-b-[#eaeaea] flex items-start gap-3 sm:gap-4">
                  <div className="min-w-[36px] pt-1 shrink-0">
                    <span className="px-1.5 py-0.5 bg-[var(--black)] text-white text-[9px] font-bold tracking-wider">{p.weight}%</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                      <span className="text-sm font-bold sm:min-w-[180px]">{p.name}</span>
                      <div className="flex-1 h-[4px] bg-[#e8e4d0] relative w-full">
                        <div className={`absolute left-0 top-0 bottom-0 ${p.color === 'hi' ? 'bg-[#22c55e]' : p.color === 'md' ? 'bg-[#f59e0b]' : 'bg-[var(--red)]'}`} style={{ width: p.score + '%' }} />
                      </div>
                      <span className={`text-xs font-bold sm:w-12 sm:text-right ${p.color === 'hi' ? 'text-[#16a34a]' : p.color === 'md' ? 'text-[#d97706]' : 'text-[var(--red)]'}`}>{p.score}%</span>
                    </div>
                    <div className="text-xs text-[#555] leading-relaxed">{p.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Score Panel — full width on mobile, fixed sidebar on md+ */}
        <div className="bg-[var(--black)] flex flex-col">
          <div className="p-5 sm:p-6 border-b border-b-[#222] text-center">
            <div className="text-[10px] uppercase tracking-[2px] font-bold text-[#888] mb-2">Content SEO Score</div>
            <div className="text-[80px] sm:text-[110px] leading-[0.85] text-[var(--red)] tracking-[-4px]" style={{ fontFamily: 'var(--font-d)' }}>{analysis.overallScore}</div>
            <div className="text-[10px] uppercase tracking-[2px] font-bold text-[#888] mt-3">/ 100 — {analysis.overallScore >= 80 ? 'EXCELLENT' : analysis.overallScore >= 60 ? 'NEEDS WORK' : 'POOR'}</div>
          </div>

          {analysis.improvements.length > 0 && (
            <div className="p-4 sm:p-5 border-b border-b-[#222]">
              <div className="text-[10px] uppercase tracking-[2px] font-bold text-[#888] mb-4">Top Fixes</div>
              <div className="flex flex-col gap-3">
                {analysis.improvements.map((fix, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <span className={`mt-0.5 shrink-0 ${fix.icon === '⚠' ? 'text-[#f59e0b]' : 'text-[var(--red)]'}`}>
                      {fix.icon === '⚠' ? <AlertTriangle className="h-3.5 w-3.5" /> : <XIcon className="h-3.5 w-3.5" />}
                    </span>
                    <div className="flex-1">
                      <div className="text-xs text-[var(--bg)] font-bold mb-0.5">{fix.text}</div>
                      <div className="text-[10px] text-[#4ade80] font-bold tracking-wide">{fix.impact}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-4 sm:p-5 border-b border-b-[#222]">
            <div className="text-[10px] uppercase tracking-[2px] font-bold text-[#888] mb-4">Predicted Performance</div>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center pb-2 border-b border-b-[#1a1a1a]">
                <span className="text-[11px] text-[#888]">Reach Estimate</span>
                <span className="text-[12px] font-bold text-[var(--bg)]">{analysis.overallScore >= 80 ? 'HIGH' : analysis.overallScore >= 60 ? 'MODERATE' : 'LOW'}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-b-[#1a1a1a]">
                <span className="text-[11px] text-[#888]">Engagement Rate</span>
                <span className="text-[12px] font-bold text-[var(--bg)]">{(analysis.overallScore * 0.05).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-b-[#1a1a1a]">
                <span className="text-[11px] text-[#888]">Discovery Potential</span>
                <span className="text-[12px] font-bold text-[var(--bg)]">{analysis.overallScore >= 80 ? 'EXCELLENT' : analysis.overallScore >= 60 ? 'FAIR' : 'POOR'}</span>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5 mt-auto pb-6 sm:pb-8">
            <button className="w-full btn btn-red mb-3 justify-center py-3 text-sm font-bold" onClick={handleRewrite} disabled={isRewriting || !text.trim()}>
              {isRewriting ? "Rewriting..." : "AI Rewrite for Max Score"}
            </button>
            <button className="w-full btn border-2 border-[#333] text-white hover:bg-[#222] justify-center py-3 text-sm font-bold" onClick={handleSaveAnalysis} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Analysis"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
