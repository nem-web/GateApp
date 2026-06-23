"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Zap, 
  Flame, 
  Clock, 
  CheckCircle2, 
  PlayCircle, 
  CalendarDays, 
  Lock, 
  ChevronRight,
  ShieldAlert
} from "lucide-react";

// --- Dummy Data (Replace with real DB fetch) ---
const todaysQuiz = {
  id: "dq-today",
  date: "Today, 24 Oct",
  title: "Mixed Subject Challenge",
  subjects: ["Networks", "Engineering Maths"],
  questions: 5,
  timeLimit: 10, // mins
  xpReward: 50,
};

const pastQuizzes = [
  { id: "dq-1", date: "Yesterday, 23 Oct", title: "Control Systems Basics", score: 4, total: 5, status: "completed" },
  { id: "dq-2", date: "22 Oct 2026", title: "Digital Logic Masters", score: 5, total: 5, status: "completed" },
  { id: "dq-3", date: "21 Oct 2026", title: "Power Electronics", score: 0, total: 5, status: "missed" },
  { id: "dq-4", date: "20 Oct 2026", title: "Signals & Systems", score: 3, total: 5, status: "completed" },
];

export default function DailyQuizPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <div className="min-h-screen bg-[#0F1117] text-[#E5E7EB] font-sans pb-24 selection:bg-[#F59E0B]/30 overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#F59E0B]/10 blur-[120px] rounded-full pointer-events-none" />

      <main className="relative z-10 mx-auto max-w-5xl px-4 pt-24 sm:px-6 lg:px-8">
        
        {/* HEADER & STREAK */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#F59E0B]/30 bg-[#F59E0B]/10 text-xs font-bold uppercase tracking-widest text-[#F59E0B] mb-4">
              <Zap size={14} /> Consistency is Key
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-2">
              Daily GATE Quiz
            </h1>
            <p className="text-[#9CA3AF] text-base max-w-2xl">
              5 new questions every day. Keep your concepts sharp, earn XP, and climb the weekly leaderboard.
            </p>
          </div>

          {/* Gamification Streak Card */}
          <div className="shrink-0 flex items-center gap-4 rounded-2xl border border-[#F59E0B]/20 bg-[#1A1D27] p-4 shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F59E0B]/10 text-[#F59E0B]">
              <Flame size={24} className="animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Current Streak</p>
              <p className="text-2xl font-bold text-white">12 Days</p>
            </div>
          </div>
        </motion.div>

        {/* ADMIN QUICK LINK (Only visible to admins ideally) */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="mb-8 flex items-center justify-end"
        >
          <Link 
            href="/admin/daily-quiz" 
            className="flex items-center gap-2 text-sm font-medium text-[#6C63FF] transition-colors hover:text-white"
          >
            <ShieldAlert size={16} /> Manage Quizzes (Admin)
          </Link>
        </motion.div>

        {/* TODAY'S QUIZ HERO CARD */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
          className="relative mb-16 overflow-hidden rounded-[2rem] border border-[#F59E0B]/30 bg-gradient-to-br from-[#1A1D27] to-[#0F1117] p-8 md:p-12 shadow-[0_0_50px_rgba(245,158,11,0.1)] group"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-10 pointer-events-none">
            <Zap size={200} />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#F59E0B]/20 px-3 py-1 text-sm font-bold text-[#F59E0B]">
                <CalendarDays size={16} /> {todaysQuiz.date}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                {todaysQuiz.title}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-[#9CA3AF]">
                <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                  <FileText size={16} /> {todaysQuiz.questions} Questions
                </span>
                <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                  <Clock size={16} /> {todaysQuiz.timeLimit} Mins
                </span>
                <span className="flex items-center gap-1.5 bg-green-500/10 text-green-400 px-3 py-1.5 rounded-lg border border-green-500/20">
                  <Zap size={16} /> +{todaysQuiz.xpReward} XP
                </span>
              </div>
            </div>

            <Link 
              href={`/daily-quiz/${todaysQuiz.id}`}
              className="shrink-0 flex w-full md:w-auto items-center justify-center gap-2 rounded-xl bg-[#F59E0B] px-8 py-4 text-base font-bold text-black transition-all hover:bg-[#F59E0B]/90 hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] active:scale-95"
            >
              <PlayCircle size={20} /> Start Today's Quiz
            </Link>
          </div>
        </motion.div>

        {/* PAST QUIZZES SECTION */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h3 className="text-xl font-bold text-white">Past Quizzes</h3>
            <span className="text-sm text-[#9CA3AF]">Last 7 Days</span>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {pastQuizzes.map((quiz) => (
              <motion.div 
                key={quiz.id}
                variants={itemVariants}
              >
                <Link 
                  href={`/daily-quiz/${quiz.id}`}
                  className={`group flex items-center justify-between rounded-2xl border p-5 transition-all hover:-translate-y-1 ${
                    quiz.status === "completed" && quiz.score === quiz.total 
                      ? "bg-green-500/5 border-green-500/20 hover:border-green-500/50" 
                      : quiz.status === "completed"
                      ? "bg-[#1A1D27] border-white/5 hover:border-white/20"
                      : "bg-red-500/5 border-red-500/20 hover:border-red-500/50 opacity-70 hover:opacity-100"
                  }`}
                >
                  <div>
                    <p className="text-xs font-semibold text-[#9CA3AF] mb-1">{quiz.date}</p>
                    <h4 className="text-base font-bold text-white transition-colors group-hover:text-[#F59E0B]">
                      {quiz.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-4">
                    {quiz.status === "completed" ? (
                      <div className="flex flex-col items-end">
                        <span className={`text-lg font-bold ${quiz.score === quiz.total ? 'text-green-400' : 'text-white'}`}>
                          {quiz.score}/{quiz.total}
                        </span>
                        <span className="text-xs text-[#9CA3AF]">Score</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-400">
                        <Lock size={12} /> Missed
                      </div>
                    )}
                    <ChevronRight size={18} className="text-[#9CA3AF] transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>

      </main>
    </div>
  );
}

// Just a tiny mock icon for FileText to keep imports clean
function FileText(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" x2="8" y1="13" y2="13"/>
      <line x1="16" x2="8" y1="17" y2="17"/>
      <line x1="10" x2="8" y1="9" y2="9"/>
    </svg>
  );
}