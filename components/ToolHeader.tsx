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
      <div className="flex items-start gap-4">
        <div className="text-4xl leading-none sm:text-5xl" aria-hidden>{icon}</div>
        <div>
          <h1 className="font-heading text-3xl leading-tight tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">{tagline}</p>
        </div>
      </div>
    </header>
  );
}
