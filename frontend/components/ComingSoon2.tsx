"use client";
import React from "react";
import Link from "next/link";
import { ArrowLeft, Rocket, Sparkles, Clock } from "lucide-react";
import { BranchConfig } from "@/lib/branchConfig";

interface ComingSoonProps {
  title: string;
  description: string;
  backLink: string;
  backText: string;
  config?: BranchConfig; // Optional, so it works even on non-branch pages
}

export default function ComingSoon({ 
  title, 
  description, 
  backLink, 
  backText, 
  config 
}: ComingSoonProps) {
  
  // Fallback themes in case no branch config is provided
  const themeText = config?.theme.text || "text-[#6C63FF]";
  const themeBgLight = config?.theme.bgLight || "bg-[#6C63FF]/10";
  const themeBorder = config?.theme.border || "border-[#6C63FF]/30";
  const themeGlow = config?.theme.glow || "bg-[#6C63FF]/5";
  const themeSelection = config?.theme.selection || "selection:bg-[#6C63FF]/30";

  return (
    <div className={`min-h-[80vh] flex flex-col relative ${themeSelection}`}>
      
      {/* Dynamic 3D Ambient Glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] blur-[150px] rounded-full pointer-events-none ${themeGlow}`} />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 pt-12 sm:px-6 flex flex-col flex-grow">
        
        {/* Back Navigation */}
        <Link 
          href={backLink} 
          className={`mb-12 inline-flex items-center gap-2 text-sm font-medium text-gray-400 transition-colors ${themeText.replace('text-', 'hover:text-')}`}
        >
          <ArrowLeft size={16} /> {backText}
        </Link>

        {/* Coming Soon Card */}
        <div className={`flex-grow flex flex-col items-center justify-center rounded-3xl border border-gray-800 bg-[#111216]/60 p-8 sm:p-16 backdrop-blur-2xl shadow-2xl text-center transition-all duration-500 hover:border-gray-700`}>
          
          {/* Animated Icons Container */}
          <div className="relative mb-8">
            <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-spin-slow" />
            <div className={`flex h-24 w-24 items-center justify-center rounded-3xl shadow-inner border backdrop-blur-md ${themeBgLight} ${themeText} ${themeBorder}`}>
              <Rocket size={48} strokeWidth={1.5} className="animate-bounce-slow" />
            </div>
            {/* Sparkle Badges */}
            <div className={`absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#0e0f14] border ${themeBorder} ${themeText}`}>
              <Sparkles size={14} />
            </div>
          </div>

          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6 text-xs font-bold uppercase tracking-widest ${themeBgLight} ${themeBorder} ${themeText}`}>
            <Clock size={14} /> Work in Progress
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            {title}
          </h1>
          
          <p className="text-gray-400 text-lg max-w-lg mx-auto leading-relaxed mb-10">
            {description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link 
              href={backLink}
              className={`inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-bold text-black transition-all hover:opacity-90 active:scale-95 shadow-lg ${themeText.replace('text-', 'bg-')}`}
            >
              Go Back
            </Link>
            <button 
              className={`inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-semibold text-white border border-gray-700 bg-gray-800/50 transition-all hover:bg-gray-700 hover:text-white active:scale-95`}
              onClick={() => alert("We will notify you when it's ready!")}
            >
              Notify Me
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}