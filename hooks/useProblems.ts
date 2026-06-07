'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Problem, ProblemInsert } from '@/types'

export function useProblems() {
  const [problems, setProblems] = useState<Problem[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)

  const fetchProblems = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('problems')
      .select('*')
      .order('num', { ascending: true })
    if (error) setError(error.message)
    else setProblems(data as Problem[])
    setLoading(false)
  }, [])

  useEffect(() => { fetchProblems() }, [fetchProblems])

  const addProblem = async (p: ProblemInsert): Promise<Problem | null> => {
    const { data, error } = await supabase
      .from('problems')
      .insert(p)
      .select()
      .single()
    if (error) { setError(error.message); return null }
    setProblems(prev =>
      [...prev, data as Problem].sort((a, b) => +a.num - +b.num)
    )
    return data as Problem
  }

  const updateProblem = async (id: number, p: Partial<ProblemInsert>): Promise<boolean> => {
    const { data, error } = await supabase
      .from('problems')
      .update(p)
      .eq('id', id)
      .select()
      .single()
    if (error) { setError(error.message); return false }
    setProblems(prev =>
      prev.map(x => x.id === id ? data as Problem : x)
        .sort((a, b) => +a.num - +b.num)
    )
    return true
  }

  const deleteProblem = async (id: number): Promise<boolean> => {
    const { error } = await supabase
      .from('problems')
      .delete()
      .eq('id', id)
    if (error) { setError(error.message); return false }
    setProblems(prev => prev.filter(x => x.id !== id))
    return true
  }

  return { problems, loading, error, fetchProblems, addProblem, updateProblem, deleteProblem }
}
