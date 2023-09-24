
// prefer default export if available
const preferDefault = m => (m && m.default) || m


exports.components = {
  "component---cache-dev-404-page-js": preferDefault(require("/Users/skeshmiri/lens-snap/lens-resolver/packages/site/.cache/dev-404-page.js")),
  "component---src-pages-index-tsx": preferDefault(require("/Users/skeshmiri/lens-snap/lens-resolver/packages/site/src/pages/index.tsx"))
}

