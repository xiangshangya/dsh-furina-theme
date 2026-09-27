/**
 * misty-morning for DeepSeek Harness — palette and token tables.
 *
 * `palette` holds the theme's own `--dmm-*` variables (the values this
 * stylesheet paints with). `tokens` holds the `--dsw-alias-*` /
 * `--dsw-specific-*` overrides handed to the DSH theme registry, which applies
 * them as inline custom properties on <body>. Both are keyed by colour scheme
 * because the DSH theme contract requires a value per scheme: the light side is
 * the published misty-morning palette, the dark side is the misty-night
 * companion derived from it so the theme stays legible under a dark preference.
 *
 * Source palette (codexthemes.ai "misty-morning" v0.4.7, mode light):
 *   canvas #F1F4F8 · surface #FFFFFF · text #2C3A4A · muted #5F7183
 *   accent #4C87B4 · border #D7E0E9 · focus #3C749C
 *   success #4E8E6B · warning #C08A3E · danger #C25B63
 *
 * Two deliberate deviations from the source palette, both contrast-driven, plus
 * one for accent fills:
 *
 * - #5F7183 (muted) measures 4.40:1 on the artwork-veiled hero surface and
 *   #C25B63 (danger) 3.73:1, both under the 4.5:1 AA floor for body-sized text.
 *   The shipped secondary (#405365) measures 4.86:1 and the error red
 *   (#A9454E) 5.04:1.
 * - The muted tiers are blue-grey steps beside the source theme's muted
 *   #5F7183: secondary #405365, tertiary #435668, caption #61758A. The
 *   published tiers (#6B7C8E / #8494A6) measured 3.07-4.48:1 where DSH paints
 *   timestamps, shortcut hints, section labels, the composer placeholder, and
 *   usage chips. Secondary and tertiary are dark enough to clear AA *directly
 *   over the illustration* — the sidebar rows carry no material of their own,
 *   so their backdrop reaches ~rgb(191,204,217) at the darkest artwork spots —
 *   while caption only ever lands on the light composer/card surfaces and keeps
 *   the source palette's value.
 * - White text on the source accent #4C87B4 measures 3.86:1, so every token
 *   that paints a filled accent control with light text (brand fill, primary
 *   button, business/active accent) uses the deeper #3A7199 (5.25:1); #4C87B4
 *   stays as the decoration accent (`--dmm-accent`, tints, caret). The same
 *   deeper blue is what accent-coloured *text* resolves to (links, the active
 *   tab label), where it measures 4.62:1 on the reading surfaces against
 *   4.43:1 for the source focus blue #3C749C.
 *
 * Decoration visibility and sidebar material: the source theme authored its
 * drifting motes as 0.14-0.20 gradient alphas inside a 0.45-opacity layer, over
 * a 1440px hero. DSH tiles that pattern across a much larger stage and paints
 * it at full alpha, so the same recipe reads as speckle: the alphas here are
 * cut to 0.05-0.08 (`scripts/build.mjs --no-motes` removes the pattern).
 * The window-wide veil and the stage veils are trimmed so the illustration
 * keeps Codex's colour strength, and the sidebar column re-paints the same
 * illustration so it shows through instead of being washed out by the window
 * veil. Rows stay fully transparent — nothing but the illustration sits behind
 * nav labels and timestamps.
 */

