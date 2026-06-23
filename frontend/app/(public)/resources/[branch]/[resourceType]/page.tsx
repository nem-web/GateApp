import { promises as fs } from "fs";
import path from "path";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { branchData, BranchKey } from "@/lib/branchConfig";
import ResourceList, { ResourceData } from "@/components/ResourceList";

interface PageProps {
  params: Promise<{
    branch: string;
    resourceType: string;
  }>;
}

export default async function DynamicResourcePage({ params }: PageProps) {
  const { branch, resourceType } = await params;

  if (!branch || !resourceType) {
    notFound();
  }

  // 1. Validate branch against config
  const configKey = `${branch}` as BranchKey;
  const config = branchData[configKey];

  if (!config) {
    notFound();
  }

  // 2. Fetch the JSON data
  const dataFilePath = path.join(
    process.cwd(),
    "data",
    branch,
    `${resourceType}.json`
  );

  let data: ResourceData;

  try {
    const fileContents = await fs.readFile(dataFilePath, "utf8");
    data = JSON.parse(fileContents);
  } catch {
    // Show 404 if the JSON file doesn't exist for this branch/resource combo
    notFound();
  }

  // Extract dynamic hover color for the back button
  const hoverTextClass = config.theme.text.replace("text-", "hover:text-");

  return (
    <div className={`min-h-screen bg-[#0e0f14] text-white font-sans pb-24 ${config.theme.selection}`}>
      
      {/* 3D Ambient Background Glow */}
      <div className={`absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] blur-[120px] rounded-full pointer-events-none ${config.theme.glow}`} />
      
      <main className="relative z-10 mx-auto max-w-6xl px-4 pt-12 sm:px-6 lg:px-8">
        
        {/* Dynamic Back Navigation */}
        <Link 
          href={`/resources/${branch}`} 
          className={`mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-400 transition-colors ${hoverTextClass}`}
        >
          <ArrowLeft size={16} /> Back to {config.shortName} Resources
        </Link>

        {/* Pass the data, config, and type down to our premium UI component */}
        <ResourceList 
          data={data} 
          config={config} 
          resourceType={resourceType} 
        />
        
      </main>
    </div>
  );
}