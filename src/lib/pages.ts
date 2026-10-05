export interface PageInfo { path: string; label: string; h1: string; intro: string; about: string[]; tips: string[] }

export const PAGES: PageInfo[] = [
  {
    "path": "/",
    "label": "Photographer invoice generator",
    "h1": "Your work deserves a better invoice.",
    "intro": "Fill in the details, then download a PDF. No account needed.",
    "about": [
      "Frameline is a free invoice maker built for photographers. Add your studio, your client and your services, and download a clean A4 PDF.",
      "Everything happens in your browser. Nothing is uploaded, and there is nothing to sign up for."
    ],
    "tips": [
      "Put the shoot date on the invoice so the client can match it to the booking.",
      "Add your advance as a payment received, so the balance is calculated for you.",
      "Use the notes box for bank details, UPI ID or payment terms."
    ]
  },
  {
    "path": "/wedding-photography-invoice",
    "label": "Wedding Photography Invoice",
    "h1": "A wedding invoice your clients take seriously.",
    "intro": "Add the package, the advance and the balance. Download a PDF in under a minute.",
    "about": [
      "A wedding invoice usually covers more than one thing: coverage hours, an album, prints, and sometimes a second shooter or a drone. List each one as its own line so the client sees what the total is made of.",
      "Weddings are mostly paid in parts. Enter the advance you already received and Frameline shows the balance still due on the invoice."
    ],
    "tips": [
      "List coverage, album and prints as separate lines.",
      "Enter the advance you have received to show the balance due.",
      "Add your payment terms in the notes, such as balance due before the album is delivered."
    ]
  },
  {
    "path": "/photo-studio-bill-format",
    "label": "Photo Studio Bill Format",
    "h1": "A proper bill for your photo studio.",
    "intro": "Add items, tax and advance. Get a clean bill as a PDF.",
    "about": [
      "A good photo studio bill has your studio name and contact details, the customer name, a date, a list of items with quantity and rate, and the total. If the customer paid an advance, the bill should also show the balance.",
      "Frameline puts all of that on one page. Use the tax field for GST or any other tax, and pick INR to show amounts in rupees."
    ],
    "tips": [
      "Include quantity and rate for every item, such as prints, frames or albums.",
      "Use the tax field if you charge GST.",
      "Keep a bill number for each customer so your records stay in order."
    ]
  },
  {
    "path": "/photography-invoice-template",
    "label": "Photography Invoice Template",
    "h1": "A photography invoice template that fills itself in.",
    "intro": "Type your details once, and the totals are worked out for you.",
    "about": [
      "Word and Excel templates mean fixing columns and checking formulas every time. Here the layout is already done and the maths is automatic.",
      "Pick your currency, add your services, and download the PDF. Your last invoice is kept in this browser, so the next one starts faster."
    ],
    "tips": [
      "Add a logo so the invoice looks like your brand.",
      "Use a new invoice number every time, for example INV-002.",
      "Send the PDF, not a screenshot, so the client can save and print it."
    ]
  },
  {
    "path": "/product-photography-invoice",
    "label": "Product Photography Invoice",
    "h1": "An invoice for product shoots, priced per image.",
    "intro": "Add the number of images, the rate and your usage terms. Download the PDF.",
    "about": [
      "Product photography is often priced per image or per product. Put the number of images in the quantity box and the price per image in the rate box, and the line total is calculated for you.",
      "If the brand will use the photos in ads or on a marketplace, add a Usage Rights line, or write the terms in the notes."
    ],
    "tips": [
      "Use quantity for number of images and rate for price per image.",
      "Add editing and retouching as a separate line.",
      "State the usage rights in the notes so there is no confusion later."
    ]
  }
]

/** Finds which page the visitor is on, from the address in the browser. */
export function getPage(): PageInfo {
  const p = window.location.pathname.replace(/\.html$/, '').replace(/\/+$/, '') || '/'
  return PAGES.find(x => x.path === p) ?? PAGES[0]
}
