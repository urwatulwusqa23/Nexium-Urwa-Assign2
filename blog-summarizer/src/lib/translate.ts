import { urduDictionary } from "@/lib/urduDictionary";

export function translateToUrdu(text: string): string {
  return text
    .split(" ")
    .map(word => {
      const clean = word.toLowerCase().replace(/[^\w]/g, ""); // remove punctuation
      return urduDictionary[clean] || word;
    })
    .join(" ");
}
