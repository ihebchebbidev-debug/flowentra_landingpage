/**
 * Screenshot/image source resolution.
 *
 * Managed screenshots (hero + product showcase) are served from the backend so
 * the admin Screenshots Manager can upload/replace/delete them and have changes
 * go live instantly. The frontend's bundled copies in /public act as a fallback
 * when the backend is unreachable or a file was removed.
 *
 * Usage:
 *   <img
 *     src={managedImg(path)}
 *     data-local={path}
 *     onError={localFallback}
 *   />
 */

// Origin that serves the managed image folders (the PHP backend behind Nginx).
// Override at build time with VITE_SCREENSHOT_BASE_URL if the backend moves.
export const SCREENSHOT_BASE =
  import.meta.env.VITE_SCREENSHOT_BASE_URL || "https://backend.flowentra.io";

/** Prefix a relative "/hero-screenshots/x.png" path with the backend origin. */
export function managedImg(path?: string): string | undefined {
  if (!path) return path;
  if (/^https?:\/\//i.test(path) || path.startsWith("data:")) return path; // already absolute
  return `${SCREENSHOT_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
}

/**
 * onError handler: if the backend image fails, fall back once to the local
 * /public copy stored in the element's `data-local` attribute.
 * Returns true if it switched to the local copy (so callers can stop there).
 */
export function localFallback(e: React.SyntheticEvent<HTMLImageElement>): boolean {
  const img = e.currentTarget;
  const local = img.getAttribute("data-local");
  if (local && !img.dataset.triedLocal) {
    img.dataset.triedLocal = "1";
    img.src = local;
    return true;
  }
  return false;
}
