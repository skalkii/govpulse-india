import { ToolHeader } from "@/components/ToolHeader";
import { EmptyState } from "@/components/EmptyState";
import { getDict } from "@/lib/i18n/server";

export const metadata = { title: "River Health Check" };

export default async function RiversPage() {
  const t = await getDict();
  return (
    <>
      <ToolHeader
        icon="🌊"
        title={t.modules.rivers.title}
        tagline={t.modules.rivers.tagline}
      />
      <EmptyState title="Loading state picker + station list" />
    </>
  );
}
