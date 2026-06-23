import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { branchData, BranchKey } from "@/lib/branchConfig";
import { 
  Search, 
  FileText, 
  BookOpen, 
  Target, 
  Zap, 
  ChevronRight, 
  GraduationCap,
  Building2,
  TrendingUp,
  Briefcase,
  Activity
} from "lucide-react";

interface PageProps {
  params: Promise<{
    branch: string;
  }>;
}

export default async function DynamicBranchPage({ params }: PageProps) {
  const { branch } = await params;
  
  // Validate branch
  const configKey = `${branch}` as BranchKey;
  const config = branchData[configKey];

  if (!config) {
    notFound();
  }

  // Generate dynamic links based on the current branch
  const quickLinks = [
    { name: "Top IIT/IISc Cutoffs", href: `/resources/${branch}/iit-cutoffs` },
    { name: "PSU Recruitment", href: `/resources/${branch}/psu-cutoffs` },
    { name: "NITs (CCMT) Cutoffs", href: `/resources/${branch}/nit-cutoffs` },
    { name: "Syllabus 2026", href: `/resources/${branch}/syllabus` },
    { name: "Rank Predictor", href: "/tools/rank-predictor" },
  ];

  const resourceCategories = [
    {
      title: `${config.shortName} PYQ Papers`,
      description: `2010-2025 ${config.name} papers with detailed solutions.`,
      icon: FileText,
      href: `/resources/${branch}/pyq`,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      border: "border-blue-400/20",
    },
    {
      title: `${config.shortName} Study Notes`,
      description: `Comprehensive subject-wise notes for core ${config.shortName} subjects.`,
      icon: BookOpen,
      href: `/resources/${branch}/free-notes`,
      color: "text-green-400",
      bg: "bg-green-400/10",
      border: "border-green-400/20",
    },
    {
      title: `${config.shortName} Mock Tests`,
      description: `Full-length and subject-wise timed practice tests for ${config.shortName}.`,
      icon: Target,
      href: `/resources/${branch}/mock-tests`,
      color: "text-amber-400",
      bg: "bg-amber-400/10",
      border: "border-amber-400/20",
    },
    {
      title: `${config.shortName} Smart Tools`,
      description: `${config.shortName} Rank predictor, marks calculator, and study planner.`,
      icon: Zap,
      href: "/tools",
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      border: "border-purple-400/20",
    },
  ];

  const cutoffResources = [
    {
      title: "IIT & IISc M.Tech Cutoffs",
      description: "Category-wise GATE score requirements for top institutes like IISc, IITB, IITM, and IITD.",
      icon: GraduationCap,
      href: `/resources/${branch}/iit-cutoffs`,
    },
    {
      title: "PSU Recruitment via GATE",
      description: "Cutoffs and selection processes for PGCIL, ONGC, NTPC, IOCL, and other major PSUs.",
      icon: Building2,
      href: `/resources/${branch}/psu-cutoffs`,
    },
    {
      title: "NITs & IIITs (CCMT)",
      description: "Previous year opening and closing ranks for M.Tech admissions through CCMT counselling.",
      icon: TrendingUp,
      href: `/resources/${branch}/nit-cutoffs`,
    },
    {
      title: "Post-GATE Guidance",
      description: "Interview preparation, standard operating procedures (SOPs), and admission tips.",
      icon: Briefcase,
      href: `/resources/${branch}/guidance`,
    },
  ];

  return (
    <div className={`min-h-screen bg-[#0e0f14] text-white font-sans pb-24 ${config.theme.selection}`}>
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b border-gray-800/50 bg-[#111216]/50 pt-20 pb-16">
        {/* Dynamic Background Glow */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] blur-[120px] rounded-full pointer-events-none ${config.theme.glow}`} />
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className={`mb-6 inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${config.theme.border} ${config.theme.bgLight} ${config.theme.text}`}>
            <Activity className="mr-2 h-3.5 w-3.5" />
            {config.name} ({config.shortName})
          </div>
          
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white">
            Resource Hub <span className={config.theme.text}>{config.shortName}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-gray-400 sm:text-lg">
            {config.description}
          </p>

          {/* SEARCH BAR */}
          <div className="mx-auto mt-10 max-w-2xl relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Search className={`h-5 w-5 text-gray-500 transition-colors ${config.theme.text.replace('text-', 'group-focus-within:text-')}`} />
            </div>
            <input
              type="text"
              className={`block w-full rounded-xl border border-gray-800 bg-[#0B0C10] py-4 pl-12 pr-4 text-sm text-white placeholder-gray-500 transition-all focus:outline-none shadow-lg ${config.theme.focus}`}
              placeholder={`Search for ${config.shortName} subjects, cutoffs, PYQs, or formulas...`}
            />
          </div>

          {/* QUICK LINKS SUB-NAV */}
          <div className="mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 mr-2">Popular:</span>
            {quickLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className={`rounded-full border border-gray-700/50 bg-gray-800/40 px-4 py-1.5 text-xs font-medium text-gray-300 transition-colors ${config.theme.borderHover} hover:${config.theme.bgLight.replace('bg-', 'bg-')} hover:${config.theme.text.replace('text-', 'text-')}`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16 space-y-24">
        
        {/* CUTOFFS & ADMISSIONS SECTION */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold text-white">Cutoffs & Admissions</h2>
            <div className="h-px flex-1 bg-gray-800/60" />
          </div>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {cutoffResources.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group flex flex-col rounded-2xl border border-gray-800 bg-[#111216] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gray-600 hover:bg-[#15161b] hover:shadow-xl"
              >
                <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 text-gray-300 transition-colors ${config.theme.bgLight.replace('bg-', 'group-hover:bg-')} ${config.theme.text.replace('text-', 'group-hover:text-')}`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className={`mb-2 text-base font-bold text-white transition-colors ${config.theme.text.replace('text-', 'group-hover:text-')}`}>
                  {item.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed flex-1">
                  {item.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* QUICK CATEGORIES (Study Material) */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold text-white">{config.shortName} Prep Materials</h2>
            <div className="h-px flex-1 bg-gray-800/60" />
          </div>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {resourceCategories.map((category) => (
              <Link
                key={category.title}
                href={category.href}
                className={`group flex flex-col rounded-2xl border bg-gradient-to-br from-[#111216] to-[#0B0C10] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${category.border}`}
              >
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${category.bg} ${category.color}`}>
                  <category.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-white">{category.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed flex-1">
                  {category.description}
                </p>
                <div className={`mt-6 flex items-center text-sm font-semibold transition-colors ${category.color}`}>
                  Explore <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* DYNAMIC SUBJECTS GRID */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold text-white">{config.shortName} Syllabus Breakdown</h2>
            <div className="h-px flex-1 bg-gray-800/60" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {config.subjects.map((subject) => (
              <Link
                key={subject.name}
                href={subject.href}
                className="group flex items-center justify-between rounded-xl border border-gray-800 bg-[#111216] p-5 transition-colors hover:border-gray-700 hover:bg-[#15161b]"
              >
                <div>
                  <h3 className={`text-base font-semibold text-white transition-colors ${config.theme.text.replace('text-', 'group-hover:text-')}`}>
                    {subject.name}
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="rounded bg-gray-800/80 px-2 py-0.5 text-[10px] font-medium text-gray-400 border border-gray-700/50">
                      {subject.type}
                    </span>
                    <span className={`rounded px-2 py-0.5 text-[10px] font-medium border ${config.theme.bgLight} ${config.theme.text} ${config.theme.border}`}>
                      Weightage: {subject.weightage}
                    </span>
                  </div>
                </div>
                <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-gray-800/50 text-gray-400 transition-colors ${config.theme.bgLight.replace('bg-', 'group-hover:bg-')} ${config.theme.text.replace('text-', 'group-hover:text-')}`}>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}