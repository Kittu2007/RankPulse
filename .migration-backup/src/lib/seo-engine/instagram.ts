import { SeoReport, SeoFactor } from "@/types";
import { clampScore } from "@/lib/utils";

export const INSTAGRAM_WEIGHTS = {
  watchTime:      0.30,  // Hook strength — first 3 seconds determine completion
  dmSends:        0.25,  // DM sends/reach ratio — weighted 3-5x more than likes
  captionKeywords:0.10,  // 2-5% keyword density in first 125 chars
  hashtags:       0.08,  // 3-5 niche hashtags optimal; >10 penalised
  altText:        0.05,  // Manual alt text with keywords — high leverage
  profileComplete:0.04,  // Bio, link, category, highlights
  consistency:    0.03,  // 4+ posts/week for topic cluster maintenance
  originality:    0.05,  // Watermarked content excluded from Recommendations
  // Reserved/bonus:0.10
} as const

export interface InstagramParams {
  caption: string
  hasAltText: boolean
  hashtagCount: number
  hashtags: string[]
  postingFrequencyPerWeek: number
  hasLinkInCaption: boolean
  hasWatermark: boolean
}

export function scoreInstagram(params: InstagramParams): SeoReport {
  const flags: { type: 'warn' | 'error', label: string, param: string }[] = []
  const scores: Record<string, number> = {}

  // Hook strength — analyse first 125 chars
  const firstChunk = params.caption.slice(0, 125)
  const hookWords = ['save', 'watch', 'try', 'stop', 'wait', 'this', 'secret', 'hack', 'never', 'always']
  const hasHook = hookWords.some(w => firstChunk.toLowerCase().includes(w))
  scores.watchTime = hasHook ? 80 : 45

  // Caption keyword density
  const wordCount = params.caption.split(' ').length
  const keywordDensity = wordCount > 0 ? Math.min(wordCount / 100, 1) : 0
  scores.captionKeywords = Math.round(keywordDensity * 100)

  // Hashtag strategy
  if (params.hashtagCount === 0) {
    scores.hashtags = 20
    flags.push({ type: 'warn', label: 'No hashtags — add 3-5 niche hashtags', param: 'hashtags' })
  } else if (params.hashtagCount >= 3 && params.hashtagCount <= 5) {
    scores.hashtags = 95
  } else if (params.hashtagCount > 10) {
    scores.hashtags = 30
    flags.push({ type: 'error', label: `${params.hashtagCount} hashtags — over 10 triggers penalty`, param: 'hashtags' })
  } else {
    scores.hashtags = 70
  }

  // Alt text
  scores.altText = params.hasAltText ? 90 : 0
  if (!params.hasAltText) {
    flags.push({ type: 'warn', label: 'No alt text — adds indexing leverage', param: 'altText' })
  }

  // Link in caption penalty
  const hasLink = params.hasLinkInCaption || /https?:\/\//.test(params.caption)
  if (hasLink) {
    flags.push({ type: 'error', label: 'Link in caption — suppresses Explore reach 30-50%', param: 'links' })
  }

  // Watermark check
  if (params.hasWatermark) {
    flags.push({ type: 'error', label: 'Watermarked content — excluded from Recommendations', param: 'originality' })
    scores.originality = 10
  } else {
    scores.originality = 90
  }

  // Posting consistency
  scores.consistency = Math.min(params.postingFrequencyPerWeek / 4 * 100, 100)
  if (params.postingFrequencyPerWeek < 4) {
    flags.push({ type: 'warn', label: `${params.postingFrequencyPerWeek}x/week — needs 4+ to maintain topic cluster`, param: 'consistency' })
  }

  // DM sends score (estimated from caption quality)
  scores.dmSends = hasHook ? 65 : 35
  scores.profileComplete = 80 // Default — improve with profile audit integration

  // Weighted total
  const total = Math.round(
    scores.watchTime * INSTAGRAM_WEIGHTS.watchTime +
    scores.dmSends * INSTAGRAM_WEIGHTS.dmSends +
    scores.captionKeywords * INSTAGRAM_WEIGHTS.captionKeywords +
    scores.hashtags * INSTAGRAM_WEIGHTS.hashtags +
    scores.altText * INSTAGRAM_WEIGHTS.altText +
    scores.profileComplete * INSTAGRAM_WEIGHTS.profileComplete +
    scores.consistency * INSTAGRAM_WEIGHTS.consistency +
    scores.originality * INSTAGRAM_WEIGHTS.originality
  )
  
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


  return { overallScore: Math.min(total, 100), factors, fixGuide }
}
