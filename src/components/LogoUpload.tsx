import { useRef, useState } from 'react'

const OK = ['image/png', 'image/jpeg', 'image/webp']

/** Shrinks the image inside the browser. Nothing is uploaded anywhere. */
function shrink(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file), img = new Image()
    img.onload = () => {
      const s = Math.min(1, 500 / Math.max(img.width, img.height)), c = document.createElement('canvas')
      c.width = Math.round(img.width * s); c.height = Math.round(img.height * s)
      c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height)
      URL.revokeObjectURL(url); resolve(c.toDataURL('image/png'))
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('bad image')) }
    img.src = url
  })
}

export default function LogoUpload({ value, onChange }: { value: string | null; onChange: (v: string | null) => void }) {
  const ref = useRef<HTMLInputElement>(null)
  const [err, setErr] = useState('')
  const [on, setOn] = useState(false)

  async function take(f?: File) {
    if (!f) return
    setErr('')
    if (!OK.includes(f.type)) return setErr('Please use a PNG, JPG or WebP image.')
    if (f.size > 5 * 1024 * 1024) return setErr('That file is over 5 MB. Please choose a smaller one.')
    try { onChange(await shrink(f)) } catch { setErr('That image could not be read. Try another file.') }
  }

  return (
    <div className="full">
      <span className="l">Logo (optional)</span>
      {value ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src={value} alt="Your logo" style={{ height: 44, maxWidth: 120, objectFit: 'contain', background: '#fff', padding: 4, borderRadius: 6, border: '1px solid #E6E6E9' }} />
          <button type="button" className="lk" onClick={() => onChange(null)}>Remove logo</button>
        </div>
      ) : (
        <button type="button" className={`drop${on ? ' on' : ''}`} onClick={() => ref.current?.click()}
          onDragOver={e => { e.preventDefault(); setOn(true) }} onDragLeave={() => setOn(false)}
          onDrop={e => { e.preventDefault(); setOn(false); take(e.dataTransfer.files[0]) }}>
          Drop logo here or click to choose
        </button>
      )}
      <input ref={ref} type="file" accept="image/png,image/jpeg,image/webp" className="sr" aria-label="Upload logo"
        onChange={e => { take(e.target.files?.[0]); e.target.value = '' }} />
      {err && <p className="err" role="alert">{err}</p>}
    </div>
  )
}
