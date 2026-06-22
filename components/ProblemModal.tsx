'use client'
import { useState, useEffect } from 'react'
import { Problem, ProblemInsert, TOPICS, PATTERNS, DIFFICULTIES, toDisplay, toStorage } from '@/types'

interface Props {
  initial?: Problem | null
  onSave: (p: ProblemInsert) => Promise<void>
  onClose: () => void
}

// Returns today as YYYY-MM-DD for storage, DD-MM-YYYY for display
function todayStorage(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}
function todayDisplay(): string {
  const d = new Date()
  return `${String(d.getDate()).padStart(2,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${d.getFullYear()}`
}

function makeEmpty(): ProblemInsert {
  return {
    num: '', title: '', topic: 'Arrays', pattern: 'Other', diff: 'Medium',
    time_complexity: '', space_complexity: '', statement: '', insight: '',
    code: '', tags: [], solved_at: todayStorage(),
  }
}

export default function ProblemModal({ initial, onSave, onClose }: Props) {
  const [form, setForm] = useState<ProblemInsert>(makeEmpty)
  const [tagsStr, setTagsStr] = useState('')
  const [saving, setSaving] = useState(false)
  const [dateDisplay, setDateDisplay] = useState(todayDisplay)

  useEffect(() => {
    if (initial) {
      setForm({ ...initial })
      setTagsStr(initial.tags?.join(', ') ?? '')
      setDateDisplay(toDisplay(initial.solved_at))
    } else {
      const e = makeEmpty()
      setForm(e)
      setTagsStr('')
      setDateDisplay(todayDisplay())
    }
  }, [initial])

  const set = (k: keyof ProblemInsert, v: unknown) =>
    setForm(p => ({ ...p, [k]: v }))

  const handleDate = (val: string) => {
    setDateDisplay(val)
    // auto-convert once fully entered DD-MM-YYYY
    if (/^\d{2}-\d{2}-\d{4}$/.test(val)) {
      set('solved_at', toStorage(val))
    } else {
      set('solved_at', '')
    }
  }

  const handleSave = async () => {
    if (!form.num.trim() || !form.title.trim()) return
    setSaving(true)
    await onSave({
      ...form,
      tags: tagsStr.split(',').map(t => t.trim()).filter(Boolean),
    })
    setSaving(false)
  }

  const inputCls = 'w-full bg-[#21262d] border border-[#30363d] text-[#e6edf3] rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#58a6ff] transition-colors'
  const labelCls = 'block text-[10px] uppercase tracking-widest text-[#8b949e] mb-1.5'

  return (
    <div
      className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 w-[620px] max-h-[92vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-bold text-[#e6edf3] tracking-wide">
            {initial ? 'Edit Problem' : 'Add New Problem'}
          </h2>
          <button onClick={onClose} className="text-[#8b949e] hover:text-[#e6edf3] text-lg leading-none transition-colors">✕</button>
        </div>

        {/* Row 1 */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div><label className={labelCls}>LeetCode #</label>
            <input className={inputCls} value={form.num} onChange={e => set('num', e.target.value)} placeholder="e.g. 406" /></div>
          <div><label className={labelCls}>Title</label>
            <input className={inputCls} value={form.title} onChange={e => set('title', e.target.value)} placeholder="Problem name" /></div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div><label className={labelCls}>Topic</label>
            <select className={inputCls} value={form.topic} onChange={e => set('topic', e.target.value)}>
              {TOPICS.map(t => <option key={t}>{t}</option>)}
            </select></div>
          <div><label className={labelCls}>Pattern</label>
            <select className={inputCls} value={form.pattern} onChange={e => set('pattern', e.target.value)}>
              {PATTERNS.map(p => <option key={p}>{p}</option>)}
            </select></div>
          <div><label className={labelCls}>Difficulty</label>
            <select className={inputCls} value={form.diff} onChange={e => set('diff', e.target.value as Problem['diff'])}>
              {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
            </select></div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div><label className={labelCls}>Time Complexity</label>
            <input className={inputCls} value={form.time_complexity ?? ''} onChange={e => set('time_complexity', e.target.value)} placeholder="O(n log n)" /></div>
          <div><label className={labelCls}>Space Complexity</label>
            <input className={inputCls} value={form.space_complexity ?? ''} onChange={e => set('space_complexity', e.target.value)} placeholder="O(n)" /></div>
          <div><label className={labelCls}>Solved On (DD-MM-YYYY)</label>
            <input className={inputCls} value={dateDisplay} onChange={e => handleDate(e.target.value)} placeholder="15-06-2025" maxLength={10} /></div>
        </div>

        {/* Statement */}
        <div className="mb-3">
          <label className={labelCls}>Problem Statement</label>
          <textarea className={inputCls} rows={3} value={form.statement ?? ''} onChange={e => set('statement', e.target.value)} placeholder="Describe the problem…" />
        </div>

        {/* Insight */}
        <div className="mb-3">
          <label className={labelCls}>Key Insight / Approach</label>
          <textarea className={inputCls} rows={3} value={form.insight ?? ''} onChange={e => set('insight', e.target.value)} placeholder="Core idea, pattern used…" />
        </div>

        {/* Code */}
        <div className="mb-3">
          <label className={labelCls}>C++ Solution</label>
          <textarea className={`${inputCls} text-[11px]`} rows={9} value={form.code ?? ''} onChange={e => set('code', e.target.value)} placeholder="Paste your C++ code here…" />
        </div>

        {/* Tags */}
        <div className="mb-5">
          <label className={labelCls}>Tags (comma-separated)</label>
          <input className={inputCls} value={tagsStr} onChange={e => setTagsStr(e.target.value)} placeholder="greedy, two-pointers, sorting…" />
        </div>

        {/* Actions */}
        <div className="flex gap-2 justify-end pt-4 border-t border-[#30363d]">
          <button onClick={onClose} className="px-4 py-2 text-xs rounded-lg border border-[#30363d] bg-transparent text-[#8b949e] hover:text-[#e6edf3] transition-colors font-mono">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !form.num.trim() || !form.title.trim()}
            className="px-5 py-2 text-xs rounded-lg bg-[#58a6ff] text-black font-bold hover:bg-[#79c0ff] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-mono"
          >
            {saving ? 'Saving…' : 'Save Problem'}
          </button>
        </div>
      </div>
    </div>
  )
}
