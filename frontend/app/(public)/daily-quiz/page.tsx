import { ResourceListPage, resourceListMetadata } from "@/lib/resource-list-page";

export const metadata = resourceListMetadata("Daily GATE Quiz", "Attempt published GATE quiz resources.", "/daily-quiz");

export default function Page() {
  return <ResourceListPage kind="QUIZ" title="Daily GATE Quiz" description="Published quiz resources for daily GATE practice." />;
}
