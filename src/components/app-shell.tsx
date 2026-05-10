"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, BookOpen, CalendarDays, CheckSquare, FileText, Gamepad2, Home, Moon, PlayCircle, Sun, Trophy } from "lucide-react";
import { useTheme } from "next-themes";

const nav = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/study-plan", label: "Study Plan", icon: CalendarDays },
  { href: "/todo", label: "To-Do", icon: CheckSquare },
  { href: "/notes", label: "Notes", icon: FileText },
  { href: "/lectures", label: "Lectures", icon: PlayCircle },
  { href: "/pyq", label: "PYQ", icon: BookOpen },
  { href: "/cutoffs", label: "Cutoffs", icon: BarChart3 },
  { href: "/test", label: "Tests", icon: Trophy },
  { href: "/games", label: "Games", icon: Gamepad2 }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  return (
    <div className="min-h-screen md:grid md:grid-cols-[240px_1fr]">
      <aside className="border-r border-slate-200 p-4 dark:border-slate-800">
        <h1 className="mb-6 text-xl font-bold text-brand">GATEPrep Pro</h1>
        <nav className="space-y-2">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${active ? "bg-brand text-white" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button className="mt-6 flex items-center gap-2 rounded-lg border px-3 py-2 text-sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />} Toggle theme
        </button>
      </aside>
      <main className="p-4 md:p-6 animate-in fade-in duration-300">{children}</main>
    </div>
  );
}
