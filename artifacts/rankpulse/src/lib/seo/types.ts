export interface SEOParameterScore {
  name: string;
  weight: number;
  score: number; // 0 to 100
  color: 'hi' | 'md' | 'lo';
  note: string;
}

export interface SEOAnalysisResult {
  platform: 'instagram' | 'linkedin' | 'x';
  overallScore: number;
  parameters: SEOParameterScore[];
  penalties: SEOPenaltyFlag[];
  improvements: SEOImprovement[];
}

export interface SEOPenaltyFlag {
  id: string;
  type: 'err' | 'warn' | 'ok';
  message: string;
}

export interface SEOImprovement {
  icon: string;
  text: string;
  impact: string;
}

export interface SEOScoringOptions {
  profileComplete?: boolean;
  engagementBaitRegex?: RegExp[];
  hasExternalLinkInBody?: boolean;
  tweepCred?: number;
  postingFrequency?: number; // posts per week
  accountAge?: number; // months
  recentRepostCount?: number;
  imageCount?: number;
  hasAltText?: boolean;
  premiumStatus?: boolean;
}
