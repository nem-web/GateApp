import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { promises as fs } from "fs";
import path from "path";
import { ArrowLeft, BookOpen, Download } from "lucide-react";
import { branchData, BranchKey } from "@/lib/branchConfig";

interface PageProps {
  params: Promise<{
    branch: string;
  }>;
}

// Define the shape of our JSON data
interface SyllabusData {
  pdfDownloadLink: string;
  sections: {
    title: string;
    topics: string;
  }[];
}

export default async function DynamicSyllabusPage({ params }: PageProps) {
  const { branch } = await params;

  // 1. Validate branch against config
  const configKey = `${branch}` as BranchKey;
  const config = branchData[configKey];

  if (!config) {
    notFound();
  }

  // 2. Fetch the JSON data for this specific branch
  const dataFilePath = path.join(process.cwd(), "data", branch, "syllabus.json");
  let syllabusData: SyllabusData;

  try {
    const fileContents = await fs.readFile(dataFilePath, "utf8");
    syllabusData = JSON.parse(fileContents);
  } catch (error) {
    // If syllabus.json is missing for this branch, show 404
    notFound();
  }

  // 3. Extract base color from text class for solid buttons (e.g., 'text-green-500' -> 'bg-green-500')
  const solidBgClass = config.theme.text.replace("text-", "bg-");
  const hoverTextClass = config.theme.text.replace("text-", "hover:text-");

  return (
    <div className={`min-h-screen bg-[#0e0f14] text-white font-sans pb-24 ${config.theme.selection}`}>
      {/* Dynamic Background Glow */}
      <div className={`absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] blur-[120px] rounded-full pointer-events-none ${config.theme.glow}`} />
      
      <main className="relative z-10 mx-auto max-w-4xl px-4 pt-12 sm:px-6 lg:px-8">
        
        {/* Dynamic Back Link */}
        <Link 
          href={`/resources/${branch}`} 
          className={`mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-400 transition-colors ${hoverTextClass}`}
        >
          <ArrowLeft size={16} /> Back to {config.shortName} Resources
        </Link>

        {/* Header Section */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${config.theme.bgLight} ${config.theme.text}`}>
              <BookOpen size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white">GATE 2026 {config.shortName} Syllabus</h1>
              <p className="text-gray-400 mt-1">Official chapter-wise syllabus breakdown.</p>
            </div>
          </div>
          
          {/* Dynamic Download Button */}
          <a 
            href={syllabusData.pdfDownloadLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex w-fit items-center gap-2 rounded-lg ${solidBgClass} px-4 py-2.5 text-sm font-bold text-black transition-opacity hover:opacity-90`}
          >
            <Download size={16} /> Download PDF
          </a>
        </div>

        {/* Dynamic Syllabus Sections */}
        <div className="space-y-4">
          {syllabusData.sections.map((section, i) => (
            <div 
              key={i} 
              className={`rounded-2xl border border-gray-800 bg-[#111216]/80 p-6 backdrop-blur-xl transition-colors ${config.theme.borderHover}`}
            >
              <h3 className={`mb-3 text-lg font-bold ${config.theme.text}`}>
                {section.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-300">
                {section.topics}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}