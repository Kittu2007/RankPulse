"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function HashtagsPage() {
  const [topic, setTopic] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const generateHashtags = async () => {
    if (!topic) {
      toast.error("Please enter a topic.");
      return;
    }
    setLoading(true);
    setHashtags([]);
    try {
      const response = await fetch("/api/hashtags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate hashtags.");
      }

      const data = await response.json();
      setHashtags(data.hashtags);
      toast.success("Hashtags generated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while generating hashtags.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Hashtag Generator</CardTitle>
          <CardDescription>
            Enter a topic to generate relevant hashtags for your social media posts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="text"
              placeholder="e.g., 'AI in marketing'"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={loading}
            />
            <Button onClick={generateHashtags} disabled={loading}>
              {loading ? "Generating..." : "Generate"}
            </Button>
          </div>
        </CardContent>
        {hashtags.length > 0 && (
          <CardFooter className="flex-col items-start gap-4">
            <div className="flex flex-wrap gap-2">
              {hashtags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => copyToClipboard(tag)}>
                  {tag}
                </Badge>
              ))}
            </div>
            <Button variant="outline" onClick={() => copyToClipboard(hashtags.join(' '))}>Copy All</Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
