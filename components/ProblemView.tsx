'use client'
import { useState } from 'react'
import { Problem, toDisplay } from '@/types'
import { highlightCpp } from '@/lib/highlight'

interface Props {
  problem: Problem
  onEdit: () => void
  onDelete: () => void
}

const diffStyle: Record<string, string> = {
  Easy:   'text-[#3fb950] bg-[#3fb950]/10 border-[#3fb950]/30',
  Medium: 'text-[#d29922] bg-[#d29922]/10 border-[#d29922]/30',
  Hard:   'text-[#f85149] bg-[#f85149]/10 border-[#f85149]/30',
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-[10px] uppercase tracking-widest text-[#8b949e]">{children}</span>
      <div className="flex-1 h-px bg-[#30363d]" />
    </div>
  )
}

export default function ProblemView({ problem: p, onEdit, onDelete }: Props) {
  const [copied, setCopied] = useState(false)

  const copyCode = () => {
    if (!p.code) return
    navigator.clipboard.writeText(p.code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const lcSlug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#30363d] bg-[#161b22] flex items-start gap-4 shrink-0">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] text-[#8b949e] font-mono">#{p.num}</span>
            <span className="text-[#30363d]">·</span>
            <a
              href={`https://leetcode.com/problems/${lcSlug}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-[#58a6ff] hover:underline"
            >
              ↗ LeetCode
            </a>
            {p.solved_at && (
              <>
                <span className="text-[#30363d]">·</span>
                <span className="text-[11px] text-[#8b949e]">📅 {toDisplay(p.solved_at)}</span>
              </>
            )}
          </div>
          <h2 className="text-[17px] font-bold text-[#e6edf3] leading-tight">{p.title}</h2>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className={`text-[11px] px-2.5 py-0.5 rounded border font-bold ${diffStyle[p.diff]}`}>{p.diff}</span>
            <span className="text-[11px] px-2.5 py-0.5 rounded border border-[#58a6ff]/30 text-[#58a6ff] bg-[#58a6ff]/8">{p.topic}</span>
            <span className="text-[11px] px-2.5 py-0.5 rounded border border-[#bc8cff]/30 text-[#bc8cff] bg-[#bc8cff]/8">{p.pattern}</span>
            {(p.tags ?? []).map(t => (
              <span key={t} className="text-[10px] px-2 py-0.5 rounded border border-[#30363d] text-[#8b949e] bg-[#21262d]">{t}</span>
            ))}
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={onEdit}
            className="px-3 py-1.5 text-[11px] rounded-lg border border-[#30363d] bg-[#21262d] text-[#8b949e] hover:text-[#e6edf3] hover:border-[#58a6ff] transition-all font-mono">
            ✏️ Edit
          </button>
          <button onClick={onDelete}
            className="px-3 py-1.5 text-[11px] rounded-lg border border-transparent text-[#8b949e] hover:text-[#f85149] hover:border-[#f85149]/50 hover:bg-[#f85149]/8 transition-all font-mono">
            🗑 Delete
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="max-w-[860px]">

          {/* Complexity cards */}
          {(p.time_complexity || p.space_complexity) && (
            <div className="flex gap-3 mb-5">
              {p.time_complexity && (
                <div className="bg-[#161b22] border border-[#30363d] rounded-lg px-4 py-2.5">
                  <div className="text-[10px] uppercase tracking-widest text-[#8b949e] mb-1">Time</div>
                  <div className="text-[#3fb950] font-bold text-sm font-mono">{p.time_complexity}</div>
                </div>
              )}
              {p.space_complexity && (
                <div className="bg-[#161b22] border border-[#30363d] rounded-lg px-4 py-2.5">
                  <div className="text-[10px] uppercase tracking-widest text-[#8b949e] mb-1">Space</div>
                  <div className="text-[#3fb950] font-bold text-sm font-mono">{p.space_complexity}</div>
                </div>
              )}
            </div>
          )}

          {/* Statement */}
          {p.statement && (
            <div className="mb-5">
              <SectionLabel>Problem Statement</SectionLabel>
              <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 text-[13px] text-[#c9d1d9] leading-7 font-mono">
                {p.statement}
              </div>
            </div>
          )}

          {/* Insight */}
          {p.insight && (
            <div className="mb-5">
              <SectionLabel>Key Insight</SectionLabel>
              <div className="bg-[#58a6ff]/5 border border-[#58a6ff]/20 rounded-xl p-4 flex gap-3 text-[13px] text-[#c9d1d9] leading-7">
                <span className="text-lg shrink-0">💡</span>
                <div className="font-mono whitespace-pre-line">{p.insight}</div>
              </div>
            </div>
          )}

          {/* Code */}
          {p.code && (
            <div className="mb-5">
              <SectionLabel>C++ Solution</SectionLabel>
              <div className="bg-[#0d1117] border border-[#30363d] rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#21262d] border-b border-[#30363d]">
                  <div className="flex items-center gap-2.5">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#f85149]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#d29922]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#3fb950]" />
                    </div>
                    <span className="text-[10px] text-[#8b949e] tracking-wide">C++ — {p.title}</span>
                  </div>
                  <button
                    onClick={copyCode}
                    className={`text-[11px] px-2.5 py-1 rounded-md border font-mono transition-all ${
                      copied
                        ? 'border-[#3fb950]/50 text-[#3fb950]'
                        : 'border-[#30363d] text-[#8b949e] hover:text-[#e6edf3] hover:border-[#58a6ff]'
                    }`}
                  >
                    {copied ? '✓ Copied' : '⎘ Copy'}
                  </button>
                </div>
                <pre className="p-5 overflow-x-auto text-[12.5px] leading-relaxed font-mono">
                  <code dangerouslySetInnerHTML={{ __html: highlightCpp(p.code) }} />
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
