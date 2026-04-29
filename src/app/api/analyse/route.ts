

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { scoreInstagram } from '@/lib/seo-engine/instagram'
import { scoreLinkedIn } from '@/lib/seo-engine/linkedin'
import { scoreTwitter } from '@/lib/seo-engine/x'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const body = await req.json()
  const { platform, caption, options } = body

  let result
  if (platform === 'instagram') result = scoreInstagram({ caption, ...options })
  else if (platform === 'linkedin') result = scoreLinkedIn({ caption, ...options })
  else if (platform === 'x') result = scoreTwitter({ caption, ...options })
  else return NextResponse.json({ error: 'Invalid platform' }, { status: 400 })

  // Save to DB if authenticated
  if (user) {
    await supabase.from('analyses').insert({
      user_id: user.id,
      platform,
      caption,
      score: result.overallScore,
      params: result.factors,
      flags: result.fixGuide,
    })
  }

  return NextResponse.json(result)
}

