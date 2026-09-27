/**
 * Readability audit for a live page: sample real screenshot pixels behind
 * visible text and compare them with the text's computed colour.
 *
 * Usage:
 *   node contrast-audit.cjs --url <url> [--wait 9000] [--port 9400]
 *                           [--width 1440] [--height 900] [--click-file <js>]
 *                           [--pre-eval <js>] [--label <name>] [--png <file>]
 */
const { spawn } = require('node:child_process')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const sharp = require(process.env.SHARP_PATH || 'sharp')

const CHROME = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

function parseArgs(argv) {
  const out = {}
  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i]
    if (!key.startsWith('--')) continue
    const next = argv[i + 1]
    if (next === undefined || next.startsWith('--')) { out[key.slice(2)] = true; continue }
    out[key.slice(2)] = next
    i += 1
  }
  return out
}

const args = parseArgs(process.argv.slice(2))
const width = Number(args.width ?? 1440)
const height = Number(args.height ?? 900)
const waitMs = Number(args.wait ?? 9000)
const port = Number(args.port ?? 9400)
const label = args.label ?? 'page'
const profileDir = path.join(os.tmpdir(), `dmm-audit-${port}`)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const COLLECT = `(() => {
  const parse = (value) => {
    const m = /rgba?\\(([^)]+)\\)/.exec(value || '')
    if (!m) return null
    const parts = m[1].split(',').map((v) => Number.parseFloat(v))
    return { r: parts[0], g: parts[1], b: parts[2], a: parts.length > 3 ? parts[3] : 1 }
  }
  const visible = (el) => {
    const rect = el.getBoundingClientRect()
    if (rect.width < 8 || rect.height < 6) return null
    if (rect.bottom < 0 || rect.top > innerHeight || rect.right < 0 || rect.left > innerWidth) return null
    const style = getComputedStyle(el)
    if (style.visibility === 'hidden' || style.display === 'none') return null
    if (Number.parseFloat(style.opacity) < 0.5) return null
    return { rect, style }
  }
  const ownText = (el) => [...el.childNodes]
    .filter((n) => n.nodeType === 3)
    .map((n) => n.textContent.trim())
    .join(' ')
    .trim()
  const items = []
  for (const el of document.querySelectorAll('body *')) {
    const text = ownText(el)
    if (text.length < 2) continue
    const seen = visible(el)
    if (!seen) continue
    const color = parse(seen.style.color)
    if (!color || color.a < 0.5) continue
    const size = Number.parseFloat(seen.style.fontSize)
    const weight = Number.parseInt(seen.style.fontWeight, 10) || 400
    items.push({
      text: text.slice(0, 40),
      color,
      fontSize: size,
      large: size >= 24 || (size >= 18.66 && weight >= 600),
      x: Math.round(seen.rect.x), y: Math.round(seen.rect.y),
      w: Math.round(seen.rect.width), h: Math.round(seen.rect.height),
      tag: el.tagName.toLowerCase(),
      cls: (el.getAttribute('class') || '').split(/\\s+/).slice(0, 2).join('.'),
    })
  }
  return JSON.stringify(items)
})()`

