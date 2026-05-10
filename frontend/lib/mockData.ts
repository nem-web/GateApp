// Subject types and colors
export const subjects = {
  mathematics: { name: 'Mathematics', color: '#818CF8', bgColor: 'rgba(129, 140, 248, 0.15)' },
  generalAptitude: { name: 'General Aptitude', color: '#34D399', bgColor: 'rgba(52, 211, 153, 0.15)' },
  engineeringMaths: { name: 'Engineering Maths', color: '#60A5FA', bgColor: 'rgba(96, 165, 250, 0.15)' },
  coreSubject: { name: 'Computer Science', color: '#F472B6', bgColor: 'rgba(244, 114, 182, 0.15)' },
  aptitudeVerbal: { name: 'Verbal Ability', color: '#FBBF24', bgColor: 'rgba(251, 191, 36, 0.15)' },
};

// Dashboard stats
export const dashboardStats = {
  studyStreak: 12,
  hoursToday: 4.5,
  topicsDone: 47,
  gateCountdown: 127,
};

// Subject progress data
export const subjectProgress = [
  { subject: 'Mathematics', progress: 68, color: '#818CF8' },
  { subject: 'General Aptitude', progress: 82, color: '#34D399' },
  { subject: 'Engineering Maths', progress: 55, color: '#60A5FA' },
  { subject: 'Computer Science', progress: 45, color: '#F472B6' },
  { subject: 'Verbal Ability', progress: 73, color: '#FBBF24' },
];

// AI insights
export const aiInsights = [
  "Based on your recent performance, focusing more on Discrete Mathematics could improve your overall score by 8-10 marks.",
  "Your General Aptitude scores are consistently above average. Consider allocating more time to weaker subjects.",
  "You tend to perform better in morning study sessions. Try scheduling difficult topics before noon.",
];

// Recent scores for chart
export const recentScores = [
  { date: 'Week 1', score: 45 },
  { date: 'Week 2', score: 52 },
  { date: 'Week 3', score: 48 },
  { date: 'Week 4', score: 61 },
  { date: 'Week 5', score: 58 },
  { date: 'Week 6', score: 67 },
  { date: 'Week 7', score: 72 },
];

// Today's todos
export const todaysTodos = [
  { id: 1, task: 'Complete Graph Theory revision', priority: 'high', completed: false },
  { id: 2, task: 'Solve 20 PYQ from 2023', priority: 'medium', completed: true },
  { id: 3, task: 'Watch OS lecture on deadlocks', priority: 'low', completed: false },
];

// Study plan schedule
export const weeklySchedule = [
  { day: 'Mon', slots: [
    { time: '6:00', subject: 'Mathematics', topic: 'Linear Algebra' },
    { time: '9:00', subject: 'Computer Science', topic: 'Data Structures' },
    { time: '14:00', subject: 'Engineering Maths', topic: 'Calculus' },
    { time: '18:00', subject: 'General Aptitude', topic: 'Numerical Ability' },
  ]},
  { day: 'Tue', slots: [
    { time: '6:00', subject: 'Computer Science', topic: 'Algorithms' },
    { time: '10:00', subject: 'Mathematics', topic: 'Probability' },
    { time: '15:00', subject: 'Verbal Ability', topic: 'Reading Comp' },
    { time: '19:00', subject: 'Computer Science', topic: 'DBMS' },
  ]},
  { day: 'Wed', slots: [
    { time: '7:00', subject: 'Engineering Maths', topic: 'Differential Eq' },
    { time: '11:00', subject: 'Computer Science', topic: 'OS Concepts' },
    { time: '16:00', subject: 'Mathematics', topic: 'Discrete Maths' },
  ]},
  { day: 'Thu', slots: [
    { time: '6:00', subject: 'Computer Science', topic: 'Computer Networks' },
    { time: '9:00', subject: 'General Aptitude', topic: 'Logical Reasoning' },
    { time: '14:00', subject: 'Mathematics', topic: 'Graph Theory' },
    { time: '17:00', subject: 'Engineering Maths', topic: 'Complex Analysis' },
  ]},
  { day: 'Fri', slots: [
    { time: '8:00', subject: 'Computer Science', topic: 'TOC & Compilers' },
    { time: '12:00', subject: 'Verbal Ability', topic: 'Grammar' },
    { time: '15:00', subject: 'Mathematics', topic: 'Number Theory' },
  ]},
  { day: 'Sat', slots: [
    { time: '7:00', subject: 'Computer Science', topic: 'Digital Logic' },
    { time: '10:00', subject: 'Engineering Maths', topic: 'Transforms' },
    { time: '14:00', subject: 'General Aptitude', topic: 'Mock Test' },
    { time: '18:00', subject: 'Computer Science', topic: 'COA' },
  ]},
  { day: 'Sun', slots: [
    { time: '9:00', subject: 'Mathematics', topic: 'Revision' },
    { time: '14:00', subject: 'Computer Science', topic: 'Revision' },
  ]},
];

