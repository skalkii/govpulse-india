export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-muted/70 ${className}`}
      aria-hidden
    />
  );
}
