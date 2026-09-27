(() => {
  const start = document.querySelector('[data-slot="sidebar"]')
  const describe = (el) => {
    if (!el) return null
    const style = getComputedStyle(el)
    const rect = el.getBoundingClientRect()
    return {
      tag: el.tagName,
      cls: (el.className || '').toString().slice(0, 44),
      slot: el.getAttribute('data-slot'),
      bg: style.backgroundColor,
      img: style.backgroundImage === 'none' ? 'none' : style.backgroundImage.slice(0, 46),
      frost: style.backdropFilter,
      rect: [Math.round(rect.x), Math.round(rect.y), Math.round(rect.width), Math.round(rect.height)],
    }
  }
  const ancestors = []
  let node = start
  for (let i = 0; i < 4 && node; i += 1) { ancestors.push(describe(node)); node = node.parentElement }
  const inner = []
  if (start) {
    const stack = [[start, 0]]
    while (stack.length && inner.length < 12) {
      const [el, depth] = stack.shift()
      if (depth > 2) continue
      for (const child of el.children) {
        if (child.getBoundingClientRect().width < 60) continue
        const d = describe(child)
        d.depth = depth + 1
        inner.push(d)
        stack.push([child, depth + 1])
      }
    }
  }
  return { ancestors, inner }
})()
