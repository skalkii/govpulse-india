import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface ResultCardProps {
  title?: string;
  source?: string;
  updatedAt?: string;
  children: React.ReactNode;
}

export function ResultCard({ title, source, updatedAt, children }: ResultCardProps) {
  return (
    <Card>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="space-y-4">{children}</CardContent>
      {(source || updatedAt) && (
        <CardContent className="border-t pt-3 text-xs text-muted-foreground">
          {source && <span>Source: {source}</span>}
          {source && updatedAt && <span> · </span>}
          {updatedAt && <span>Updated {updatedAt}</span>}
        </CardContent>
      )}
    </Card>
  );
}
