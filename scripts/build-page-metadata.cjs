const fs = require('node:fs')
const path = require('node:path')
const metadata = require('../src/data/pageMetadata.json')

const buildDirectory = path.resolve(__dirname, '../build')
const template = fs.readFileSync(
  path.join(buildDirectory, 'index.html'),
  'utf8'
)

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }[character]
  })
}

if (!template.includes('</head>')) {
  throw new Error('CRA output is missing its closing head tag')
}

// Keep CRA's hashed assets intact while replacing all page-specific head tags.
const shell = template
  .replace(/<title>[^]*?<\/title>/gi, '')
  .replace(
    /<meta\b[^>]*(?:name|property)="(?:description|robots|og:[^"]+|twitter:[^"]+)"[^>]*>/gi,
    ''
  )
  .replace(/<link\b[^>]*rel="canonical"[^>]*>/gi, '')

for (const [route, page] of Object.entries(metadata.pages)) {
  if (!/^\/(?:[a-z0-9-]+(?:\/[a-z0-9-]+)*)?$/.test(route)) {
    throw new Error(`Invalid page metadata route: ${route}`)
  }
  if (!page.title?.trim() || !page.description?.trim()) {
    throw new Error(`Missing title or description for ${route}`)
  }
  const url = `${metadata.siteUrl}${route}`
  const image = `${metadata.siteUrl}${metadata.image}`
  const tags = [
    `<title>${escapeHtml(page.title)}</title>`,
    `<link rel="canonical" href="${escapeHtml(url)}" />`,
    ...Object.entries({
      description: page.description,
      robots: 'index, follow',
      'twitter:card': 'summary_large_image',
      'twitter:title': page.title,
      'twitter:description': page.description,
      'twitter:image': image,
      'twitter:image:alt': metadata.imageAlt,
    }).map(
      ([name, content]) =>
        `<meta name="${name}" content="${escapeHtml(content)}" />`
    ),
    ...Object.entries({
      'og:type': 'website',
      'og:site_name': metadata.siteName,
      'og:title': page.title,
      'og:description': page.description,
      'og:url': url,
      'og:image': image,
      'og:image:alt': metadata.imageAlt,
    }).map(
      ([name, content]) =>
        `<meta property="${name}" content="${escapeHtml(content)}" />`
    ),
  ].join('')
  const outputPath = path.join(
    buildDirectory,
    route === '/' ? 'index.html' : `${route.slice(1)}.html`
  )
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, shell.replace('</head>', `${tags}</head>`))
}

console.log(`Wrote metadata for ${Object.keys(metadata.pages).length} pages.`)
