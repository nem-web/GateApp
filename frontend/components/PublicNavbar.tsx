'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu,
  X,
  ChevronDown,
  Calculator,
  BarChart3,
  BookOpen,
  GraduationCap,
  FileText,
  Youtube,
  Brain,
  PenTool,
  Zap,
  Search,
  LogIn,
  Sparkles,
  Layers,
  Award,
} from 'lucide-react'

type NavLink = {
  name: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
}

type NavDropdown = {
  name: string
  icon: React.ComponentType<{ className?: string }>
  links: NavLink[]
}

type NavItem = NavLink | NavDropdown

const publicNavItems: NavItem[] = [
  { name: 'Home', href: '/', icon: Layers },
  {
    name: 'Tools',
    icon: Zap,
    links: [
      { name: 'Marks Calculator', href: '/gate-marks-calculator', icon: Calculator },
      { name: 'Rank Predictor', href: '/gate-rank-predictor', icon: BarChart3 },
      { name: 'Study Planner', href: '/study-planner', icon: Brain },
      { name: 'Revision Tracker', href: '/revision-tracker', icon: Award },
      { name: 'Daily Quiz', href: '/daily-quiz', icon: PenTool },
    ],
  },
  {
    name: 'Resources',
    icon: BookOpen,
    links: [
      { name: 'Blogs', href: '/blog', icon: FileText },
      { name: 'PYQ Papers', href: '/pyq', icon: BookOpen },
      { name: 'Formula Sheets', href: '/free-formula-sheets', icon: Sparkles },
      { name: 'Free Notes', href: '/free-gate-notes', icon: FileText },
      { name: 'Vlogs', href: '/vlogs', icon: Youtube },
    ],
  },
  {
    name: 'Subjects',
    icon: GraduationCap,
    links: [
      { name: 'All Subjects', href: '/subject', icon: Layers },
      { name: 'GATE EE', href: '/gate-ee', icon: GraduationCap },
      { name: 'GATE CS', href: '/gate-cs', icon: GraduationCap },
      { name: 'GATE EC', href: '/gate-ec', icon: GraduationCap },
      { name: 'GATE ECE', href: '/gate-ece', icon: GraduationCap },
      { name: 'GATE CE', href: '/gate-ce', icon: GraduationCap },
      { name: 'GATE ME', href: '/gate-me', icon: GraduationCap },
      { name: 'GATE IN', href: '/gate-in', icon: GraduationCap },
    ],
  },
  { name: 'Pricing', href: '/pricing', icon: Sparkles },
  { name: 'Search', href: '/search', icon: Search },
]

function isDropdown(item: NavItem): item is NavDropdown {
  return 'links' in item && Array.isArray((item as NavDropdown).links)
}

function getItemHref(item: NavItem): string {
  if (isDropdown(item)) return item.links[0]?.href ?? '#'
  return item.href
}

