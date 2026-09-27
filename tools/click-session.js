(() => {
  const rows = [...document.querySelectorAll('div[role="treeitem"], div[class*="sessionRow"]')]
    .filter((el) => el.getBoundingClientRect().width > 40 && el.textContent.trim())
  const row = rows.find((el) => el.textContent.includes('适配')) || rows[1] || rows[0]
  if (!row) return 'no session row found'
  const rect = row.getBoundingClientRect()
  const init = {
    bubbles: true,
    cancelable: true,
    composed: true,
    clientX: rect.x + rect.width / 2,
    clientY: rect.y + rect.height / 2,
    button: 0,
    buttons: 1,
  }
  for (const type of ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click']) {
    const Event = type.startsWith('pointer') ? PointerEvent : MouseEvent
    row.dispatchEvent(new Event(type, init))
  }
  return 'dispatched on: ' + row.className.toString().slice(0, 40)
})()
