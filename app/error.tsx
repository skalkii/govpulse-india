"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: Props) {
  useEffect(() => {
    console.error("[GovPulse] route error:", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-xl py-12 text-center">
      <div className="text-5xl" aria-hidden>⚠️</div>
      <h1 className="mt-4 font-heading text-3xl tracking-tight">Something broke</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {error.message || "An unexpected error happened while loading this page."}
      </p>
      {error.digest && (
        <p className="mt-1 font-mono text-xs text-muted-foreground">
          Reference: {error.digest}
        </p>
      )}
      <div className="mt-6 flex justify-center gap-2">
        <Button onClick={() => reset()}>Try again</Button>
        <Link
          href="/"
          className="inline-flex h-8 items-center rounded-lg border border-border px-3 text-sm font-medium hover:bg-muted"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}
