/**
 * Centralized localStorage helpers for RankPulse.
 * Every feature stores data under a namespaced key.
 */

// ── Analyses ─────────────────────────────────────────────────────────────────

export interface SavedAnalysis {
  id: number;
  platform: string;
  content_text: string;
  overall_score: number;
  parameter_scores?: any[];
  penalties?: any[];
  suggestions?: any[];
  created_at: string;
}

export function getAnalyses(): SavedAnalysis[] {
  try { return JSON.parse(localStorage.getItem("rp_analyses") || "[]"); }
  catch { return []; }
}

export function saveAnalysis(a: SavedAnalysis): void {
  const saved = getAnalyses();
  saved.unshift(a);
  localStorage.setItem("rp_analyses", JSON.stringify(saved.slice(0, 50)));
}

// ── Content Ideas ────────────────────────────────────────────────────────────

export interface SavedIdea {
  id: number;
  score: number;
  title: string;
  hook: string;
  tags: string[];
  format: string;
  saved_at: string;
}

export function getSavedIdeas(): SavedIdea[] {
  try { return JSON.parse(localStorage.getItem("rp_ideas") || "[]"); }
  catch { return []; }
}

export function saveIdea(idea: SavedIdea): void {
  const saved = getSavedIdeas();
  if (saved.some(s => s.title === idea.title)) return; // no dupes
  saved.unshift(idea);
  localStorage.setItem("rp_ideas", JSON.stringify(saved.slice(0, 50)));
}

export function removeSavedIdea(id: number): void {
  const saved = getSavedIdeas().filter(i => i.id !== id);
  localStorage.setItem("rp_ideas", JSON.stringify(saved));
}

// ── Keyword Sets ─────────────────────────────────────────────────────────────

export interface KeywordSet {
  id: number;
  name: string;
  platform: string;
  keywords: string[];
  created_at: string;
}

export function getKeywordSets(): KeywordSet[] {
  try { return JSON.parse(localStorage.getItem("rp_kw_sets") || "[]"); }
  catch { return []; }
}

export function saveKeywordSet(set: KeywordSet): void {
  const saved = getKeywordSets();
  saved.unshift(set);
  localStorage.setItem("rp_kw_sets", JSON.stringify(saved.slice(0, 20)));
}

export function deleteKeywordSet(id: number): void {
  const saved = getKeywordSets().filter(s => s.id !== id);
  localStorage.setItem("rp_kw_sets", JSON.stringify(saved));
}

// ── Competitors ──────────────────────────────────────────────────────────────

export interface TrackedCompetitor {
  id: number;
  handle: string;
  name: string;
  platform: string;
  added_at: string;
}

export function getCompetitors(): TrackedCompetitor[] {
  try { return JSON.parse(localStorage.getItem("rp_competitors") || "[]"); }
  catch { return []; }
}

export function addCompetitor(comp: TrackedCompetitor): void {
  const saved = getCompetitors();
  if (saved.some(c => c.handle.toLowerCase() === comp.handle.toLowerCase())) return;
  saved.unshift(comp);
  localStorage.setItem("rp_competitors", JSON.stringify(saved.slice(0, 20)));
}

export function removeCompetitor(id: number): void {
  const saved = getCompetitors().filter(c => c.id !== id);
  localStorage.setItem("rp_competitors", JSON.stringify(saved));
}

// ── Scheduled Posts ──────────────────────────────────────────────────────────

export interface ScheduledPost {
  id: number;
  day: number; // 1-28
  platform: string; // ig | li | x
  text: string;
  score?: number;
  created_at: string;
}

export function getScheduledPosts(): ScheduledPost[] {
  try { return JSON.parse(localStorage.getItem("rp_schedule") || "[]"); }
  catch { return []; }
}

export function saveScheduledPost(post: ScheduledPost): void {
  const saved = getScheduledPosts();
  saved.push(post);
  localStorage.setItem("rp_schedule", JSON.stringify(saved));
}

export function removeScheduledPost(id: number): void {
  const saved = getScheduledPosts().filter(p => p.id !== id);
  localStorage.setItem("rp_schedule", JSON.stringify(saved));
}

// ── Profile Audit Overrides ──────────────────────────────────────────────────

export interface ProfileAuditData {
  platform: string;
  username: string;
  bio: string;
  updated_at: string;
}

export function getProfileAudit(platform: string): ProfileAuditData | null {
  try {
    const all = JSON.parse(localStorage.getItem("rp_audits") || "{}");
    return all[platform] ?? null;
  } catch { return null; }
}

export function saveProfileAudit(data: ProfileAuditData): void {
  try {
    const all = JSON.parse(localStorage.getItem("rp_audits") || "{}");
    all[data.platform] = data;
    localStorage.setItem("rp_audits", JSON.stringify(all));
  } catch { /* ignore */ }
}
