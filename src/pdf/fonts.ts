import { Font } from '@react-pdf/renderer'
// Fonts are bundled with the app (no internet needed). Each file is a font the PDF embeds.
import inter400 from '@fontsource/inter/files/inter-latin-400-normal.woff?url'
import inter600 from '@fontsource/inter/files/inter-latin-600-normal.woff?url'
import interExt from '@fontsource/inter/files/inter-latin-ext-400-normal.woff?url'   // contains ₹
import manrope800 from '@fontsource/manrope/files/manrope-latin-800-normal.woff?url'
import arabic600 from '@fontsource/noto-sans-arabic/files/noto-sans-arabic-arabic-600-normal.woff?url' // contains د.إ

Font.register({ family: 'Inter', fonts: [{ src: inter400, fontWeight: 400 }, { src: inter600, fontWeight: 600 }] })
Font.register({ family: 'Manrope', src: manrope800, fontWeight: 800 })
Font.register({ family: 'InterExt', src: interExt })
Font.register({ family: 'NotoArabic', src: arabic600 })
