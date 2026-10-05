import type { Invoice } from './types'

/** Turns any typed text into a safe number: never NaN, never negative. */
export const toNum = (v: string | number): number => {
  const n = typeof v === 'number' ? v : parseFloat(String(v).replace(/,/g, ''))
  return Number.isFinite(n) && n > 0 ? n : 0
}

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100

export interface Totals {
  lines: number[]
  subtotal: number; tax: number; discount: number; total: number
  advance: number; balance: number; overpaid: number
}

export function calculate(inv: Invoice): Totals {
  const lines = inv.items.map(i => round2(toNum(i.qty) * toNum(i.rate)))
  const subtotal = round2(lines.reduce((a, b) => a + b, 0))
  const rawDiscount = inv.discountType === 'percent'
    ? subtotal * Math.min(toNum(inv.discount), 100) / 100
    : toNum(inv.discount)
  const discount = round2(Math.min(rawDiscount, subtotal))   // discount can't exceed subtotal
  const tax = round2((subtotal - discount) * Math.min(toNum(inv.taxPercent), 100) / 100)
  const total = round2(subtotal - discount + tax)
  const advance = round2(toNum(inv.advance))
  const balance = round2(Math.max(total - advance, 0))
  const overpaid = round2(Math.max(advance - total, 0))
  return { lines, subtotal, tax, discount, total, advance, balance, overpaid }
}
