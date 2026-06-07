'use client'
import { Problem } from '@/types'

interface Props {
  problems: Problem[]
  onAdd: () => void
}

export default function Topbar({ problems, onAdd }: Props) {
  const easy  = problems.filter(p => p.diff === 'Easy').length
  const med   = problems.filter(p => p.diff === 'Medium').length
  const hard  = problems.filter(p => p.diff === 'Hard').length

  return (
    <header className="h-12 bg-[#161b22] border-b border-[#30363d] flex items-center px-5 gap-4 shrink-0 z-10">
      <div className="text-[#58a6ff] font-bold text-sm tracking-widest uppercase font-mono">
        ⚡ DSA <span className="text-[#8b949e] font-normal">Vault</span>
      </div>

      <div className="flex gap-2 ml-4">
        <span className="text-[11px] px-2.5 py-0.5 rounded-full border border-[#58a6ff]/30 text-[#58a6ff] bg-[#58a6ff]/10">
          ⚡ {problems.length} total
        </span>
        <span className="text-[11px] px-2.5 py-0.5 rounded-full border border-[#3fb950]/30 text-[#3fb950] bg-[#3fb950]/10">
          E {easy}
        </span>
        <span className="text-[11px] px-2.5 py-0.5 rounded-full border border-[#d29922]/30 text-[#d29922] bg-[#d29922]/10">
          M {med}
        </span>
        <span className="text-[11px] px-2.5 py-0.5 rounded-full border border-[#f85149]/30 text-[#f85149] bg-[#f85149]/10">
          H {hard}
        </span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <span className="text-[10px] text-[#8b949e] font-mono hidden md:block">Ctrl+N to add</span>
        <button
          onClick={onAdd}
          className="px-4 py-1.5 text-xs rounded-lg bg-[#58a6ff] text-black font-bold hover:bg-[#79c0ff] transition-colors font-mono"
        >
          ＋ Add Problem
        </button>
      </div>
    </header>
  )
}
