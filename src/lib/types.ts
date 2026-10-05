export interface LineItem { id: string; name: string; qty: string; rate: string }

export interface Invoice {
  studioName: string; logo: string | null; email: string; phone: string; website: string; address: string
  clientName: string; clientEmail: string; clientPhone: string; clientAddress: string
  invoiceNumber: string; invoiceDate: string; shootDate: string; currency: string
  items: LineItem[]
  taxPercent: string; discount: string; discountType: 'percent' | 'flat'
  advance: string; notes: string
}

/** [button label, service name put on the invoice] */
export const QUICK_SERVICES: [string, string][] = [
  ['Wedding', 'Wedding Photography'], ['Pre-Wedding', 'Pre-Wedding Photography'], ['Event', 'Event Photography'],
  ['Product', 'Product Photography'], ['Editing', 'Photo Editing'], ['Album', 'Album Print'],
  ['Drone', 'Drone Coverage'], ['Extra Hours', 'Extra Hours'], ['Usage', 'Usage Rights']
]

export const uid = () => Math.random().toString(36).slice(2, 10)
const today = () => new Date().toISOString().slice(0, 10)

export const emptyInvoice = (): Invoice => ({
  studioName: '', logo: null, email: '', phone: '', website: '', address: '',
  clientName: '', clientEmail: '', clientPhone: '', clientAddress: '',
  invoiceNumber: 'INV-001', invoiceDate: today(), shootDate: '', currency: 'INR',
  items: [{ id: uid(), name: '', qty: '1', rate: '' }],
  taxPercent: '', discount: '', discountType: 'flat', advance: '', notes: ''
})
