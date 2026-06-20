import { GateBranchSeoPage, branchMetadata } from "@/lib/seo-renderers";

export function generateMetadata() {
  return branchMetadata("gate-ce");
}

export default function Page() {
  return <GateBranchSeoPage slug="gate-ce" />;
}
