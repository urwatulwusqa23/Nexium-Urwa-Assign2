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
  <div
    className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed flex items-center justify-center px-4"
    style={{ backgroundImage: "url('/bg.jpg')" }}
  >
    <main className="w-full max-w-xl backdrop-blur-md bg-white/70 rounded-xl p-6 space-y-6 shadow-xl">
      <h1 className="text-3xl font-bold text-center text-gray-800">📰 Blog Summarizer</h1>

      <div className="space-y-2">
        <Label htmlFor="url" className="text-lg font-medium text-gray-700">
          Enter Blog URL:
        </Label>
        <Input
          id="url"
          type="url"
          placeholder="https://example.com/blog-post"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="p-3 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
        />
        <Button
          onClick={handleScrape}
          disabled={loading}
          className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2"
        >
          {loading ? "Summarizing..." : "Summarize Blog"}
        </Button>
      </div>

      {error && (
        <Card className="bg-red-50 border border-red-200">
          <CardContent className="text-red-700 font-medium p-4">{error}</CardContent>
        </Card>
      )}

      {summary && (
        <Card className="border border-gray-200 shadow-sm bg-white">
          <CardContent className="space-y-4 p-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">📄 Summary (English)</h2>
            <p className="text-gray-700 leading-relaxed">{summary}</p>
          </CardContent>
        </Card>
      )}

      {urduSummary && (
        <Card className="border border-gray-200 shadow-sm bg-white">
          <CardContent className="space-y-4 p-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">🌐 Urdu Summary</h2>
            <p className="text-right font-urdu text-gray-700 leading-loose tracking-wide">{urduSummary}</p>
          </CardContent>
        </Card>
      )}
    </main>
  </div>
);
}