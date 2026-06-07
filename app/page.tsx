'use client'
import { useState, useEffect, useCallback } from 'react'
import { useProblems } from '@/hooks/useProblems'
import { Problem, ProblemInsert } from '@/types'
import Sidebar from '@/components/Sidebar'
import Topbar from '@/components/Topbar'
import ProblemView from '@/components/ProblemView'
import ProblemModal from '@/components/ProblemModal'

export default function Home() {
  const { problems, loading, error, addProblem, updateProblem, deleteProblem } = useProblems()
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [modalOpen, setModalOpen]   = useState(false)
  const [editTarget, setEditTarget] = useState<Problem | null>(null)

  const selected = problems.find(p => p.id === selectedId) ?? null

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') { setModalOpen(false); setEditTarget(null) }
    if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
      e.preventDefault()
      setEditTarget(null)
      setModalOpen(true)
    }
  }, [])
  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleKey])

  const openAdd  = () => { setEditTarget(null); setModalOpen(true) }
  const openEdit = (p: Problem) => { setEditTarget(p); setModalOpen(true) }
  const closeModal = () => { setModalOpen(false); setEditTarget(null) }

  const handleSave = async (data: ProblemInsert) => {
    if (editTarget) {
      await updateProblem(editTarget.id, data)
    } else {
      const created = await addProblem(data)
      if (created) setSelectedId(created.id)
    }
    closeModal()
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this problem?')) return
    await deleteProblem(id)
    setSelectedId(null)
  }

  return (
    <div className="flex flex-col h-screen bg-[#0d1117] text-[#e6edf3] overflow-hidden">
      <Topbar problems={problems} onAdd={openAdd} />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar problems={problems} selected={selectedId} onSelect={setSelectedId} onAdd={openAdd} />
        <main className="flex-1 overflow-hidden flex flex-col">
          {loading && (
            <div className="flex-1 flex items-center justify-center gap-3">
              <div className="w-4 h-4 border-2 border-[#58a6ff] border-t-transparent rounded-full animate-spin" />
              <span className="text-[#8b949e] text-sm font-mono">Loading from Supabase…</span>
            </div>
          )}
          {!loading && error && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl mb-3">⚠️</div>
                <div className="text-[#f85149] text-sm font-mono mb-1">Connection error</div>
                <div className="text-[#8b949e] text-xs font-mono">{error}</div>
              </div>
            </div>
          )}
          {!loading && !error && !selected && (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-[#8b949e]">
              <div className="text-5xl opacity-20">🧩</div>
              <h3 className="text-base text-[#e6edf3] opacity-40 font-mono">Select a problem</h3>
              <p className="text-sm font-mono">Pick any problem from the sidebar</p>
              <button onClick={openAdd} className="mt-2 px-5 py-2 text-xs rounded-lg border border-[#58a6ff]/40 text-[#58a6ff] hover:bg-[#58a6ff]/10 transition-colors font-mono">
                ＋ Add your first problem
              </button>
            </div>
          )}
          {!loading && !error && selected && (
            <ProblemView problem={selected} onEdit={() => openEdit(selected)} onDelete={() => handleDelete(selected.id)} />
          )}
        </main>
      </div>
      {modalOpen && (
        <ProblemModal initial={editTarget} onSave={handleSave} onClose={closeModal} />
      )}
    </div>
  )
}
