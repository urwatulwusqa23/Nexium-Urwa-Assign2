"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [urduSummary, setUrduSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleScrape = async () => {
    setLoading(true);
    setSummary("");
    setUrduSummary("");
    setError("");

    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch summary");
      }

      setSummary(data.summary);
      setUrduSummary(data.urduSummary);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">📰 Blog Summarizer</h1>

      <div className="space-y-2">
        <Label htmlFor="url">Enter Blog URL:</Label>
        <Input
          id="url"
          type="url"
          placeholder="https://example.com/blog-post"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button onClick={handleScrape} disabled={loading} className="w-full mt-2">
          {loading ? "Summarizing..." : "Summarize Blog"}
        </Button>
      </div>

      {error && (
        <Card className="bg-red-100 text-red-700 p-4">
          <CardContent>{error}</CardContent>
        </Card>
      )}

      {summary && (
        <Card>
          <CardContent className="space-y-2 pt-4">
            <h2 className="text-lg font-semibold">📄 Summary (English)</h2>
            <p>{summary}</p>
          </CardContent>
        </Card>
      )}

      {urduSummary && (
        <Card>
          <CardContent className="space-y-2 pt-4">
            <h2 className="text-lg font-semibold">🌐 Urdu Summary</h2>
            <p className="font-urdu">{urduSummary}</p>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
