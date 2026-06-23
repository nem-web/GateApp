"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Zap, 
  Monitor, 
  Settings, 
  Cpu, 
  Building2, 
  Network, 
  ArrowRight, 
  FileQuestion,
  History
} from "lucide-react";

// --- Branch Data Configuration ---
const branches = [
  {
    id: "EE",
    name: "Electrical Engineering",
    short: "GATE EE",
    color: "#22c55e",
    bgHover: "hover:border-[#22c55e]/50",
    glow: "group-hover:shadow-[0_0_30px_rgba(34,197,94,0.15)]",
    href: "/resources/gate-ee/pyq",
    icon: Zap,
    yearCount: "15+ Years",
  },
  {
    id: "CS",
    name: "Computer Science & IT",
    short: "GATE CS",
    color: "#3b82f6",
    bgHover: "hover:border-[#3b82f6]/50",
    glow: "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]",
    href: "/resources/gate-cs/pyq",
    icon: Monitor,
    yearCount: "15+ Years",
  },
  {
    id: "ME",
    name: "Mechanical Engineering",
    short: "GATE ME",
    color: "#ef4444",
    bgHover: "hover:border-[#ef4444]/50",
    glow: "group-hover:shadow-[0_0_30px_rgba(239,68,68,0.15)]",
    href: "/resources/gate-me/pyq",
    icon: Settings,
    yearCount: "15+ Years",
  },
  {
    id: "ECE",
    name: "Electronics & Comm.",
    short: "GATE ECE",
    color: "#a855f7",
    bgHover: "hover:border-[#a855f7]/50",
    glow: "group-hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]",
    href: "/resources/gate-ece/pyq",
    icon: Cpu,
    yearCount: "15+ Years",
  },
  {
    id: "CE",
    name: "Civil Engineering",
    short: "GATE CE",
    color: "#f59e0b",
    bgHover: "hover:border-[#f59e0b]/50",
    glow: "group-hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]",
    href: "/resources/gate-ce/pyq",
    icon: Building2,
    yearCount: "15+ Years",
  },
  {
    id: "IN",
    name: "Instrumentation Engg.",
    short: "GATE IN",
    color: "#06b6d4",
    bgHover: "hover:border-[#06b6d4]/50",
    glow: "group-hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]",
    href: "/resources/gate-in/pyq",
    icon: Network,
    yearCount: "15+ Years",
  },
];

export default function PyqIndexPage() {
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
    <div className="relative min-h-screen bg-[#0e0f14] text-[#E5E7EB] font-sans selection:bg-[#06b6d4]/30 overflow-hidden pb-24">
      
      {/* Ambient Background Glows (Cyan/Teal theme for PYQs) */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#06b6d4]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <main className="relative z-10 mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#06b6d4]/30 bg-[#06b6d4]/10 text-xs font-bold uppercase tracking-widest text-[#06b6d4] mb-6 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
          >
            <History size={14} /> Official GATE Archives
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6"
          >
            Previous Year <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#06b6d4] to-[#3b82f6]">Questions</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-[#9CA3AF] text-lg leading-relaxed"
          >
            Practice with 15+ years of official GATE papers. Features complete PDFs, detailed solutions, and official answer keys.
          </motion.p>
        </div>

        {/* BRANCH GRID */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {branches.map((branch) => (
            <motion.div key={branch.id} variants={cardVariants}>
              <Link
                href={branch.href}
                className={`group flex flex-col justify-between h-full rounded-3xl border border-gray-800 bg-[#111216]/80 backdrop-blur-xl p-8 transition-all duration-300 hover:-translate-y-1 ${branch.bgHover} ${branch.glow}`}
              >
                <div>
                  <div className="flex items-start justify-between mb-6">
                    <div 
                      className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-inner transition-transform group-hover:scale-110 border border-white/5"
                      style={{ backgroundColor: `${branch.color}15`, color: branch.color }}
                    >
                      <branch.icon size={28} strokeWidth={1.5} />
                    </div>
                    
                    <div className="flex items-center gap-1.5 rounded-full bg-[#0B0C10] border border-gray-800 px-3 py-1 text-xs font-medium text-[#9CA3AF]">
                      <FileQuestion size={12} /> {branch.yearCount}
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-2 transition-colors group-hover:text-white">
                    {branch.name}
                  </h2>
                  <p className="text-sm text-[#9CA3AF] mb-8 leading-relaxed">
                    Access chapter-wise and full-length official PYQs with solutions for {branch.short}.
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-gray-800/60 pt-5">
                  <span 
                    className="text-sm font-bold tracking-wide transition-colors"
                    style={{ color: branch.color }}
                  >
                    View Papers
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 transition-all duration-300 group-hover:bg-white/10">
                    <ArrowRight 
                      size={16} 
                      className="transition-transform group-hover:translate-x-1" 
                      style={{ color: branch.color }}
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