export function PublicNavbar() {
  const pathname = usePathname() ?? "/"

  // const [mounted, setMounted] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)

  // useEffect(() => {
  //   setMounted(true)
  // }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  // if (!mounted) {
  //   return (
  //     <header className="sticky top-0 z-50 w-full bg-background">
  //       <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
  //         <Link href="/" className="flex items-center gap-3 shrink-0">
  //           <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
  //             <span className="text-xl font-bold text-primary-foreground">
  //               G
  //             </span>
  //           </div>

  //           <span className="hidden text-lg font-bold text-foreground sm:inline-block">
  //             GATEPrep Pro
  //           </span>
  //         </Link>
  //       </div>
  //     </header>
  //   )
  // }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-background/80 shadow-sm backdrop-blur-xl border-b border-border/40'
          : 'bg-background'
      }`}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <Link 
          href="/" 
          className="flex items-center gap-3 shrink-0 group transition-transform duration-200 hover:scale-[1.02]"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-sm group-hover:shadow-md transition-all">
            <span className="text-xl font-bold text-primary-foreground">G</span>
          </div>
          <span className="hidden text-lg font-bold text-foreground sm:inline-block tracking-tight">
            GATEPrep Pro
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="Public navigation" className="hidden lg:flex items-center gap-1.5">
          {publicNavItems.map((item) => {
            if (isDropdown(item)) {
              const isOpen = openDropdown === item.name
              const hasActiveChild = item.links.some((link) => isActive(link.href))

              return (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(item.name)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    type="button"
                    onClick={() => setOpenDropdown(isOpen ? null : item.name)}
                    className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                      hasActiveChild
                        ? 'text-primary bg-primary/5'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/80'
                    }`}
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    {item.name}
                    <ChevronDown
                      className={`h-3.5 w-3.5 opacity-70 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute left-0 top-full mt-2 w-60 rounded-xl border border-border/50 bg-background/95 backdrop-blur-xl p-2.5 shadow-xl ring-1 ring-black/5"
                      >
                        <div className="flex flex-col gap-1">
                          {item.links.map((link) => (
                            <Link
                              key={link.href}
                              href={link.href}
                              onClick={() => setOpenDropdown(null)}
                              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                                isActive(link.href)
                                  ? 'bg-primary/10 text-primary'
                                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                              }`}
                            >
                              {link.icon && (
                                <link.icon 
                                  className={`h-4 w-4 shrink-0 transition-colors ${
                                    isActive(link.href) ? 'text-primary' : 'text-muted-foreground/70'
                                  }`} 
                                />
                              )}
                              {link.name}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            }

            const href = getItemHref(item)
            return (
              <Link
                key={item.name}
                href={href}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive(href)
                    ? 'text-primary bg-primary/5'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/80'
                }`}
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Desktop Auth Button - FIXED PADDING & STYLING */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:bg-primary/90 active:scale-95"
          >
            <LogIn className="h-4 w-4" />
            Sign In
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="inline-flex items-center justify-center rounded-lg p-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors lg:hidden active:scale-95"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-border/50 bg-background/95 backdrop-blur-xl lg:hidden shadow-inner"
          >
            <nav aria-label="Mobile public navigation" className="space-y-1.5 px-4 py-6 max-h-[calc(100vh-4.5rem)] overflow-y-auto">
              {publicNavItems.map((item) => {
                if (isDropdown(item)) {
                  const isOpen = openDropdown === item.name
                  const hasActiveChild = item.links.some((link) => isActive(link.href))

                  return (
                    <div key={item.name} className="flex flex-col gap-1">
                      <button
                        type="button"
                        onClick={() => setOpenDropdown(isOpen ? null : item.name)}
                        className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                          hasActiveChild
                            ? 'text-primary bg-primary/5'
                            : 'text-muted-foreground hover:text-foreground hover:bg-secondary/80'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          {item.icon && <item.icon className="h-5 w-5 opacity-80" />}
                          {item.name}
                        </span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-300 ${
                            isOpen ? 'rotate-180 text-foreground' : 'opacity-70'
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="ml-6 mt-1 space-y-1 border-l-2 border-border/50 pl-4 py-1">
                              {item.links.map((link) => (
                                <Link
                                  key={link.href}
                                  href={link.href}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                                    isActive(link.href)
                                      ? 'bg-primary/10 text-primary'
                                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                                  }`}
                                >
                                  {link.icon && (
                                    <link.icon 
                                      className={`h-4 w-4 shrink-0 ${
                                        isActive(link.href) ? 'text-primary' : 'text-muted-foreground/70'
                                      }`} 
                                    />
                                  )}
                                  {link.name}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                }

                const href = getItemHref(item)
                return (
                  <Link
                    key={item.name}
                    href={href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                      isActive(href)
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {item.icon && <item.icon className="h-5 w-5 opacity-80" />}
                    {item.name}
                  </Link>
                )
              })}

              <div className="mt-6 border-t border-border/50 pt-6">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-base font-semibold text-primary-foreground shadow-sm hover:shadow-md hover:bg-primary/90 transition-all active:scale-[0.98]"
                >
                  <LogIn className="h-5 w-5" />
                  Sign In
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}