import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves a project site (not a user/org site) at
  // https://<user>.github.io/<repo>/ -- every asset URL Vite emits needs
  // this prefix or they'd all 404 one directory level too high once
  // deployed there. Applies to `npm run dev` too, not just `vite build`'s
  // output -- the dev server 302-redirects a bare "/" request to
  // "/spice-nest-curriculum/" to match, so local dev now runs at that path
  // rather than the server root (bookmark/type the full path, or just
  // follow the redirect).
  base: '/spice-nest-curriculum/',
  plugins: [react()],
})
