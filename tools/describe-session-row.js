(() => {
  const spans = [...document.querySelectorAll('span[class*="_title"]')]
    .filter((el) => el.textContent.trim() && el.getBoundingClientRect().width > 40)
  const row = spans.find((el) => el.textContent.includes('适配'))
  if (!row) return { found: false, titles: spans.map((s) => s.textContent.trim()).slice(0, 6) }
  const chain = []
  let node = row
  for (let i = 0; i < 6 && node; i += 1) {
    const rect = node.getBoundingClientRect()
    chain.push({
      tag: node.tagName,
      cls: (node.className || '').toString().slice(0, 60),
      role: node.getAttribute('role'),
      attrs: [...node.attributes].map((a) => a.name).filter((n) => n.startsWith('data-')).slice(0, 6),
      rect: [Math.round(rect.x), Math.round(rect.y), Math.round(rect.width), Math.round(rect.height)],
    })
    node = node.parentElement
  }
  return { found: true, text: row.textContent.trim().slice(0, 30), chain }
})()
