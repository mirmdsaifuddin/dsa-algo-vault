import { Problem, toDisplay } from '@/types'

// ── Excel export (topic-wise sheets) ──────────────────────────────────────────
export async function exportToExcel(problems: Problem[], groupBy: 'topic' | 'pattern' = 'topic') {
  const XLSX = await import('xlsx')
  const wb = XLSX.utils.book_new()

  // Group problems
  const groups: Record<string, Problem[]> = {}
  problems.forEach(p => {
    const key = p[groupBy] ?? 'Other'
    ;(groups[key] = groups[key] ?? []).push(p)
  })

  // All problems sheet first
  const allRows = problems.map(p => ({
    '#':          p.num,
    'Title':      p.title,
    'Topic':      p.topic,
    'Pattern':    p.pattern,
    'Difficulty': p.diff,
    'Time':       p.time_complexity ?? '',
    'Space':      p.space_complexity ?? '',
    'Solved On':  p.solved_at ? toDisplay(p.solved_at) : '',
    'Tags':       (p.tags ?? []).join(', '),
    'Statement':  p.statement ?? '',
    'Insight':    p.insight ?? '',
  }))
  const allWs = XLSX.utils.json_to_sheet(allRows)
  XLSX.utils.book_append_sheet(wb, allWs, 'All Problems')

  // One sheet per group
  Object.entries(groups).sort(([a], [b]) => a.localeCompare(b)).forEach(([key, probs]) => {
    const rows = probs.map(p => ({
      '#':          p.num,
      'Title':      p.title,
      'Difficulty': p.diff,
      'Pattern':    p.pattern,
      'Time':       p.time_complexity ?? '',
      'Space':      p.space_complexity ?? '',
      'Solved On':  p.solved_at ? toDisplay(p.solved_at) : '',
      'Tags':       (p.tags ?? []).join(', '),
      'Statement':  p.statement ?? '',
      'Insight':    p.insight ?? '',
    }))
    const ws = XLSX.utils.json_to_sheet(rows)
    // Trim sheet name to 31 chars (Excel limit)
    const sheetName = key.slice(0, 31)
    XLSX.utils.book_append_sheet(wb, ws, sheetName)
  })

  XLSX.writeFile(wb, `dsa-vault-${groupBy}-wise.xlsx`)
}

// ── PDF export (topic-wise sections) ─────────────────────────────────────────
export async function exportToPDF(problems: Problem[], groupBy: 'topic' | 'pattern' = 'topic') {
  const { default: jsPDF } = await import('jspdf')
  const { default: autoTable } = await import('jspdf-autotable')

  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })

  // Title page header
  doc.setFontSize(18)
  doc.setTextColor(88, 166, 255)
  doc.text('DSA Vault — Problem Tracker', 14, 16)
  doc.setFontSize(10)
  doc.setTextColor(139, 148, 158)
  doc.text(`Exported: ${new Date().toLocaleDateString('en-IN')} · ${problems.length} problems`, 14, 23)

  // Group problems
  const groups: Record<string, Problem[]> = {}
  problems.forEach(p => {
    const key = p[groupBy] ?? 'Other'
    ;(groups[key] = groups[key] ?? []).push(p)
  })

  let isFirst = true
  Object.entries(groups).sort(([a], [b]) => a.localeCompare(b)).forEach(([key, probs]) => {
    if (!isFirst) doc.addPage()
    isFirst = false

    // Section header
    doc.setFontSize(13)
    doc.setTextColor(88, 166, 255)
    doc.text(`${key} (${probs.length})`, 14, 34)

    autoTable(doc, {
      startY: 38,
      head: [['#', 'Title', 'Diff', 'Pattern', 'Time', 'Space', 'Solved On', 'Tags']],
      body: probs.map(p => [
        p.num,
        p.title,
        p.diff,
        p.pattern,
        p.time_complexity ?? '',
        p.space_complexity ?? '',
        p.solved_at ? toDisplay(p.solved_at) : '',
        (p.tags ?? []).join(', '),
      ]),
      styles: {
        fontSize: 8,
        cellPadding: 2,
        textColor: [230, 237, 243],
        fillColor: [22, 27, 34],
      },
      headStyles: {
        fillColor: [33, 38, 45],
        textColor: [88, 166, 255],
        fontStyle: 'bold',
      },
      alternateRowStyles: { fillColor: [13, 17, 23] },
      columnStyles: {
        0: { cellWidth: 12 },
        1: { cellWidth: 55 },
        2: { cellWidth: 18 },
        3: { cellWidth: 35 },
        4: { cellWidth: 22 },
        5: { cellWidth: 22 },
        6: { cellWidth: 22 },
        7: { cellWidth: 'auto' },
      },
      margin: { left: 14, right: 14 },
    })
  })

  doc.save(`dsa-vault-${groupBy}-wise.pdf`)
}
