/**
 * Next.js `router.replace` cannot load cross-origin URLs; use a full page navigation instead.
 */
export function replaceAuthDestination(
  path: string,
  routerReplace: (href: string) => void
): void {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    window.location.href = path;
    return;
  }
  routerReplace(path);
}
