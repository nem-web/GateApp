"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ArrowRight, Download, ChevronRight } from "lucide-react";

// --- Branch Data Structure ---
const syllabusData = {
  EE: {
    id: "EE",
    title: "Electrical Engineering",
    short: "GATE EE",
    theme: {
      text: "text-[#22c55e]",
      bg: "bg-[#22c55e]",
      bgSubtle: "bg-[#22c55e]/10",
      border: "border-[#22c55e]/30",
      glow: "bg-[#22c55e]/5",
    },
    resourceLink: "/resources/gate-ee",
    sections: [
      {
        title: "Engineering Mathematics",
        topics: "Linear Algebra, Calculus, Differential Equations, Complex Variables, Probability and Statistics, Numerical Methods.",
      },
      {
        title: "Electric Circuits",
        topics: "Network elements, KCL, KVL, Node and Mesh analysis, Transient response, AC circuits, Resonance, Two-port networks.",
      },
      {
        title: "Electromagnetic Fields",
        topics: "Coulomb's Law, Electric Field Intensity, Gauss's Law, Ampere's Law, Faraday's Law, Magnetic circuits, Dielectrics.",
      },
      {
        title: "Signals and Systems",
        topics: "Continuous and Discrete time signals, LTI systems, Fourier series, Fourier Transform, Laplace Transform, Z-Transform.",
      },
      {
        title: "Electrical Machines",
        topics: "Single phase transformer, DC machines, Induction machines, Synchronous machines, Operating principles and performance.",
      },
      {
        title: "Power Systems",
        topics: "Power generation concepts, Transmission line models, Per-unit quantities, Load flow methods, Fault analysis, System stability.",
      },
    ]
  },
  CS: {
    id: "CS",
    title: "Computer Science & IT",
    short: "GATE CS",
    theme: {
      text: "text-[#3b82f6]",
      bg: "bg-[#3b82f6]",
      bgSubtle: "bg-[#3b82f6]/10",
      border: "border-[#3b82f6]/30",
      glow: "bg-[#3b82f6]/5",
    },
    resourceLink: "/resources/gate-cs",
    sections: [
      {
        title: "Engineering & Discrete Mathematics",
        topics: "Discrete Math (Logic, Sets, Graphs, Combinatorics), Linear Algebra, Calculus, Probability and Statistics.",
      },
      {
        title: "Digital Logic",
        topics: "Boolean algebra, Combinational and sequential circuits, Minimization, Number representations and computer arithmetic.",
      },
      {
        title: "Computer Organization and Architecture",
        topics: "Machine instructions and addressing modes, ALU, data-path and control unit, Instruction pipelining, Memory hierarchy, I/O interface.",
      },
      {
        title: "Programming and Data Structures",
        topics: "Programming in C, Recursion, Arrays, stacks, queues, linked lists, trees, binary search trees, binary heaps, graphs.",
      },
      {
        title: "Algorithms",
        topics: "Searching, sorting, hashing, Asymptotic worst case time and space complexity, Algorithm design techniques.",
      },
      {
        title: "Operating Systems",
        topics: "System calls, processes, threads, inter-process communication, concurrency and synchronization, Deadlock, CPU and I/O scheduling.",
      },
    ]
  },
  ME: {
    id: "ME",
    title: "Mechanical Engineering",
    short: "GATE ME",
    theme: {
      text: "text-[#ef4444]",
      bg: "bg-[#ef4444]",
      bgSubtle: "bg-[#ef4444]/10",
      border: "border-[#ef4444]/30",
      glow: "bg-[#ef4444]/5",
    },
    resourceLink: "/resources/gate-me",
    sections: [
      {
        title: "Engineering Mathematics",
        topics: "Linear Algebra, Calculus, Differential Equations, Complex Variables, Probability and Statistics, Numerical Methods.",
      },
      {
        title: "Applied Mechanics & Vibrations",
        topics: "Free-body diagrams and equilibrium, trusses and frames, virtual work, kinematics and dynamics, impulse and momentum, vibration.",
      },
      {
        title: "Mechanics of Materials & Design",
        topics: "Stress and strain, elastic constants, shear force and bending moment diagrams, deflection of beams, torsion, failure theories.",
      },
      {
        title: "Fluid Mechanics & Thermal",
        topics: "Fluid properties, fluid statics, manometry, buoyancy, Bernoulli's equations, Thermodynamic systems and processes, IC engines.",
      },
      {
        title: "Heat Transfer",
        topics: "Modes of heat transfer, one-dimensional heat conduction, resistance concept, heat transfer through fins, free and forced convection.",
      },
      {
        title: "Manufacturing Engineering",
        topics: "Structure and properties of engineering materials, phase diagrams, heat treatment, casting, forming and joining processes, machining.",
      },
    ]
  }
};

