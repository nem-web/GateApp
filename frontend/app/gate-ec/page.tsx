import { GateBranchSeoPage, branchMetadata } from "@/lib/seo-renderers";

export function generateMetadata() {
  return branchMetadata("gate-ec");
}

export default function Page() {
  return <GateBranchSeoPage slug="gate-ec" />;
}
