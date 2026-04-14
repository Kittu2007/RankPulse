/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const openai = new OpenAI({
      baseURL: "https://integrate.api.nvidia.com/v1",
      apiKey: process.env.NVIDIA_API_KEY || "mock_key",
    });

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { niche, platform, style, keywords } = await req.json();

    const payload = `You are an expert social media strategist. Generate 5 highly optimized content ideas for a ${niche} account on ${platform}. 
    Style: ${style}. Keywords to target: ${keywords || "none"}.
    
    Output strictly in JSON format. The response must be a JSON object with a single key "ideas" containing an array of objects.
    Each object must have exactly three keys:
    - "title": a catchy title for the idea.
    - "hook": the SEO hook.
    - "score": an integer representing the estimated SEO score (between 75 and 99).
    
    Do not output markdown code blocks. Output exactly the raw JSON text starting with { and ending with }.`;

    const params: any = {
      model: "deepseek-ai/deepseek-v3.1-terminus",
      messages: [{ role: "user", content: payload }],
      temperature: 0.2,
      top_p: 0.7,
      max_tokens: 8192,
      extra_body: { chat_template_kwargs: { thinking: true } },
    };

    const completion = await openai.chat.completions.create(params);

    let content = completion.choices?.[0]?.message?.content || "";
    const jsonMatch = content.match(/```json\n([\s\S]*)\n```/);
    if (jsonMatch) content = jsonMatch[1];
    
    let parsedResponse = { ideas: [] };
    try {
      parsedResponse = JSON.parse(content.trim());
    } catch(err) {
      const firstBrace = content.indexOf('{');
      const lastBrace = content.lastIndexOf('}');
      if(firstBrace !== -1 && lastBrace !== -1) {
          parsedResponse = JSON.parse(content.substring(firstBrace, lastBrace + 1));
      } else {
        throw new Error("Failed to parse JSON response from AI");
      }
    }

    return NextResponse.json(parsedResponse);
  } catch (err: any) {
    console.error("AI Generate API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