type BranchKey = keyof typeof syllabusData;

export default function InteractiveSyllabusPage() {
  const [activeBranch, setActiveBranch] = useState<BranchKey>("EE");

  const currentData = syllabusData[activeBranch];

  return (
    <div className="min-h-screen bg-[#0F1117] text-[#E5E7EB] font-sans pb-24 overflow-hidden">
      
      {/* Dynamic Background Glow */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeBranch}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] ${currentData.theme.glow} blur-[120px] rounded-full pointer-events-none`}
        />
      </AnimatePresence>

      <main className="relative z-10 mx-auto max-w-5xl px-4 pt-20 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            GATE Syllabus Viewer
          </h1>
          <p className="text-[#9CA3AF] text-lg max-w-2xl mx-auto">
            Select your branch to view the complete chapter-wise breakdown and access dedicated study resources.
          </p>
        </div>

        {/* BRANCH SWITCHER (TABS) */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
          {(Object.keys(syllabusData) as BranchKey[]).map((branchKey) => {
            const isActive = activeBranch === branchKey;
            const branchInfo = syllabusData[branchKey];
            
            return (
              <button
                key={branchKey}
                onClick={() => setActiveBranch(branchKey)}
                className={`relative px-6 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
                  isActive 
                    ? "text-white" 
                    : "text-[#9CA3AF] bg-[#1A1D27] hover:bg-[#2A2D3E] hover:text-white border border-white/5"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className={`absolute inset-0 rounded-xl ${branchInfo.theme.bg}`}
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{branchInfo.short}</span>
              </button>
            );
          })}
        </div>

        {/* SYLLABUS CONTENT AREA */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
          
          {/* Left: Syllabus List */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${currentData.theme.bgSubtle} ${currentData.theme.text}`}>
                <BookOpen size={20} />
              </div>
              <h2 className="text-2xl font-bold text-white">
                {currentData.title} Syllabus
              </h2>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeBranch}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {currentData.sections.map((section, idx) => (
                  <div 
                    key={idx} 
                    className="group rounded-2xl border border-white/5 bg-[#1A1D27] p-6 transition-colors hover:border-white/10"
                  >
                    <h3 className={`mb-3 text-lg font-bold ${currentData.theme.text}`}>
                      {section.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-[#9CA3AF]">
                      {section.topics}
                    </p>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: Actions & Resources Sidebar */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={`sidebar-${activeBranch}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="sticky top-24"
              >
                {/* Resource Link Card */}
                <div className={`rounded-2xl border ${currentData.theme.border} ${currentData.theme.bgSubtle} p-6 mb-6`}>
                  <h3 className="text-lg font-bold text-white mb-2">Prepare for {currentData.short}</h3>
                  <p className="text-sm text-[#9CA3AF] mb-6">
                    Access our complete library of PYQs, formula sheets, and study materials for {currentData.title}.
                  </p>
                  <Link
                    href={currentData.resourceLink}
                    className={`flex items-center justify-center gap-2 w-full rounded-xl ${currentData.theme.bg} px-4 py-3 text-sm font-bold text-black transition-all hover:opacity-90 active:scale-95`}
                  >
                    View Resources <ArrowRight size={16} />
                  </Link>
                </div>

                {/* PDF Download Stub */}
                <div className="rounded-2xl border border-white/5 bg-[#1A1D27] p-6">
                  <h3 className="text-sm font-bold text-white mb-4">Official Documents</h3>
                  <button className="group flex w-full items-center justify-between rounded-xl bg-[#0F1117] p-3 border border-white/5 transition-colors hover:border-white/10">
                    <div className="flex items-center gap-3">
                      <Download size={16} className={currentData.theme.text} />
                      <span className="text-sm font-medium text-[#E5E7EB]">Download PDF</span>
                    </div>
                    <ChevronRight size={16} className="text-[#9CA3AF] transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </main>
    </div>
  );
}