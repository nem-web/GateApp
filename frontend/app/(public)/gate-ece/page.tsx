import { GateBranchSeoPage, branchMetadata } from "@/lib/seo-renderers";

export function generateMetadata() {
  return branchMetadata("gate-ece");
}

export default function Page() {
  return <GateBranchSeoPage slug="gate-ece" />;
}
