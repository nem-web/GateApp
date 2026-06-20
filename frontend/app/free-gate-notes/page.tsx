import { ResourceListPage, resourceListMetadata } from "@/lib/resource-list-page";

export const metadata = resourceListMetadata("Free GATE Notes", "Browse published free GATE notes from GATEPrep.", "/free-gate-notes");

export default function Page() {
  return <ResourceListPage kind="NOTE" title="Free GATE Notes" description="Published GATE notes organized for search, revision, and subject discovery." />;
}
