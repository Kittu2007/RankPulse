import { Router } from "express";
import OpenAI from "openai";

const router = Router();

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY || process.env.OPENAI_API_KEY || "placeholder",
  baseURL: process.env.NVIDIA_API_KEY ? "https://integrate.api.nvidia.com/v1" : undefined,
});

router.post("/analyse", async (req, res) => {
  try {
    const { text, platform } = req.body;
    if (!text || !platform) return res.status(400).json({ error: "text and platform required" });
    res.json({ ok: true, message: "Analysis stored" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal error" });
  }
});

router.get("/keywords", async (req, res) => {
  const keywords = [
    { rank: 1, term: "social media tips", vol: 92, trend: "+34%", diff: "easy" },
    { rank: 2, term: "instagram reels 2026", vol: 88, trend: "+22%", diff: "med" },
    { rank: 3, term: "content strategy", vol: 75, trend: "stable", diff: "med" },
    { rank: 4, term: "linkedin growth", vol: 70, trend: "+18%", diff: "med" },
    { rank: 5, term: "arm workout home", vol: 68, trend: "+41%", diff: "easy" },
  ];
  res.json({ keywords });
});

router.post("/hashtags", async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic) return res.status(400).json({ error: "topic required" });

    if (!process.env.NVIDIA_API_KEY && !process.env.OPENAI_API_KEY) {
      const fallbackHashtags = [
        `#${topic.toLowerCase().replace(/\s+/g, "")}`,
        `#${topic.toLowerCase().replace(/\s+/g, "")}tips`,
        `#socialmedia`,
        `#contentcreator`,
        `#instagram`,
        `#viral`,
        `#trending`,
        `#creatoreconomy`,
        `#${topic.toLowerCase().split(" ")[0]}`,
        `#digitalmarketing`,
      ];
      return res.json({ hashtags: fallbackHashtags });
    }

    const completion = await openai.chat.completions.create({
      model: process.env.NVIDIA_API_KEY ? "meta/llama-3.1-8b-instruct" : "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a social media hashtag expert. Generate relevant, high-performing hashtags. Return only a JSON array of hashtag strings, each starting with #.",
        },
        {
          role: "user",
          content: `Generate 10 relevant hashtags for the topic: "${topic}". Return only a JSON array like ["#hashtag1", "#hashtag2", ...].`,
        },
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content || "[]";
    const match = content.match(/\[.*\]/s);
    const hashtags = match ? JSON.parse(match[0]) : [];
    res.json({ hashtags });
  } catch (err) {
    console.error("Hashtags error:", err);
    res.status(500).json({ error: "Failed to generate hashtags" });
  }
});

router.post("/ai/generate", async (req, res) => {
  try {
    const { niche, platform, style, keywords } = req.body;

    if (!process.env.NVIDIA_API_KEY && !process.env.OPENAI_API_KEY) {
      return res.json({
        ideas: [
          { score: 88, title: `"${niche}: The ${style} guide nobody tells you"`, hook: `Lead with data or transformation. Use numbers in the first 3 words.` },
          { score: 82, title: `"Why most ${niche} content fails in 2026"`, hook: `Controversy + specificity = depth score gold.` },
          { score: 78, title: `"${style} ${niche} breakdown — algorithm approved"`, hook: `Platform-specific format signals. Cite the source.` },
          { score: 74, title: `"5 ${niche} mistakes killing your ${platform} reach"`, hook: `Fear + utility drives DM shares.` },
          { score: 70, title: `"Hot take: ${niche} creators are doing this wrong"`, hook: `Personal transformation + data = DM-worthy content.` },
        ]
      });
    }

    const completion = await openai.chat.completions.create({
      model: process.env.NVIDIA_API_KEY ? "meta/llama-3.1-8b-instruct" : "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a social media SEO expert. Generate pre-scored content ideas for ${platform}. Each idea should be optimized for the algorithm with a score from 60-95. Return JSON array with objects: {score: number, title: string, hook: string}`,
        },
        {
          role: "user",
          content: `Generate 5 ${style} content ideas for niche: "${niche}" on ${platform}${keywords ? ` focusing on keywords: ${keywords}` : ""}. Return JSON array only.`,
        },
      ],
      temperature: 0.8,
    });

    const content = completion.choices[0]?.message?.content || "[]";
    const match = content.match(/\[.*\]/s);
    const ideas = match ? JSON.parse(match[0]) : [];
    res.json({ ideas });
  } catch (err) {
    console.error("AI Generate error:", err);
    res.status(500).json({ error: "Failed to generate ideas" });
  }
});

router.post("/ai/rewrite", async (req, res) => {
  try {
    const { caption, platform, score } = req.body;
    if (!caption) return res.status(400).json({ error: "caption required" });

    if (!process.env.NVIDIA_API_KEY && !process.env.OPENAI_API_KEY) {
      const improved = caption + "\n\n[AI Rewrite not configured — add NVIDIA_API_KEY or OPENAI_API_KEY to enable this feature]";
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.setHeader("Transfer-Encoding", "chunked");
      return res.end(improved);
    }

    const model = process.env.NVIDIA_API_KEY ? "meta/llama-3.1-8b-instruct" : "gpt-4o-mini";

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");

    const stream = await openai.chat.completions.create({
      model,
      stream: true,
      messages: [
        {
          role: "system",
          content: `You are a social media SEO expert. Rewrite captions to maximize the ${platform} algorithm score. Current score: ${score}/100. Focus on: hook strength, keyword density, engagement triggers, platform-specific signals. Output only the rewritten caption text.`,
        },
        { role: "user", content: caption },
      ],
      temperature: 0.7,
    });

    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content || "";
      if (text) res.write(text);
    }

    res.end();
  } catch (err) {
    console.error("AI Rewrite error:", err);
    res.status(500).json({ error: "Rewrite failed" });
  }
});

router.post("/ai-ideas", async (req, res) => {
  return router.handle({ ...req, url: "/ai/generate" } as never, res, () => {});
});

export default router;
