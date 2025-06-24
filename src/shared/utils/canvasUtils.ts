/**
 * 设置高清 Canvas 绘图环境，适配高 DPI 屏幕（如 Retina）
 *
 * @param canvas HTMLCanvasElement 实例
 * @param clear 是否在设置后清除画布内容，默认 true
 * @returns [ctx, dpr] 绘图上下文和缩放倍率
 */
export function setupHiDPICanvas(
  canvas: HTMLCanvasElement,
  naturalWidth: number,
  naturalHeight: number,
  clear: boolean = true
): CanvasRenderingContext2D | null {
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const dpr = window.devicePixelRatio || 1

  canvas.width = naturalWidth * dpr
  canvas.height = naturalHeight * dpr

  ctx.scale(dpr, dpr)

  if (clear) {
    ctx.clearRect(0, 0, naturalWidth, naturalHeight)
  }

  return ctx
}
