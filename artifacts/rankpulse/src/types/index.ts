import { Database } from "@/lib/supabase/database.types";

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

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Account = Database['public']['Tables']['accounts']['Row'];
export type Analysis = Database['public']['Tables']['analyses']['Row'];
export type Keyword = Database['public']['Tables']['keywords']['Row'];
export type Competitor = Database['public']['Tables']['competitors']['Row'];
export type Plan = Database['public']['Tables']['plans']['Row'];
export type Post = Database['public']['Tables']['posts']['Row'];
