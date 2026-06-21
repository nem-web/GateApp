import { resourceListMetadata } from "@/lib/resource-list-page";
import { FreeNotesClient } from "./FreeNotesClient"; // Adjust path as needed

export const metadata = resourceListMetadata(
  "Free GATE Notes", 
  "Browse published free GATE notes organized by subject and topics from GATEPrep.", 
  "/free-gate-notes"
);

export default function Page() {
  return <FreeNotesClient />;
}