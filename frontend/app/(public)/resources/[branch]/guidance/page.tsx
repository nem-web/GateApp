import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { promises as fs } from "fs";
import path from "path";
import { branchData, BranchKey } from "@/lib/branchConfig";
import { 
  ArrowLeft, 
  Briefcase, 
  Users, 
  FileEdit, 
  CalendarCheck, 
  MessageSquare,
  Cpu,
  Code,
  Terminal,
  Wrench,
  Target,
  HardHat,
  Building,
  Activity
} from "lucide-react";

// 1. Map string names from JSON to Lucide React components
const IconMap: Record<string, React.ElementType> = {
  CalendarCheck,
  Users,
  FileEdit,
  MessageSquare,
  Briefcase,
  Cpu,
  Code,
  Terminal,
  Wrench,
  Target,
  HardHat,
  Building,
  Activity
};

interface PageProps {
  params: Promise<{
    branch: string;
  }>;
}

interface GuidanceTopic {
  title: string;
  icon: string;
  colorClass: string;
  bgClass: string;
  description: string;
  points: string[];
}

interface GuidanceData {
  pageSubtitle: string;
  bannerText: string;
  topics: GuidanceTopic[];
}

export default async function DynamicGuidancePage({ params }: PageProps) {
  const { branch } = await params;

  // Validate branch against config
  const configKey = `${branch}` as BranchKey;
  const config = branchData[configKey];

  if (!config) {
    notFound();
  }

  // Fetch the JSON data
  const dataFilePath = path.join(process.cwd(), "data", branch, "guidance.json");
  let guidanceData: GuidanceData;

  try {
    const fileContents = await fs.readFile(dataFilePath, "utf8");
    guidanceData = JSON.parse(fileContents);
  } catch (error) {
    notFound();
  }

  // Dynamic Theme Variables based on Branch Config
  const solidBgClass = config.theme.text.replace("text-", "bg-");
  const hoverTextClass = config.theme.text.replace("text-", "hover:text-");
  const bannerBorderClass = config.theme.border;

  return (
    <div className={`min-h-screen bg-[#0e0f14] text-white font-sans pb-24 ${config.theme.selection}`}>
      
      {/* Dynamic Ambient Background Glow */}
      <div className={`absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] blur-[120px] rounded-full pointer-events-none ${config.theme.glow}`} />
      
      <main className="relative z-10 mx-auto max-w-5xl px-4 pt-12 sm:px-6 lg:px-8">
        
        {/* Dynamic Back Navigation */}
        <Link 
          href={`/resources/${branch}`} 
          className={`mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-400 transition-colors ${hoverTextClass}`}
        >
          <ArrowLeft size={16} /> Back to {config.shortName} Resources
        </Link>

        {/* Dynamic Page Header */}
        <div className="mb-10 flex items-center gap-4">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${config.theme.bgLight} ${config.theme.text}`}>
            <Briefcase size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white">Post-GATE Guidance</h1>
            <p className="text-gray-400 mt-1">{guidanceData.pageSubtitle}</p>
          </div>
        </div>

        {/* Guidance Grid populated dynamically */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {guidanceData.topics.map((topic, i) => {
            // Resolve the icon dynamically from the map, fallback to Briefcase if typo in JSON
            const TopicIcon = IconMap[topic.icon] || Briefcase;

            return (
              <div 
                key={i} 
                className={`group flex flex-col rounded-2xl border border-gray-800 bg-[#111216]/80 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-[#15161b] ${config.theme.borderHover}`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${topic.bgClass} ${topic.colorClass}`}>
                    <TopicIcon size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-gray-200 transition-colors">
                      {topic.title}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      {topic.description}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 border-t border-gray-800/60 pt-4 flex-1">
                  <ul className="space-y-3">
                    {topic.points.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                        <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${topic.colorClass.replace('text-', 'bg-')}`} />
                        <span className="leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Action Bottom Banner */}
        <div className={`mt-12 rounded-2xl border bg-[#111216] p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 ${bannerBorderClass}`}>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Need personalized advice?</h3>
            <p className="text-sm text-gray-400 max-w-xl">
              {guidanceData.bannerText}
            </p>
          </div>
          <button className={`whitespace-nowrap rounded-lg px-6 py-3 text-sm font-bold text-black transition-opacity hover:opacity-90 active:scale-95 ${solidBgClass}`}>
            Book Mentorship Call
          </button>
        </div>

      </main>
    </div>
  );
}