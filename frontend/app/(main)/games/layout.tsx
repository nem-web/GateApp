import { createMetadata } from '@/lib/seo'

export const metadata = createMetadata({
  title: 'Games',
  description: 'Use private study-break games and custom HTML practice games inside the GATEPrep Pro workspace.',
  path: '/games',
  noIndex: true,
})

export default function GamesLayout({ children }: { children: React.ReactNode }) {
  return children
}

