"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { 
  Zap, 
  Monitor, 
  Settings, 
  Building2, 
  Cpu, 
  BarChart3, 
  PieChart, 
  ArrowRight, 
  Network
} from "lucide-react";

// --- Branch Data Configuration ---
const branches = [
  {
    id: "EE",
    name: "Electrical Engineering",
    short: "GATE EE",
    color: "#22c55e",
    bgLight: "bg-[#22c55e]/10",
    href: "/resources/gate-ee",
    icon: Zap,
  },
  {
    id: "CS",
    name: "Computer Science & IT",
    short: "GATE CS",
    color: "#3b82f6",
    bgLight: "bg-[#3b82f6]/10",
    href: "/resources/gate-cs",
    icon: Monitor,
  },
  {
    id: "ME",
    name: "Mechanical Engineering",
    short: "GATE ME",
    color: "#ef4444",
    bgLight: "bg-[#ef4444]/10",
    href: "/resources/gate-me",
    icon: Settings,
  },
  {
    id: "EC",
    name: "Electronics & Comm.",
    short: "GATE EC",
    color: "#a855f7",
    bgLight: "bg-[#a855f7]/10",
    href: "/resources/gate-ece",
    icon: Cpu,
  },
  {
    id: "CE",
    name: "Civil Engineering",
    short: "GATE CE",
    color: "#f59e0b",
    bgLight: "bg-[#f59e0b]/10",
    href: "/resources/gate-ce",
    icon: Building2,
  },
  {
    id: "IN",
    name: "Instrumentation Engg.",
    short: "GATE IN",
    color: "#06b6d4",
    bgLight: "bg-[#06b6d4]/10",
    href: "/resources/gate-in",
    icon: Network,
  },
];

// --- Custom Interactive Cursor Component ---
const CustomCursor = ({ isHovering }: { isHovering: boolean }) => {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 700, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[100] hidden md:flex items-center justify-center rounded-full mix-blend-screen"
      style={{
        x: cursorX,
        y: cursorY,
        translateX: "-50%",
        translateY: "-50%",
      }}
    >
      <motion.div
        animate={{
          width: isHovering ? 80 : 24,
          height: isHovering ? 80 : 24,
          backgroundColor: isHovering ? "rgba(108, 99, 255, 0.15)" : "rgba(108, 99, 255, 0.8)",
          border: isHovering ? "2px solid rgba(108, 99, 255, 0.8)" : "0px solid transparent",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="rounded-full blur-[1px]"
      />
    </motion.div>
  );
};

// --- 3D Interactive Card Component ---
const BranchTiltCard = ({ branch, setHovering }: { branch: any, setHovering: (val: boolean) => void }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setHovering(false);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setHovering(true)}
      onClick={() => router.push(branch.href)}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="group relative cursor-none w-full rounded-3xl border border-white/5 bg-[#111216] p-6 shadow-xl transition-colors hover:border-white/20"
    >
      {/* 3D Content Wrapper */}
      <div
        style={{ transform: "translateZ(60px)", transformStyle: "preserve-3d" }}
        className="relative z-10 flex h-full flex-col justify-between"
      >
        {/* Top Header */}
        <div className="flex items-start justify-between mb-8">
          <div 
            className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-inner"
            style={{ backgroundColor: `${branch.color}15`, color: branch.color }}
          >
            <branch.icon size={28} />
          </div>
          <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white">
            <PieChart size={12} style={{ color: branch.color }} />
            Weightage
          </div>
        </div>

        {/* Text Content */}
        <div style={{ transform: "translateZ(30px)" }}>
          <h2 className="text-xl font-bold text-white mb-1 group-hover:text-white transition-colors" style={{ textShadow: "0 4px 12px rgba(0,0,0,0.5)" }}>
            {branch.name}
          </h2>
          <p className="text-sm text-[#9CA3AF]">
            Subject-wise mark distribution, core vs aptitude analysis, and priority topics.
          </p>
        </div>

        {/* Action Button */}
        <div 
          style={{ transform: "translateZ(40px)" }} 
          className="mt-8 flex items-center justify-between border-t border-white/10 pt-4"
        >
          <span className="text-sm font-bold" style={{ color: branch.color }}>
            View Analysis
          </span>
          <ArrowRight 
            size={18} 
            className="text-[#9CA3AF] transition-transform group-hover:translate-x-1" 
            style={{ color: branch.color }}
          />
        </div>
      </div>
      
      {/* Background Decorative Element */}
      <div className="absolute -bottom-6 -right-6 opacity-5 pointer-events-none transition-transform group-hover:scale-110 group-hover:opacity-10">
        <BarChart3 size={150} style={{ color: branch.color }} />
      </div>
    </motion.div>
  );
};

// --- Main Page Component ---
export default function WeightageAnalysisPage() {
  const [isHoveringCard, setIsHoveringCard] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 20 } },
  };

  return (
    <div className="relative min-h-screen bg-[#0F1117] text-[#E5E7EB] font-sans selection:bg-[#6C63FF]/30 overflow-hidden md:cursor-none">
      
      {/* Interactive Cursor Component */}
      <CustomCursor isHovering={isHoveringCard} />

      {/* Ambient Background Grid & Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#6C63FF]/10 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 mx-auto max-w-7xl px-4 pt-24 pb-32 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#6C63FF]/30 bg-[#6C63FF]/10 text-xs font-bold uppercase tracking-widest text-[#6C63FF] mb-6">
            <BarChart3 size={14} /> Data-Driven Prep
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
            Subject Weightage <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6C63FF] to-[#818CF8]">Analysis</span>
          </h1>
          <p className="max-w-2xl mx-auto text-[#9CA3AF] text-lg leading-relaxed">
            Stop studying blindly. Explore the exact mark distribution and high-yield topics for your branch based on the last 15 years of GATE papers.
          </p>
        </motion.div>

        {/* 3D Branch Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 perspective-1000"
        >
          {branches.map((branch) => (
            <motion.div key={branch.id} variants={itemVariants}>
              <BranchTiltCard branch={branch} setHovering={setIsHoveringCard} />
            </motion.div>
          ))}
        </motion.div>

      </main>
    </div>
  );
}