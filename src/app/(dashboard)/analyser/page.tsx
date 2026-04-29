"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SeoReport, SocialPlatform } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AnalyserPage() {
  const [platform, setPlatform] = useState<SocialPlatform>("instagram");
  const [caption, setCaption] = useState("");
  const [report, setReport] = useState<SeoReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyse = async () => {
    setIsLoading(true);
    setReport(null);
    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, caption, options: { hashtagCount: (caption.match(/#/g) || []).length, hasAltText: true, postingFrequencyPerWeek: 4, hasLinkInCaption: false, hasWatermark: false } }),
      });
      if (!response.ok) {
        throw new Error("Failed to analyse");
      }
      const data = await response.json();
      setReport(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-h1">Content Analyser</CardTitle>
          <CardDescription>
            Get an instant SEO score for your social media posts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="instagram" onValueChange={(value) => setPlatform(value as SocialPlatform)}>
            <TabsList>
              <TabsTrigger value="instagram">Instagram</TabsTrigger>
              <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
              <TabsTrigger value="x">X (Twitter)</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="grid gap-4 mt-4">
            <div className="grid gap-2">
              <Label htmlFor="caption">Caption</Label>
              <Textarea
                id="caption"
                placeholder="Paste your caption here..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="min-h-[200px] text-body"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-between">
          <Button onClick={handleAnalyse} disabled={isLoading || !caption}>
            {isLoading ? "Analysing..." : "Analyse Post"}
          </Button>
          {report && (
             <Button variant="secondary">Rewrite with AI</Button>
          )}
        </CardFooter>
      </Card>

      {report && (
        <Card>
          <CardHeader>
            <CardTitle className="text-h2">Analysis Report</CardTitle>
            <CardDescription>Overall Score: <span className="text-display text-primary">{report.overallScore}</span>/100</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Display report details here */}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
