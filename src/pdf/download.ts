import { createElement } from 'react'
import type { Invoice } from '../lib/types'
import type { Totals } from '../lib/calc'
import { slug } from '../lib/format'

/** Loaded only when the user clicks Download, so the first page load stays fast. */
export async function downloadInvoice(inv: Invoice, totals: Totals, showBranding: boolean) {
  const [{ pdf }, { default: InvoicePDF }] = await Promise.all([import('@react-pdf/renderer'), import('./InvoicePDF')])
  const blob = await pdf(createElement(InvoicePDF, { inv, T: totals, showBranding }) as never).toBlob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${slug(inv.studioName, 'Studio')}-Invoice-${slug(inv.invoiceNumber, '001')}.pdf`
  document.body.appendChild(a); a.click(); a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}
