import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'

const src = path.join(process.env.USERPROFILE, 'Documents', 'CAFEMAYA')
const out = path.resolve('public/img')
fs.mkdirSync(out, { recursive: true })

const files = fs.readdirSync(src).filter((f) => /\.jpe?g$/i.test(f) && !/logo|herosection/i.test(f)).sort()
const pad = (n) => `p${String(n).padStart(2, '0')}`

/** Photos with text baked into the frame: crop it away. [topFraction, bottomFraction] */
const crops = {
  p28: [0.1, 0],
  p27: [0.22, 0],
  p35: [0.17, 0.15],
}

/**
 * Slides behind the hero. These are rendered separately at the aspect the hero
 * actually displays, so no pixels are wasted on areas the crop throws away.
 */
const heroIds = new Set(['p05', 'p31', 'p28', 'p34', 'p16', 'p33'])

/** The hero photo sits in an arched plate, so every screen gets the same 4:5 crop. */
const heroVariants = [
  ['plate', 1240, 1550, 84],
  ['platesm', 760, 950, 80],
]

const report = []
const manifest = {}

async function render(file, id) {
  const meta = await sharp(file).rotate().metadata()
  const crop = crops[id]
  const top = crop ? Math.round(meta.height * crop[0]) : 0
  const bottom = crop ? Math.round(meta.height * crop[1]) : 0
  const region = { left: 0, top, width: meta.width, height: meta.height - top - bottom }

  const base = () => {
    const s = sharp(file).rotate()
    return crop ? s.extract(region) : s
  }

  let dims = null
  for (const [suffix, max, quality] of [['lg', 2000, 82], ['sm', 720, 73], ['xs', 400, 68]]) {
    const info = await base()
      .resize({ width: max, height: max, fit: 'inside', withoutEnlargement: true })
      .webp({ quality, effort: 6, smartSubsample: true })
      .toFile(path.join(out, `${id}-${suffix}.webp`))
    if (suffix === 'lg') dims = { w: info.width, h: info.height, kb: Math.round(info.size / 1024) }
  }

  if (heroIds.has(id)) {
    manifest[id] = {}
    for (const [suffix, w, h, quality] of heroVariants) {
      const info = await base()
        .resize({ width: w, height: h, fit: 'cover', position: 'attention', withoutEnlargement: true })
        .sharpen({ sigma: 0.55, m1: 0.3, m2: 0.8 })
        .webp({ quality, effort: 6 })
        .toFile(path.join(out, `${id}-${suffix}.webp`))
      // record real output sizes so the markup can hand the browser accurate width descriptors
      manifest[id][suffix] = [info.width, info.height]
      if (suffix === 'plate') dims.heroKb = `${info.width}x${info.height} ${Math.round(info.size / 1024)}KB`
    }
  }
  report.push({ id, ...dims, hero: heroIds.has(id), cropped: !!crop })
}

for (let i = 0; i < files.length; i++) await render(path.join(src, files[i]), pad(i))
await render(path.join(src, 'herosection.jpg'), 'storefront')

const logo = path.join(src, 'logo.jpg')
await sharp(logo).resize(900).webp({ quality: 92, effort: 6 }).toFile(path.join(out, 'logo.webp'))
// small marks for the nav, footer and chat header, where the big one was 60x oversized
await sharp(logo).resize(760).webp({ quality: 82, effort: 6 }).toFile(path.join(out, 'logo-md.webp'))
await sharp(logo).resize(192).webp({ quality: 84, effort: 6 }).toFile(path.join(out, 'logo-sm.webp'))
await sharp(logo).resize(96).webp({ quality: 86, effort: 6 }).toFile(path.join(out, 'logo-xs.webp'))
await sharp(logo).resize(512, 512).png().toFile(path.resolve('public/icon-512.png'))
await sharp(logo).resize(180, 180).png().toFile(path.resolve('public/apple-touch-icon.png'))
await sharp(logo).resize(64, 64).png().toFile(path.resolve('public/favicon.png'))
await sharp(path.join(src, 'herosection.jpg')).resize(1200, 630, { fit: 'cover' }).jpeg({ quality: 86 }).toFile(path.resolve('public/og.jpg'))

fs.writeFileSync(path.resolve('src/data/heroManifest.json'), `${JSON.stringify(manifest, null, 2)}\n`)

console.log(report.map((r) => `${r.id} ${r.w}x${r.h} ${r.kb}KB${r.hero ? ` hero:${r.heroKb}KB` : ''}${r.cropped ? ' (cropped)' : ''}`).join('\n'))
console.log('\nTS dims:')
console.log(report.map((r) => `  ${r.id}: ${r.w}x${r.h}`).join('\n'))
