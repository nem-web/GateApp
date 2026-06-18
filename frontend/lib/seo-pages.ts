import { GATE_EE_SUBJECTS, GATE_EE_WEIGHTAGE } from '@/lib/gate-ee'

export type PublicSeoPage = {
  slug: string
  title: string
  description: string
  h1: string
  intro: string
  keywords: string[]
  sections: Array<{
    heading: string
    body: string
    bullets?: string[]
  }>
  faqs: Array<{ question: string; answer: string }>
}

export const PUBLIC_SEO_PAGES: PublicSeoPage[] = [
  {
    slug: 'syllabus',
    title: 'GATE EE Syllabus 2027 | Subjects, Weightage and Preparation Map',
    description:
      'Explore the complete GATE Electrical Engineering syllabus with subject clusters, recent weightage patterns, and a practical preparation map for GATE EE aspirants.',
    h1: 'GATE EE syllabus and subject weightage',
    intro:
      'Use this GATE Electrical Engineering syllabus guide to organize preparation around high-signal subjects, repeated PYQ patterns, and revision-heavy topics.',
    keywords: ['GATE EE syllabus', 'GATE Electrical Engineering subjects', 'GATE EE weightage'],
    sections: [
      {
        heading: 'Core GATE EE subject clusters',
        body: 'The platform groups preparation into canonical GATE EE subjects so notes, lectures, tests, and weak-topic analytics stay consistent.',
        bullets: GATE_EE_SUBJECTS.filter((subject) => subject !== 'English'),
      },
      {
        heading: 'Recent subject weightage signals',
        body: 'Recent papers repeatedly reward strong coverage of machines, power systems, control, networks, signals, mathematics, and aptitude.',
        bullets: GATE_EE_WEIGHTAGE.slice(0, 8).map(
          (row) => `${row.subject}: ${row.average}% average, ${row.latest}% in 2025`,
        ),
      },
      {
        heading: 'How to use this syllabus',
        body: 'Turn each subject into a loop of concept lectures, solved examples, PYQ review, flashcards, and timed tests. GATEPrep Pro keeps those artifacts connected in one study workspace.',
      },
    ],
    faqs: [
      {
        question: 'Which subject has the highest GATE EE weightage?',
        answer:
          'Aptitude is consistently worth 15 marks, while Electrical Machines, Power Systems, Control Systems, Network Theory, Signals and Systems, and Engineering Mathematics are major technical contributors.',
      },
      {
        question: 'Should I complete the full GATE EE syllabus before taking tests?',
        answer:
          'No. Start subject-wise drills early, then graduate to mixed tests as soon as two or three core subjects are revised.',
      },
    ],
  },
  {
    slug: 'study-plan',
    title: 'GATE EE Study Plan | Weekly Timetable and Revision Strategy',
    description:
      'Build a realistic GATE Electrical Engineering study plan with weekly timetable blocks, revision loops, backlog recovery, and practice-test milestones.',
    h1: 'GATE EE weekly study plan',
    intro:
      'A strong GATE EE timetable balances concept learning, PYQ solving, recall practice, and mocks without letting backlog quietly compound.',
    keywords: ['GATE EE study plan', 'GATE timetable', 'GATE preparation schedule'],
    sections: [
      {
        heading: 'Weekly preparation rhythm',
        body: 'A productive week should include concept blocks, problem-solving blocks, spaced recall, and at least one timed practice session.',
        bullets: [
          'Four to six focused technical sessions for core subjects',
          'Two mathematics or aptitude refreshers',
          'Daily flashcard review for formulas and traps',
          'One mixed drill or previous-year paper review',
        ],
      },
      {
        heading: 'Backlog recovery',
        body: 'When sessions are missed, compress by priority rather than by panic. Keep high-weightage subjects and active weak areas visible first.',
      },
      {
        heading: 'Where GATEPrep Pro helps',
        body: 'The study planner can turn focus subjects, available hours, and lecture queues into a weekly timetable, then track completion against the dashboard.',
      },
    ],
    faqs: [
      {
        question: 'How many hours should I study daily for GATE EE?',
        answer:
          'The right target depends on your starting point, but consistency matters more than a single heroic day. Track weekly hours and make sure each week includes practice and revision.',
      },
      {
        question: 'How often should I revise GATE EE formulas?',
        answer:
          'Use short daily recall sessions and longer weekly revisions. Flashcards are effective for formula-heavy areas such as power electronics, machines, networks, and control.',
      },
    ],
  },
  {
    slug: 'previous-year-papers',
    title: 'GATE EE Previous Year Papers | PYQ Practice Strategy',
    description:
      'Learn how to use GATE EE previous-year papers for pattern recognition, topic prioritization, accuracy tracking, and exam-tempo practice.',
    h1: 'GATE EE previous-year paper strategy',
    intro:
      'Previous-year questions are the cleanest signal for how GATE EE tests concepts, calculation speed, and topic combinations.',
    keywords: ['GATE EE PYQ', 'GATE EE previous year papers', 'GATE Electrical PYQ'],
    sections: [
      {
        heading: 'Use PYQs in three passes',
        body: 'First solve topic-wise after finishing a chapter, then revisit mixed subject sets, and finally attempt full-length papers under time limits.',
        bullets: [
          'Pass 1: concept validation',
          'Pass 2: mixed recall and trap detection',
          'Pass 3: speed, accuracy, and exam temperament',
        ],
      },
      {
        heading: 'Track mistakes by subject',
        body: 'Mistake logs are most useful when they map to canonical subjects and topics. This makes dashboard weak-topic signals more reliable.',
      },
      {
        heading: 'Convert PYQs into revision assets',
        body: 'Every repeated error should become a note, flashcard, or follow-up task so the same mistake does not survive into the next mock.',
      },
    ],
    faqs: [
      {
        question: 'Are previous-year papers enough for GATE EE preparation?',
        answer:
          'They are necessary but not sufficient. Use PYQs to understand patterns, then add concept practice, subject tests, and full mocks.',
      },
      {
        question: 'When should I start solving GATE EE PYQs?',
        answer:
          'Start topic-wise PYQs as soon as you finish a chapter. Do not wait until the entire syllabus is complete.',
      },
    ],
  },
  {
    slug: 'cutoffs',
    title: 'GATE EE Cutoff Analysis | Qualifying Marks and College Planning',
    description:
      'Understand GATE Electrical Engineering cutoff trends, qualifying score planning, and how to connect rank expectations with college and PSU decisions.',
    h1: 'GATE EE cutoff analysis',
    intro:
      'Cutoffs are planning signals, not guarantees. Use them to set score buffers, category-aware targets, and realistic post-exam options.',
    keywords: ['GATE EE cutoff', 'GATE Electrical Engineering cutoff', 'GATE qualifying marks'],
    sections: [
      {
        heading: 'How cutoff planning helps',
        body: 'A cutoff-aware plan turns preparation from “finish everything” into “build enough reliable marks with a buffer for exam-day variance.”',
      },
      {
        heading: 'Score buffers matter',
        body: 'Aim comfortably above the qualifying cutoff. Admission and PSU shortlists usually need stronger ranks than basic qualification.',
      },
      {
        heading: 'Use performance data',
        body: 'Mock scores, subject accuracy, and recent weak-topic patterns provide a more useful target than comparing yourself with one old cutoff number.',
      },
    ],
    faqs: [
      {
        question: 'Is the GATE EE qualifying cutoff the same as admission cutoff?',
        answer:
          'No. Qualifying cutoff only determines eligibility. Institute, branch, and PSU shortlists can require much stronger scores or ranks.',
      },
      {
        question: 'Can cutoff trends predict the next GATE EE cutoff exactly?',
        answer:
          'No trend can predict exactly. Treat historical cutoffs as directional signals and prepare with a margin.',
      },
    ],
  },
  {
    slug: 'flashcards',
    title: 'GATE EE Flashcards | Formula Revision and Active Recall',
    description:
      'Use GATE Electrical Engineering flashcards for formulas, conceptual traps, definitions, and spaced repetition across high-weightage subjects.',
    h1: 'GATE EE flashcards for active recall',
    intro:
      'Flashcards work best when they force retrieval: a formula, a condition, a sign convention, or a common mistake you want to eliminate.',
    keywords: ['GATE EE flashcards', 'GATE formula revision', 'active recall GATE'],
    sections: [
      {
        heading: 'What belongs on a GATE EE flashcard',
        body: 'Keep cards short, atomic, and testable. One card should check one recall target.',
        bullets: [
          'Formula plus when it applies',
          'Common sign convention or assumption',
          'Conceptual contrast between two similar cases',
          'Mistake from a PYQ or mock test',
        ],
      },
      {
        heading: 'Spaced repetition',
        body: 'Difficult cards should return sooner, while mastered cards can wait longer. This keeps revision efficient as the syllabus grows.',
      },
      {
        heading: 'Connect cards to subjects',
        body: 'Subject tagging makes it easier to diagnose whether a recall issue is isolated or part of a larger weak-topic pattern.',
      },
    ],
    faqs: [
      {
        question: 'Are flashcards useful for numerical GATE EE subjects?',
        answer:
          'Yes, if they target formulas, boundary conditions, assumptions, and recurring traps rather than trying to store full solutions.',
      },
      {
        question: 'How many flashcards should I review daily?',
        answer:
          'Review the due cards first. A small daily habit is usually more effective than a large weekly catch-up session.',
      },
    ],
  },
]

export function getPublicSeoPage(slug: string) {
  return PUBLIC_SEO_PAGES.find((page) => page.slug === slug)
}

