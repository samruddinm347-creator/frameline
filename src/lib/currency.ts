export interface Currency { code: string; symbol: string; label: string; locale: string }

export const CURRENCIES: Currency[] = [
  { code: 'INR', symbol: '₹', label: 'INR ₹', locale: 'en-IN' },
  { code: 'USD', symbol: '$', label: 'USD $', locale: 'en-US' },
  { code: 'GBP', symbol: '£', label: 'GBP £', locale: 'en-GB' },
  { code: 'EUR', symbol: '€', label: 'EUR €', locale: 'de-DE' },
  { code: 'AUD', symbol: '$', label: 'AUD $', locale: 'en-AU' },
  { code: 'CAD', symbol: '$', label: 'CAD $', locale: 'en-CA' },
  { code: 'AED', symbol: 'د.إ', label: 'AED د.إ', locale: 'en-US' },
  { code: 'SGD', symbol: '$', label: 'SGD $', locale: 'en-SG' },
  { code: 'NZD', symbol: '$', label: 'NZD $', locale: 'en-NZ' },
  { code: 'JPY', symbol: '¥', label: 'JPY ¥', locale: 'ja-JP' }
]

export const getCurrency = (code: string) => CURRENCIES.find(c => c.code === code) ?? CURRENCIES[0]

/** Number part only, with correct digit grouping (never NaN). */
export function formatNumber(value: number, code: string): string {
  const c = getCurrency(code)
  const digits = c.code === 'JPY' ? 0 : 2
  return new Intl.NumberFormat(c.locale, { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(Number.isFinite(value) ? value : 0)
}

export const formatMoney = (value: number, code: string) => `${getCurrency(code).symbol}${formatNumber(value, code)}`
