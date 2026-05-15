import { ToolHeader } from "@/components/ToolHeader";
import { EmptyState } from "@/components/EmptyState";

export const metadata = { title: "AQI Now & Next 24h — GovPulse India" };

export default function AqiPage() {
  return (
    <>
      <ToolHeader
        icon="🌬️"
        title="AQI Now & Next 24h"
        tagline="Live air quality and a transparent rules-based forecast for any Indian city."
      />
      <EmptyState
        title="Wiring up CPCB live feed"
        hint="City picker and forecast cards land in the next commit."
      />
    </>
  );
}
