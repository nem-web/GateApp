import { ResourceListPage, resourceListMetadata } from "@/lib/resource-list-page";

export const metadata = resourceListMetadata("Free GATE Formula Sheets", "Browse published GATE formula sheets.", "/free-formula-sheets");

export default function Page() {
  return <ResourceListPage kind="FORMULA" title="Free GATE Formula Sheets" description="Published formula sheets for fast GATE revision." />;
}
