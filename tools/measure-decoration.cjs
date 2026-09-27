/**
 * Compare two DSH screenshots numerically: per-region mean/stddev plus a
 * high-frequency "speckle" energy (mean absolute difference against a blurred
 * copy), so decoration changes such as the light-mote pattern can be judged
 * without eyeballing the image at full size.
 *
 * Usage: node measure-decoration.cjs <before.png> <after.png>
 */
const sharp = require(process.env.SHARP_PATH || 'sharp')

const REGIONS = {
  sidebar: { left: 0.0, top: 0.09, width: 0.185, height: 0.78 },
  'hero (art)': { left: 0.21, top: 0.22, width: 0.55, height: 0.44 },
}

async function regionStats(file, region) {
  const meta = await sharp(file).metadata()
  const crop = {
    left: Math.round(region.left * meta.width),
    top: Math.round(region.top * meta.height),
    width: Math.round(region.width * meta.width),
    height: Math.round(region.height * meta.height),
  }
  // Materialise the crop first: stats() and blur() must both see the same
  // pixels, and normalising to one width keeps DPR-2 and DPR-1 shots comparable.
  const cropBuffer = await sharp(file).extract(crop).resize({ width: 480 }).png().toBuffer()
  const stats = await sharp(cropBuffer).stats()
  const blur = await sharp(cropBuffer).blur(2.5).raw().toBuffer({ resolveWithObject: true })
  const raw = await sharp(cropBuffer).raw().toBuffer({ resolveWithObject: true })
  let diff = 0
  for (let i = 0; i < raw.data.length; i += raw.info.channels) {
    diff += Math.abs(raw.data[i] - blur.data[i])
  }
  const speckle = diff / (raw.data.length / raw.info.channels)
  return {
    mean: stats.channels.slice(0, 3).map((c) => Math.round(c.mean)),
    stdev: stats.channels.slice(0, 3).map((c) => Math.round(c.stdev)),
    speckle: Number(speckle.toFixed(2)),
  }
}

async function main() {
  const [before, after] = process.argv.slice(2)
  for (const [name, region] of Object.entries(REGIONS)) {
    const a = await regionStats(before, region)
    const b = await regionStats(after, region)
    console.log(`${name}:`)
    console.log(`  before  mean(${a.mean.join(',')}) stdev(${a.stdev.join(',')}) speckle=${a.speckle}`)
    console.log(`  after   mean(${b.mean.join(',')}) stdev(${b.stdev.join(',')}) speckle=${b.speckle}`)
    console.log(`  delta   speckle ${(b.speckle / a.speckle * 100).toFixed(0)}% of before, `
      + `stdev ${(b.stdev[0] / a.stdev[0] * 100).toFixed(0)}%`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
