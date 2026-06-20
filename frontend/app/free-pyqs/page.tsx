import { ResourceListPage, resourceListMetadata } from "@/lib/resource-list-page";

export const metadata = resourceListMetadata("Free GATE PYQs", "Browse published GATE previous-year question explanations.", "/free-pyqs");

export default function Page() {
  return <ResourceListPage kind="PYQ" title="Free GATE PYQs" description="Published previous-year question explanations and linked practice resources." />;
}
