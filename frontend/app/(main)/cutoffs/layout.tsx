import { createMetadata } from '@/lib/seo'

export const metadata = createMetadata({
  title: 'Cutoffs',
  description: 'Analyze private GATE EE cutoff rows, score expectations, category context, and college or PSU planning notes.',
  path: '/cutoffs',
  noIndex: true,
})

export default function CutoffsLayout({ children }: { children: React.ReactNode }) {
  return children
}

