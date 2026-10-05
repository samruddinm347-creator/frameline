import { track } from '@vercel/analytics'

/** Counts a click only. NEVER pass invoice content here. */
export const trackDownloadClick = () => {
  try { track('download_pdf_click') } catch { /* analytics must never break the app */ }
}
