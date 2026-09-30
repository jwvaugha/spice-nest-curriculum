// Vite's `base` config (see vite.config.js) only rewrites asset URLs it
// actually processes at build time -- bundled JS/CSS imports and the
// references it finds in index.html. A plain runtime string typed directly
// into a component, like "/images/foo.jpg", is invisible to that rewrite
// and stays a literal root-relative path -- which 404s once the site is
// deployed under a subpath (a GitHub Pages PROJECT site is served at
// https://<user>.github.io/<repo>/, never the domain root). This wraps
// every such literal so it resolves against wherever the app is actually
// deployed (`import.meta.env.BASE_URL`, Vite's own runtime constant for
// its configured `base` -- `/spice-nest-curriculum/` in production,
// `/` in local dev) instead of being hardcoded to "/".
export function asset(path) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
}
