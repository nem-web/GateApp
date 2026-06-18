import { createMetadata } from '@/lib/seo'

export const metadata = createMetadata({
  title: 'Lectures',
  description: 'Track private GATE EE lecture playlists, watch progress, subject mapping, and recommended next topics.',
  path: '/lectures',
  noIndex: true,
})

export default function LecturesLayout({ children }: { children: React.ReactNode }) {
  return children
}

