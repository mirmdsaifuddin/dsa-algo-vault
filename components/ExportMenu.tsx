'use client'
import { useState, useRef, useEffect } from 'react'
import { Problem } from '@/types'
import { exportToExcel, exportToPDF } from '@/lib/exportUtils'

interface Props { problems: Problem[] }

export default function ExportMenu({ problems }: Props) {
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const run = async (fn: () => Promise<void>) => {
    setBusy(true); setOpen(false)
    try { await fn() } finally { setBusy(false) }
  }

  const btn = 'w-full text-left px-3 py-2 text-xs font-mono hover:bg-[#21262d] text-[#e6edf3] transition-colors flex items-center gap-2'

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        disabled={busy}
        className="px-3 py-1.5 text-xs rounded-lg border border-[#30363d] bg-[#21262d] text-[#8b949e] hover:text-[#e6edf3] hover:border-[#58a6ff] transition-all font-mono flex items-center gap-1.5 disabled:opacity-50"
      >
        {busy ? '⏳' : '⬇'} Export
        <span className="text-[9px] opacity-60">▾</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-52 bg-[#161b22] border border-[#30363d] rounded-lg shadow-xl z-50 overflow-hidden py-1">
          <div className="px-3 py-1.5 text-[9px] uppercase tracking-widest text-[#8b949e] border-b border-[#30363d] mb-1">Excel (.xlsx)</div>
          <button className={btn} onClick={() => run(() => exportToExcel(problems, 'topic'))}>
            <span>📊</span> By Topic
          </button>
          <button className={btn} onClick={() => run(() => exportToExcel(problems, 'pattern'))}>
            <span>📊</span> By Pattern
          </button>

          <div className="px-3 py-1.5 text-[9px] uppercase tracking-widest text-[#8b949e] border-t border-b border-[#30363d] mt-1 mb-1">PDF (.pdf)</div>
          <button className={btn} onClick={() => run(() => exportToPDF(problems, 'topic'))}>
            <span>📄</span> By Topic
          </button>
          <button className={btn} onClick={() => run(() => exportToPDF(problems, 'pattern'))}>
            <span>📄</span> By Pattern
          </button>
        </div>
      )}
    </div>
  )
}
