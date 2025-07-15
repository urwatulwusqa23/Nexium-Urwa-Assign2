import { Card, CardContent } from "@/components/ui/card";

export const SummaryCard = ({ summary }: { summary: string }) => (
  <Card className="mt-4">
    <CardContent className="p-4 text-right font-serif">{summary}</CardContent>
  </Card>
);
