import { useState } from "react";
import { toast } from "sonner";

export default function HashtagsPage() {
  const [topic, setTopic] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const generateHashtags = async () => {
    if (!topic) { toast.error("Please enter a topic."); return; }
    setLoading(true);
    setHashtags([]);
    try {
      const response = await fetch("/api/hashtags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      if (!response.ok) throw new Error("Failed to generate hashtags.");
      const data = await response.json();
      setHashtags(data.hashtags);
      toast.success("Hashtags generated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while generating hashtags.");
    } finally { setLoading(false); }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="page-transition min-h-screen flex flex-col bg-[var(--bg)]">
      <div className="page-header flex items-center justify-between">
        <div><div className="page-kicker">Find what ranks</div><div className="d4">Hashtag Intelligence</div></div>
      </div>
      <div className="section-wrap">
        <div className="card max-w-2xl">
          <div className="flex items-center gap-2 mb-4"><div className="sh-accent" /><span className="sh-title">Hashtag Generator</span></div>
          <p className="text-sm text-[#555] mb-4">Enter a topic to generate relevant hashtags for your social media posts.</p>
          <div className="flex gap-2 mb-4">
            <input type="text" placeholder="e.g., 'AI in marketing'" value={topic}
              onChange={(e) => setTopic(e.target.value)} disabled={loading}
              className="input flex-1" />
            <button onClick={generateHashtags} disabled={loading} className="btn btn-red px-6">{loading ? "Generating..." : "Generate"}</button>
          </div>
          {hashtags.length > 0 && (
            <div>
              <div className="label-sm mb-3">Generated Hashtags — click to copy</div>
              <div className="flex flex-wrap gap-2 mb-4">
                {hashtags.map((tag, index) => (
                  <button key={index} onClick={() => copyToClipboard(tag)}
                    className="px-3 py-1.5 border-2 border-[var(--black)] text-xs font-bold hover:bg-[var(--black)] hover:text-white transition-colors cursor-pointer">
                    {tag}
                  </button>
                ))}
              </div>
              <button onClick={() => copyToClipboard(hashtags.join(' '))} className="btn btn-black btn-sm">Copy All</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
