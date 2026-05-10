import { NextResponse } from "next/server";

/** Sample GATE-style MCQs for “Take test” until DB-backed tests ship. */
export async function GET() {
  return NextResponse.json({
    title: "Practice drill — Data Structures & Algorithms",
    durationMinutes: 15,
    questions: [
      {
        id: "q1",
        subject: "Data Structures",
        topic: "Trees",
        text: "Which traversal of a binary tree visits nodes in sorted order for a BST?",
        options: ["Preorder", "Inorder", "Postorder", "Level order"],
        correctIndex: 1,
      },
      {
        id: "q2",
        subject: "Algorithms",
        topic: "Complexity",
        text: "Average-case time complexity of QuickSort (random pivot, balanced splits)?",
        options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
        correctIndex: 1,
      },
      {
        id: "q3",
        subject: "Discrete Math",
        topic: "Graphs",
        text: "A connected undirected graph with V vertices and V−1 edges is always…",
        options: ["Complete", "A tree", "Bipartite", "Eulerian"],
        correctIndex: 1,
      },
    ],
  });
}
