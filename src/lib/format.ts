export const fmtDate = (s: string) => {
  const d = new Date(s + 'T00:00:00')
  return s && !isNaN(d.getTime()) ? d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : ''
}
export const slug = (s: string, fallback: string) =>
  s.replace(/[^\p{L}\p{N}\-_ ]+/gu, '').trim().replace(/\s+/g, '-').slice(0, 40) || fallback
