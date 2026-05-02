import { NextRequest, NextResponse } from "next/server";

function toTag(value: string): string {
  return `#${value.replace(/[^a-zA-Z0-9]/g, "")}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const topic = typeof body?.topic === "string" ? body.topic.trim() : "";

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const normalized = topic.toLowerCase();
    const words = normalized.split(/\s+/).filter(Boolean);
    const base = words.join("");

    const generated = new Set<string>();
    const suffixes = [
      "tips",
      "strategy",
      "growth",
      "marketing",
      "creator",
      "content",
      "digital",
      "socialmedia",
      "branding",
      "business",
    ];

    generated.add(toTag(base));
    words.slice(0, 4).forEach((word: string) => generated.add(toTag(word)));
    suffixes.forEach((suffix) => generated.add(toTag(`${base}${suffix}`)));

    const hashtags = Array.from(generated).slice(0, 30);

    return NextResponse.json({ hashtags });
  } catch (error) {
    console.error("Hashtag API error", error);
    return NextResponse.json({ error: "Failed to generate hashtags" }, { status: 500 });
  }
}
