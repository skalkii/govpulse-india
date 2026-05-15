import { ToolHeader } from "@/components/ToolHeader";
import { EmptyState } from "@/components/EmptyState";

export const metadata = { title: "Accident Black-Spots — GovPulse India" };

export default function BlackSpotsPage() {
  return (
    <>
      <ToolHeader
        icon="⚠️"
        title="Accident Black-Spots"
        tagline="MoRTH-identified high-risk stretches on national highways."
      />
      <EmptyState title="State filter + Leaflet map coming next" />
    </>
  );
}
