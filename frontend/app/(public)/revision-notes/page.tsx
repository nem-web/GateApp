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
  Clock,
  FileText
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
    href: "/revision-notes/gate-ee",
    icon: Zap,
    topicCount: 11,
  },
  {
    id: "CS",
    name: "Computer Science & IT",
    short: "GATE CS",
    color: "#3b82f6",
    bgHover: "hover:border-[#3b82f6]/50",
    glow: "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]",
    href: "/revision-notes/gate-cs",
    icon: Monitor,
    topicCount: 12,
  },
  {
    id: "ME",
    name: "Mechanical Engineering",
    short: "GATE ME",
    color: "#ef4444",
    bgHover: "hover:border-[#ef4444]/50",
    glow: "group-hover:shadow-[0_0_30px_rgba(239,68,68,0.15)]",
    href: "/revision-notes/gate-me",
    icon: Settings,
    topicCount: 14,
  },
  {
    id: "ECE",
    name: "Electronics & Comm.",
    short: "GATE ECE",
    color: "#a855f7",
    bgHover: "hover:border-[#a855f7]/50",
    glow: "group-hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]",
    href: "/revision-notes/gate-ece",
    icon: Cpu,
    topicCount: 10,
  },
  {
    id: "CE",
    name: "Civil Engineering",
    short: "GATE CE",
    color: "#f59e0b",
    bgHover: "hover:border-[#f59e0b]/50",
    glow: "group-hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]",
    href: "/revision-notes/gate-ce",
    icon: Building2,
    topicCount: 8,
  },
  {
    id: "IN",
    name: "Instrumentation Engg.",
    short: "GATE IN",
    color: "#06b6d4",
    bgHover: "hover:border-[#06b6d4]/50",
    glow: "group-hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]",
    href: "/revision-notes/gate-in",
    icon: Network,
    topicCount: 9,
  },
];

export default function RevisionNotesIndexPage() {
  // Framer Motion Variants for smooth staggered loading
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
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
    <div className="relative min-h-screen bg-[#0e0f14] text-[#E5E7EB] font-sans selection:bg-[#F59E0B]/30 overflow-hidden pb-24">
      
      {/* Ambient Background Glows (Slightly warmer tone for revision) */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#F59E0B]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#ef4444]/5 blur-[120px] rounded-full pointer-events-none" />

      <main className="relative z-10 mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#F59E0B]/30 bg-[#F59E0B]/10 text-xs font-bold uppercase tracking-widest text-[#F59E0B] mb-6 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
          >
            <Clock size={14} /> Last Minute Preparation
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6"
          >
            Quick Revision <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F59E0B] to-[#ef4444]">Notes & Formulas</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-[#9CA3AF] text-lg leading-relaxed"
          >
            Accelerate your prep with high-yield short notes, cheat sheets, and formula mind-maps designed specifically for rapid revision.
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
                      <FileText size={12} /> Cheat Sheets
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-2 transition-colors group-hover:text-white">
                    {branch.name}
                  </h2>
                  <p className="text-sm text-[#9CA3AF] mb-8 leading-relaxed">
                    Compact summaries, key formulas, and must-know concepts for {branch.short} at a glance.
                  </p>
                </div>

                <div 
                  className="flex items-center justify-between border-t border-gray-800/60 pt-5"
                >
                  <span 
                    className="text-sm font-bold tracking-wide transition-colors"
                    style={{ color: branch.color }}
                  >
                    View Revision Notes
                  </span>
                  <div 
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 transition-all duration-300 group-hover:bg-white/10"
                  >
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