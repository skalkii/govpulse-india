import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export interface ToolHeaderProps {
  icon: string;
  title: string;
  tagline: string;
}

export function ToolHeader({ icon, title, tagline }: ToolHeaderProps) {
  return (
    <header className="mb-8">
      <Link
        href="/"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" />
        All tools
      </Link>
      <div className="flex items-start gap-3">
        <div className="text-4xl leading-none" aria-hidden>{icon}</div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">{tagline}</p>
        </div>
      </div>
    </header>
  );
}
