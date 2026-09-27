/**
 * misty-morning for DeepSeek Harness — host half.
 *
 * The theme is entirely a browser-side layer: a plugin-owned stylesheet plus
 * one `--dsw-*` alias-token layer. This host half exists so the Loader row
 * mounts like any other plugin and `dsh-client-modules` can resolve the
 * package's `./client` bundle from the same row.
 */

/** Plugin name shown in the Loader's entry tree. */
export const name = 'dsh-theme-misty-morning'

/** No host-side behavior: the browser half owns the whole theme. */
export function apply() {}
