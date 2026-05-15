import { ToolHeader } from "@/components/ToolHeader";
import { EmptyState } from "@/components/EmptyState";

export const metadata = { title: "River Health Check — GovPulse India" };

export default function RiversPage() {
  return (
    <>
      <ToolHeader
        icon="🌊"
        title="River Health Check"
        tagline="CPCB station readings: dissolved oxygen, BOD, pH, fecal coliform."
      />
      <EmptyState title="Loading state picker + station list" />
    </>
  );
}
