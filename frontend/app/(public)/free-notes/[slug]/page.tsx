import { promises as fs } from "fs";
import path from "path";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { branchData, BranchKey } from "@/lib/branchConfig";
import ResourceList, { ResourceData } from "@/components/ResourceList";

interface PageProps {
  params: Promise<{
    slug: string; // e.g., "gate-ee", "gate-in"
  }>;
}

export default async function FreeNotesBranchPage({ params }: PageProps) {
  const { slug } = await params;

  // 1. Validate the branch against our config
  const configKey = `${slug}` as BranchKey;
  const config = branchData[configKey];

  if (!config) {
    notFound();
  }

  // 2. Fetch the free-notes.json data for this specific branch
  const dataFilePath = path.join(
    process.cwd(),
    "data",
    slug,
    "free-notes.json"
  );

  let data: ResourceData;

  try {
    const fileContents = await fs.readFile(dataFilePath, "utf8");
    data = JSON.parse(fileContents);
  } catch {
    // Show 404 if the JSON file is missing
    notFound();
  }

  // Extract dynamic hover color for the back button
  const hoverTextClass = config.theme.text.replace("text-", "hover:text-");

  return (
    <div className={`min-h-screen bg-[#0e0f14] text-white font-sans pb-24 ${config.theme.selection}`}>
      
      {/* 3D Ambient Background Glow tied to branch color */}
      <div className={`absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] blur-[120px] rounded-full pointer-events-none ${config.theme.glow}`} />
      
      <main className="relative z-10 mx-auto max-w-6xl px-4 pt-12 sm:px-6 lg:px-8">
        
        {/* Back Navigation to the main free-notes index */}
        <Link 
          href="/free-notes" 
          className={`mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-400 transition-colors ${hoverTextClass}`}
        >
          <ArrowLeft size={16} /> Back to All Branches
        </Link>

        {/* Reuse our premium UI component! 
          We pass "free-notes" as the resourceType so it automatically picks the BookOpen icon.
        */}
        <ResourceList 
          data={data} 
          config={config} 
          resourceType="free-notes" 
        />
        
      </main>
    </div>
  );
}