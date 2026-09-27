(() => ({
  href: location.href,
  title: document.title,
  phases: [...document.querySelectorAll('[data-phase]')].map((el) => el.getAttribute('data-phase')),
  centerPhase: document.querySelector('[data-dsh-center-col] [data-phase]')?.getAttribute('data-phase') ?? 'none',
}))()
