import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Preview-only build config: produces a single, fully self-contained HTML
// file (JS + CSS inlined) for quick sharing/preview without npm install or
// a dev server. Not used by the normal `npm run dev` / `npm run build`
// scripts — see README.md "Quick static preview" section.
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  base: './',
  build: {
    outDir: 'dist-preview',
    emptyOutDir: false,
    cssCodeSplit: false,
  },
})
