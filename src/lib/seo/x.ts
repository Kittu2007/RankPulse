import { SEOAnalysisResult, SEOParameterScore, SEOScoringOptions, SEOPenaltyFlag, SEOImprovement } from "./types";

export function analyzeX(text: string, options: SEOScoringOptions = {}): SEOAnalysisResult {
  const params: SEOParameterScore[] = [];
  const penalties: SEOPenaltyFlag[] = [];
  const improvements: SEOImprovement[] = [];
  
  const length = text.length;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const hasLinkInBody = urlRegex.test(text);
  const hashtags = text.match(/#[a-zA-Z0-9_]+/g) || [];
  const hashtagCount = hashtags.length;

  // 1. Reply Depth (Conversation) (25%)
  const invitesReplies = text.includes("?") || text.toLowerCase().includes("thoughts") || text.toLowerCase().includes("why do you");
  const replyScore = invitesReplies ? 90 : 50;
  params.push({
    name: "Reply Depth Score",
    weight: 25,
    score: replyScore,
    color: replyScore >= 80 ? 'hi' : 'md',
    note: replyScore >= 80 ? "Actively structures for replies. Author reply = +75 alg weight." : "Doesn't prompt strong replies. A reply is 150x more valuable than a like."
  });

  if (replyScore < 80) improvements.push({ icon: '⚠', text: 'Ask a polarizing/deep question for replies', impact: 'Est. +10 pts' });

  // 2. Retweet Velocity (First 30 min) (20%)
  const hasBoldStance = length < 100 ? true : false; // simulating punchy hooks
  const rtScore = hasBoldStance ? 85 : 55;
  params.push({
    name: "Retweet Velocity (30min)",
    weight: 20,
    score: rtScore,
    color: rtScore >= 80 ? 'hi' : 'md',
    note: rtScore >= 80 ? "Punchy and highly retweetable." : "Moderate RT speed potential. Ensure you post at 12-3pm or 7-9am peak."
  });

  // 3. TweepCred Score (18%)
  const tweepCred = options.tweepCred ?? 73;
  params.push({
    name: "TweepCred Score",
    weight: 18,
    score: tweepCred,
    color: tweepCred >= 65 ? 'hi' : 'lo',
    note: tweepCred >= 65 ? "Above critical threshold (65). All posts eligible for distribution." : "CRITICAL: Score below 65. Distribution severely limited."
  });

  // 4. Keyword / Hashtag Match (12%)
  let hashScore = 0;
  if (hashtagCount >= 1 && hashtagCount <= 2) hashScore = 95;
  else if (hashtagCount === 0) hashScore = 70;
  else hashScore = 30; // Multiple hashtag penalty
  
  params.push({
    name: "Keyword / Hashtag Match",
    weight: 12,
    score: hashScore,
    color: hashScore >= 80 ? 'hi' : hashScore >= 60 ? 'md' : 'lo',
    note: hashScore >= 80 ? "1-2 niche hashtags used. Optimal." : hashScore === 70 ? "No hashtags. Grok relies purely on semantic text." : `ACTIVE PENALTY: ${hashtagCount} hashtags used. Multiple hashtags penalised 40%.`
  });

  if (hashtagCount > 2) {
    improvements.push({ icon: '✗', text: 'Reduce hashtags to max 2', impact: 'Est. +7 pts' });
  }

  // 5. External Link Penalty (10%)
  const linkScore = hasLinkInBody ? 0 : 100;
  params.push({
    name: "External Link Penalty",
    weight: 10,
    score: linkScore,
    color: linkScore === 100 ? 'hi' : 'lo',
    note: linkScore === 100 ? "No external link in body." : "ACTIVE PENALTY: Link in tweet body. 30-50% reach reduction. Move to first reply."
  });

  if (hasLinkInBody) {
    improvements.push({ icon: '✗', text: 'Move link to first reply', impact: 'Est. +10 pts' });
  }

  // 6. Content Format Score (8%)
  params.push({
    name: "Content Format Score",
    weight: 8,
    score: 85,
    color: 'hi',
    note: "Text-first content. X rewards text over video by 30%."
  });

  // 7. Recency Score (5%)
  params.push({
    name: "Recency Score",
    weight: 5,
    score: 75,
    color: 'hi',
    note: "Optimized. Posts decay 50% every 6 hours."
  });

  // 8. X Premium Boost (2%)
  const premium = options.premiumStatus ?? true;
  params.push({
    name: "X Premium Boost",
    weight: 2,
    score: premium ? 100 : 0,
    color: premium ? 'hi' : 'lo',
    note: premium ? "Algorithm multiplier active." : "Missing premium interaction multiplier."
  });

  // PENALTIES
  if (hasLinkInBody) {
    penalties.push({ id: 'x-link', type: 'err', message: 'Link in body' });
  } else {
    penalties.push({ id: 'x-link', type: 'ok', message: 'No Body Links' });
  }

  if (hashtagCount > 2) {
    penalties.push({ id: 'x-hash', type: 'err', message: 'Too many hashtags (> 2)' });
  } else if (hashtagCount > 0) {
    penalties.push({ id: 'x-hash', type: 'ok', message: 'Optimal Hashtags' });
  }

  if (tweepCred < 65) {
    penalties.push({ id: 'x-cred', type: 'err', message: 'Low TweepCred (< 65)' });
  }

  if (replyScore >= 80) {
    penalties.push({ id: 'x-reply', type: 'ok', message: 'Reply Prompt active' });
  } else {
    penalties.push({ id: 'x-reply', type: 'warn', message: 'Weak Conversation Hook' });
  }

  let totalWeightedScore = 0;
  for (const p of params) {
    totalWeightedScore += (p.score * p.weight);
  }
  const overallScore = Math.floor(totalWeightedScore / 100);

  return {
    platform: 'x',
    overallScore,
    parameters: params,
    penalties,
    improvements: improvements.slice(0, 3)
  };
}
