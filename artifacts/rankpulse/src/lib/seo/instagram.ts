import { SEOAnalysisResult, SEOParameterScore, SEOScoringOptions, SEOPenaltyFlag, SEOImprovement } from "./types";

export function analyzeInstagram(text: string, options: SEOScoringOptions = {}): SEOAnalysisResult {
  const params: SEOParameterScore[] = [];
  const penalties: SEOPenaltyFlag[] = [];
  const improvements: SEOImprovement[] = [];
  
  // Text analysis basics
  const length = text.length;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const hasLinkInCaption = urlRegex.test(text);
  const hashtags = text.match(/#[a-zA-Z0-9_]+/g) || [];
  const hashtagCount = hashtags.length;
  
  // 1. Watch Time / Retention (30%)
  // Simulated: If it's a hooky text (has interrogative, or good length)
  let watchTimeScore = 60; // Baseline
  if (length < 30) {
    watchTimeScore = 30; // Too short to hold attention
  } else if (text.includes("?") || text.toLowerCase().includes("how to") || text.toLowerCase().includes("wait")) {
    watchTimeScore = 85; 
  }
  
  params.push({
    name: "Watch Time / Hook Strength",
    weight: 30,
    score: watchTimeScore,
    color: watchTimeScore >= 60 ? 'hi' : watchTimeScore >= 40 ? 'md' : 'lo',
    note: watchTimeScore >= 60 ? "Strong hook detected. Should retain attention well." : "First 3 seconds are weak. Add a hook that stops scroll. Target: 60%+ completion."
  });

  if (watchTimeScore < 60) {
    improvements.push({ icon: '⚠', text: 'Strengthen first 3-second hook', impact: 'Est. +6 pts' });
  }

  // 2. DM Sends per Reach (25%)
  let dmScore = 40;
  if (text.toLowerCase().includes("share") || text.toLowerCase().includes("send") || text.toLowerCase().includes("tag a friend")) {
    dmScore = 90;
  }
  params.push({
    name: "DM Sends per Reach",
    weight: 25,
    score: dmScore,
    color: dmScore >= 80 ? 'hi' : dmScore >= 60 ? 'md' : 'lo',
    note: dmScore >= 80 ? "High shareability markers found." : "Content not intrinsically DM-worthy. Add a 'send this to a friend' moment."
  });

  if (dmScore < 60) {
    improvements.push({ icon: '⚠', text: 'Add a highly shareable call-to-action', impact: 'Est. +5 pts' });
  }

  // 3. Caption Keyword Density (10%)
  // Target 2-5% keyword density. Hard to compute semantically without dictionary, we'll estimate based on length > 125 chars
  const keywordScore = length > 125 ? 85 : 40;
  params.push({
    name: "Caption Keywords",
    weight: 10,
    score: keywordScore,
    color: keywordScore >= 80 ? 'hi' : 'lo',
    note: keywordScore >= 80 ? "Good keyword density. Length supports indexing." : "Caption too short for semantic indexing. Expand to 125+ characters."
  });

  // 4. Hashtag Strategy (8%)
  // 3-5 is optimal. >10 penalized
  let hashtagScore = 0;
  if (hashtagCount >= 3 && hashtagCount <= 5) hashtagScore = 100;
  else if (hashtagCount > 0 && hashtagCount <= 10) hashtagScore = 70;
  else if (hashtagCount === 0) hashtagScore = 40;
  else hashtagScore = 10; // penalty for > 10
  
  params.push({
    name: "Hashtag Strategy",
    weight: 8,
    score: hashtagScore,
    color: hashtagScore >= 80 ? 'hi' : hashtagScore >= 60 ? 'md' : 'lo',
    note: hashtagScore === 100 ? `${hashtagCount} niche hashtags — optimal.` : hashtagScore === 10 ? `Penalised: ${hashtagCount} hashtags used. Target 3-5.` : `${hashtagCount} hashtags used. Target 3-5.`
  });

  // 5. Alt Text Optimization (5%)
  const hasAltText = options.hasAltText ?? false;
  const altTextScore = hasAltText ? 100 : 0;
  params.push({
    name: "Alt Text Optimisation",
    weight: 5,
    score: altTextScore,
    color: altTextScore === 100 ? 'hi' : 'lo',
    note: altTextScore === 100 ? "Alt text provided." : "No alt text on media. Add keyword-rich alt text to boost indexing."
  });

  if (!hasAltText) {
    improvements.push({ icon: '⚠', text: 'Add alt text to image/video', impact: 'Est. +3 pts' });
    penalties.push({ id: 'ig-alt', type: 'warn', message: 'No Alt Text' });
  }

  // 6. Profile Completeness (4%)
  const profileComplete = options.profileComplete ?? true;
  params.push({
    name: "Profile Completeness",
    weight: 4,
    score: profileComplete ? 95 : 30,
    color: profileComplete ? 'hi' : 'lo',
    note: profileComplete ? "Profile strong. Category, bio keywords, and link all set." : "Incomplete profile limits authority score."
  });

  // 7. Posting Consistency (3%)
  const consistencyScore = (options.postingFrequency || 4) >= 4 ? 90 : 40;
  params.push({
    name: "Posting Consistency",
    weight: 3,
    score: consistencyScore,
    color: consistencyScore >= 80 ? 'hi' : 'lo',
    note: consistencyScore >= 80 ? "Consistent posting detected." : "Target minimum 4x/week to maintain topic cluster."
  });

  // 8. Content Originality (5%)
  const reposts = options.recentRepostCount || 0;
  const origScore = reposts < 10 ? 95 : 10;
  params.push({
    name: "Content Originality",
    weight: 5,
    score: origScore,
    color: origScore >= 80 ? 'hi' : 'lo',
    note: origScore >= 80 ? "Original content detected." : "Warning: Over 10+ reposts in 30 days limits recommendation reach."
  });

  // PENALTIES
  if (hasLinkInCaption) {
    penalties.push({ id: 'ig-link', type: 'err', message: 'Link in Caption' });
    improvements.push({ icon: '✗', text: 'Move link out of caption body', impact: 'Est. +8 pts' });
  } else {
    penalties.push({ id: 'ig-link', type: 'ok', message: 'No Links in Caption' });
  }

  if (hashtagCount > 10) {
    penalties.push({ id: 'ig-hash', type: 'err', message: 'Hashtag limit exceeded (>10)' });
  } else if (hashtagCount >= 3 && hashtagCount <= 5){
    penalties.push({ id: 'ig-hash', type: 'ok', message: `Hashtags (${hashtagCount})` });
  }

  // Calculate generic flags
  penalties.push({ id: 'ig-kw', type: keywordScore >= 80 ? 'ok' : 'warn', message: keywordScore >= 80 ? 'Caption Keywords' : 'Low Keyword Density' });
  
  if (watchTimeScore < 60) penalties.push({ id: 'ig-hook', type: 'warn', message: 'Hook Weak (first 3s)' });

  // Compute Overall Score (Weighted Average)
  let totalWeightedScore = 0;
  for (const p of params) {
    totalWeightedScore += (p.score * p.weight);
  }
  const overallScore = Math.round(totalWeightedScore / 100);

  // Take top 3 improvements
  const topImprovements = improvements.slice(0, 3);

  return {
    platform: 'instagram',
    overallScore,
    parameters: params,
    penalties,
    improvements: topImprovements
  };
}
