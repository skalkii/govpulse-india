import { ToolHeader } from "@/components/ToolHeader";
import { EmptyState } from "@/components/EmptyState";

export const metadata = { title: "Rainfall Anomaly — GovPulse India" };

export default function RainfallPage() {
  return (
    <>
      <ToolHeader
        icon="🌧️"
        title="Rainfall Anomaly"
        tagline="How this monsoon compares to a district's long-run average."
      />
      <EmptyState title="District picker + anomaly gauge coming next" />
    </>
  );
}
