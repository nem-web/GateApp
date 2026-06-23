import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { promises as fs } from "fs";
import path from "path";
import { branchData, BranchKey } from "@/lib/branchConfig";
import { ArrowLeft, TrendingUp } from "lucide-react";

interface PageProps {
  params: Promise<{
    branch: string;
  }>;
}

interface NitCutoffRow {
  institute: string;
  program: string;
  open: number;
  close: number;
}

interface NitCutoffData {
  pageSubtitle: string;
  cutoffs: NitCutoffRow[];
}

export default async function DynamicNitCutoffsPage({ params }: PageProps) {
  const { branch } = await params;

  // Validate branch against config
  const configKey = `${branch}` as BranchKey;
  const config = branchData[configKey];

  if (!config) {
    notFound();
  }

  // Fetch the JSON data
  const dataFilePath = path.join(process.cwd(), "data", branch, "nit-cutoffs.json");
  let cutoffData: NitCutoffData;

  try {
    const fileContents = await fs.readFile(dataFilePath, "utf8");
    cutoffData = JSON.parse(fileContents);
  } catch (error) {
    notFound();
  }

  // Dynamic Theme Extraction
  const hoverTextClass = config.theme.text.replace("text-", "hover:text-");
  const branchColorClass = config.theme.text; // e.g., 'text-green-500'

  return (
    <div className={`min-h-screen bg-[#0e0f14] text-white font-sans pb-24 ${config.theme.selection}`}>
      
      {/* 3D Ambient Background Glow */}
      <div className={`absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] blur-[120px] rounded-full pointer-events-none ${config.theme.glow}`} />
      
      <main className="relative z-10 mx-auto max-w-5xl px-4 pt-12 sm:px-6 lg:px-8">
        
        {/* Dynamic Back Navigation */}
        <Link 
          href={`/resources/${branch}`} 
          className={`mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-400 transition-colors ${hoverTextClass}`}
        >
          <ArrowLeft size={16} /> Back to {config.shortName} Resources
        </Link>

        {/* Page Header */}
        <div className="mb-10 flex items-center gap-4">
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg border ${config.theme.bgLight} ${config.theme.text} ${config.theme.border}`}>
            <TrendingUp size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              NITs & IIITs (CCMT) Cutoffs
            </h1>
            <p className="text-gray-400 mt-1">{cutoffData.pageSubtitle}</p>
          </div>
        </div>

        {/* 3D Glassmorphism Table Container */}
        <div className={`relative overflow-hidden rounded-2xl border bg-[#111216]/80 backdrop-blur-2xl shadow-2xl transition-all ${config.theme.border}`}>
          
          {/* Subtle top inner shadow for depth */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#15161b]/80 border-b border-gray-800 text-gray-400 backdrop-blur-sm">
                <tr>
                  <th className="p-6 font-semibold tracking-wider">Institute</th>
                  <th className="p-6 font-semibold tracking-wider">Specialization</th>
                  <th className={`p-6 font-bold text-center tracking-wider ${branchColorClass}`}>Opening Score</th>
                  <th className="p-6 font-semibold text-center tracking-wider text-gray-400">Closing Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {cutoffData.cutoffs.map((row, i) => (
                  <tr 
                    key={i} 
                    className="group transition-all duration-300 hover:bg-[#1a1c23]/80 hover:shadow-md relative"
                  >
                    {/* Hover indicator line */}
                    <td className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-current transition-colors opacity-50" style={{ color: 'inherit' }}>
                       <span className={`hidden group-hover:block w-full h-full ${config.theme.bgLight.replace('bg-', 'bg-').split('/')[0]}`} />
                    </td>

                    <td className="p-6 font-medium text-white group-hover:text-gray-100">{row.institute}</td>
                    <td className="p-6 text-gray-400 group-hover:text-gray-300">{row.program}</td>
                    
                    {/* Highlighted Opening Score */}
                    <td className="p-6 text-center">
                      <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full font-bold bg-[#111216] border ${config.theme.border} text-white shadow-inner`}>
                        {row.open}
                      </span>
                    </td>
                    
                    {/* Closing Score */}
                    <td className="p-6 text-center">
                      <span className="inline-flex items-center justify-center px-3 py-1 rounded-full font-semibold bg-gray-800/50 border border-gray-700 text-gray-300">
                        {row.close}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}