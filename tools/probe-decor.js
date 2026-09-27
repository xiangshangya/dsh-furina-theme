(() => {
  const hero = document.querySelector('[data-dsh-center-col] [data-phase="hero"]')
  const button = document.querySelector('button[class*="newSession"]')
  const sidebar = document.querySelector('[data-slot="sidebar"]') || document.querySelector('aside')
  const read = (el) => (el ? getComputedStyle(el) : null)
  return {
    newSessionBg: read(button)?.backgroundColor ?? 'none',
    newSessionBorder: read(button)?.borderTopColor ?? 'none',
    sidebarBg: read(sidebar)?.backgroundColor ?? 'none',
    sidebarImg: read(sidebar)?.backgroundImage.slice(0, 60) ?? 'none',
    sidebarFrost: read(sidebar)?.backdropFilter ?? 'none',
    heroBg: read(hero)?.backgroundColor ?? 'none',
    heroImg: read(hero)?.backgroundImage.slice(0, 150) ?? 'none',
    motesVar: getComputedStyle(document.body).getPropertyValue('--dmm-motes').trim().slice(0, 120),
  }
})()
