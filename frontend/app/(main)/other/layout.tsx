import { createMetadata } from '@/lib/seo'

export const metadata = createMetadata({
  title: 'Study Resources',
  description: 'Store private study links and spreadsheet resources for the GATE EE workspace.',
  path: '/other',
  noIndex: true,
})

export default function OtherLayout({ children }: { children: React.ReactNode }) {
  return children
}

