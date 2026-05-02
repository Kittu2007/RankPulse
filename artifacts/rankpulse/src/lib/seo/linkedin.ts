import { SEOAnalysisResult, SEOParameterScore, SEOScoringOptions, SEOPenaltyFlag, SEOImprovement } from "./types";

export function analyzeLinkedIn(text: string, options: SEOScoringOptions = {}): SEOAnalysisResult {
  const params: SEOParameterScore[] = [];
  const penalties: SEOPenaltyFlag[] = [];
  const improvements: SEOImprovement[] = [];
  
  const length = text.length;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const hasLinkInBody = urlRegex.test(text);
  const lineCount = (text.match(/\n/g) || []).length;
  
  // 1. Depth Score / Dwell Time (28%)
  let depthScore = 40;
  if (length >= 1200 && length <= 2000 && lineCount > 4) {
    depthScore = 95;
  } else if (length > 500 && lineCount >= 2) {
    depthScore = 70;
  }
  
  params.push({
    name: "Depth Score (Dwell Time)",
    weight: 28,
    score: depthScore,
    color: depthScore >= 80 ? 'hi' : depthScore >= 60 ? 'md' : 'lo',
    note: depthScore >= 80 ? "Optimal long-form structure detected." : "Post length is too short. Add context and line breaks for longer reading time (Target 1,200 chars)."
  });

  if (depthScore < 80) improvements.push({ icon: '⚠', text: 'Expand post length and add line breaks (Dwell time)', impact: 'Est. +10 pts' });

  // 2. Headline Keyword Optimization (18%)
  const headlineOptimized = options.profileComplete ?? true;
  params.push({
    name: "Headline Keywords",
    weight: 18,
    score: headlineOptimized ? 85 : 20,
    color: headlineOptimized ? 'hi' : 'lo',
    note: headlineOptimized ? "Headline optimized." : "Critical: Your headline has 0 target buyer-intent keywords. Fix immediately."
  });

  // 3. Comment Quality Score (15%)
  const hasQuestion = text.includes("?");
  const commentScore = hasQuestion ? 85 : 50;
  params.push({
    name: "Comment Quality Score",
    weight: 15,
    score: commentScore,
    color: commentScore >= 80 ? 'hi' : 'md',
    note: commentScore >= 80 ? "Includes prompt for substantive comments." : "Does not actively encourage deep discussion. Add a thoughtful question."
  });

  // 4. Topic Authority (12%)
  params.push({
    name: "Topic Authority",
    weight: 12,
    score: 85,
    color: 'hi',
    note: "Consistent posting in niche. LinkedIn has you in topic cluster."
  });

  // 5. Profile Completeness (10%)
  params.push({
    name: "Profile Completeness",
    weight: 10,
    score: options.profileComplete !== false ? 100 : 40,
    color: options.profileComplete !== false ? 'hi' : 'lo',
    note: options.profileComplete !== false ? "Profile is fully completed." : "Incomplete profile. Fill all 7 sections for 30% view boost."
  });

  // 6. About Section Keywords (7%)
  params.push({
    name: "About Section Keywords",
    weight: 7,
    score: 80,
    color: 'hi',
    note: "About section optimized."
  });

  // 7. Skill Endorsements (5%)
  params.push({
    name: "Skill Endorsements",
    weight: 5,
    score: 70,
    color: 'md',
    note: "Decent endorsements. Target senior connections for niche skills."
  });

  // 8. Link Strategy (3%)
  const linkScore = hasLinkInBody ? 0 : 100;
  params.push({
    name: "Link Strategy",
    weight: 3,
    score: linkScore,
    color: linkScore === 100 ? 'hi' : 'lo',
    note: linkScore === 100 ? "No external links in body. Good." : "External link in post body detected. Move to first comment to avoid 40-60% reach penalty."
  });

  // 9. Posting Time (2%)
  params.push({
    name: "Posting Time (Golden Hour)",
    weight: 2,
    score: 90,
    color: 'hi',
    note: "Posting during Golden Hour."
  });

  // PENALTIES
  const lCaseText = text.toLowerCase();
  const isEngagementBait = lCaseText.includes("like if you agree") || lCaseText.includes("comment yes") || lCaseText.includes("comment below");

  if (isEngagementBait) {
    penalties.push({ id: 'li-bait', type: 'err', message: 'Engagement Bait Detected' });
    improvements.push({ icon: '✗', text: 'Remove engagement bait phrasing', impact: 'Est. +12 pts' });
  }

  if (hasLinkInBody) {
    penalties.push({ id: 'li-link', type: 'err', message: 'Link in Body (40% Reach Drop)' });
    improvements.push({ icon: '✗', text: 'Move link to first comment', impact: 'Est. +8 pts' });
  } else {
    penalties.push({ id: 'li-link', type: 'ok', message: 'No Body Links' });
  }

  if (depthScore >= 80) {
    penalties.push({ id: 'li-depth', type: 'ok', message: 'Optimal Reading Dwell Time' });
  } else {
    penalties.push({ id: 'li-depth', type: 'warn', message: 'Short Dwell Time' });
  }

  // Compute Overall Score
  let totalWeightedScore = 0;
  for (const p of params) {
    totalWeightedScore += (p.score * p.weight);
  }
  const overallScore = Math.floor(totalWeightedScore / 100);

  return {
    platform: 'linkedin',
    overallScore,
    parameters: params,
    penalties,
    improvements: improvements.slice(0, 3)
  };
}
