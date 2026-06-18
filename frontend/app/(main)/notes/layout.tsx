import { createMetadata } from '@/lib/seo'

export const metadata = createMetadata({
  title: 'Notes',
  description: 'Manage private GATE EE notes, PDF annotations, summaries, concept explanations, quizzes, and flashcard generation.',
  path: '/notes',
  noIndex: true,
})

export default function NotesLayout({ children }: { children: React.ReactNode }) {
  return children
}

