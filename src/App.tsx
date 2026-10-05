import { useEffect, useMemo, useRef, useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { BRAND, SHOW_BRANDING_DEFAULT } from './lib/config'
import { calculate } from './lib/calc'
import { formatMoney } from './lib/currency'
import { trackDownloadClick } from './lib/analytics'
import { useInvoice } from './hooks/useInvoice'
import Editor from './components/Editor'
import Sheet from './components/Sheet'

export default function App() {
  const { inv, set, reset } = useInvoice()
  const T = useMemo(() => calculate(inv), [inv])
  const [pv, setPv] = useState(false)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const timer = useRef<number>()

  useEffect(() => { document.body.classList.toggle('pv', pv) }, [pv])

  const toast = (m: string) => { setMsg(m); window.clearTimeout(timer.current); timer.current = window.setTimeout(() => setMsg(''), 2600) }

  async function download() {
    if (busy) return
    if (!inv.studioName.trim() || !inv.clientName.trim()) {
      setPv(false); window.scrollTo(0, 0)
      return toast('Add your studio name and client name first.')
    }
    trackDownloadClick()   // counts the click only, never invoice content
    setBusy(true)
    try {
      const { downloadInvoice } = await import('./pdf/download')
      await downloadInvoice(inv, T, SHOW_BRANDING_DEFAULT)
      toast('Invoice downloaded.')
    } catch (e) {
      console.error(e)
      toast('Could not create the PDF. Please try again.')
    } finally { setBusy(false) }
  }

  const label = T.overpaid > 0 ? 'Paid in full' : 'Balance due'
  const dlText = busy ? 'Preparing…' : 'Download Invoice'

  return (
    <>
      <header>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <a className="logo" href="/"><span className="lm" />{BRAND}</a>
          <span className="desc">Photographer Invoice Generator</span>
        </div>
        <div className="acts">
          <button className="btn" type="button" onClick={reset}>New Invoice</button>
          <button className="btn pri hn" type="button" disabled={busy} onClick={download}>{dlText}</button>
        </div>
      </header>

      <div className="app">
        <div className="ed"><Editor inv={inv} set={set} T={T} /></div>
        <main className="cv" aria-label="Invoice preview">
          <div className="cvh"><span>Live preview</span><span>Saved in this browser</span></div>
          <div className="wrap"><Sheet inv={inv} T={T} showBranding={SHOW_BRANDING_DEFAULT} /></div>
        </main>
      </div>

      <div className="bar">
        <div><small>{label}</small><b>{formatMoney(T.balance, inv.currency)}</b></div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn" type="button" onClick={() => { setPv(p => !p); window.scrollTo(0, 0) }}>{pv ? 'Edit' : 'Preview'}</button>
          <button className="btn pri" type="button" disabled={busy} onClick={download}>{dlText}</button>
        </div>
      </div>
      <div className={`toast${msg ? ' on' : ''}`} role="status">{msg}</div>
      <Analytics />
    </>
  )
}
