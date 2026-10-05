import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

const page = (f: string) => fileURLToPath(new URL('./' + f, import.meta.url))

// Every .html file below becomes its own page on the website.
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: page('index.html'),
        wedding: page('wedding-photography-invoice.html'),
        studio: page('photo-studio-bill-format.html'),
        template: page('photography-invoice-template.html'),
        product: page('product-photography-invoice.html')
      }
    }
  }
})
