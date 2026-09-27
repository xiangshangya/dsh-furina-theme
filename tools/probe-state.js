(() => {
  const root = getComputedStyle(document.body)
  const tags = [...document.querySelectorAll('style[data-plugin]')].map((t) => t.dataset.plugin)
  const art = root.backgroundImage
  return {
    pluginTag: tags.filter((t) => t === 'dsh-theme-misty-morning').length,
    bootHasPlugin: (globalThis.__DSH_BOOT__?.entries ?? []).some((e) => e.id === 'dsh-theme-misty-morning'),
    bodyHasArt: art.includes('data:image/jpeg'),
    dark: document.body.hasAttribute('data-ds-dark-theme'),
    tokens: {
      bgBase: root.getPropertyValue('--dsw-alias-bg-base').trim(),
      layer1: root.getPropertyValue('--dsw-alias-bg-layer-1').trim(),
      labelPrimary: root.getPropertyValue('--dsw-alias-label-primary').trim(),
      labelSecondary: root.getPropertyValue('--dsw-alias-label-secondary').trim(),
      labelTertiary: root.getPropertyValue('--dsw-alias-label-tertiary').trim(),
      labelCaption: root.getPropertyValue('--dsw-alias-label-caption').trim(),
      brand: root.getPropertyValue('--dsw-alias-brand-primary').trim(),
      border: root.getPropertyValue('--dsw-alias-border-l2').trim(),
      sidebar: root.getPropertyValue('--dsw-specific-sidebar-fill').trim(),
      tokenCount: [...document.body.style].filter((n) => n.startsWith('--dsw-')).length,
    },
    phases: [...document.querySelectorAll('[data-phase]')].map((el) => el.getAttribute('data-phase')),
    cssVarProfile: root.getPropertyValue('--dmm-canvas').trim(),
  }
})()
