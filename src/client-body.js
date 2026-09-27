/**
 * misty-morning for DeepSeek Harness — browser half.
 *
 * Two contributions, both owned by this plugin's fiber and both retracted when
 * it unloads:
 *
 *   1. One plugin-owned global stylesheet holding the artwork canvas, the
 *      surface veils, and the non-interactive decoration.
 *   2. One alias-token layer stacked through `ctx.theme.overrideTokens`, so the
 *      theme composes over whichever built-in preference the user picked and
 *      every DSH surface that paints itself from a `--dsw-alias-*` token
 *      follows without a component selector.
 *
 * The theme never writes the durable preference: it is a layer, not a scheme.
 * `ctx.theme` supplies the token contract; this half owns the artwork.
 */

/** Install the plugin-owned global stylesheet for exactly this plugin's lifetime. */
function installStylesheet(ctx) {
  if (typeof document === 'undefined') return
  ctx.effect(() => {
    const tag = document.createElement('style')
    tag.dataset.plugin = PLUGIN_ID
    tag.dataset.pluginCss = PLUGIN_ID + '/misty-morning.css'
    tag.textContent = THEME_CSS
    document.head.appendChild(tag)
    return () => { tag.remove() }
  }, 'misty-morning: theme stylesheet')
}

/**
 * Fold the two scheme tables into the `{ light, dark }` pairs the theme
 * registry validates. Both tables are built from one key set, so a missing
 * counterpart is a build error, not a runtime one.
 * @returns Override layer keyed by token name.
 */
function overrideLayer() {
  const layer = {}
  for (const name of Object.keys(LIGHT_TOKENS)) {
    layer[name] = { light: LIGHT_TOKENS[name], dark: DARK_TOKENS[name] }
  }
  return layer
}

exports.name = PLUGIN_ID
/** The theme service owns the token contract this layer stacks on. */
exports.inject = ['theme']
exports.apply = function apply(ctx) {
  installStylesheet(ctx)
  ctx.effect(() => ctx.theme.overrideTokens(PLUGIN_ID, overrideLayer()), 'misty-morning: alias token layer')
}
