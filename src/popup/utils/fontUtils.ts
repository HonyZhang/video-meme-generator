/**
 * 根据画布高度计算默认字体大小
 * @param canvasHeight 画布高度
 * @returns 默认字体大小
 */
export function getDefaultFontSize(canvasHeight: number): number {
  return Math.floor(canvasHeight / 12);
}
