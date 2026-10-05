import type { Invoice } from '../lib/types'
import type { Totals } from '../lib/calc'
import { toNum } from '../lib/calc'
import { formatMoney } from '../lib/currency'
import { fmtDate } from '../lib/format'
import { BRAND } from '../lib/config'

export default function Sheet({ inv, T, showBranding }: { inv: Invoice; T: Totals; showBranding: boolean }) {
  const m = (n: number) => formatMoney(n, inv.currency)
  const rows = inv.items.map((it, i) => ({ it, a: T.lines[i] })).filter(r => r.it.name || r.a > 0)
  const contact = [inv.email, inv.phone, inv.website, inv.address].filter(Boolean)
  const ini = (inv.studioName.trim()[0] || '').toUpperCase()
  const dash = <span className="mu">—</span>

  return (
    <article className="sheet" aria-label="Invoice preview">
      <i className="cm a" /><i className="cm b" /><i className="cm c" /><i className="cm d" />
      <div className="in">
        <div className="top">
          <div style={{ minWidth: 0 }}>
            {inv.logo
              ? <img src={inv.logo} alt="" style={{ height: 'max(40px,6cqw)', maxWidth: '30cqw', objectFit: 'contain', display: 'block', marginBottom: 'max(12px,2cqw)' }} />
              : <div className="mk">{ini}</div>}
            <div className="studio">{inv.studioName || 'Your studio name'}</div>
            <div className="ct mu">{contact.map(c => <div key={c}>{c}</div>)}</div>
          </div>
          <div className="nb"><div className="cp">Invoice</div><div className="num">{inv.invoiceNumber || '—'}</div></div>
        </div>

        <div className="meta">
          <div><div className="cp">Billed to</div><b>{inv.clientName || 'Client name'}</b>
            <div className="mu">{[inv.clientEmail, inv.clientPhone, inv.clientAddress].filter(Boolean).map(c => <div key={c}>{c}</div>)}</div></div>
          <div><div className="cp">Shoot</div><b>{fmtDate(inv.shootDate) || dash}</b></div>
          <div><div className="cp">Issued</div><b>{fmtDate(inv.invoiceDate) || dash}</b></div>
        </div>

        <table>
          <thead><tr><th>Service</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={4} className="mu" style={{ padding: '16px 0' }}>Add a service to see it here.</td></tr>}
            {rows.map((r, n) => (
              <tr key={r.it.id}>
                <td><small>{String(n + 1).padStart(2, '0')}</small>{r.it.name || 'Untitled service'}</td>
                <td>{r.it.qty || 0}</td><td>{m(toNum(r.it.rate))}</td><td>{m(r.a)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="low">
          <div className="nt">{inv.notes && <><div className="cp">Notes</div>{inv.notes}</>}</div>
          <div className="tot">
            <div><span className="mu">Subtotal</span><span>{m(T.subtotal)}</span></div>
            {T.discount > 0 && <div><span className="mu">Discount</span><span>−{m(T.discount)}</span></div>}
            {T.tax > 0 && <div><span className="mu">Tax</span><span>{m(T.tax)}</span></div>}
            <div><span className="mu">Total</span><b>{m(T.total)}</b></div>
            {T.advance > 0 && <div><span className="mu">Advance paid</span><span>−{m(T.advance)}</span></div>}
          </div>
        </div>

        <div key={T.balance} className="due pulse"><span className="cp">{T.overpaid > 0 ? 'Paid in full' : 'Balance due'}</span><b>{m(T.balance)}</b></div>
        {T.overpaid > 0 && <div className="ov mu">Overpaid by {m(T.overpaid)}</div>}
        <div className="fill" />
        <div className="ft"><span>{showBranding && <><i />Made with {BRAND}</>}</span><span>{inv.invoiceNumber}</span></div>
      </div>
    </article>
  )
}
