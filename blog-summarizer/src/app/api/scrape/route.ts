import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";
import { connectMongo, Blog } from "@/lib/mongodb";
import { supabase } from "@/lib/supabase";

function cleanBlogText(text: string): string {
  // Remove first 29 characters
  let cleaned = text.length > 29 ? text.slice(30) : "";

  // Remove "Member-only story — 122", "— 122", or just "Member-only story"
  cleaned = cleaned
    .replace(/Member-only story\s*—*\s*\d*/gi, "")
    .replace(/^\s*—*\s*\d+\s*$/gm, "")
    .replace(/^\s*Member-only story\s*$/gim, "")
    .trim();

  return cleaned;
}


function generateSummary(text: string): string {
  const sentences = text.split(".").map(s => s.trim()).filter(Boolean);
  if (sentences.length === 0) return "";
  return sentences.slice(0, 3).join(". ") + ".";
}
import { urduDictionary } from "@/lib/urduDictionary";

function translateToUrdu(text: string): string {
  return text
    .split(" ")
    .map((word) => {
      const clean = word.toLowerCase().replace(/[^a-z]/gi, "");
      return urduDictionary[clean] || word;
    })
    .join(" ");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    console.log("📥 Received URL:", url);

    // Fetch the HTML
const { data: html } = await axios.get(url, {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
  }
});
    const $ = cheerio.load(html);

    let paragraphs = $("article p");
    if (paragraphs.length === 0) paragraphs = $("p");

    const fullText = paragraphs
      .map((_, el) => $(el).text().trim())
      .get()
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    console.log("📄 Extracted text length:", fullText.length);
    if (fullText.length < 50) {
      return NextResponse.json({ error: "Could not extract enough text for summary." }, { status: 400 });
    }
    const cleanedText = cleanBlogText(fullText);
    const summary = generateSummary(cleanedText);

    if (!summary || summary.length < 10) {
      return NextResponse.json({ error: "No summary could be generated." }, { status: 400 });
    }

    console.log("📝 Summary:", summary);

   
const urduSummary = await translateToUrdu(summary);
    console.log("🌐 Urdu Summary:", urduSummary);

    // Save full text to MongoDB
    await connectMongo();
    const blog = new Blog({ url, text: cleanedText });
    await blog.save();
const { data, error: supabaseError } = await supabase
  .from("summarize")
  .insert([{ url, summary, urdu: urduSummary }]);

if (supabaseError) {
  console.error("❌ Supabase insert error:", supabaseError); // log full error
} else {
  console.log("✅ Supabase insert success:", data);
}



   // await supabase.from("summaries").insert([{ url, summary, urdu: urduSummary }]);

    return NextResponse.json({ url, summary, urduSummary }, { status: 200 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.error("❌ Server error:", e.message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}