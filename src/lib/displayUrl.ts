/**
 * Admin-only URL display masking.
 *
 * The CMS backend physically lives on luccibyey.com.tn, but admins should
 * only ever *see* the brand domain (flowentra.io). These helpers swap the
 * host for display purposes without touching what's stored or fetched.
 *
 * - `toDisplayUrl(real)`  → string the admin should see (flowentra.io/...)
 * - `toRealUrl(display)`  → string we should store/fetch (luccibyey.com.tn/...)
 *
 * Both are idempotent and safe to call on empty / non-URL values.
 */

const REAL_HOST = "https://luccibyey.com.tn/flowentra";
const DISPLAY_HOST = "https://flowentra.io";

// Also handle the bare host (no /flowentra path) just in case.
const REAL_HOST_BARE = "https://luccibyey.com.tn";

export function toDisplayUrl(value: string | null | undefined): string {
  if (!value) return "";
  let v = value;
  if (v.startsWith(REAL_HOST)) {
    v = DISPLAY_HOST + v.slice(REAL_HOST.length);
  } else if (v.startsWith(REAL_HOST_BARE)) {
    v = DISPLAY_HOST + v.slice(REAL_HOST_BARE.length);
  }
  return v;
}

export function toRealUrl(value: string | null | undefined): string {
  if (!value) return "";
  if (value.startsWith(DISPLAY_HOST)) {
    return REAL_HOST + value.slice(DISPLAY_HOST.length);
  }
  return value;
}