const lightPalette = {
  canvas: '#F1F4F8',
  surface: 'rgba(255, 255, 255, 0.90)',
  raised: '#FFFFFF',
  text: '#2C3A4A',
  muted: '#405365',
  faint: '#435668',
  caption: '#61758A',
  dimmed: '#C3CEDB',
  accent: '#4C87B4',
  accentDeep: '#3A7199',
  accentSoft: 'rgba(76, 135, 180, 0.16)',
  accentWash: '#E4EEF7',
  border: '#D7E0E9',
  borderSoft: 'rgba(44, 58, 74, 0.07)',
  borderStrong: 'rgba(44, 58, 74, 0.13)',
  borderHeavy: 'rgba(44, 58, 74, 0.24)',
  success: '#4E8E6B',
  successSoft: '#E3F1E8',
  warning: '#C08A3E',
  warningSoft: '#F7EEDF',
  danger: '#A9454E',
  dangerSoft: '#FBECEE',
  shadow: 'rgba(35, 50, 64, 0.12)',
  shadowSoft: 'rgba(35, 50, 64, 0.07)',
  terminalBackground: '#F1F4F8',
  terminalForeground: '#2C3A4A',
  /* Surface veils used over the artwork. */
  /* Window-wide veil (`--dsw-alias-bg-base`) plus the two stage veils. Kept low
     enough that the illustration keeps its own colour: Codex shows it at ~30%
     through one 70% veil, DSH stacks the window veil and a stage veil, so both
     were trimmed to land at the same strength. */
  veil: 'rgba(241, 244, 248, 0.58)',
  veilHero: 'rgba(241, 244, 248, 0.28)',
  veilRead: 'rgba(241, 244, 248, 0.72)',
  sidebar: 'rgba(240, 245, 251, 0.50)',
  sidebarWash: 'rgba(255, 255, 255, 0.06)',
  /* Flat veil painted *inside* the sidebar column, over its own copy of the
     illustration (see src/theme.css slot [4]). DSH puts a 70% window-wide veil
     between the body artwork and the column, so the column re-paints the same
     artwork and veils it here instead of stacking on top of that one. */
  sidebarVeil: 'rgba(241, 244, 248, 0.30)',
  /* The sidebar illustration is deliberately *sharp*: no blur, no brightness
     lift. Set a `backdrop-filter` value here (e.g.
     `blur(9px) saturate(1.14) brightness(1.10)`) to bring frosted glass back. */
  sidebarFrost: 'none',
  headerWash: 'rgba(241, 244, 248, 0.28)',
  popover: 'rgba(253, 254, 255, 0.97)',
  composer: 'rgba(255, 255, 255, 0.92)',
  /* Directional light gradient layered over the illustration. */
  artGradient:
    'linear-gradient(105deg, rgba(241,244,248,0.46) 0%, rgba(241,244,248,0.30) 45%, '
    + 'rgba(241,244,248,0.10) 72%, rgba(241,244,248,0.02) 100%)',
  /* Ambient light motes on the home stage. */
  motes:
    'radial-gradient(circle at 88% 12%, rgba(76,135,180,0.07) 0 2px, transparent 3px), '
    + 'radial-gradient(circle at 12% 22%, rgba(114,130,143,0.05) 0 1px, transparent 2px), '
    + 'radial-gradient(circle at 68% 58%, rgba(60,116,156,0.05) 0 3px, transparent 4px)',
}

