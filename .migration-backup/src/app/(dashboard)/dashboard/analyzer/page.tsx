/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import { analyzeInstagram } from "@/lib/seo/instagram";
import { analyzeLinkedIn } from "@/lib/seo/linkedin";
import { analyzeX } from "@/lib/seo/x";
import type { SEOAnalysisResult } from "@/lib/seo/types";
import { createClient } from "@/utils/supabase/client";

type Platform = 'instagram' | 'linkedin' | 'x';

export default function AnalyzerPage() {
  const [platform, setPlatform] = useState<Platform>('instagram');
  const [text, setText] = useState("Just dropped a new reel — save this for later if you want quick arm workouts at home. No equipment needed. These 5 moves hit triceps, biceps and shoulders. Try them today! Link in bio for full program.");

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
    try {
      const res = await fetch("/api/ai/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caption: originalText,
          platform,
          score: analysis.overallScore,
        })
      });

      if (!res.ok) throw new Error("Failed to fetch rewrite");
      
      const reader = res.body?.getReader();
      const decoder = new TextDecoder("utf-8");

      if (reader) {
        let newText = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          newText += decoder.decode(value, { stream: true });
          setText(newText);
        }
      }
    } catch (err) {
      console.error(err);
      setText(originalText);
      alert("AI Rewrite failed. Please try again later.");
    }
    setIsRewriting(false);
  };

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setIsSaving(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error("No authenticated user found.");
        setIsSaving(false);
        return;
      }

      const { error } = await supabase.from('analyses').insert({
        user_id: user.id,
        platform: platform,
        content_text: text,
        overall_score: analysis.overallScore,
        parameter_scores: analysis.parameters as any,
        penalties: analysis.penalties as any,
        suggestions: analysis.improvements as any,
      });

      if (error) {
        console.error("Failed to insert analysis:", error);
      }
    } catch (err) {
      console.error(err);
    }
    setIsSaving(false);
  };

  return (
    <div className="page-transition min-h-screen flex flex-col bg-[var(--bg)]">
      <div className="page-header border-b-2 border-b-[var(--black)] p-[24px_32px] flex items-center justify-between">
        <div className="page-title-group">
          <div className="page-kicker text-[10px] text-[var(--red)] uppercase tracking-[2px] font-bold mb-1">Real-time SEO scoring</div>
          <div className="d4 text-[40px] leading-none uppercase" style={{ fontFamily: 'var(--font-d)' }}>Content Analyser</div>
        </div>
        <div className="flex gap-0 border-2 items-stretch h-[42px] border-[var(--black)]">
          {(['instagram', 'linkedin', 'x'] as const).map(p => (
            <button 
              key={p}
              className={`btn ${platform === p ? 'bg-[var(--black)] text-white' : 'bg-white hover:bg-[#f0f0f0]'} rounded-none border-0 border-r-2 last:border-r-0 border-r-[var(--black)] px-6 relative h-full flex items-center`}
              onClick={() => setPlatform(p)}
            >
              <span className="font-bold text-sm tracking-wide">{p === 'instagram' ? 'Instagram' : p === 'linkedin' ? 'LinkedIn' : 'X / Twitter'}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-[1fr_320px] max-[900px]:grid-cols-1 flex-1 relative">
        <div className="border-r-2 border-r-[var(--black)] flex flex-col">
          {/* Input Area */}
          <div className="p-5 border-b-2 border-b-[var(--black)] bg-white">
            <div className="label-sm mb-2 text-[10px] font-bold tracking-[2px] uppercase text-[var(--black)]">Paste Caption or Post Text</div>
            <textarea 
              className="textarea w-full min-h-[140px] p-4 border-2 border-[var(--black)] bg-[var(--bg)] resize-none outline-none focus:border-[var(--red)] text-sm mb-3"
              rows={5}
              placeholder="Paste your Instagram caption, LinkedIn post, or tweet here...&#10;&#10;RankPulse will score it against the 2026 algorithm in real-time."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="flex gap-2 items-center">
              <button 
                className="btn btn-red px-5 py-2 font-bold text-sm"
                onClick={handleAnalyze}
                disabled={isSaving}
              >
                {isSaving ? "Analysing..." : "Analyse Now →"}
              </button>
              <button 
                className="btn btn-outline px-5 py-2 font-bold text-sm"
                onClick={handleRewrite}
                disabled={isRewriting || !text.trim()}
              >
                {isRewriting ? "Rewriting..." : "AI Rewrite"}
              </button>
              <button className="btn btn-outline px-5 py-2 font-bold text-sm" onClick={() => setText('')}>Clear</button>
              <span className="body-sm ml-auto text-xs text-[#888] font-bold">{text.length} characters</span>
            </div>
          </div>

          {/* Flags */}
          <div className="p-4 border-b-2 border-b-[var(--black)] bg-[#fafafa]">
            <div className="label-sm mb-3 text-[10px] font-bold tracking-[2px] uppercase text-[var(--black)]">Detected Issues &amp; Signals</div>
            <div className="flex flex-wrap gap-2">
              {analysis.penalties.map((flag, i) => (
                <span key={i} className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide border-2 flex items-center gap-1.5 ${
                  flag.type === 'ok' ? 'bg-[#ebfbf0] text-[#166534] border-[#22c55e]' : 
                  flag.type === 'warn' ? 'bg-[#fffbeb] text-[#92400e] border-[#f59e0b]' : 
                  'bg-[#fef2f2] text-[#991b1b] border-[#ef4444]'
                }`}>
                  {flag.type === 'ok' ? '✓' : flag.type === 'warn' ? '⚠' : '✗'} {flag.message}
                </span>
              ))}
            </div>
          </div>

          {/* Parameter Breakdown */}
          <div className="flex-1 bg-white">
            <div className="p-5 border-b-2 border-b-[var(--black)] bg-[#f8f8f8]">
              <div className="flex items-center gap-3">
                <div className="w-6 h-[3px] bg-[var(--red)]" />
                <span className="text-sm font-bold uppercase tracking-[2px]">Parameter Breakdown — {platform === 'instagram' ? 'Instagram' : platform === 'linkedin' ? 'LinkedIn' : 'X / Twitter'}</span>
              </div>
            </div>
            <div>
              {analysis.parameters.map((p, i) => (
                <div key={i} className="p-4 border-b border-b-[#eaeaea] flex items-start gap-4">
                  <div className="min-w-[40px] pt-1">
                    <span className="px-1.5 py-0.5 bg-[var(--black)] text-white text-[9px] font-bold tracking-wider">{p.weight}%</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                      <span className="text-sm font-bold min-w-[180px]">{p.name}</span>
                      <div className="flex-1 h-[4px] bg-[#e8e4d0] relative w-full">
                        <div className={`absolute left-0 top-0 bottom-0 ${p.color === 'hi' ? 'bg-[#22c55e]' : p.color === 'md' ? 'bg-[#f59e0b]' : 'bg-[var(--red)]'}`} style={{ width: p.score + '%' }} />
                      </div>
                      <span className={`text-xs font-bold w-12 text-right ${p.color === 'hi' ? 'text-[#16a34a]' : p.color === 'md' ? 'text-[#d97706]' : 'text-[var(--red)]'}`}>{p.score}%</span>
                    </div>
                    <div className="text-xs text-[#555] leading-relaxed">{p.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side Score Panel */}
        <div className="bg-[var(--black)] flex flex-col min-h-full">
          <div className="p-6 border-b border-b-[#222] text-center">
            <div className="text-[10px] uppercase tracking-[2px] font-bold text-[#888] mb-2">Content SEO Score</div>
            <div className="text-[110px] leading-[0.85] text-[var(--red)] tracking-[-4px]" style={{ fontFamily: 'var(--font-d)' }}>{analysis.overallScore}</div>
            <div className="text-[10px] uppercase tracking-[2px] font-bold text-[#888] mt-3">/ 100 — {analysis.overallScore >= 80 ? 'EXCELLENT' : analysis.overallScore >= 60 ? 'NEEDS WORK' : 'POOR'}</div>
            {analysis.improvements.length > 0 && (
              <div className="mt-5 pt-5 border-t border-t-[#222]">
                <div className="text-xs text-[#888] mb-1">Fix flagged issues to reach</div>
                <div className="text-3xl text-[#4ade80]" style={{ fontFamily: 'var(--font-d)' }}>{Math.min(100, analysis.overallScore + 18)}+</div>
              </div>
            )}
          </div>

          {analysis.improvements.length > 0 && (
            <div className="p-5 border-b border-b-[#222]">
              <div className="text-[10px] uppercase tracking-[2px] font-bold text-[#888] mb-4">Top Fixes</div>
              <div className="flex flex-col gap-3">
                {analysis.improvements.map((fix, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <span className={`font-bold text-xs mt-0.5 ${fix.icon === '⚠' ? 'text-[#f59e0b]' : 'text-[var(--red)]'}`}>{fix.icon}</span>
                    <div className="flex-1">
                      <div className="text-xs text-[var(--bg)] font-bold mb-0.5">{fix.text}</div>
                      <div className="text-[10px] text-[#4ade80] font-bold tracking-wide">{fix.impact}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-5 border-b border-b-[#222]">
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

          <div className="p-5 mt-auto pb-8">
            <button 
              className="w-full btn btn-red mb-3 justify-center py-3 text-sm font-bold"
              onClick={handleRewrite}
              disabled={isRewriting || !text.trim()}
            >
              {isRewriting ? "Rewriting..." : "AI Rewrite for Max Score"}
            </button>
            <button 
              className="w-full btn border-2 border-[#333] text-white hover:bg-[#222] justify-center py-3 text-sm font-bold"
              onClick={handleAnalyze}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Analysis"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
