
import { AnalysisParams, SeoReport, SeoFactor } from "@/types";
import { clampScore } from "@/lib/utils";

export const X_WEIGHTS = {
  replyDepth:    0.25,  // Author reply to reply = +75 weight (vs like = +1)
  rtVelocity:   0.20,  // Retweet = 20x a like in engagement score
  tweepCred:    0.18,  // Hidden 0-100 account reputation; <65 = only 3 posts distributed
  kwHashMatch:  0.12,  // 1-2 hashtags = +21% engagement; multiple = -40%
  linkPenalty:  0.10,  // Links in tweet body = 30-50% reach reduction
  contentFormat:0.08,  // Text-only outperforms video by 30% on X
  recency:      0.05,  // Time decay: -50% visibility every 6 hours
  grokCluster:  0.02,  // Grok AI topic cluster matching
}

export interface TwitterParams {
    caption: string;
    hashtagCount: number;
    // Add other params as needed
}

export function scoreTwitter(params: TwitterParams): SeoReport {
    const scores: Record<string, number> = {};
    const flags: { type: 'warn' | 'error', label: string, param: string }[] = [];

    // Dummy scoring logic
    scores.replyDepth = 70;
    scores.rtVelocity = 80;
    scores.tweepCred = 85;
    scores.contentFormat = 90;
    scores.recency = 95;
    scores.grokCluster = 75;

    if (params.hashtagCount >= 1 && params.hashtagCount <= 2) {
        scores.kwHashMatch = 90;
    } else if (params.hashtagCount > 2) {
        scores.kwHashMatch = 40;
        flags.push({ type: 'error', label: 'Using more than 2 hashtags can reduce engagement by 40%.', param: 'kwHashMatch' });
    } else {
        scores.kwHashMatch = 60;
    }

    if (/https?:\/\//.test(params.caption)) {
        scores.linkPenalty = 40;
        flags.push({ type: 'error', label: 'Links in tweet body reduce reach by 30-50%.', param: 'linkPenalty' });
    } else {
        scores.linkPenalty = 90;
    }

    const total = Object.keys(scores).reduce((acc, key) => {
        return acc + (scores[key] * (X_WEIGHTS[key as keyof typeof X_WEIGHTS] || 0));
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
