import React from "react";
import { notFound } from "next/navigation";
import { branchData, BranchKey } from "@/lib/branchConfig";
import ComingSoon from "@/components/ComingSoon2";
import ComingSoon2 from "@/components/ComingSoon2";

interface PageProps {
  params: Promise<{
    slug: string; // e.g., "gate-ee", "gate-in"
  }>;
}

export default async function RevisionNotesBranchPage({ params }: PageProps) {
  const { slug } = await params;

  // 1. Validate the branch against our config
  const configKey = `${slug}` as BranchKey;
  const config = branchData[configKey];

  if (!config) {
    notFound();
  }

  return (
    <div className={`min-h-screen bg-[#0e0f14] text-white font-sans pb-24 ${config.theme.selection}`}>
      
      {/* Pass the branch config into the ComingSoon component for dynamic styling */}
      <ComingSoon2 
        title={`${config.shortName} Revision Notes`}
        description={`We are currently curating the ultimate short notes, formula mind-maps, and quick revision sheets for ${config.name}. Check back soon!`}
        backLink="/revision-notes"
        backText="Back to All Branches"
        config={config}
      />
      
    </div>
  );
}