import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Billing",
  description: "Manage your GATEPrep Pro subscription, billing history, invoices, and plan usage.",
  path: "/billing",
  noIndex: true,
});

export default function BillingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
