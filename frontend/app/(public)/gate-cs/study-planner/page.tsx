"use client";

import Link from "next/link";
import { useState } from "react";
import { JsonLd, absoluteUrl, breadcrumbSchema } from "@/lib/seo";
import { Calendar, Target, Brain, Award, Clock, ChevronRight, BookOpen, TrendingUp, BarChart3, Sparkles } from "lucide-react";

export default function GateCSStudyPlannerPage() {
  const [hours, setHours] = useState(4);
  const [days, setDays] = useState(6);
  const weeklyHours = hours * days;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <JsonLd
        data={[
          breadcrumbSchema([{ name: "Home", path: "/" }, { name: "GATE CS", path: "/gate-cs" }, { name: "Study Planner", path: "/gate-cs/study-planner" }]),
        ]}
      />
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-10 md:py-14">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:text-foreground">Home</Link></li>
            <li>/</li>
            <li><Link href="/gate-cs" className="hover:text-foreground">GATE CS</Link></li>
            <li>/</li>
            <li className="text-foreground font-medium" aria-current="page">Study Planner</li>
          </ol>
        </nav>

        <header className="max-w-3xl">
          <p className="text-sm font-medium text-primary">GATE CS preparation tool</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">GATE CS Study Planner</h1>
          <p className="mt-4 leading-7 text-muted-foreground">
            Personalize your GATE CS preparation with an intelligent study planner. Set your daily study hours,
            target score, and rank goals to get a customized study schedule that optimizes your preparation.
          </p>
        </header>

        {/* Personalization Dashboard */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Daily Goals Card */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold flex items-center gap-2"><Clock className="size-5 text-primary" /> Daily Goals</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="text-sm font-medium">Hours per day</label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="mt-2 w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1 hour</span>
                  <span className="font-semibold text-primary">{hours} hours</span>
                  <span>10 hours</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Study days per week</label>
                <input
                  type="range"
                  min={1}
                  max={7}
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="mt-2 w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1 day</span>
                  <span className="font-semibold text-primary">{days} days</span>
                  <span>7 days</span>
                </div>
              </div>
              <div className="rounded-lg bg-primary/10 p-4 text-center">
                <div className="text-2xl font-bold text-primary">{weeklyHours}</div>
                <div className="text-xs text-muted-foreground">Weekly Study Capacity (hours)</div>
              </div>
            </div>
          </div>

          {/* Target Section */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold flex items-center gap-2"><Target className="size-5 text-primary" /> Target Settings</h2>
            <div className="mt-4 space-y-4">
              <div className="rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Target Score</span>
                  <Award className="size-5 text-yellow-500" />
                </div>
                <div className="mt-2 text-2xl font-bold text-primary">85+</div>
                <div className="text-xs text-muted-foreground">Competitive for Top IITs & PSUs</div>
              </div>
              <div className="rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Target Rank</span>
                  <TrendingUp className="size-5 text-green-500" />
                </div>
                <div className="mt-2 text-2xl font-bold text-primary">Top 500</div>
                <div className="text-xs text-muted-foreground">IIT MTech CSE Admission Range</div>
              </div>
              <div className="rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Target Institute</span>
                  <Brain className="size-5 text-purple-500" />
                </div>
                <div className="mt-2 text-lg font-bold text-primary">IIT Bombay / IIT Delhi</div>
                <div className="text-xs text-muted-foreground">Top-tier Computer Science programs</div>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Schedule Preview */}
        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold flex items-center gap-2"><Calendar className="size-5 text-primary" /> Your Weekly Study Schedule</h2>
          <p className="mt-1 text-sm text-muted-foreground">Based on {hours} hours/day, {days} days/week ({weeklyHours} hours total)</p>
          <div className="mt-4 grid gap-3 md:grid-cols-7">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
              const isStudyDay = i < days;
              const studyHours = isStudyDay ? hours : 0;
              const activities = isStudyDay
                ? [
                    `${Math.round(studyHours * 0.4)}h Concept Study`,
                    `${Math.round(studyHours * 0.3)}h Problem Solving`,
                    `${Math.round(studyHours * 0.2)}h PYQ Practice`,
                    `${Math.round(studyHours * 0.1)}h Revision`,
                  ]
                : ["Rest & Recovery", "Light Review (Optional)"];
              return (
                <div
                  key={day}
                  className={`rounded-lg border p-3 text-center ${
                    isStudyDay
                      ? "border-primary/30 bg-primary/5"
                      : "border-border bg-secondary/30 opacity-60"
                  }`}
                >
                  <div className="text-sm font-semibold">{day}</div>
                  <div className={`text-xs font-medium mt-1 ${isStudyDay ? "text-primary" : "text-muted-foreground"}`}>
                    {isStudyDay ? `${studyHours}h` : "Off"}
                  </div>
                  <div className="mt-2 space-y-1">
                    {activities.slice(0, 3).map((act) => (
                      <div key={act} className="text-[10px] text-muted-foreground">{act}</div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Quick Stats Dashboard */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <div className="text-2xl font-bold text-primary">{weeklyHours}</div>
            <div className="text-sm text-muted-foreground">Weekly Hours</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <div className="text-2xl font-bold text-primary">{weeklyHours * 52}</div>
            <div className="text-sm text-muted-foreground">Yearly Capacity</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <div className="text-2xl font-bold text-primary">{Math.round(weeklyHours * 0.3)}h</div>
            <div className="text-sm text-muted-foreground">PYQ Practice/Week</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <div className="text-2xl font-bold text-primary">{Math.round(weeklyHours * 0.1)}h</div>
            <div className="text-sm text-muted-foreground">Revision/Week</div>
          </div>
        </div>

        {/* Revision Planner */}
        <section className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg font-semibold flex items-center gap-2"><Sparkles className="size-5 text-primary" /> Revision Planner</h2>
          <p className="mt-1 text-sm text-muted-foreground">Suggested revision schedule based on exam proximity</p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-lg border border-border p-4 hover:bg-secondary/50 transition-colors">
              <h3 className="font-medium text-sm">Daily Revision</h3>
              <p className="text-xs text-muted-foreground mt-1">30 min/day: Flashcards + Formula Sheets</p>
              <div className="mt-2 text-xs text-primary font-medium">10% of study time</div>
            </div>
            <div className="rounded-lg border border-border p-4 hover:bg-secondary/50 transition-colors">
              <h3 className="font-medium text-sm">Weekly Revision</h3>
              <p className="text-xs text-muted-foreground mt-1">3 hours/week: Weak topic + Mistake log review</p>
              <div className="mt-2 text-xs text-primary font-medium">1 subject in-depth</div>
            </div>
            <div className="rounded-lg border border-border p-4 hover:bg-secondary/50 transition-colors">
              <h3 className="font-medium text-sm">Monthly Revision</h3>
              <p className="text-xs text-muted-foreground mt-1">Full syllabus scan + Mock test analysis</p>
              <div className="mt-2 text-xs text-primary font-medium">Track progress trends</div>
            </div>
          </div>
        </section>

        {/* CTA Links */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/gate-cs/study-plan" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
            <BookOpen className="size-4" /> View Detailed Study Plans
          </Link>
          <Link href="/gate-cs/pyqs" className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:bg-secondary transition-colors">
            <BarChart3 className="size-4" /> Start PYQ Practice
          </Link>
        </div>
      </main>
    </div>
  );
}