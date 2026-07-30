import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // The outputs directory this project lives in does not allow files to be
    // deleted/renamed once written (sandbox constraint), so we disable Vite's
    // pre-build "empty the dist folder" step. Content-hashed filenames mean
    // fresh builds simply add new files rather than requiring old ones to be
    // removed; a handful of superseded hashed assets may remain in dist/ from
    // earlier builds but are otherwise harmless and unreferenced by index.html.
    emptyOutDir: false,
  },
})
