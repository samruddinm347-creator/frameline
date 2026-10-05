import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import './fonts'
import type { Invoice } from '../lib/types'
import type { Totals } from '../lib/calc'
import { toNum } from '../lib/calc'
import { formatNumber, getCurrency } from '../lib/currency'
import { fmtDate } from '../lib/format'
import { BRAND } from '../lib/config'

const ACC = '#0B6B4F', INK = '#18181B', MU = '#5F5F68', HAIR = '#EBEBEE', TINT = '#EAF4EF'
const s = StyleSheet.create({
  page: { fontFamily: 'Inter', fontSize: 9.5, color: INK, paddingTop: 46, paddingHorizontal: 46, paddingBottom: 64, lineHeight: 1.45 },
  cm: { position: 'absolute', width: 14, height: 14, borderColor: ACC },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  mu: { color: MU },
  cap: { fontFamily: 'Inter', fontWeight: 600, fontSize: 8, color: MU },
  mark: { width: 34, height: 34, backgroundColor: TINT, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  markT: { color: ACC, fontFamily: 'Manrope', fontWeight: 800, fontSize: 15 },
  studio: { fontFamily: 'Manrope', fontWeight: 800, fontSize: 21, lineHeight: 1.1, letterSpacing: -0.6 },
  num: { fontFamily: 'Manrope', fontWeight: 800, fontSize: 32, lineHeight: 1, letterSpacing: -1.3, textAlign: 'right', marginTop: 5 },
  meta: { flexDirection: 'row', marginTop: 28, paddingTop: 12, borderTopWidth: 2, borderTopColor: ACC },
  th: { paddingBottom: 7, borderBottomWidth: 1, borderBottomColor: '#D3D4DD' },
  tr: { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: HAIR },
  due: { marginTop: 18, borderTopWidth: 2, borderTopColor: ACC, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: 12 },
  foot: { position: 'absolute', left: 46, right: 46, bottom: 30, flexDirection: 'row', justifyContent: 'space-between', fontSize: 7.5, color: '#8A8A94' }
})

/** Draws "₹1,25,000.00". Sign, symbol and number are separate text pieces, so Arabic (د.إ) can never reorder the digits. */
function Money({ v, code, style, sign = '' }: { v: number; code: string; style?: object; sign?: string }) {
  const c = getCurrency(code)
  const { textAlign, width, ...txt } = (style ?? {}) as Record<string, unknown>
  const symFont = code === 'INR' ? 'InterExt' : code === 'AED' ? 'NotoArabic' : 'Inter'
  return (
    <View style={{ width: width as never, flexDirection: 'row', justifyContent: textAlign === 'right' ? 'flex-end' : 'flex-start', alignItems: 'baseline' }}>
      {sign ? <Text style={txt}>{sign}</Text> : null}
      <Text style={{ ...txt, fontFamily: symFont, fontWeight: symFont === 'Inter' ? 600 : 400, marginRight: code === 'AED' ? 3 : 0 }}>{c.symbol}</Text>
      <Text style={txt}>{formatNumber(v, code)}</Text>
    </View>
  )
}

const W = { svc: '46%', qty: '10%', rate: '22%', amt: '22%' }

export default function InvoicePDF({ inv, T, showBranding }: { inv: Invoice; T: Totals; showBranding: boolean }) {
  const code = inv.currency
  const rows = inv.items.map((it, i) => ({ it, a: T.lines[i] })).filter(r => r.it.name || r.a > 0)
  const contact = [inv.email, inv.phone, inv.website, inv.address].filter(Boolean)
  const ini = (inv.studioName.trim()[0] || '').toUpperCase()
  const label = T.overpaid > 0 ? 'Paid in full' : 'Balance due'

  return (
    <Document title={`Invoice ${inv.invoiceNumber}`} author={inv.studioName || BRAND} creator={BRAND}>
      <Page size="A4" style={s.page}>
        <View fixed style={[s.cm, { top: 18, left: 18, borderTopWidth: 1.5, borderLeftWidth: 1.5 }]} />
        <View fixed style={[s.cm, { top: 18, right: 18, borderTopWidth: 1.5, borderRightWidth: 1.5 }]} />
        <View fixed style={[s.cm, { bottom: 18, left: 18, borderBottomWidth: 1.5, borderLeftWidth: 1.5 }]} />
        <View fixed style={[s.cm, { bottom: 18, right: 18, borderBottomWidth: 1.5, borderRightWidth: 1.5 }]} />

        <View style={s.row}>
          <View style={{ maxWidth: '60%' }}>
            {inv.logo ? <Image src={inv.logo} style={{ height: 40, maxWidth: 140, objectFit: 'contain', marginBottom: 12 }} />
              : <View style={s.mark}><Text style={s.markT}>{ini}</Text></View>}
            <Text style={s.studio}>{inv.studioName || 'Your studio name'}</Text>
            <View style={{ marginTop: 6 }}>{contact.map(c => <Text key={c} style={s.mu}>{c}</Text>)}</View>
          </View>
          <View style={{ maxWidth: '38%' }}><Text style={[s.cap, { textAlign: 'right' }]}>Invoice</Text><Text style={s.num}>{inv.invoiceNumber || '-'}</Text></View>
        </View>

        <View style={s.meta}>
          <View style={{ width: '50%', paddingRight: 10 }}>
            <Text style={[s.cap, { marginBottom: 4 }]}>Billed to</Text>
            <Text style={{ fontWeight: 600 }}>{inv.clientName || 'Client name'}</Text>
            {[inv.clientEmail, inv.clientPhone, inv.clientAddress].filter(Boolean).map(c => <Text key={c} style={s.mu}>{c}</Text>)}
          </View>
          <View style={{ width: '25%' }}><Text style={[s.cap, { marginBottom: 4 }]}>Shoot</Text><Text style={{ fontWeight: 600 }}>{fmtDate(inv.shootDate) || '-'}</Text></View>
          <View style={{ width: '25%' }}><Text style={[s.cap, { marginBottom: 4 }]}>Issued</Text><Text style={{ fontWeight: 600 }}>{fmtDate(inv.invoiceDate) || '-'}</Text></View>
        </View>

        <View style={{ marginTop: 24 }}>
          <View style={[s.row, s.th]} fixed>
            <Text style={[s.cap, { width: W.svc }]}>Service</Text>
            <Text style={[s.cap, { width: W.qty, textAlign: 'right' }]}>Qty</Text>
            <Text style={[s.cap, { width: W.rate, textAlign: 'right' }]}>Rate</Text>
            <Text style={[s.cap, { width: W.amt, textAlign: 'right' }]}>Amount</Text>
          </View>
          {rows.length === 0 && <View style={s.tr}><Text style={s.mu}>No services added.</Text></View>}
          {rows.map((r, n) => (
            <View key={r.it.id} style={s.tr} wrap={false}>
              <View style={{ width: W.svc, flexDirection: 'row', paddingRight: 8 }}>
                <Text style={{ color: '#8A8A94', fontWeight: 600, width: 20 }}>{String(n + 1).padStart(2, '0')}</Text>
                <Text style={{ fontWeight: 600, flex: 1 }}>{r.it.name || 'Untitled service'}</Text>
              </View>
              <Text style={{ width: W.qty, textAlign: 'right' }}>{r.it.qty || 0}</Text>
              <Money v={toNum(r.it.rate)} code={code} style={{ width: W.rate, textAlign: 'right' }} />
              <Money v={r.a} code={code} style={{ width: W.amt, textAlign: 'right', fontWeight: 600 }} />
            </View>
          ))}
        </View>

        <View style={[s.row, { marginTop: 18 }]} wrap={false}>
          <View style={{ width: '50%', paddingRight: 14 }}>
            {inv.notes ? <><Text style={[s.cap, { marginBottom: 4 }]}>Notes</Text><Text style={s.mu}>{inv.notes}</Text></> : null}
          </View>
          <View style={{ width: '44%' }}>
            {([['Subtotal', T.subtotal, ''], ['Discount', T.discount, '-'], ['Tax', T.tax, ''], ['Total', T.total, ''], ['Advance paid', T.advance, '-']] as [string, number, string][])
              .filter(([k, v]) => v > 0 || k === 'Subtotal' || k === 'Total').map(([k, v, sign]) => (
                <View key={k} style={[s.row, { paddingVertical: 2 }]}>
                  <Text style={k === 'Total' ? { fontWeight: 600 } : s.mu}>{k}</Text>
                  <Money v={v} code={code} sign={sign} style={k === 'Total' ? { fontWeight: 600 } : undefined} />
                </View>
              ))}
          </View>
        </View>

        <View style={s.due} wrap={false}>
          <Text style={[s.cap, { color: ACC, fontSize: 9.5 }]}>{label}</Text>
          <Money v={T.balance} code={code} style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 30, letterSpacing: -1.2, lineHeight: 1, color: ACC }} />
        </View>
        {T.overpaid > 0 && <View style={{ alignItems: 'flex-end', marginTop: 5 }}><View style={{ flexDirection: 'row', alignItems: 'baseline' }}><Text style={s.mu}>Overpaid by </Text><Money v={T.overpaid} code={code} style={s.mu} /></View></View>}

        <View fixed style={s.foot}>
          <Text>{showBranding ? `Made with ${BRAND}` : ''}</Text>
          <Text render={({ pageNumber, totalPages }) => `${inv.invoiceNumber}    Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>
    </Document>
  )
}