function luminance({ r, g, b }) {
  const channel = (value) => {
    const c = value / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

function contrast(a, b) {
  const la = luminance(a)
  const lb = luminance(b)
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}

async function main() {
  const chrome = spawn(CHROME, [
    '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    '--disable-extensions', '--hide-scrollbars',
    `--remote-debugging-port=${port}`, `--user-data-dir=${profileDir}`,
    `--window-size=${width},${height}`, 'about:blank',
  ], { stdio: 'ignore' })

  let target
  for (let attempt = 0; attempt < 100 && !target; attempt += 1) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()
      target = list.find((t) => t.type === 'page' && t.webSocketDebuggerUrl)
    } catch { /* not up yet */ }
    if (!target) await sleep(200)
  }
  if (!target) throw new Error('no chrome target')

  const ws = new WebSocket(target.webSocketDebuggerUrl)
  let seq = 0
  const pending = new Map()
  ws.addEventListener('message', (event) => {
    const msg = JSON.parse(event.data)
    const entry = pending.get(msg.id)
    if (entry) { pending.delete(msg.id); entry(msg) }
  })
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true })
    ws.addEventListener('error', reject, { once: true })
  })
  const send = (method, params = {}) => new Promise((resolve) => {
    seq += 1
    pending.set(seq, resolve)
    ws.send(JSON.stringify({ id: seq, method, params }))
  })

  await send('Page.enable')
  await send('Runtime.enable')
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false })
  await send('Page.navigate', { url: args.url })
  await sleep(waitMs)
  if (args['pre-eval']) {
    await send('Runtime.evaluate', { expression: fs.readFileSync(args['pre-eval'], 'utf8'), returnByValue: true })
  }
  if (args['click-file']) {
    await send('Runtime.evaluate', { expression: fs.readFileSync(args['click-file'], 'utf8'), awaitPromise: true, returnByValue: true })
    await sleep(Number(args.settle ?? 3000))
  }

  const collected = await send('Runtime.evaluate', { expression: COLLECT, returnByValue: true })
  const items = JSON.parse(collected.result.result.value)
  const shot = await send('Page.captureScreenshot', { format: 'png' })
  const buffer = Buffer.from(shot.result.data, 'base64')
  if (args.png) fs.writeFileSync(args.png, buffer)

  const { data, info } = await sharp(buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const pixel = (x, y) => {
    const cx = Math.min(Math.max(x, 0), info.width - 1)
    const cy = Math.min(Math.max(y, 0), info.height - 1)
    const i = (cy * info.width + cx) * info.channels
    return { r: data[i], g: data[i + 1], b: data[i + 2] }
  }

  const results = []
  for (const item of items) {
    const samples = []
    const stepX = Math.max(1, Math.floor(item.w / 14))
    const stepY = Math.max(1, Math.floor(item.h / 6))
    for (let y = item.y + 1; y < item.y + item.h - 1; y += stepY) {
      for (let x = item.x + 1; x < item.x + item.w - 1; x += stepX) samples.push(pixel(x, y))
    }
    if (samples.length === 0) continue
    /* Median channel values: text covers a minority of a text run's box, so the
       median channel is the surface behind it. */
    const median = (channel) => samples.map((s) => s[channel]).sort((a, b) => a - b)[Math.floor(samples.length / 2)]
    const background = { r: median('r'), g: median('g'), b: median('b') }
    const ratio = contrast(item.color, background)
    results.push({ ...item, background, ratio: Number(ratio.toFixed(2)) })
  }

  const failures = results.filter((item) => item.ratio < (item.large ? 3 : 4.5))
  const groups = new Map()
  for (const item of results) {
    const key = `rgb(${item.color.r},${item.color.g},${item.color.b}) on rgb(${item.background.r},${item.background.g},${item.background.b})`
    const entry = groups.get(key) ?? { key, count: 0, fails: 0, worst: 99, sample: item.text, cls: item.cls, tag: item.tag }
    entry.count += 1
    if (item.ratio < (item.large ? 3 : 4.5)) entry.fails += 1
    entry.worst = Math.min(entry.worst, item.ratio)
    groups.set(key, entry)
  }
  const summary = {
    label,
    sampled: results.length,
    failures: failures.length,
    groups: [...groups.values()]
      .sort((a, b) => b.fails - a.fails || a.worst - b.worst)
      .slice(0, 14)
      .map((g) => `${g.fails}/${g.count} worst ${g.worst} ${g.tag}.${g.cls} "${g.sample}" | ${g.key}`),
  }
  console.log(JSON.stringify(summary, null, 2))
  if (failures.length > 0) {
    console.log(JSON.stringify(failures.map((i) => ({
      ratio: i.ratio, text: i.text, tag: i.tag, cls: i.cls,
      color: i.color, background: i.background, large: i.large,
    })), null, 2))
  }

  ws.close()
  chrome.kill()
  process.exitCode = failures.length > 0 ? 1 : 0
}

main().catch((error) => { console.error(error); process.exitCode = 2 })
