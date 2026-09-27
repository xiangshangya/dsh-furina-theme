(() => {
  const el = document.querySelector('[data-slot="sidebar"] > div') || document.querySelector('[data-slot="sidebar"]')
  if (!el) return 'no sidebar element'
  el.style.setProperty('background', 'none', 'important')
  el.style.setProperty('background-image', 'none', 'important')
  el.style.setProperty('backdrop-filter', 'none', 'important')
  const inner = el.querySelector('*')
  const innerRead = inner ? getComputedStyle(inner).backgroundColor : 'n/a'
  return {
    cleared: el.className.toString().slice(0, 40),
    computedBgAfter: getComputedStyle(el).backgroundColor,
    childBg: innerRead,
  }
})()