const darkPalette = {
  canvas: '#141B25',
  surface: 'rgba(26, 35, 48, 0.88)',
  raised: '#1E2937',
  text: '#E7EEF7',
  muted: '#A3B4C6',
  faint: '#97A9BC',
  caption: '#8A9CB0',
  dimmed: '#3A4A5C',
  accent: '#7FB4DC',
  accentDeep: '#5E9AC6',
  accentSoft: 'rgba(127, 180, 220, 0.20)',
  accentWash: '#20303F',
  border: '#2E3D50',
  borderSoft: 'rgba(231, 238, 247, 0.07)',
  borderStrong: 'rgba(231, 238, 247, 0.14)',
  borderHeavy: 'rgba(231, 238, 247, 0.22)',
  success: '#6FAE8B',
  successSoft: '#1D3229',
  warning: '#D6A863',
  warningSoft: '#3A2F1D',
  danger: '#E08A90',
  dangerSoft: '#3A2126',
  shadow: 'rgba(0, 0, 0, 0.42)',
  shadowSoft: 'rgba(0, 0, 0, 0.24)',
  terminalBackground: '#141B25',
  terminalForeground: '#E7EEF7',
  veil: 'rgba(18, 25, 35, 0.52)',
  veilHero: 'rgba(18, 25, 35, 0.28)',
  veilRead: 'rgba(18, 25, 35, 0.66)',
  sidebar: 'rgba(16, 23, 33, 0.50)',
  sidebarVeil: 'rgba(18, 25, 35, 0.34)',
  sidebarWash: 'rgba(127, 180, 220, 0.06)',
  sidebarFrost: 'none',
  headerWash: 'rgba(18, 25, 35, 0.30)',
  popover: 'rgba(31, 42, 56, 0.97)',
  composer: 'rgba(30, 41, 55, 0.92)',
  artGradient:
    'linear-gradient(105deg, rgba(14,20,29,0.55) 0%, rgba(14,20,29,0.40) 45%, '
    + 'rgba(14,20,29,0.22) 72%, rgba(14,20,29,0.14) 100%)',
  motes:
    'radial-gradient(circle at 88% 12%, rgba(127,180,220,0.08) 0 2px, transparent 3px), '
    + 'radial-gradient(circle at 12% 22%, rgba(163,180,198,0.05) 0 1px, transparent 2px), '
    + 'radial-gradient(circle at 68% 58%, rgba(143,195,232,0.06) 0 3px, transparent 4px)',
}

export const palette = { light: lightPalette, dark: darkPalette }

/**
 * `--dsw-*` overrides, one table per colour scheme. Names are the semantic
 * aliases declared by `dsh-client-ui-theme`'s design-platform sheet; every
 * entry listed there that paints a surface, a border, text, or a state is
 * covered so no native grey survives the switch.
 */
