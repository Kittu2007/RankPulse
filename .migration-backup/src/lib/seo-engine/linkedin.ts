import { SeoReport, SeoFactor } from "@/types";
import { clampScore } from "@/lib/utils";

export const LINKEDIN_WEIGHTS = {
  depthScore:     0.28,  // NEW 2026: exact reading time tracked per post
  headlineKW:     0.18,  // #1 LinkedIn search signal
  commentQuality: 0.15,  // Substantive comments from 1st-degree connections
  topicAuthority: 0.12,  // 3-5 posts/week in same niche for expert cluster
  profileComplete:0.10,  // Complete profiles get 30% more views
  aboutKeywords:  0.07,  // First 300 chars indexed
  skillEndorse:   0.05,  // Specific skills endorsed by senior peers
  linkStrategy:   0.03,  // External links in post body = 40-60% penalty
}

export interface LinkedInParams {
    caption: string;
    // Add other params as needed
}

export function scoreLinkedIn(params: LinkedInParams): SeoReport {
    const scores: Record<string, number> = {};
    const flags: { type: 'warn' | 'error', label: string, param: string }[] = [];

    // Dummy scoring logic, replace with real implementation
    scores.depthScore = params.caption.length > 1000 ? 90 : 60;
    scores.headlineKW = 75;
    scores.commentQuality = 80;
    scores.topicAuthority = 85;
    scores.profileComplete = 90;
    scores.aboutKeywords = 70;
    scores.skillEndorse = 65;
    scores.linkStrategy = /https?:\/\//.test(params.caption) ? 20 : 95;

    if (scores.linkStrategy < 50) {
        flags.push({ type: 'error', label: 'External links in post body incur a 40-60% penalty. Move to first comment.', param: 'linkStrategy' });
    }

    const total = Object.keys(scores).reduce((acc, key) => {
        return acc + (scores[key] * (LINKEDIN_WEIGHTS[key as keyof typeof LINKEDIN_WEIGHTS] || 0));
    }, 0);
    
    const factors: SeoFactor[] = Object.entries(scores).map(([name, score]) => ({
        name,
        value: score,
        score: score,
        maxScore: 100,
        pass: !flags.some(f => f.param === name),
        description: '',
      }));
    
      const fixGuide = flags.reduce((acc, flag) => {
        acc[flag.param] = flag.label;
        return acc;
      }, {} as Record<string, string>);

    return {
        overallScore: clampScore(total),
        factors,
        fixGuide,
    };
}
