import { useEffect, useState } from 'react'
import { emptyInvoice, type Invoice } from '../lib/types'

const KEY = 'frameline-invoice-v1'

function load(): Invoice {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...emptyInvoice(), ...JSON.parse(raw) }
  } catch { /* ignore corrupted data */ }
  return emptyInvoice()
}

export function useInvoice() {
  const [inv, setInv] = useState<Invoice>(load)

  useEffect(() => {
    const t = setTimeout(() => {
      try { localStorage.setItem(KEY, JSON.stringify(inv)) } catch { /* storage full: skip */ }
    }, 300)
    return () => clearTimeout(t)
  }, [inv])

  const set = <K extends keyof Invoice>(k: K, v: Invoice[K]) => setInv(p => ({ ...p, [k]: v }))

  const hasData = !!(inv.studioName || inv.clientName || inv.items.some(i => i.name || i.rate))

  const reset = () => {
    if (hasData && !window.confirm('Start a new invoice? Your current invoice will be cleared.')) return
    try { localStorage.removeItem(KEY) } catch { /* ignore */ }
    setInv(emptyInvoice())
  }

  return { inv, set, reset }
}
