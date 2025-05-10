export function remToPx(rem: number): number {
  const remPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  return rem * remPx;
}
