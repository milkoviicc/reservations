// tailwind.config.ts
import type { Config } from 'tailwindcss'
import tailwindScrollbarHide from 'tailwind-scrollbar-hide'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,vue,html}'],
  theme: {
    extend: {},
  },
  plugins: [tailwindScrollbarHide],
}

export default config
