export function generateSummary(text: string): string {
  // Simulated AI-like summary logic (static/dumb)
  const sentences = text.split('. ');
  const summary = sentences.slice(0, 3).join('. ') + '.';
  return summary;
}