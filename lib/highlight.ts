const KW = new Set([
  'int','void','return','if','else','for','while','auto','bool','class','struct',
  'nullptr','true','false','using','namespace','do','vector','string','new',
  'delete','break','continue','long','short','char','double','float','size_t',
  'pair','map','set','unordered_map','unordered_set','sort','max','min',
  'push_back','count','find','begin','end','size','abs','greater','const',
  'inline','unsigned','signed','template','typename','static_cast','include',
])
const TY = new Set(['ListNode','TreeNode','INT_MAX','INT_MIN','Node'])

function esc(s: string) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
}

export function highlightCpp(code: string): string {
  return code.split('\n').map(line => {
    if (line.trim().startsWith('//')) {
      const idx = line.indexOf('//')
      return esc(line.slice(0, idx)) +
        `<span class="cm">//${esc(line.slice(idx + 2))}</span>`
    }
    let out = '', i = 0
    while (i < line.length) {
      const ch = line[i]
      if (ch === '/' && line[i+1] === '/') {
        out += `<span class="cm">${esc(line.slice(i))}</span>`; break
      }
      if (ch === '"') {
        let j = i+1; while (j < line.length && line[j] !== '"') j++
        out += `<span class="st">${esc(line.slice(i, j+1))}</span>`; i = j+1; continue
      }
      if (/\d/.test(ch) && (i === 0 || !/\w/.test(line[i-1]))) {
        let j = i; while (j < line.length && /[\d.x]/.test(line[j])) j++
        out += `<span class="nm">${esc(line.slice(i, j))}</span>`; i = j; continue
      }
      if (/[a-zA-Z_]/.test(ch)) {
        let j = i; while (j < line.length && /\w/.test(line[j])) j++
        const word = line.slice(i, j)
        if (KW.has(word))       out += `<span class="kw">${word}</span>`
        else if (TY.has(word))  out += `<span class="ty">${word}</span>`
        else if (j < line.length && line[j] === '(') out += `<span class="fn">${word}</span>`
        else out += word
        i = j; continue
      }
      out += esc(ch); i++
    }
    return out
  }).join('\n')
}
