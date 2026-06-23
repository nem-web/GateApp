import Link from "next/link";
import { 
  ArrowRight, 
  BrainCircuit, 
  Target, 
  FileText, 
  BarChart3, 
  LayoutDashboard, 
  Zap, 
  Users, 
  CalendarDays,
  CheckCircle2,
  Lock
} from "lucide-react";

const publicFeatures = [
  {
    icon: FileText,
    title: "Subject-Wise PYQs",
    description: "Access 20+ years of Previous Year Questions categorized by subject and topic with detailed step-by-step solutions."
  },
  {
    icon: BrainCircuit,
    title: "Formula Revision Sheets",
    description: "Quick-access digital cheat sheets for every core subject. Perfect for last-minute revision."
  },
  {
    icon: Target,
    title: "Rank Predictor & Marks Calculator",
    description: "Estimate your All India Rank and normalize marks instantly using past year cutoff data and scoring trends."
  },
  {
    icon: Users,
    title: "Community Blog",
    description: "Read preparation strategies, interview experiences, and study guides written by top rankers and expert mentors."
  }
];

const dashboardFeatures = [
  {
    icon: LayoutDashboard,
    title: "Personalized Study Workspace",
    description: "A distraction-free environment tailored to your branch. Track your daily goals, upcoming tests, and active study streaks."
  },
  {
    icon: CalendarDays,
    title: "Dynamic Study Planner",
    description: "Input your target subjects and let our algorithm build a balanced weekly schedule to ensure you cover the syllabus before Feb."
  },
  {
    icon: BarChart3,
    title: "In-Depth Performance Analytics",
    description: "Identify weak areas with precision. Our analytics engine tracks your accuracy, time-per-question, and subject mastery levels over time."
  },
  {
    icon: Zap,
    title: "Daily Micro-Quizzes",
    description: "Keep concepts fresh with adaptive daily quizzes that target your weak points and reinforce your strongest subjects."
  }
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#0e0f14] text-white font-sans selection:bg-[#22c55e]/30">
      
      {/* HERO SECTION */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#22c55e]/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#22c55e]/30 bg-[#22c55e]/10 text-sm font-medium text-[#22c55e] mb-6">
            <Zap size={16} /> Everything you need to crack GATE
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Powerful Features for <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22c55e] to-blue-500">
              Serious Aspirants
            </span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            From free public resources to a highly personalized AI-driven study dashboard, GATEPrep Pro is engineered to maximize your AIR.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login?mode=register"
              className="w-full sm:w-auto rounded-lg bg-[#22c55e] px-8 py-3.5 text-sm font-bold text-black transition-all hover:bg-[#22c55e]/90 active:scale-95"
            >
              Start Free Trial
            </Link>
            <a
              href="#dashboard-features"
              className="w-full sm:w-auto rounded-lg border border-gray-700 bg-transparent px-8 py-3.5 text-sm font-medium text-white transition-colors hover:border-gray-500 hover:bg-gray-800"
            >
              Explore Dashboard
            </a>
          </div>
        </div>
      </section>

      {/* PUBLIC RESOURCES SECTION */}
      <section className="py-20 border-t border-gray-800/50 bg-[#111216]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-4">Public Learning Hub</h2>
            <p className="text-gray-400 max-w-2xl">
              Free tools and resources accessible to everyone. No login required to start learning and analyzing past trends.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {publicFeatures.map((feature, idx) => (
              <div 
                key={idx} 
                className="group p-8 rounded-2xl border border-gray-800 bg-[#0B0C10] transition-colors hover:border-[#22c55e]/50"
              >
                <div className="h-12 w-12 rounded-xl bg-gray-800 flex items-center justify-center text-[#22c55e] mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROTECTED DASHBOARD SECTION */}
      <section id="dashboard-features" className="py-20 border-t border-gray-800/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <div className="inline-flex items-center gap-2 text-[#f59e0b] font-bold text-sm uppercase tracking-wider mb-3">
                <Lock size={16} /> Pro Workspace
              </div>
              <h2 className="text-3xl font-bold mb-4">Personalized Study Dashboard</h2>
              <p className="text-gray-400 max-w-2xl">
                Create an account to unlock your private workspace. Organize notes, track test series analytics, and follow a customized roadmap.
              </p>
            </div>
            <Link
              href="/login"
              className="shrink-0 flex items-center gap-2 text-sm font-bold text-[#22c55e] hover:text-[#22c55e]/80 transition-colors"
            >
              Sign in to Dashboard <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {dashboardFeatures.map((feature, idx) => (
              <div 
                key={idx} 
                className="relative overflow-hidden p-8 rounded-2xl border border-gray-800 bg-gradient-to-b from-[#111216] to-[#0B0C10] transition-all hover:border-blue-500/30"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <feature.icon size={100} />
                </div>
                <div className="relative z-10">
                  <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6">
                    <feature.icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <ul className="mt-6 space-y-2">
                    {[1, 2, 3].map((_, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-500">
                        <CheckCircle2 size={14} className="text-[#22c55e]" />
                        Included in Pro Workspace
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 border-t border-gray-800/50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to maximize your GATE score?</h2>
          <p className="text-gray-400 mb-10">
            Join thousands of serious aspirants organizing their preparation with GATEPrep Pro.
          </p>
          <Link
            href="/login?mode=register"
            className="inline-flex items-center gap-2 rounded-lg bg-[#22c55e] px-8 py-4 text-base font-bold text-black transition-all hover:bg-[#22c55e]/90 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] active:scale-95"
          >
            Create Your Free Account <ArrowRight size={18} />
          </Link>
        </div>
      </section>

    </div>
  );
}