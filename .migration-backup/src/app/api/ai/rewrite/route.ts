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

    const { caption, platform, score } = await req.json();

    if (!caption) {
      return NextResponse.json({ error: "Caption is required" }, { status: 400 });
    }

    const payload = `Rewrite this ${platform} post to maximize SEO performance. Current score: ${score}/100. Write the exact rewritten post directly, do not add introductory phrases.
    
Post:
${caption}`;

    const params: any = {
      model: "deepseek-ai/deepseek-v3.1-terminus",
      messages: [{ role: "user", content: payload }],
      temperature: 0.2,
      top_p: 0.7,
      max_tokens: 8192,
      stream: true,
      extra_body: { chat_template_kwargs: { thinking: true } },
    };

    const completion = await openai.chat.completions.create(params);

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of (completion as any)) {
          const content = chunk.choices?.[0]?.delta?.content;
          if (content) {
            controller.enqueue(new TextEncoder().encode(content));
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err: any) {
    console.error("AI Rewrite API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