// Notes folders
export const noteFolders = [
  { id: 1, name: 'Mathematics', icon: '📐', notes: [
    { id: 101, title: 'Linear Algebra Basics', lastEdited: '2 hours ago' },
    { id: 102, title: 'Probability Formulas', lastEdited: '1 day ago' },
    { id: 103, title: 'Graph Theory Notes', lastEdited: '3 days ago' },
  ]},
  { id: 2, name: 'Computer Science', icon: '💻', notes: [
    { id: 201, title: 'Data Structures', lastEdited: '5 hours ago' },
    { id: 202, title: 'Algorithm Analysis', lastEdited: '2 days ago' },
    { id: 203, title: 'OS Concepts', lastEdited: '1 week ago' },
    { id: 204, title: 'DBMS Normalization', lastEdited: '4 days ago' },
  ]},
  { id: 3, name: 'Engineering Maths', icon: '∫', notes: [
    { id: 301, title: 'Differential Equations', lastEdited: '1 day ago' },
    { id: 302, title: 'Laplace Transforms', lastEdited: '5 days ago' },
  ]},
  { id: 4, name: 'General Aptitude', icon: '🧠', notes: [
    { id: 401, title: 'Numerical Ability Tips', lastEdited: '3 hours ago' },
    { id: 402, title: 'Logical Reasoning Patterns', lastEdited: '2 days ago' },
  ]},
];

// PYQ papers
export const pyqPapers = [
  { id: 1, year: 2024, subject: 'Computer Science', difficulty: 'hard', topics: ['Algorithms', 'DBMS', 'OS'] },
  { id: 2, year: 2024, subject: 'Mathematics', difficulty: 'medium', topics: ['Linear Algebra', 'Calculus'] },
  { id: 3, year: 2023, subject: 'Computer Science', difficulty: 'medium', topics: ['Data Structures', 'TOC'] },
  { id: 4, year: 2023, subject: 'General Aptitude', difficulty: 'easy', topics: ['Verbal', 'Numerical'] },
  { id: 5, year: 2022, subject: 'Engineering Maths', difficulty: 'hard', topics: ['Complex Analysis', 'Transforms'] },
  { id: 6, year: 2022, subject: 'Computer Science', difficulty: 'hard', topics: ['Networks', 'Security'] },
  { id: 7, year: 2021, subject: 'Mathematics', difficulty: 'medium', topics: ['Probability', 'Statistics'] },
  { id: 8, year: 2021, subject: 'Computer Science', difficulty: 'easy', topics: ['Digital Logic', 'COA'] },
];

// Topic frequency for heatmap
export const topicFrequency = [
  { topic: 'Data Structures', frequency: 45, subject: 'Computer Science' },
  { topic: 'Algorithms', frequency: 42, subject: 'Computer Science' },
  { topic: 'Linear Algebra', frequency: 38, subject: 'Mathematics' },
  { topic: 'DBMS', frequency: 35, subject: 'Computer Science' },
  { topic: 'Operating Systems', frequency: 33, subject: 'Computer Science' },
  { topic: 'Probability', frequency: 30, subject: 'Mathematics' },
  { topic: 'Computer Networks', frequency: 28, subject: 'Computer Science' },
  { topic: 'Calculus', frequency: 25, subject: 'Engineering Maths' },
];

// Games
export const games = [
  { id: 1, name: 'Math Sprint', description: 'Race against time solving quick math problems', icon: '⚡', color: '#6C63FF', featured: true },
  { id: 2, name: 'Formula Flash', description: 'Match formulas with their names', icon: '🎯', color: '#818CF8', featured: false },
  { id: 3, name: 'Logic Puzzle', description: 'Solve logical reasoning puzzles', icon: '🧩', color: '#34D399', featured: false },
  { id: 4, name: 'Code Debug', description: 'Find and fix bugs in code snippets', icon: '🐛', color: '#F472B6', featured: false },
  { id: 5, name: 'Memory Match', description: 'Match pairs of concepts and definitions', icon: '🃏', color: '#60A5FA', featured: false },
  { id: 6, name: 'Quick Quiz', description: 'Rapid fire GATE questions', icon: '❓', color: '#FBBF24', featured: false },
];

// Flashcards
export const flashcards = [
  { id: 1, front: 'What is the time complexity of QuickSort in the average case?', back: 'O(n log n)\n\nQuickSort uses divide and conquer, partitioning the array around a pivot element.', subject: 'Computer Science' },
  { id: 2, front: 'State the Cayley-Hamilton Theorem', back: 'Every square matrix satisfies its own characteristic equation.\n\nIf p(λ) = det(A - λI) is the characteristic polynomial, then p(A) = 0.', subject: 'Mathematics' },
  { id: 3, front: 'What is a deadlock in Operating Systems?', back: 'A situation where two or more processes are blocked forever, each waiting for resources held by the other.\n\nConditions: Mutual exclusion, Hold & wait, No preemption, Circular wait', subject: 'Computer Science' },
  { id: 4, front: 'Define the Laplace Transform of f(t)', back: 'L{f(t)} = F(s) = ∫₀^∞ e^(-st) f(t) dt\n\nTransforms differential equations into algebraic equations.', subject: 'Engineering Maths' },
  { id: 5, front: 'What is BCNF (Boyce-Codd Normal Form)?', back: 'A relation is in BCNF if for every functional dependency X → Y, X is a superkey.\n\nStronger than 3NF. Eliminates all redundancy based on FDs.', subject: 'Computer Science' },
];

// User data
export const userData = {
  name: 'Rahul Sharma',
  email: 'rahul@example.com',
  avatar: null,
  targetExam: 'GATE 2025 - CS',
  gateDate: new Date('2025-02-01'),
  studyHoursPerDay: 6,
  joinedDate: new Date('2024-06-15'),
};
