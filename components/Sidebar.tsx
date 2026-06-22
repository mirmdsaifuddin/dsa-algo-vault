'use client'
import { useMemo, useState } from 'react'
import { Problem } from '@/types'

interface Props {
  problems: Problem[]
  selected: number | null
  onSelect: (id: number) => void
  onAdd: () => void
}

type GroupBy = 'topic' | 'pattern' | 'diff'

const DIFF_ORDER = ['Easy', 'Medium', 'Hard']

const diffColor: Record<string, string> = {
  Easy:   'text-[#3fb950] bg-[#3fb950]/10',
  Medium: 'text-[#d29922] bg-[#d29922]/10',
  Hard:   'text-[#f85149] bg-[#f85149]/10',
}

export default function Sidebar({ problems, selected, onSelect, onAdd }: Props) {
  const [search, setSearch]     = useState('')
  const [groupBy, setGroupBy]   = useState<GroupBy>('topic')
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return problems
    return problems.filter(p =>
      `${p.num} ${p.title} ${p.topic} ${p.pattern} ${(p.tags ?? []).join(' ')}`.toLowerCase().includes(q)
    )
  }, [problems, search])

  const groups = useMemo(() => {
    const map: Record<string, Problem[]> = {}
    filtered.forEach(p => {
      const k = p[groupBy] ?? 'Other'
      ;(map[k] = map[k] ?? []).push(p)
    })
    return map
  }, [filtered, groupBy])

  const groupKeys = useMemo(() => {
    if (groupBy === 'diff') return DIFF_ORDER.filter(k => groups[k])
    return Object.keys(groups).sort()
  }, [groups, groupBy])

  const toggle = (k: string) =>
    setExpanded(e => ({ ...e, [k]: e[k] === false ? true : false }))

  const easy  = problems.filter(p => p.diff === 'Easy').length
  const med   = problems.filter(p => p.diff === 'Medium').length
  const hard  = problems.filter(p => p.diff === 'Hard').length

  return (
    <aside className="w-[340px] min-w-[240px] bg-[#161b22] border-r border-[#30363d] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#30363d]">
        <div className="text-[#58a6ff] font-bold text-sm tracking-widest uppercase">⚡ DSA Vault</div>
        <div className="text-[11px] text-[#8b949e] mt-0.5">{problems.length} problems tracked</div>
        {/* Stats */}
        <div className="flex gap-2 mt-2.5">
          {[['E', easy, '#3fb950'], ['M', med, '#d29922'], ['H', hard, '#f85149']].map(([l, n, c]) => (
            <span key={String(l)} className="text-[10px] px-2 py-0.5 rounded-full border" style={{ color: String(c), borderColor: String(c) + '44', background: String(c) + '15' }}>
              {l} {n}
            </span>
          ))}
          <span className="text-[10px] px-2 py-0.5 rounded-full border border-[#58a6ff44] text-[#58a6ff] bg-[#58a6ff15] ml-auto">
            {problems.length} total
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="px-3 py-2.5 border-b border-[#30363d] flex flex-col gap-2">
        {/* Search */}
        <div className="relative">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8b949e]" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            className="w-full bg-[#21262d] border border-[#30363d] text-[#e6edf3] rounded-md py-1.5 pl-7 pr-3 text-xs font-mono focus:outline-none focus:border-[#58a6ff] transition-colors"
            placeholder="Search # title tag…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {/* Group toggle */}
        <div className="flex gap-1">
          {(['topic','pattern','diff'] as GroupBy[]).map(g => (
            <button
              key={g}
              onClick={() => setGroupBy(g)}
              className={`flex-1 py-1 rounded-md text-[10px] font-mono border transition-all capitalize ${
                groupBy === g
                  ? 'bg-[#58a6ff15] border-[#58a6ff] text-[#58a6ff]'
                  : 'border-[#30363d] text-[#8b949e] hover:text-[#e6edf3]'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto py-1 pb-16 scrollbar-thin">
        {groupKeys.length === 0 && (
          <div className="text-center text-[#8b949e] text-xs py-8">No problems found</div>
        )}
        {groupKeys.map(key => {
          const open = expanded[key] !== false
          return (
            <div key={key}>
              <button
                onClick={() => toggle(key)}
                className="w-full flex items-center gap-1.5 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-[#8b949e] hover:text-[#e6edf3] transition-colors sticky top-0 bg-[#161b22] z-10"
              >
                <span className={`transition-transform text-[9px] ${open ? 'rotate-90' : ''}`}>▶</span>
                <span className="truncate">{key}</span>
                <span className="ml-auto bg-[#21262d] text-[#8b949e] text-[10px] px-1.5 py-0.5 rounded-full">{groups[key].length}</span>
              </button>
              {open && groups[key].map(p => (
                <button
                  key={p.id}
                  onClick={() => onSelect(p.id)}
                  className={`w-full flex items-center gap-2 px-3 py-1.5 pl-6 text-xs font-mono text-left border-l-2 transition-all ${
                    selected === p.id
                      ? 'text-[#58a6ff] bg-[#58a6ff]/8 border-l-[#58a6ff]'
                      : 'text-[#8b949e] border-l-transparent hover:text-[#e6edf3] hover:bg-[#58a6ff]/5'
                  }`}
                >
                  <span className="text-[10px] text-[#444] min-w-[30px]">#{p.num}</span>
                  <span className="flex-1 truncate">{p.title}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold shrink-0 ${diffColor[p.diff]}`}>
                    {p.diff[0]}
                  </span>
                </button>
              ))}
            </div>
          )
        })}
      </div>

      {/* Footer add btn */}
      <div className="absolute bottom-0 left-0 w-[340px] p-3 bg-[#161b22] border-t border-r border-[#30363d]">
        <button
          onClick={onAdd}
          className="w-full py-2 rounded-lg bg-[#58a6ff] text-black text-xs font-bold hover:bg-[#79c0ff] transition-colors font-mono"
        >
          ＋ Add Problem
        </button>
      </div>
    </aside>
  )
}
