import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export interface ToolCardProps {
  href: string;
  title: string;
  description: string;
  icon: string;
  external?: boolean;
}

export function ToolCard({ href, title, description, icon, external = false }: ToolCardProps) {
  const Arrow = external ? ArrowUpRight : ArrowRight;
  const cta = external ? "Open" : "Open";
  const linkProps = external ? { target: "_blank", rel: "noreferrer noopener" } : {};

  return (
    <Link href={href} {...linkProps} className="group block">
      <Card className="h-full overflow-hidden border-border/60 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-primary/40 group-hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.18)] group-focus-visible:ring-2 group-focus-visible:ring-ring">
        <CardHeader>
          <div className="text-3xl sm:text-4xl" aria-hidden>{icon}</div>
          <CardTitle className="mt-3 font-heading text-xl tracking-tight">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between text-sm font-medium text-primary">
          <span>{cta}</span>
          <Arrow className="size-4 transition-transform group-hover:translate-x-0.5" />
        </CardContent>
      </Card>
    </Link>
  );
}
