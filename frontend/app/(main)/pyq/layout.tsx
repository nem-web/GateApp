import { createMetadata } from '@/lib/seo'

export const metadata = createMetadata({
  title: 'PYQ Papers',
  description: 'Manage private GATE EE previous-year question papers, solutions, answer keys, and reading workflows.',
  path: '/pyq',
  noIndex: true,
})

export default function PyqLayout({ children }: { children: React.ReactNode }) {
  return children
}

