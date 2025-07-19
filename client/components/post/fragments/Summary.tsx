export interface SummaryProps {
  summary: string;
}

export function Summary({ summary }: SummaryProps) {
  return (
    <p className="text-muted-foreground text-base leading-relaxed">{summary}</p>
  );
}
