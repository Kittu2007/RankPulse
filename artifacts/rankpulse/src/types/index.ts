export type SocialPlatform = "instagram" | "linkedin" | "x";

export interface AnalysisParams {
  caption: string;
  hashtagCount: number;
  hashtags?: string[];
  hasAltText?: boolean;
  postingFrequencyPerWeek?: number;
  hasLinkInCaption?: boolean;
  hasWatermark?: boolean;
}

export interface SeoFactor {
  name: string;
  value: number;
  score: number;
  maxScore: number;
  pass: boolean;
  description: string;
}

export interface SeoReport {
  overallScore: number;
  factors: SeoFactor[];
  fixGuide: Record<string, string>;
}
