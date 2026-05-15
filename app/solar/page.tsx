import { ToolHeader } from "@/components/ToolHeader";
import { EmptyState } from "@/components/EmptyState";

export const metadata = { title: "Solar ROI Calculator — GovPulse India" };

export default function SolarPage() {
  return (
    <>
      <ToolHeader
        icon="☀️"
        title="Solar ROI Calculator"
        tagline="Rooftop solar payback estimate by pincode, roof area, and bill."
      />
      <EmptyState title="Pincode lookup + payback math coming next" />
    </>
  );
}
