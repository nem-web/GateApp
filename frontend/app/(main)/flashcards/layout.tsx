import { createMetadata } from '@/lib/seo'

export const metadata = createMetadata({
  title: 'Flashcards',
  description: 'Review private GATE EE flashcards with spaced repetition and difficulty-based scheduling.',
  path: '/flashcards',
  noIndex: true,
})

export default function FlashcardsLayout({ children }: { children: React.ReactNode }) {
  return children
}

