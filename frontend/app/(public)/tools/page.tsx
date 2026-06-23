"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Calculator, 
  CalendarDays, 
  Trophy, 
  ArrowRight,
  Wrench,
  BarChart3,
  Target
} from "lucide-react";

// --- Tools Data Configuration ---
const toolsData = [
  {
    id: "rank-predictor",
    name: "GATE Rank Predictor",
    description: "Analyze your expected GATE rank based on your marks, category, and paper difficulty using our advanced AI algorithm.",
    color: "#a855f7", // Purple
    bgHover: "hover:border-[#a855f7]/50",
    glow: "group-hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]",
    href: "/tools/rank-predictor",
    icon: Trophy,
    tags: ["Live", "AI Powered", "Highly Accurate"],
  },
  {
    id: "marks-calculator",
    name: "Marks Calculator",
    description: "Paste your GATE response sheet URL to instantly calculate your exact marks, positive score, and negative penalties.",
    color: "#3b82f6", // Blue
    bgHover: "hover:border-[#3b82f6]/50",
    glow: "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]",
    href: "/tools/marks-calculator",
    icon: Calculator,
    tags: ["Response Sheet", "Instant"],
  },
  {
    id: "study-planner",
    name: "Smart Study Planner",
    description: "Generate a personalized day-by-day revision schedule based on your target branch, remaining time, and weak subjects.",
    color: "#f59e0b", // Amber
    bgHover: "hover:border-[#f59e0b]/50",
    glow: "group-hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]",
    href: "/tools/study-planner",
    icon: CalendarDays,
    tags: ["Personalized", "Tracker"],
  },
];

export default function ToolsIndexPage() {
  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 100, damping: 15 } 
    },
  };

  return (
    <div className="relative min-h-screen bg-[#0e0f14] text-[#E5E7EB] font-sans selection:bg-[#a855f7]/30 overflow-hidden pb-24">
      
      {/* Ambient Background Glows */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#a855f7]/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <main className="relative z-10 mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#a855f7]/30 bg-[#a855f7]/10 text-xs font-bold uppercase tracking-widest text-[#a855f7] mb-6 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
          >
            <Wrench size={14} /> Smart Preparation Tools
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6"
          >
            GATE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a855f7] to-[#ec4899]">Toolbox</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-[#9CA3AF] text-lg leading-relaxed"
          >
            Optimize your strategy, calculate your marks, and predict your rank with our suite of advanced, data-driven tools.
          </motion.p>
        </div>

        {/* TOOLS GRID */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {toolsData.map((tool) => (
            <motion.div key={tool.id} variants={cardVariants}>
              <Link
                href={tool.href}
                className={`group flex flex-col justify-between h-full rounded-3xl border border-gray-800 bg-[#111216]/80 backdrop-blur-xl p-8 transition-all duration-300 hover:-translate-y-1 ${tool.bgHover} ${tool.glow}`}
              >
                <div>
                  <div className="flex items-start justify-between mb-6">
                    <div 
                      className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-inner transition-transform group-hover:scale-110 border border-white/5"
                      style={{ backgroundColor: `${tool.color}15`, color: tool.color }}
                    >
                      <tool.icon size={28} strokeWidth={1.5} />
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-3 transition-colors group-hover:text-white">
                    {tool.name}
                  </h2>
                  <p className="text-sm text-[#9CA3AF] mb-6 leading-relaxed">
                    {tool.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {tool.tags.map((tag, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase border border-gray-700 bg-gray-800/50 text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-800/60 pt-5">
                  <span 
                    className="text-sm font-bold tracking-wide transition-colors"
                    style={{ color: tool.color }}
                  >
                    Open Tool
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 transition-all duration-300 group-hover:bg-white/10">
                    <ArrowRight 
                      size={16} 
                      className="transition-transform group-hover:translate-x-1" 
                      style={{ color: tool.color }}
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

      </main>
    </div>
  );
}