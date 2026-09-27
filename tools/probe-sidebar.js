(() => {
  const root = document.querySelector('[data-slot="sidebar"]') || document.querySelector('aside')
  if (!root) return { found: false }
  const rows = []
  const walk = (el, depth) => {
    if (depth > 7) return
    const rect = el.getBoundingClientRect()
    const style = getComputedStyle(el)
    const bg = style.backgroundColor
    const hasBg = bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent'
    const hasImg = style.backgroundImage !== 'none'
    if ((hasBg || hasImg) && rect.width > 8 && rect.height > 4) {
      rows.push({
        depth,
        tag: el.tagName,
        cls: (el.className || '').toString().slice(0, 48),
        bg,
        img: hasImg ? style.backgroundImage.slice(0, 40) : '',
        rect: [Math.round(rect.x), Math.round(rect.y), Math.round(rect.width), Math.round(rect.height)],
        text: (el.textContent || '').trim().slice(0, 18),
      })
    }
    for (const child of el.children) walk(child, depth + 1)
  }
  walk(root, 0)
  return {
    found: true,
    tokens: {
      fill: getComputedStyle(document.body).getPropertyValue('--dsw-specific-sidebar-fill').trim(),
      hover: getComputedStyle(document.body).getPropertyValue('--dsw-specific-sidebar-nav-item-hover').trim(),
      active: getComputedStyle(document.body).getPropertyValue('--dsw-specific-sidebar-nav-item-active').trim(),
      activeAccent: getComputedStyle(document.body).getPropertyValue('--dsw-specific-sidebar-nav-item-active-accent').trim(),
    },
    rows: rows.slice(0, 40),
  }
})()
