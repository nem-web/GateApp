import { createMetadata } from '@/lib/seo'

export const metadata = createMetadata({
  title: 'Study Plan',
  description: 'Build and manage a private GATE EE weekly timetable with AI-assisted planning and backlog recovery.',
  path: '/study-plan',
  noIndex: true,
})

export default function StudyPlanLayout({ children }: { children: React.ReactNode }) {
  return children
}

