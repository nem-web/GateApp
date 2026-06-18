import { createMetadata } from '@/lib/seo'

export const metadata = createMetadata({
  title: 'Sign In',
  description: 'Sign in to GATEPrep Pro to save GATE EE study plans, notes, tests, flashcards, lectures, and progress.',
  path: '/login',
  noIndex: true,
})

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children
}

