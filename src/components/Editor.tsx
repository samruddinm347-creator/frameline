import { useId, useState, type InputHTMLAttributes } from 'react'
import { QUICK_SERVICES, uid, type Invoice } from '../lib/types'
import type { Totals } from '../lib/calc'
import { toNum } from '../lib/calc'
import { CURRENCIES, formatMoney } from '../lib/currency'
import LogoUpload from './LogoUpload'

type Set = <K extends keyof Invoice>(k: K, v: Invoice[K]) => void

function Fld({ label, full, ...p }: { label: string; full?: boolean } & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId()
  return <div className={full ? 'full' : undefined}><label htmlFor={id}>{label}</label><input id={id} {...p} /></div>
}

export default function Editor({ inv, set, T }: { inv: Invoice; set: Set; T: Totals }) {
  const [out, setOut] = useState<string | null>(null)
  const t = (k: keyof Invoice, label: string, o: { full?: boolean } & InputHTMLAttributes<HTMLInputElement> = {}) =>
    <Fld label={label} value={inv[k] as string} onChange={e => set(k, e.target.value as never)} {...o} />

  const patch = (id: string, p: Partial<Invoice['items'][0]>) => set('items', inv.items.map(i => (i.id === id ? { ...i, ...p } : i)))
  const addLine = (name = '') => {
    const last = inv.items[inv.items.length - 1]
    if (name && last && !last.name && !toNum(last.rate)) patch(last.id, { name })
    else set('items', [...inv.items, { id: uid(), name, qty: '1', rate: '' }])
  }
  const move = (i: number, d: -1 | 1) => {
    const j = i + d; if (j < 0 || j >= inv.items.length) return
    const n = [...inv.items];[n[i], n[j]] = [n[j], n[i]]; set('items', n)
  }
  const del = (id: string) => {
    setOut(id)
    setTimeout(() => {
      const n = inv.items.filter(i => i.id !== id)
      set('items', n.length ? n : [{ id: uid(), name: '', qty: '1', rate: '' }]); setOut(null)
    }, 150)
  }

  return (
    <form onSubmit={e => e.preventDefault()} aria-label="Invoice details">
      <div className="hero"><h1>Your work deserves a better invoice.</h1><p>Fill in the details, then download a PDF. No account needed.</p></div>
      <section className="sec"><h2 className="st">Your studio</h2><div className="g">
        {t('studioName', 'Studio or photographer name', { full: true, placeholder: 'Aarav Mehta Photography' })}
        <LogoUpload value={inv.logo} onChange={v => set('logo', v)} />
        {t('email', 'Email', { type: 'email', placeholder: 'hello@studio.com' })}
        {t('phone', 'Phone', { type: 'tel' })}
        {t('website', 'Website', { full: true, placeholder: 'yourstudio.com' })}
        {t('address', 'Address', { full: true })}
      </div></section>

      <section className="sec"><h2 className="st">Client</h2><div className="g">
        {t('clientName', 'Client name', { full: true, placeholder: 'Riya & Kabir' })}
        {t('clientEmail', 'Email', { type: 'email' })}
        {t('clientPhone', 'Phone', { type: 'tel' })}
        {t('clientAddress', 'Address', { full: true })}
      </div></section>

      <section className="sec"><h2 className="st">Shoot details</h2><div className="g">
        {t('invoiceNumber', 'Invoice number')}
        <div><label htmlFor="cur">Currency</label>
          <select id="cur" value={inv.currency} onChange={e => set('currency', e.target.value)}>
            {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} {c.symbol}</option>)}
          </select></div>
        {t('invoiceDate', 'Invoice date', { type: 'date' })}
        {t('shootDate', 'Shoot date', { type: 'date' })}
      </div></section>

      <section className="sec"><h2 className="st">Services</h2>
        <div className="pal" role="group" aria-label="Quick add a service">
          {QUICK_SERVICES.map(([label, name]) => (
            <button key={label} type="button" className="tile" onClick={() => addLine(name)}><b>+</b>{label}</button>
          ))}
        </div>
        <datalist id="svc">{QUICK_SERVICES.map(([, n]) => <option key={n} value={n} />)}</datalist>
        {inv.items.map((it, i) => (
          <div key={it.id} className={`item${out === it.id ? ' out' : ''}`}>
            <div className="n"><label htmlFor={`n${it.id}`}>Service {i + 1}</label>
              <input id={`n${it.id}`} list="svc" value={it.name} placeholder="e.g. Wedding Photography" onChange={e => patch(it.id, { name: e.target.value })} /></div>
            <div><label htmlFor={`q${it.id}`}>Qty</label>
              <input id={`q${it.id}`} inputMode="decimal" value={it.qty} onChange={e => patch(it.id, { qty: e.target.value })} /></div>
            <div><label htmlFor={`r${it.id}`}>Rate</label>
              <input id={`r${it.id}`} inputMode="decimal" value={it.rate} placeholder="0" onChange={e => patch(it.id, { rate: e.target.value })} /></div>
            <div className="r2">
              <span className="amt">{formatMoney(T.lines[i] ?? 0, inv.currency)}</span>
              <button type="button" aria-label="Move up" onClick={() => move(i, -1)}>↑</button>
              <button type="button" aria-label="Move down" onClick={() => move(i, 1)}>↓</button>
              <button type="button" aria-label={`Delete service ${i + 1}`} onClick={() => del(it.id)}>✕</button>
            </div>
          </div>
        ))}
        <button className="add" type="button" onClick={() => addLine()}>+ Blank line</button>
        <div className="g" style={{ marginTop: 16 }}>
          {t('taxPercent', 'Tax (%)', { inputMode: 'decimal', placeholder: '0' })}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 74px', gap: 8 }}>
            {t('discount', 'Discount', { inputMode: 'decimal', placeholder: '0' })}
            <div><label htmlFor="dt">Type</label>
              <select id="dt" value={inv.discountType} onChange={e => set('discountType', e.target.value as Invoice['discountType'])}>
                <option value="flat">Amt</option><option value="percent">%</option>
              </select></div>
          </div>
        </div>
      </section>

      <section className="sec" style={{ border: 0 }}><h2 className="st">Payment</h2><div className="g">
        {t('advance', 'Advance received', { full: true, inputMode: 'decimal', placeholder: '0' })}
        <div className="full bal" aria-live="polite">
          <span className="l">{T.overpaid > 0 ? 'Paid in full' : 'Balance due'}</span>
          <b>{formatMoney(T.balance, inv.currency)}</b>
          {T.overpaid > 0 && <span className="l" style={{ margin: '6px 0 0' }}>The advance is {formatMoney(T.overpaid, inv.currency)} more than the total. It shows as an overpayment.</span>}
        </div>
        <div className="full"><label htmlFor="notes">Notes or payment details</label>
          <textarea id="notes" rows={3} value={inv.notes} onChange={e => set('notes', e.target.value)}
            placeholder="Thank you for choosing us. We look forward to capturing your moments." /></div>
      </div>
      <p className="priv">Your invoice stays in your browser. No account required.</p></section>
    </form>
  )
}
