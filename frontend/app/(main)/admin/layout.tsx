import { createMetadata } from '@/lib/seo'

export const metadata = createMetadata({
  title: 'Admin Panel',
  description: 'Private administrative workspace for GATEPrep Pro content review and question uploads.',
  path: '/admin',
  noIndex: true,
})

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children
}

