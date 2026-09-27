(() => {
  const rows = [...document.querySelectorAll('[data-slot="sidebar"] [role="treeitem"]')].slice(0, 4)
  const overflow = document.querySelector('[data-slot="sidebar"] [class*="sessionOverflowButton"]')
  const describe = (el) => {
    if (!el) return null
    const style = getComputedStyle(el)
    const rect = el.getBoundingClientRect()
    return {
      cls: (el.className || '').toString().slice(0, 40),
      bgImage: style.backgroundImage === 'none' ? 'none' : style.backgroundImage.slice(0, 54),
      bg: style.backgroundColor,
      radius: style.borderTopLeftRadius,
      rect: [Math.round(rect.x), Math.round(rect.y), Math.round(rect.width), Math.round(rect.height)],
    }
  }
  return {
    rowCount: document.querySelectorAll('[data-slot="sidebar"] [role="treeitem"]').length,
    rows: rows.map(describe),
    overflow: describe(overflow),
    sectionHeader: describe(document.querySelector('[data-slot="sidebar"] [class*="sectionHeader"]')),
  }
})()
