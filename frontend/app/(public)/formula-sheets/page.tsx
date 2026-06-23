"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useMotionValue, useSpring, useTransform, Variants } from "framer-motion";
import { 
  Zap, 
  Monitor, 
  Settings, 
  Cpu, 
  Building2, 
  Network, 
  ArrowRight, 
  Sigma,
  FunctionSquare,
  Calculator,
  Pi,
  HelpCircle
} from "lucide-react";

// --- Branch Data Configuration ---
const branches = [
  {
    id: "EE",
    name: "Electrical Engineering",
    short: "GATE EE",
    color: "#22c55e",
    href: "/resources/gate-ee/formula-sheets",
    icon: Zap,
    formulaCount: "150+ Equations",
    bgIcon: FunctionSquare,
  },
  {
    id: "CS",
    name: "Computer Science & IT",
    short: "GATE CS",
    color: "#3b82f6",
    href: "/resources/gate-cs/formula-sheets",
    icon: Monitor,
    formulaCount: "120+ Formulas",
    bgIcon: Sigma,
  },
  {
    id: "ME",
    name: "Mechanical Engineering",
    short: "GATE ME",
    color: "#ef4444",
    href: "/resources/gate-me/formula-sheets",
    icon: Settings,
    formulaCount: "200+ Equations",
    bgIcon: Pi,
  },
  {
    id: "EC",
    name: "Electronics & Comm.",
    short: "GATE EC",
    color: "#a855f7",
    href: "/resources/gate-ec/formula-sheets",
    icon: Cpu,
    formulaCount: "180+ Formulas",
    bgIcon: FunctionSquare,
  },
  {
    id: "CE",
    name: "Civil Engineering",
    short: "GATE CE",
    color: "#f59e0b",
    href: "/resources/gate-ce/formula-sheets",
    icon: Building2,
    formulaCount: "250+ Equations",
    bgIcon: Sigma,
  },
  {
    id: "IN",
    name: "Instrumentation Engg.",
    short: "GATE IN",
    color: "#06b6d4",
    href: "/resources/gate-in/formula-sheets",
    icon: Network,
    formulaCount: "140+ Formulas",
    bgIcon: Pi,
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
          width: isHovering ? 80 : 20,
          height: isHovering ? 80 : 20,
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
const FormulaTiltCard = ({ branch, setHovering }: { branch: any, setHovering: (val: boolean) => void }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

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
      className="group relative cursor-none w-full rounded-3xl border border-white/5 bg-[#111216] p-8 shadow-xl transition-colors hover:border-white/20"
    >
      {/* 3D Content Wrapper */}
      <div
        style={{ transform: "translateZ(60px)", transformStyle: "preserve-3d" }}
        className="relative z-10 flex h-full flex-col justify-between"
      >
        {/* Top Header */}
        <div className="flex items-start justify-between mb-8">
          <div 
            className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-inner bg-black/50 backdrop-blur-md border border-white/5"
            style={{ color: branch.color }}
          >
            <branch.icon size={28} />
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-[#E5E7EB]">
            <Calculator size={12} style={{ color: branch.color }} />
            {branch.formulaCount}
          </div>
        </div>

        {/* Text Content */}
        <div style={{ transform: "translateZ(40px)" }}>
          <h2 className="text-2xl font-bold text-white mb-2 transition-colors" style={{ textShadow: "0 4px 12px rgba(0,0,0,0.5)" }}>
            {branch.name}
          </h2>
          <p className="text-sm text-[#9CA3AF] leading-relaxed">
            Downloadable PDFs, ultimate cheat sheets, and quick-revision formula mind maps for {branch.short}.
          </p>
        </div>

        {/* Action Button */}
        <div 
          style={{ transform: "translateZ(50px)" }} 
          className="mt-8 flex items-center justify-between border-t border-white/10 pt-5"
        >
          <span className="text-sm font-bold tracking-wide" style={{ color: branch.color }}>
            View Formula Sheets
          </span>
          <div 
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 transition-colors group-hover:bg-white/10"
          >
            <ArrowRight 
              size={16} 
              className="transition-transform group-hover:translate-x-1" 
              style={{ color: branch.color }}
            />
          </div>
        </div>
      </div>
      
      {/* Background Decorative Mathematical Element */}
      <div 
        style={{ transform: "translateZ(10px)" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none transition-all duration-500 group-hover:scale-125 group-hover:opacity-[0.08]"
      >
        <branch.bgIcon size={200} style={{ color: branch.color }} />
      </div>
      
      {/* Bottom Glow */}
      <div 
        className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-20 blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
        style={{ backgroundColor: branch.color }}
      />
    </motion.div>
  );
};

// --- SEO FAQ Section ---
function FaqSection() {
  const faqs = [
    {
      q: "Are these GATE formula sheets free to download?",
      a: "Yes, all our branch-specific formula sheets are completely free. Simply select your branch to view and download the PDFs."
    },
    {
      q: "Which branches are covered?",
      a: "We currently provide comprehensive formula cheat sheets for Electrical (EE), Computer Science (CS), Mechanical (ME), Electronics (EC), Civil (CE), and Instrumentation (IN)."
    },
    {
      q: "How should I use these formula sheets for revision?",
      a: "We recommend reviewing these sheets daily during the last 60 days of your preparation. They are perfect for quick recall before attempting full-length mock tests or PYQs."
    }
  ];

  return (
    <section className="py-24 px-4 mx-auto max-w-4xl relative z-10">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
        <p className="mt-4 text-gray-400">Everything you need to know about our free resources.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="rounded-xl border border-gray-800 bg-[#111216]/80 backdrop-blur-md p-6">
            <h3 className="flex items-center gap-3 text-lg font-bold text-white mb-2">
              <HelpCircle className="h-5 w-5 text-[#6C63FF]" /> {faq.q}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed ml-8">{faq.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// --- Main Page Component ---
export default function FormulaSheetsPage() {
  const [isHoveringCard, setIsHoveringCard] = useState(false);

  // Framer Motion Variants for Staggered Load
 const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 40, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { type: "spring", stiffness: 100, damping: 20 } 
    },
  };

  // --- STRUCTURED DATA (JSON-LD) ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Are these GATE formula sheets free to download?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, all our branch-specific formula sheets are completely free. Simply select your branch to view and download the PDFs."
        }
      },
      {
        "@type": "Question",
        "name": "Which branches are covered?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We currently provide comprehensive formula cheat sheets for Electrical (EE), Computer Science (CS), Mechanical (ME), Electronics (EC), Civil (CE), and Instrumentation (IN)."
        }
      }
    ]
  };

  return (
    <div className="relative min-h-screen bg-[#0F1117] text-[#E5E7EB] font-sans selection:bg-[#6C63FF]/30 overflow-hidden md:cursor-none">
      
      {/* Inject Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Interactive Cursor Component */}
      <CustomCursor isHovering={isHoveringCard} />

      {/* 5D Background - Animated Floating Orbs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-[#6C63FF]/10 blur-[150px] rounded-full"
        />
        <motion.div
          animate={{
            y: [0, 40, 0],
            x: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full"
        />
      </div>

      <main className="relative z-10 mx-auto max-w-7xl px-4 pt-24 pb-32 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#6C63FF]/30 bg-[#6C63FF]/10 text-xs font-bold uppercase tracking-widest text-[#6C63FF] mb-6">
            <Sigma size={14} /> Quick Revision Hub
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6">
            Free GATE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6C63FF] to-[#818CF8]">Formula Sheets</span>
          </h1>
          <p className="max-w-3xl mx-auto text-[#9CA3AF] text-lg leading-relaxed">
            Download our beautifully formatted, branch-specific cheat sheets designed for high-speed retention. Whether you are preparing for <strong>GATE EE, CSE, ME, or ECE</strong>, these PDF guides will accelerate your revision.
          </p>
        </motion.div>

        {/* 3D Branch Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 perspective-1000"
        >
          {branches.map((branch) => (
            <motion.div key={branch.id} variants={itemVariants}>
              <FormulaTiltCard branch={branch} setHovering={setIsHoveringCard} />
            </motion.div>
          ))}
        </motion.div>

        {/* SEO FAQ Section */}
        <FaqSection />

      </main>
    </div>
  );
}