(() => {
  const label = [...document.querySelectorAll('span[class*="sectionLabel"]')]
    .find((el) => el.textContent.trim().length > 0)
  if (!label) return { found: false }
  const chain = []
  let node = label
  for (let i = 0; i < 6 && node; i += 1) {
    const style = getComputedStyle(node)
    const rect = node.getBoundingClientRect()
    chain.push({
      tag: node.tagName,
      cls: (node.className || '').toString().slice(0, 46),
      role: node.getAttribute('role'),
      bg: style.backgroundColor,
      img: style.backgroundImage === 'none' ? 'none' : style.backgroundImage.slice(0, 40),
      rect: [Math.round(rect.x), Math.round(rect.y), Math.round(rect.width), Math.round(rect.height)],
    })
    node = node.parentElement
  }
  return { found: true, text: label.textContent.trim(), chain }
})()
