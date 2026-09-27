/**
 * Attach to an already-running Electron/Chromium target (the DSH desktop app
 * launched with --remote-debugging-port=<port>) and capture evidence from the
 * real app: computed styles, theme markers, and a PNG screenshot.
 *
 * Usage:
 *   node attach-shot.cjs --port 9333 [--url <substring>] [--png <file>]
 *                        [--click-selector <css>] [--settle <ms>]
 *                        [--eval "<js>" | --eval-file <file>] [--eval-out <file>]
 *                        [--width 1440 --height 900] [--wait 4000]
 */
const fs = require('node:fs')

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
const port = Number(args.port ?? 9333)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function findTarget() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()
      const pages = list.filter((t) => t.type === 'page' && t.webSocketDebuggerUrl)
      const wanted = args.url
        ? pages.find((p) => (p.url || '').includes(args.url))
        : pages.find((p) => (p.url || '').startsWith('http://127.0.0.1'))
      if (wanted) return wanted
    } catch { /* endpoint not up yet */ }
    await sleep(500)
  }
  throw new Error(`no matching page target on 127.0.0.1:${port}`)
}

async function main() {
  const target = await findTarget()
  const ws = new WebSocket(target.webSocketDebuggerUrl)
  let seq = 0
  const pending = new Map()
  ws.addEventListener('message', (event) => {
    const msg = JSON.parse(event.data)
    if (msg.id === undefined) return
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
  if (args.width && args.height) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: Number(args.width), height: Number(args.height), deviceScaleFactor: 1, mobile: false,
    })
  }
  await sleep(Number(args.wait ?? 4000))

  const out = { target: target.url }
  if (args['click-selector']) {
    // Real mouse events (not element.click()) so React handlers that listen on
    // the row itself see a trustworthy pointer sequence.
    const box = await send('Runtime.evaluate', {
      expression: `(() => { const el = document.querySelector(${JSON.stringify(args['click-selector'])}); if (!el) return null; const r = el.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; })()`,
      returnByValue: true,
    })
    const point = box.result?.result?.value
    if (!point) throw new Error(`click selector matched nothing: ${args['click-selector']}`)
    for (const type of ['mousePressed', 'mouseReleased']) {
      await send('Input.dispatchMouseEvent', {
        type, x: point.x, y: point.y, button: 'left', clickCount: 1,
      })
    }
    out.clicked = [Math.round(point.x), Math.round(point.y)]
    await sleep(Number(args.settle ?? 2500))
  }
  const expression = args['eval-file'] ? fs.readFileSync(args['eval-file'], 'utf8') : args.eval
  if (expression) {
    const evaluated = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })
    const value = evaluated.result?.result?.value ?? evaluated.result
    if (args['eval-out']) fs.writeFileSync(args['eval-out'], typeof value === 'string' ? value : JSON.stringify(value, null, 2), 'utf8')
    else out.eval = value
  }
  if (args.png) {
    const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
    fs.writeFileSync(args.png, Buffer.from(shot.result.data, 'base64'))
    out.png = args.png
  }

  console.log(JSON.stringify(out, null, 2))
  ws.close()
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
