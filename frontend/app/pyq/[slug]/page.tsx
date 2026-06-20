import { ResourceSeoPage, resourceMetadata } from "@/lib/resource-renderer";

export function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  return resourceMetadata(props, "PYQ");
}

export default function Page(props: { params: Promise<{ slug: string }> }) {
  return <ResourceSeoPage {...props} kind="PYQ" />;
}
