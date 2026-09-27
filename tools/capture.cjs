/**
 * Minimal CDP driver: open a URL in headless Chrome, wait for the app to
 * settle, then dump the DOM and/or capture a PNG screenshot.
 *
 * Usage:
 *   node cdp-shot.cjs --url <url> [--png <file>] [--dom <file>] [--width 1440]
 *                     [--height 900] [--wait 6000] [--eval "<js>"] [--eval-out <file>]
 *                     [--click "<js>"] [--port 9333] [--settle 1500]
 */
const { spawn } = require('node:child_process')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')

const CHROME = process.env.CHROME_PATH
  || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

function parseArgs(argv) {
  const out = {}
  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i]
    if (!key.startsWith('--')) continue
    const name = key.slice(2)
    const next = argv[i + 1]
    if (next === undefined || next.startsWith('--')) { out[name] = true; continue }
    out[name] = next
    i += 1
  }
  return out
}

const args = parseArgs(process.argv.slice(2))
const url = args.url
if (!url) throw new Error('--url is required')
const width = Number(args.width ?? 1440)
const height = Number(args.height ?? 900)
const waitMs = Number(args.wait ?? 6000)
const settleMs = Number(args.settle ?? 1500)
const port = Number(args.port ?? 9333)
const profileDir = path.join(os.tmpdir(), `cdp-profile-${port}`)

const chrome = spawn(CHROME, [
  '--headless=new',
  '--disable-gpu',
  '--no-first-run',
  '--no-default-browser-check',
  '--disable-extensions',
  '--disable-background-networking',
  '--hide-scrollbars',
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profileDir}`,
  `--window-size=${width},${height}`,
  'about:blank',
], { stdio: 'ignore' })

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function findPageTarget() {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/list`)
      const list = await response.json()
      const page = list.find((t) => t.type === 'page' && t.webSocketDebuggerUrl)
      if (page) return page
    } catch { /* chrome not listening yet */ }
    await sleep(200)
  }
  throw new Error('chrome debugging endpoint never appeared')
}

async function main() {
  const target = await findPageTarget()
  const ws = new WebSocket(target.webSocketDebuggerUrl)
  let seq = 0
  const pending = new Map()
  const events = []
  ws.addEventListener('message', (event) => {
    const msg = JSON.parse(event.data)
    if (msg.id !== undefined) {
      const entry = pending.get(msg.id)
      if (entry) { pending.delete(msg.id); entry(msg) }
      return
    }
    events.push(msg)
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
  await send('Emulation.setDeviceMetricsOverride', {
    width, height, deviceScaleFactor: 1, mobile: false,
  })
  await send('Page.navigate', { url })
  await sleep(waitMs)

  const results = {}
  if (args['pre-eval']) {
    await send('Runtime.evaluate', { expression: fs.readFileSync(args['pre-eval'], 'utf8'), returnByValue: true })
  }
  if (args.click || args['click-file']) {
    const clickExpression = args['click-file'] ? fs.readFileSync(args['click-file'], 'utf8') : args.click
    const clicked = await send('Runtime.evaluate', { expression: clickExpression, awaitPromise: true, returnByValue: true })
    results.click = clicked.result?.result?.value ?? clicked.result
    await sleep(settleMs)
  }

  const expression = args['eval-file'] ? fs.readFileSync(args['eval-file'], 'utf8') : args.eval
  if (expression) {
    const evaluated = await send('Runtime.evaluate', {
      expression, awaitPromise: true, returnByValue: true,
    })
    const value = evaluated.result?.result?.value ?? evaluated.result
    if (args['eval-out']) fs.writeFileSync(args['eval-out'], typeof value === 'string' ? value : JSON.stringify(value, null, 2), 'utf8')
    else results.eval = value
  }
  if (args.dom) {
    const dom = await send('Runtime.evaluate', {
      expression: 'document.documentElement.outerHTML', returnByValue: true,
    })
    fs.writeFileSync(args.dom, String(dom.result?.result?.value ?? ''), 'utf8')
  }
  if (args.png) {
    const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
    fs.writeFileSync(args.png, Buffer.from(shot.result.data, 'base64'))
  }

  console.log(JSON.stringify({
    title: (await send('Runtime.evaluate', { expression: 'document.title', returnByValue: true })).result?.result?.value,
    results,
  }, null, 2))

  ws.close()
  chrome.kill()
}

main().catch((error) => {
  console.error(error)
  chrome.kill()
  process.exitCode = 1
})
