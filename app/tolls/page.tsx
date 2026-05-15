import { ToolHeader } from "@/components/ToolHeader";
import { EmptyState } from "@/components/EmptyState";

export const metadata = { title: "Highway Toll Calculator — GovPulse India" };

export default function TollsPage() {
  return (
    <>
      <ToolHeader
        icon="🚗"
        title="Highway Toll Calculator"
        tagline="Estimate toll cost between two cities by vehicle class."
      />
      <EmptyState title="Plaza autocomplete + corridor sum coming next" />
    </>
  );
}