export const tokens = {
  light: {
    /* Surfaces */
    '--dsw-alias-bg-base': lightPalette.veil,
    '--dsw-alias-bg-layer-1': lightPalette.surface,
    '--dsw-alias-bg-layer-2': 'rgba(255, 255, 255, 0.94)',
    '--dsw-alias-bg-layer-3': lightPalette.raised,
    '--dsw-alias-bg-overlay': lightPalette.popover,
    '--dsw-alias-bg-module-platform': 'rgba(244, 247, 251, 0.88)',
    '--dsw-alias-bg-multi-select': 'rgba(244, 247, 251, 0.92)',
    '--dsw-alias-bg-skeleton': 'rgba(44, 58, 74, 0.06)',
    '--dsw-alias-bg-document-preview': 'rgba(235, 240, 247, 0.94)',
    '--dsw-alias-bg-mask-1': 'rgba(35, 50, 64, 0.24)',
    '--dsw-alias-bg-mask-2': 'rgba(35, 50, 64, 0.12)',
    '--dsw-alias-bg-mask-3': 'rgba(35, 50, 64, 0.46)',
    '--dsw-alias-bg-mask-photo': 'rgba(20, 30, 40, 0.88)',
    '--dsw-alias-bg-mask-drop': 'rgba(255, 255, 255, 0.78)',
    /* Borders */
    '--dsw-alias-border-l1': lightPalette.borderSoft,
    '--dsw-alias-border-l2': lightPalette.borderStrong,
    '--dsw-alias-border-l2-darkmode-thin': 'rgba(44, 58, 74, 0.10)',
    '--dsw-alias-border-l3': 'rgba(44, 58, 74, 0.18)',
    '--dsw-alias-border-l4': lightPalette.borderHeavy,
    '--dsw-alias-border-inverted': 'rgba(0, 0, 0, 0)',
    '--dsw-alias-border-inverted2': 'rgba(0, 0, 0, 0)',
    /* Text and icons */
    '--dsw-alias-label-primary': lightPalette.text,
    '--dsw-alias-label-secondary': lightPalette.muted,
    '--dsw-alias-label-tertiary': lightPalette.faint,
    '--dsw-alias-label-caption': lightPalette.caption,
    '--dsw-alias-label-dimmed': lightPalette.dimmed,
    '--dsw-alias-label-primary-dimmed': '#22303F',
    '--dsw-alias-label-primary-foreground': '#FFFFFF',
    '--dsw-alias-label-primary-inverted': '#FFFFFF',
    '--dsw-alias-label-primary-bluish': '#2B4763',
    '--dsw-alias-label-document-preview': lightPalette.muted,
    '--dsw-alias-menu-icon': lightPalette.text,
    '--dsw-alias-link': lightPalette.accentDeep,
    '--dsw-focus-ring-color': lightPalette.accentDeep,
    /* Brand and buttons */
    '--dsw-alias-brand-primary': lightPalette.accentDeep,
    '--dsw-alias-brand-primary-invert': '#FFFFFF',
    '--dsw-alias-brand-primary-new-colorprimary-new-color': lightPalette.accentDeep,
    '--dsw-alias-brand-text': lightPalette.text,
    '--dsw-alias-button-primary-fill': lightPalette.accentDeep,
    '--dsw-alias-button-primary-hover': '#33648A',
    '--dsw-alias-button-primary-dimmed': '#C9D8E5',
    '--dsw-alias-button-contrast-fill': '#40566B',
    '--dsw-alias-button-elevated-fill': 'rgba(255, 255, 255, 0.66)',
    '--dsw-alias-button-floating-fill': 'rgba(253, 254, 255, 0.88)',
    '--dsw-alias-button-floating-hover': '#EAF0F7',
    '--dsw-alias-button-ghost-active-border': '#8FA6B8',
    '--dsw-alias-button-ghost-active-fill': '#E7EEF6',
    '--dsw-alias-button-ghost-active-hover': '#DDE7F1',
    '--dsw-alias-button-info-fill': lightPalette.accent,
    '--dsw-alias-button-info-hover': lightPalette.accentDeep,
    '--dsw-alias-button-tool-bar-fill': 'rgba(70, 96, 120, 0.50)',
    '--dsw-alias-button-tool-bar-fill-invisible': 'rgba(31, 41, 51, 0.36)',
    '--dsw-alias-button-tool-bar-hover': 'rgba(70, 96, 120, 0.60)',
    /* Interaction */
    '--dsw-alias-interactive-bg-hover': 'rgba(44, 58, 74, 0.06)',
    '--dsw-alias-interactive-bg-active': 'rgba(44, 58, 74, 0.10)',
    '--dsw-alias-interactive-bg-hover-accent': 'rgba(76, 135, 180, 0.14)',
    '--dsw-alias-interactive-bg-hover-danger': 'rgba(181, 79, 88, 0.08)',
    '--dsw-alias-interactive-bg-hover-solid': '#EAF0F7',
    /* Markdown and code */
    '--dsw-alias-markdown-code-block': 'rgba(247, 250, 253, 0.94)',
    '--dsw-alias-markdown-code-block-banner': 'rgba(240, 245, 250, 0.94)',
    '--dsw-alias-markdown-inline-code': '#EEF3F8',
    '--dsw-alias-markdown-code-segment-selected': '#FFFFFF',
    '--dsw-alias-markdown-code-segment-unselected': 'rgba(238, 243, 248, 0.90)',
    '--dsw-alias-markdown-citation': '#E7EEF6',
    '--dsw-alias-markdown-placeholder': 'rgba(244, 247, 251, 0.90)',
    '--dsw-alias-markdown-tag': '#E7EEF6',
    '--dsw-alias-code-diff-added': 'rgba(78, 142, 107, 0.14)',
    '--dsw-alias-code-diff-deleted': 'rgba(181, 79, 88, 0.14)',
    '--dsw-alias-file-diff-added-bg': '#E8F4EC',
    '--dsw-alias-file-diff-added-gutter': 'rgba(78, 142, 107, 0.16)',
    '--dsw-alias-file-diff-added-marker': lightPalette.success,
    '--dsw-alias-file-diff-deleted-bg': lightPalette.dangerSoft,
    '--dsw-alias-file-diff-deleted-gutter': 'rgba(181, 79, 88, 0.16)',
    '--dsw-alias-file-diff-deleted-marker': lightPalette.danger,
    /* States */
    '--dsw-alias-state-error-primary': lightPalette.danger,
    '--dsw-alias-state-error-secondary': '#D98A90',
    '--dsw-alias-state-success-primary': lightPalette.success,
    '--dsw-alias-state-success-secondary': '#6FAE8B',
    '--dsw-alias-state-success-tertiary': lightPalette.successSoft,
    '--dsw-alias-state-warn-primary': lightPalette.warning,
    '--dsw-alias-state-warn-secondary': '#D6A863',
    '--dsw-alias-state-warn-tertiary': lightPalette.warningSoft,
    '--dsw-alias-state-warn-label': '#A9762F',
    '--dsw-alias-state-business-primary': lightPalette.accentDeep,
    '--dsw-alias-state-business-tertiary': lightPalette.accentWash,
    '--dsw-alias-state-idle-primary': lightPalette.dimmed,
    /* Scrollbars, toasts, tooltips */
    '--dsw-alias-scrollbar-bg-l1': '#C9D6E2',
    '--dsw-alias-scrollbar-bg-l2': '#C9D6E2',
    '--dsw-alias-scrollbar-hover-l1': '#AFC2D3',
    '--dsw-alias-scrollbar-hover-l2': '#AFC2D3',
    '--dsw-alias-toast-bg': '#3A4C5E',
    '--dsw-alias-toast-label': '#FFFFFF',
    '--dsw-alias-tooltip-bg': '#3A4C5E',
    '--dsw-alias-tooltip-key-bg': 'rgba(255, 255, 255, 0.18)',
    /* Component-specific surfaces */
    '--dsw-specific-bubble': 'rgba(226, 238, 249, 0.92)',
    '--dsw-specific-bubble-highlight': 'rgba(206, 226, 244, 0.95)',
    '--dsw-specific-input-major': lightPalette.composer,
    '--dsw-specific-login-input': 'rgba(252, 253, 255, 0.92)',
    '--dsw-specific-menu': lightPalette.popover,
    '--dsw-specific-selector': 'rgba(240, 245, 250, 0.92)',
    '--dsw-specific-sidebar-fill': lightPalette.sidebar,
    '--dsw-specific-sidebar-nav-item-hover': 'rgba(44, 58, 74, 0.06)',
    '--dsw-specific-sidebar-nav-item-active': lightPalette.accentSoft,
    '--dsw-specific-sidebar-nav-item-active-accent': 'rgba(76, 135, 180, 0.22)',
    '--dsw-specific-tip': 'rgba(240, 245, 250, 0.94)',
    '--dsw-alias-settings-card-fill': 'rgba(255, 255, 255, 0.92)',
    '--dsw-alias-settings-card-stroke': 'rgba(44, 58, 74, 0.10)',
    /* Onboarding (the first-run credential dialog) */
    '--dsw-alias-onboarding-accent': lightPalette.accent,
    '--dsw-alias-onboarding-card-fill': 'rgba(255, 255, 255, 0.95)',
    '--dsw-alias-onboarding-secondary-fill': 'rgba(240, 245, 250, 0.92)',
    '--dsw-alias-onboarding-checkbox-border': '#C9D6E2',
    /* Depth */
    '--dsw-elevation-stroke-color': 'rgba(44, 58, 74, 0.14)',
    '--dsw-shadow-lv1': '0 2px 5px 0 rgba(35, 50, 64, 0.07)',
    '--dsw-shadow-lv2': '0 4px 14px 0 rgba(35, 50, 64, 0.06), 0 2px 8px 0 rgba(35, 50, 64, 0.05)',
    '--dsw-shadow-lv3': '0 0 1px 0 rgba(35, 50, 64, 0.20), 0 0 5px 0 rgba(35, 50, 64, 0.04), '
      + '0 14px 34px 0 rgba(35, 50, 64, 0.12)',
  },
  dark: {
    /* Surfaces */
    '--dsw-alias-bg-base': darkPalette.veil,
    '--dsw-alias-bg-layer-1': darkPalette.surface,
    '--dsw-alias-bg-layer-2': 'rgba(30, 40, 54, 0.92)',
    '--dsw-alias-bg-layer-3': 'rgba(33, 44, 59, 0.95)',
    '--dsw-alias-bg-overlay': darkPalette.popover,
    '--dsw-alias-bg-module-platform': 'rgba(24, 33, 45, 0.88)',
    '--dsw-alias-bg-multi-select': 'rgba(28, 38, 52, 0.92)',
    '--dsw-alias-bg-skeleton': 'rgba(231, 238, 247, 0.08)',
    '--dsw-alias-bg-document-preview': 'rgba(28, 38, 52, 0.94)',
    '--dsw-alias-bg-mask-1': 'rgba(0, 0, 0, 0.50)',
    '--dsw-alias-bg-mask-2': 'rgba(0, 0, 0, 0.20)',
    '--dsw-alias-bg-mask-3': 'rgba(0, 0, 0, 0.48)',
    '--dsw-alias-bg-mask-photo': 'rgba(0, 0, 0, 0.88)',
    '--dsw-alias-bg-mask-drop': 'rgba(23, 31, 42, 0.70)',
    /* Borders */
    '--dsw-alias-border-l1': darkPalette.borderSoft,
    '--dsw-alias-border-l2': darkPalette.borderStrong,
    '--dsw-alias-border-l2-darkmode-thin': 'rgba(231, 238, 247, 0.08)',
    '--dsw-alias-border-l3': 'rgba(231, 238, 247, 0.18)',
    '--dsw-alias-border-l4': darkPalette.borderHeavy,
    '--dsw-alias-border-inverted': 'rgba(0, 0, 0, 0)',
    '--dsw-alias-border-inverted2': 'rgba(0, 0, 0, 0)',
    /* Text and icons */
    '--dsw-alias-label-primary': darkPalette.text,
    '--dsw-alias-label-secondary': darkPalette.muted,
    '--dsw-alias-label-tertiary': darkPalette.faint,
    '--dsw-alias-label-caption': darkPalette.caption,
    '--dsw-alias-label-dimmed': darkPalette.dimmed,
    '--dsw-alias-label-primary-dimmed': '#D5E2EE',
    '--dsw-alias-label-primary-foreground': '#131B26',
    '--dsw-alias-label-primary-inverted': '#1B2534',
    '--dsw-alias-label-primary-bluish': '#CFE3F4',
    '--dsw-alias-label-document-preview': darkPalette.muted,
    '--dsw-alias-menu-icon': '#C6D5E4',
    '--dsw-alias-link': '#8FC3E8',
    '--dsw-focus-ring-color': '#8FC3E8',
    /* Brand and buttons */
    '--dsw-alias-brand-primary': '#A9D2EE',
    '--dsw-alias-brand-primary-invert': '#131B26',
    '--dsw-alias-brand-primary-new-colorprimary-new-color': darkPalette.accent,
    '--dsw-alias-brand-text': darkPalette.text,
    '--dsw-alias-button-primary-fill': '#A9D2EE',
    '--dsw-alias-button-primary-hover': '#CFE4F5',
    '--dsw-alias-button-primary-dimmed': 'rgba(169, 210, 238, 0.32)',
    '--dsw-alias-button-contrast-fill': darkPalette.text,
    '--dsw-alias-button-elevated-fill': 'rgba(38, 51, 63, 0.72)',
    '--dsw-alias-button-floating-fill': 'rgba(30, 41, 55, 0.88)',
    '--dsw-alias-button-floating-hover': '#26333F',
    '--dsw-alias-button-ghost-active-border': '#5A6E82',
    '--dsw-alias-button-ghost-active-fill': '#24313F',
    '--dsw-alias-button-ghost-active-hover': '#2C3B4B',
    '--dsw-alias-button-info-fill': darkPalette.accent,
    '--dsw-alias-button-info-hover': '#9CC8E8',
    '--dsw-alias-button-tool-bar-fill': 'rgba(84, 98, 116, 0.50)',
    '--dsw-alias-button-tool-bar-fill-invisible': 'rgba(31, 41, 51, 0.36)',
    '--dsw-alias-button-tool-bar-hover': 'rgba(84, 98, 116, 0.60)',
    /* Interaction */
    '--dsw-alias-interactive-bg-hover': 'rgba(231, 238, 247, 0.08)',
    '--dsw-alias-interactive-bg-active': 'rgba(231, 238, 247, 0.14)',
    '--dsw-alias-interactive-bg-hover-accent': 'rgba(127, 180, 220, 0.20)',
    '--dsw-alias-interactive-bg-hover-danger': 'rgba(224, 138, 144, 0.16)',
    '--dsw-alias-interactive-bg-hover-solid': '#24313F',
    /* Markdown and code */
    '--dsw-alias-markdown-code-block': 'rgba(24, 33, 45, 0.94)',
    '--dsw-alias-markdown-code-block-banner': 'rgba(30, 40, 54, 0.94)',
    '--dsw-alias-markdown-inline-code': 'rgba(38, 50, 66, 0.90)',
    '--dsw-alias-markdown-code-segment-selected': 'rgba(38, 50, 66, 0.92)',
    '--dsw-alias-markdown-code-segment-unselected': 'rgba(22, 31, 43, 0.90)',
    '--dsw-alias-markdown-citation': 'rgba(38, 50, 66, 0.90)',
    '--dsw-alias-markdown-placeholder': 'rgba(30, 40, 54, 0.90)',
    '--dsw-alias-markdown-tag': 'rgba(38, 50, 66, 0.90)',
    '--dsw-alias-code-diff-added': 'rgba(111, 174, 139, 0.18)',
    '--dsw-alias-code-diff-deleted': 'rgba(224, 138, 144, 0.18)',
    '--dsw-alias-file-diff-added-bg': '#1B2E24',
    '--dsw-alias-file-diff-added-gutter': 'rgba(111, 174, 139, 0.18)',
    '--dsw-alias-file-diff-added-marker': darkPalette.success,
    '--dsw-alias-file-diff-deleted-bg': '#33222A',
    '--dsw-alias-file-diff-deleted-gutter': 'rgba(224, 138, 144, 0.18)',
    '--dsw-alias-file-diff-deleted-marker': darkPalette.danger,
    /* States */
    '--dsw-alias-state-error-primary': darkPalette.danger,
    '--dsw-alias-state-error-secondary': darkPalette.danger,
    '--dsw-alias-state-success-primary': darkPalette.success,
    '--dsw-alias-state-success-secondary': darkPalette.success,
    '--dsw-alias-state-success-tertiary': darkPalette.successSoft,
    '--dsw-alias-state-warn-primary': darkPalette.warning,
    '--dsw-alias-state-warn-secondary': darkPalette.warning,
    '--dsw-alias-state-warn-tertiary': darkPalette.warningSoft,
    '--dsw-alias-state-warn-label': darkPalette.warning,
    '--dsw-alias-state-business-primary': darkPalette.accent,
    '--dsw-alias-state-business-tertiary': darkPalette.accentWash,
    '--dsw-alias-state-idle-primary': darkPalette.dimmed,
    /* Scrollbars, toasts, tooltips */
    '--dsw-alias-scrollbar-bg-l1': '#46586C',
    '--dsw-alias-scrollbar-bg-l2': '#52667B',
    '--dsw-alias-scrollbar-hover-l1': '#5A6E82',
    '--dsw-alias-scrollbar-hover-l2': '#68809A',
    '--dsw-alias-toast-bg': '#2A3644',
    '--dsw-alias-toast-label': '#FFFFFF',
    '--dsw-alias-tooltip-bg': '#2A3644',
    '--dsw-alias-tooltip-key-bg': 'rgba(255, 255, 255, 0.18)',
    /* Component-specific surfaces */
    '--dsw-specific-bubble': 'rgba(38, 55, 74, 0.90)',
    '--dsw-specific-bubble-highlight': 'rgba(48, 70, 94, 0.94)',
    '--dsw-specific-input-major': darkPalette.composer,
    '--dsw-specific-login-input': 'rgba(24, 33, 45, 0.92)',
    '--dsw-specific-menu': darkPalette.popover,
    '--dsw-specific-selector': 'rgba(30, 40, 54, 0.92)',
    '--dsw-specific-sidebar-fill': darkPalette.sidebar,
    '--dsw-specific-sidebar-nav-item-hover': 'rgba(231, 238, 247, 0.07)',
    '--dsw-specific-sidebar-nav-item-active': 'rgba(127, 180, 220, 0.18)',
    '--dsw-specific-sidebar-nav-item-active-accent': 'rgba(127, 180, 220, 0.26)',
    '--dsw-specific-tip': 'rgba(30, 40, 54, 0.94)',
    '--dsw-alias-settings-card-fill': 'rgba(30, 40, 54, 0.92)',
    '--dsw-alias-settings-card-stroke': 'rgba(231, 238, 247, 0.10)',
    /* Onboarding */
    '--dsw-alias-onboarding-accent': darkPalette.accent,
    '--dsw-alias-onboarding-card-fill': 'rgba(31, 42, 56, 0.95)',
    '--dsw-alias-onboarding-secondary-fill': 'rgba(26, 35, 48, 0.92)',
    '--dsw-alias-onboarding-checkbox-border': '#46586C',
    /* Depth */
    '--dsw-elevation-stroke-color': 'rgba(231, 238, 247, 0.14)',
    '--dsw-shadow-lv1': '0 2px 5px 0 rgba(0, 0, 0, 0.30)',
    '--dsw-shadow-lv2': '0 4px 14px 0 rgba(0, 0, 0, 0.26), 0 2px 8px 0 rgba(0, 0, 0, 0.22)',
    '--dsw-shadow-lv3': '0 0 1px 0 rgba(0, 0, 0, 0.50), 0 0 5px 0 rgba(0, 0, 0, 0.20), '
      + '0 14px 34px 0 rgba(0, 0, 0, 0.42)',
  },
}

