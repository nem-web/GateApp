import { createMetadata } from '@/lib/seo'

export const metadata = createMetadata({
  title: 'To-Do List',
  description: 'Track private GATE EE tasks, priorities, completion status, and AI-generated study suggestions.',
  path: '/todos',
  noIndex: true,
})

export default function TodosLayout({ children }: { children: React.ReactNode }) {
  return children
}

