import React from "react";
import Link from "next/link";
import { 
  Target, 
  Lightbulb, 
  ShieldCheck, 
  Code2, 
  Github, 
  Linkedin, 
  Mail, 
  ArrowRight,
  Cpu
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0F1117] text-[#E5E7EB] font-sans selection:bg-[#6C63FF]/30">
      
      {/* HERO SECTION */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden border-b border-white/5">
        {/* Background Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#6C63FF]/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-white">
            Empowering Your <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6C63FF] to-blue-400">
              GATE Journey
            </span>
          </h1>
          <p className="text-[#9CA3AF] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            GATEPrep Pro was built with a single vision: to transform scattered preparation materials into a structured, intelligent, and highly personalized study experience.
          </p>
        </div>
      </section>

      {/* OUR STORY & MISSION */}
      <section className="py-20 bg-[#1A1D27]/30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#6C63FF]/30 bg-[#6C63FF]/10 text-sm font-medium text-[#6C63FF]">
                <Target size={16} /> Our Mission
              </div>
              <h2 className="text-3xl font-bold text-white">Why we built this platform</h2>
              <p className="text-[#9CA3AF] leading-relaxed">
                Preparing for the GATE exam is overwhelming. Aspirants spend hundreds of hours just organizing PYQs, searching for notes, and trying to analyze their weak points. 
              </p>
              <p className="text-[#9CA3AF] leading-relaxed">
                GATEPrep Pro eliminates the noise. We provide a clean, distraction-free environment where your only focus is learning. With our intelligent trackers, deep analytics, and curated resources, we bring predictability to an otherwise chaotic preparation phase.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl border border-white/5 bg-[#1A1D27] hover:border-[#6C63FF]/30 transition-colors">
                <Lightbulb className="text-[#FBBF24] mb-4" size={28} />
                <h3 className="text-lg font-bold text-white mb-2">Smart Strategy</h3>
                <p className="text-sm text-[#9CA3AF]">Data-driven insights to help you focus on high-weightage topics.</p>
              </div>
              <div className="p-6 rounded-2xl border border-white/5 bg-[#1A1D27] hover:border-[#6C63FF]/30 transition-colors sm:translate-y-8">
                <ShieldCheck className="text-[#34D399] mb-4" size={28} />
                <h3 className="text-lg font-bold text-white mb-2">Quality Content</h3>
                <p className="text-sm text-[#9CA3AF]">Verified PYQs, concise formula sheets, and accurate mock tests.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE TEAM (NEMCHAND) */}
      <section className="py-24 border-t border-white/5 relative overflow-hidden">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Meet the Developer</h2>
            <p className="text-[#9CA3AF] max-w-2xl mx-auto">
              GATEPrep Pro is proudly designed, developed, and maintained by a passionate solo developer dedicated to educational technology.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="relative p-1 rounded-3xl bg-gradient-to-b from-[#6C63FF]/40 to-transparent">
              <div className="rounded-[22px] bg-[#0F1117] p-8 md:p-12 flex flex-col md:flex-row gap-10 items-center md:items-start">
                
                {/* Avatar / Photo Placeholder */}
                <div className="shrink-0 relative group">
                  <div className="absolute inset-0 bg-[#6C63FF] blur-[20px] opacity-40 group-hover:opacity-60 transition-opacity rounded-full"></div>
                  <div className="relative h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-[#1A1D27] bg-[#2A2D3E] flex items-center justify-center overflow-hidden">
                    {/* You can replace this Code2 icon with an actual <img> tag later */}
                    <Code2 size={48} className="text-[#6C63FF]" />
                  </div>
                </div>

                {/* Bio Info */}
                <div className="text-center md:text-left flex-1">
                  <h3 className="text-2xl font-bold text-white mb-1">Nemchand</h3>
                  <p className="text-[#6C63FF] font-medium mb-4 flex items-center justify-center md:justify-start gap-2">
                    <Cpu size={16} /> Founder & Lead Developer
                  </p>
                  
                  <p className="text-[#9CA3AF] text-sm leading-relaxed mb-6">
                    As an engineering student myself, I realized that while there is an abundance of raw study material on the internet, there is a severe lack of organization and modern tooling. I built GATEPrep Pro to solve the exact problems I faced—combining modern web technology with serious educational content to create the ultimate productivity tool for GATE aspirants.
                  </p>

                  <div className="flex items-center justify-center md:justify-start gap-4">
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg bg-[#1A1D27] text-[#9CA3AF] hover:text-white hover:bg-[#2A2D3E] transition-colors">
                      <Github size={20} />
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg bg-[#1A1D27] text-[#9CA3AF] hover:text-white hover:bg-[#2A2D3E] transition-colors">
                      <Linkedin size={20} />
                    </a>
                    <a href="mailto:contact@example.com" className="p-2.5 rounded-lg bg-[#1A1D27] text-[#9CA3AF] hover:text-white hover:bg-[#2A2D3E] transition-colors">
                      <Mail size={20} />
                    </a>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-20 border-t border-white/5 bg-[#1A1D27]/20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Want to see the platform in action?</h2>
          <p className="text-[#9CA3AF] mb-10">
            Join the community today and take your GATE preparation to the next level.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login?mode=register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-[#6C63FF] px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-[#6C63FF]/90 hover:shadow-[0_0_20px_rgba(108,99,255,0.3)] active:scale-95"
            >
              Get Started for Free <ArrowRight size={18} />
            </Link>
            <Link
              href="/features"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border border-white/10 bg-transparent px-8 py-3.5 text-sm font-medium text-white transition-colors hover:border-white/20 hover:bg-white/5"
            >
              Explore Features
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}