/** CSS custom properties (`--dmm-*`) this stylesheet paints with, per scheme. */
export function paletteVariables(scheme, artUrl) {
  const p = palette[scheme]
  return {
    '--dmm-canvas': p.canvas,
    '--dmm-surface': p.surface,
    '--dmm-raised': p.raised,
    '--dmm-text': p.text,
    '--dmm-muted': p.muted,
    '--dmm-accent': p.accent,
    '--dmm-accent-deep': p.accentDeep,
    '--dmm-accent-soft': p.accentSoft,
    '--dmm-border': p.border,
    '--dmm-focus': p.accentDeep,
    '--dmm-shadow': p.shadow,
    '--dmm-veil': p.veil,
    '--dmm-veil-hero': p.veilHero,
    '--dmm-veil-read': p.veilRead,
    '--dmm-sidebar-wash': p.sidebarWash,
    '--dmm-sidebar-veil': p.sidebarVeil,
    '--dmm-sidebar-frost': p.sidebarFrost,
    '--dmm-header-wash': p.headerWash,
    '--dmm-term-bg': p.terminalBackground,
    '--dmm-term-fg': p.terminalForeground,
    '--dmm-art-gradient': p.artGradient,
    '--dmm-motes': p.motes,
    '--dmm-art': `url("${artUrl}")`,
  }
}
