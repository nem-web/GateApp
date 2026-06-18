import { createMetadata } from '@/lib/seo'

export const metadata = createMetadata({
  title: 'Tests',
  description: 'Create, import, solve, and review private GATE EE practice tests with subject-level performance tracking.',
  path: '/test',
  noIndex: true,
})

export default function TestLayout({ children }: { children: React.ReactNode }) {
  return children
}

