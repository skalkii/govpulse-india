"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import type StationMap from "./StationMap";

const StationMapNoSSR = dynamic(() => import("./StationMap"), {
  ssr: false,
  loading: () => (
    <div className="grid h-[420px] place-items-center rounded-xl border bg-muted/40 text-sm text-muted-foreground">
      Loading map…
    </div>
  ),
});

export function StationMapClient(props: ComponentProps<typeof StationMap>) {
  return <StationMapNoSSR {...props} />;
}
