'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react' // <-- Added next-auth hook
import { Menu, X, Star, FileText, BookOpen, Zap, Target, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// --- Mega Menu Data Structure ---
const popularResources = [
  { name: 'GATE EE PYQs', href: '/resources/gate-ee/pyq' },
  { name: 'Subject-wise PYQs', href: '/pyq/subjects' },
  { name: 'Formula Sheets', href: '/formula-sheets' },
  { name: 'Rank Predictor', href: '/tools/rank-predictor' },
]

const practiceResources = [
  { name: 'Previous Year Papers', href: '/pyqs' },
  { name: 'Topic-wise PYQs', href: '/pyq/topics' },
  { name: 'Mock Tests', href: '/mock-tests' },
  { name: 'Daily Quiz', href: '/daily-quiz' },
]

const materialResources = [
  { name: 'Subject Notes', href: '/free-notes' },
  { name: 'Revision Shortcuts', href: '/revision-notes' },
]

const toolResources = [
  { name: 'Marks Calculator', href: '/tools/marks-calculator' },
  { name: 'Study Planner', href: '/study-planner' },
]

// Removed "Login" from static array to handle it conditionally based on auth state
const baseNavItems = [
  { name: 'Blog', href: '/blog' },
  { name: 'Resources', href: '/resources' },
  { name: 'Pricing', href: '/pricing' },
]

export function PublicNavbar() {
  const pathname = usePathname() ?? "/"
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // Use NextAuth session to check logged in status
  const { data: session, status } = useSession()
  const isLoading = status === 'loading'
  const isLoggedIn = !!session

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-[#111216] border-b border-gray-800/50 text-white">
      <div className="mx-auto flex h-[4.5rem] w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Logo & Brand */}
        <Link 
          href="/" 
          className="flex items-center gap-3 shrink-0 group transition-transform duration-200 hover:scale-[1.02]"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#22c55e] shadow-sm">
            <span className="text-base font-bold text-black">G</span>
          </div>
          <span className="text-base font-semibold tracking-wide text-white">
            GATEPrep Pro
          </span>
        </Link>

        {/* Right: Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8 h-full">
          <nav aria-label="Public navigation" className="flex items-center gap-8 h-full">
            {baseNavItems.map((item) => {
              
              // MEGA MENU LOGIC
              if (item.name === 'Resources') {
                return (
                  <div key={item.name} className="group relative h-full flex items-center">
                    <Link
                      href={item.href}
                      className={`text-sm font-medium transition-colors hover:text-white ${
                        isActive(item.href) ? 'text-white' : 'text-gray-400'
                      }`}
                    >
                      {item.name}
                    </Link>

                    <div className="invisible absolute top-full z-50 w-[900px] -right-16 pt-4 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                      
                      {/* Actual Mega Menu Card */}
                      <div className="rounded-2xl border border-gray-800 bg-[#111216] p-8 shadow-2xl cursor-default">
                        <div className="grid grid-cols-4 gap-8">
                          
                          {/* Col 1: Most Popular */}
                          <div>
                            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
                              <Star className="h-4 w-4 text-[#22c55e]" /> Most Popular
                            </h3>
                            <div className="space-y-3">
                              {popularResources.map((link) => (
                                <Link key={link.name} href={link.href} className="block text-sm text-gray-400 transition-colors hover:text-white">
                                  {link.name}
                                </Link>
                              ))}
                            </div>
                          </div>

                          {/* Col 2: PYQs & Practice */}
                          <div>
                            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
                              <FileText className="h-4 w-4 text-[#22c55e]" /> PYQs & Practice
                            </h3>
                            <div className="space-y-3">
                              {practiceResources.map((link) => (
                                <Link key={link.name} href={link.href} className="block text-sm text-gray-400 transition-colors hover:text-white">
                                  {link.name}
                                </Link>
                              ))}
                            </div>
                          </div>

                          {/* Col 3: Notes & Tools (Stacked) */}
                          <div className="space-y-8">
                            <div>
                              <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
                                <BookOpen className="h-4 w-4 text-[#22c55e]" /> Notes & Subjects
                              </h3>
                              <div className="space-y-3">
                                {materialResources.map((link) => (
                                  <Link key={link.name} href={link.href} className="block text-sm text-gray-400 transition-colors hover:text-white">
                                    {link.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
                                <Zap className="h-4 w-4 text-[#22c55e]" /> Smart Tools
                              </h3>
                              <div className="space-y-3">
                                {toolResources.map((link) => (
                                  <Link key={link.name} href={link.href} className="block text-sm text-gray-400 transition-colors hover:text-white">
                                    {link.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Col 4: Featured Card */}
                          <div className="h-full">
                            <div className="flex h-full flex-col justify-between rounded-xl border border-[#22c55e]/20 bg-gradient-to-br from-[#22c55e]/10 to-transparent p-5">
                              <div>
                                <span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-[#22c55e]">
                                  Featured
                                </span>
                                <h4 className="mb-2 text-base font-bold text-white">
                                  GATE 2027 Complete Roadmap
                                </h4>
                                <p className="text-xs leading-relaxed text-gray-400">
                                  Step-by-step preparation strategy, timeline, and resource guide to crack GATE.
                                </p>
                              </div>
                              <Link
                                href="/login?mode=register"
                                className="mt-6 flex w-full items-center justify-center rounded-lg bg-[#22c55e] px-4 py-2 text-xs font-bold text-black transition-colors hover:bg-[#22c55e]/90"
                              >
                                Start Free
                              </Link>
                            </div>
                          </div>

                        </div>

                        {/* Mega Menu Footer */}
                        <div className="mt-8 border-t border-gray-800 pt-6">
                          <Link
                            href="/resources"
                            className="group inline-flex items-center text-sm font-medium text-[#22c55e] transition-colors hover:text-[#22c55e]/80"
                          >
                            View all resources <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }

              // STANDARD LINKS
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-white ${
                    isActive(item.href) ? 'text-white' : 'text-gray-400'
                  }`}
                >
                  {item.name}
                </Link>
              )
            })}

            {/* CONDITIONAL LOGIN LINK (Only show if logged out and not loading) */}
            {!isLoggedIn && !isLoading && (
              <Link
                href="/login"
                className={`text-sm font-medium transition-colors hover:text-white ${
                  isActive('/login') ? 'text-white' : 'text-gray-400'
                }`}
              >
                Login
              </Link>
            )}
          </nav>

          {/* Top Right CTA Button (Conditional Based on Auth) */}
          <div className="min-w-[110px] flex justify-end">
            {!isLoading && (
              isLoggedIn ? (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-lg bg-[#22c55e] px-5 py-2 text-sm font-semibold text-black transition-all duration-200 hover:bg-[#22c55e]/90 hover:-translate-y-0.5"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/login?mode=register"
                  className="inline-flex items-center justify-center rounded-lg bg-[#22c55e] px-5 py-2 text-sm font-semibold text-black transition-all duration-200 hover:bg-[#22c55e]/90 hover:-translate-y-0.5"
                >
                  Start Free
                </Link>
              )
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="inline-flex items-center justify-center rounded-lg p-2.5 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors lg:hidden"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-gray-800 bg-[#111216] lg:hidden"
          >
            <nav className="flex flex-col space-y-2 px-4 py-6">
              {baseNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Conditional Mobile Login Link */}
              {!isLoggedIn && !isLoading && (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    isActive('/login')
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                  }`}
                >
                  Login
                </Link>
              )}

              <div className="mt-4 border-t border-gray-800 pt-4">
                {/* Conditional Mobile CTA */}
                {!isLoading && (
                  isLoggedIn ? (
                    <Link
                      href="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex w-full items-center justify-center rounded-lg bg-[#22c55e] px-4 py-3 text-sm font-semibold text-black transition-colors hover:bg-[#22c55e]/90"
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <Link
                      href="/login?mode=register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex w-full items-center justify-center rounded-lg bg-[#22c55e] px-4 py-3 text-sm font-semibold text-black transition-colors hover:bg-[#22c55e]/90"
                    >
                      Start Free
                    </Link>
                  )
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}