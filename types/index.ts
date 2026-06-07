export interface Problem {
  id: number;
  num: string;
  title: string;
  topic: string;
  pattern: string;
  diff: "Easy" | "Medium" | "Hard";
  time_complexity?: string;
  space_complexity?: string;
  statement?: string;
  insight?: string;
  code?: string;
  tags?: string[];
  solved_at?: string; // stored as YYYY-MM-DD, displayed as DD-MM-YYYY
  created_at?: string;
}

export type ProblemInsert = Omit<Problem, "id" | "created_at">;

export const TOPICS = [
  "Arrays",
  "Strings",
  "Linked List",
  "Stack/Queue",
  "Trees",
  "Binary Tree",
  "Binary Search Tree",
  "Graphs",
  "Dynamic Programming",
  "Binary Search",
  "Heap",
  "Backtracking",
  "Greedy",
  "Hashing",
  "Sliding Window",
  "Two Pointers",
  "Math",
  "Bit Manipulation",
  "Trie",
  "Recursion",
  "Segment Tree",
  "Fenwick Tree",
  "Intervals",
  "Matrix",
  "Geometry",
  "Design",
  "Other",
];

export const PATTERNS = [
  "Prefix Sum",
  "Kadane's Algo",
  "Fast & Slow Pointers",
  "Two Pointers",
  "Sliding Window",
  "Binary Search",
  "Sorting",
  "Hashing",
  "Greedy",
  "Level Order BFS",
  "DFS Traversal",
  "Backtracking",
  "Top-K Elements",
  "Heap",
  "Merge Intervals",
  "Monotonic Stack",
  "Monotonic Queue",
  "Union Find",
  "Topological Sort",
  "Tree DFS",
  "Tree BFS",
  "Memoization",
  "Tabulation",
  "Knapsack",
  "Matrix DP",
  "Digit DP",
  "Bitmasking",
  "Trie",
  "Graph Traversal",
  "Shortest Path",
  "Cycle Detection",
  "Divide & Conquer",
  "Sweep Line",
  "Other",
];

export const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;

// Convert YYYY-MM-DD → DD-MM-YYYY for display
export function toDisplay(date?: string): string {
  if (!date) return "";
  const [y, m, d] = date.split("-");
  return `${d}-${m}-${y}`;
}

// Convert DD-MM-YYYY → YYYY-MM-DD for storage
export function toStorage(date: string): string {
  if (!date) return "";
  const [d, m, y] = date.split("-");
  return `${y}-${m}-${d}`;
}
