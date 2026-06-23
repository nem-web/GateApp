"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowLeft, Construction, Sparkles, BellRing } from "lucide-react";

interface ComingSoonProps {
  title: React.ReactNode;
  description: string;
  backUrl?: string;
  backText?: string;
}

export default function ComingSoon({ 
  title, 
  description, 
  backUrl = "/", 
  backText = "Go Back" 
}: ComingSoonProps) {
  const ref = useRef<HTMLDivElement>(null);

  // --- 3D Hover Effect Logic ---
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
    <div className="relative min-h-screen flex items-center justify-center bg-[#0F1117] text-[#E5E7EB] font-sans selection:bg-[#6C63FF]/30 overflow-hidden perspective-1000">
      
      {/* --- 3D Background Orbs --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          animate={{
            y: [0, -40, 0],
            x: [0, 30, 0],
            scale: [1, 1.2, 1],
            rotate: [0, 10, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-[#6C63FF]/10 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{
            y: [0, 40, 0],
            x: [0, -30, 0],
            scale: [1, 1.1, 1],
            rotate: [0, -10, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[10%] right-[15%] w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl px-4 py-20">
        
        {/* Navigation Back */}
        {backUrl && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8 flex justify-center"
          >
            <Link 
              href={backUrl} 
              className="group flex items-center gap-2 text-sm font-medium text-[#9CA3AF] transition-colors hover:text-white"
            >
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
              {backText}
            </Link>
          </motion.div>
        )}

        {/* --- 3D Interactive Card --- */}
        <motion.div
          ref={ref}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
          className="relative w-full rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-[#1A1D27]/80 to-[#0F1117]/80 p-8 md:p-14 shadow-2xl backdrop-blur-xl"
        >
          
          {/* Inner 3D Content Wrapper */}
          <div
            style={{ transform: "translateZ(60px)", transformStyle: "preserve-3d" }}
            className="relative z-10 flex flex-col items-center text-center"
          >
            {/* Floating Icon */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-[#6C63FF]/10 border border-[#6C63FF]/30 shadow-[0_0_40px_rgba(108,99,255,0.2)]"
              style={{ transform: "translateZ(40px)" }}
            >
              <Construction size={40} className="text-[#6C63FF]" />
              <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#1A1D27] border border-white/10">
                <Sparkles size={14} className="text-[#FBBF24]" />
              </div>
            </motion.div>

            {/* Text Layers */}
            <div style={{ transform: "translateZ(30px)" }}>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#9CA3AF]">
                Development in Progress
              </div>
              <h1 className="mb-4 text-4xl md:text-5xl font-extrabold tracking-tight text-white" style={{ textShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
                {title}
              </h1>
              <p className="mb-10 max-w-md text-base leading-relaxed text-[#9CA3AF]">
                {description}
              </p>
            </div>

            {/* Interactive Button */}
            <div style={{ transform: "translateZ(50px)" }} className="w-full sm:w-auto">
              <button className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-white px-8 py-4 text-sm font-bold text-black transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] active:scale-95 sm:w-auto">
                <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
                  <div className="relative h-full w-8 bg-white/40" />
                </div>
                <BellRing size={18} className="text-[#6C63FF]" />
                Notify Me When It's Live
              </button>
            </div>

          </div>
          
        </motion.div>
      </div>
    </div>
  );
}