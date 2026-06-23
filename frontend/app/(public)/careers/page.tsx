"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { 
  motion, 
  useMotionValue, 
  useSpring, 
  useTransform 
} from "framer-motion";
import {
  Rocket,
  Heart,
  Globe,
  Briefcase,
  Mail,
  ArrowRight,
} from "lucide-react";

// --- 3D Tilt Card Component ---
const TiltCard = ({ children }: { children: React.ReactNode }) => {
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
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative w-full max-w-2xl mx-auto rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#1A1D27] to-[#0F1117] p-8 md:p-12 shadow-[0_20px_50px_rgba(108,99,255,0.2)]"
    >
      <div
        style={{ transform: "translateZ(50px)" }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        {children}
      </div>
    </motion.div>
  );
};

// --- Main Page Component ---
export default function CareersPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
  };

  return (
    <div className="relative min-h-screen bg-[#0F1117] text-[#E5E7EB] font-sans selection:bg-[#6C63FF]/30 overflow-hidden">
      
      {/* 3D Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] rounded-full bg-[#6C63FF]/5 blur-[100px]"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[40%] -right-[10%] w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-[120px]"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-32 pb-24 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-24"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#6C63FF]/30 bg-[#6C63FF]/10 text-sm font-semibold text-[#6C63FF] mb-8">
            <Rocket size={16} /> Join the Mission
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
            Build the Future of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6C63FF] to-[#818CF8]">
              EdTech with Us
            </span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="max-w-2xl mx-auto text-[#9CA3AF] text-lg md:text-xl leading-relaxed">
            We are on a mission to democratize premium education and build the ultimate intelligence platform for GATE aspirants.
          </motion.p>
        </motion.div>

        {/* CULTURE SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, type: "spring" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32"
        >
          {[
            {
              icon: Rocket,
              title: "High Impact",
              desc: "Every feature you ship directly influences the careers of thousands of engineering students."
            },
            {
              icon: Globe,
              title: "Remote First",
              desc: "Work from anywhere in the world. We value output and creativity over geographical location."
            },
            {
              icon: Heart,
              title: "Ownership",
              desc: "No bureaucracy. You own your projects from conception to deployment and iteration."
            }
          ].map((val, i) => (
            <div key={i} className="p-8 rounded-3xl bg-[#1A1D27]/50 border border-white/5 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-[#6C63FF]/10 flex items-center justify-center text-[#6C63FF] mb-6">
                <val.icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{val.title}</h3>
              <p className="text-[#9CA3AF] leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* 3D "NO OPENINGS" CARD SECTION */}
        <div className="perspective-1000 py-10">
          <TiltCard>
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/5 border border-white/10 text-[#6C63FF] mb-6 shadow-[0_0_30px_rgba(108,99,255,0.2)]">
              <Briefcase size={32} />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              No Current Openings
            </h2>
            
            <p className="text-[#9CA3AF] text-base md:text-lg max-w-lg mb-8 leading-relaxed">
              We are currently heads-down building the core platform and our team is fully staffed. However, we are always excited to connect with passionate developers, educators, and designers.
            </p>
            
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />
            
            <p className="text-sm text-gray-500 mb-6">
              Want to stay on our radar for future opportunities?
            </p>
            
            <a 
              href="mailto:contact@gateprep.tech"
              className="group flex items-center gap-2 rounded-xl bg-[#6C63FF] px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-[#6C63FF]/90 hover:shadow-[0_0_20px_rgba(108,99,255,0.4)] active:scale-95"
            >
              <Mail size={18} /> Send us your Resume
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </a>
          </TiltCard>
        </div>

      </div>
    </div>
  );
}