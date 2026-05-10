'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import {
  Home,
  Calendar,
  CheckSquare,
  FileText,
  Layers,
  Youtube,
  BookOpen,
  Award,
  Gamepad2,
  ClipboardCheck,
  Sun,
  Moon,
  User,
  Menu,
  X,
} from 'lucide-react'
type NavItem = {
  name: string
  href: string
  icon: LucideIcon
  disabled?: boolean
  badge?: string
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Study Plan', href: '/study-plan', icon: Calendar },
  { name: 'To-Do List', href: '/todos', icon: CheckSquare },
  { name: 'Notes', href: '/notes', icon: FileText },
  { name: 'Flashcards', href: '/flashcards', icon: Layers },
  { name: 'Lectures', href: '/lectures', icon: Youtube },
  { name: 'PYQ Papers', href: '/pyq', icon: BookOpen },
  { name: 'Cutoffs', href: '/cutoffs', icon: Award },
  { name: 'Games', href: '/games', icon: Gamepad2 },
  { name: 'Test', href: '/test', icon: ClipboardCheck },
]

export default function SidebarNav() {
  const pathname = usePathname()
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [profile, setProfile] = useState<{
    name: string
    targetExam: string
    gateDate: string | null
  }>({ name: '…', targetExam: 'GATE', gateDate: null })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    fetch('/api/user/me')
      .then((r) => r.json())
      .then((data) => {
        if (data?.name) {
          setProfile({
            name: data.name,
            targetExam: data.targetExam ?? 'GATE',
            gateDate: data.gateDate ?? null,
          })
        }
      })
      .catch(() => {})
  }, [])

  const gate = profile.gateDate ? new Date(profile.gateDate) : new Date('2025-02-01')
  const daysLeft = Math.max(
    0,
    Math.ceil((gate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
  )
  const isUrgent = daysLeft < 60
  const isDarkMode = resolvedTheme === 'dark'

  return (
    <>
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-background/95 backdrop-blur-sm px-4 py-3 border-b border-border lg:hidden">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-semibold text-sm">G</span>
          </div>
          <span className="font-semibold text-foreground">GATEPrep Pro</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-secondary transition-colors"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-background/95 backdrop-blur-sm pt-16 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.disabled ? '#' : item.href}
                  onClick={() => !item.disabled && setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    item.disabled
                      ? 'opacity-50 cursor-not-allowed'
                      : isActive
                      ? 'bg-sidebar-accent text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.name}</span>
                  {item.badge && (
                    <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </motion.div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-[220px] flex-col bg-sidebar border-r border-sidebar-border z-40">
        {/* Logo */}
        <div className="p-5 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">G</span>
            </div>
            <span className="font-semibold text-foreground">GATEPrep Pro</span>
          </div>

          {/* Countdown Badge */}
          <div
            className={`mt-4 px-3 py-2 rounded-lg text-center ${
              isUrgent ? 'bg-warning/15 text-warning' : 'bg-primary/15 text-primary'
            }`}
          >
            <span className="text-2xl font-bold">{daysLeft}</span>
            <span className="text-xs block mt-0.5 opacity-80">days until GATE</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.disabled ? '#' : item.href}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                  item.disabled
                    ? 'opacity-50 cursor-not-allowed'
                    : isActive
                    ? 'bg-sidebar-accent text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full"
                  />
                )}
                <item.icon size={18} className={isActive ? 'text-primary' : ''} />
                <span className="text-sm font-medium">{item.name}</span>
                {item.badge && (
                  <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* User & Theme */}
        <div className="p-4 border-t border-sidebar-border space-y-3">
          <button
            type="button"
            disabled={!mounted}
            onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all disabled:opacity-50"
          >
            {!mounted ? <Moon size={18} /> : isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
            <span className="text-sm font-medium">
              {!mounted ? 'Theme' : isDarkMode ? 'Dark mode' : 'Light mode'}
            </span>
          </button>

          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <User size={16} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{profile.name}</p>
              <p className="text-xs text-muted-foreground truncate">{profile.targetExam}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border lg:hidden">
        <nav className="flex items-center justify-around py-2">
          {[navItems[0], navItems[1], navItems[3], navItems[6], navItems[8]].map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <item.icon size={20} />
                <span className="text-[10px] font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}

