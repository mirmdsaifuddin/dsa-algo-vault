export interface Problem {
  id: number
  num: string
  title: string
  topic: string
  pattern: string
  diff: 'Easy' | 'Medium' | 'Hard'
  time_complexity?: string
  space_complexity?: string
  statement?: string
  insight?: string
  code?: string
  tags?: string[]
  solved_at?: string   // stored as YYYY-MM-DD, displayed as DD-MM-YYYY
  created_at?: string
}

export type ProblemInsert = Omit<Problem, 'id' | 'created_at'>

export const TOPICS = [
  'Arrays', 'Strings', 'Linked List', 'Stack/Queue', 'Trees',
  'Graphs', 'Dynamic Programming', 'Binary Search', 'Heap',
  'Backtracking', 'Greedy', 'Hashing', 'Sliding Window',
  'Two Pointers', 'Math', 'Bit Manipulation', 'Trie', 'Other',
]

export const PATTERNS = [
  'Prefix Sum', "Kadane's Algo", 'Fast & Slow Pointers',
  'Level Order BFS', 'DFS Traversal', 'Top-K Elements',
  'Merge Intervals', 'Matrix Chain', 'Knapsack',
  'Monotonic Stack', 'Union Find', 'Topological Sort',
  'Two Pointers', 'Binary Search', 'Sliding Window',
  'Hashing', 'Greedy', 'Other',
]

export const DIFFICULTIES = ['Easy', 'Medium', 'Hard'] as const

// Convert YYYY-MM-DD → DD-MM-YYYY for display
export function toDisplay(date?: string): string {
  if (!date) return ''
  const [y, m, d] = date.split('-')
  return `${d}-${m}-${y}`
}

// Convert DD-MM-YYYY → YYYY-MM-DD for storage
export function toStorage(date: string): string {
  if (!date) return ''
  const [d, m, y] = date.split('-')
  return `${y}-${m}-${d}`
}
