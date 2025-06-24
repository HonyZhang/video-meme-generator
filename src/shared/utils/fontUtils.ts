import type { TextItem } from '~shared/types/textItems'





/**
 * 根据画布高度计算默认字体大小
 * @param canvasHeight 画布高度
 * @returns 默认字体大小
 */
export function getDefaultFontSize(canvasHeight: number): number {
  return Math.floor(canvasHeight / 8)
}

export async function loadFonts(fonts: string[]) {
  await Promise.all(fonts.map((f) => document.fonts.load(`10px "${f}"`)))
}

// 根据文本项批量加载字体
export async function loadFontsFromTextItems(items: TextItem[]) {
  const fontSet = new Set<string>()
  const defaultFont = 'sans-serif'
  items.forEach((item) => {
    const font = item.fontFamily || defaultFont
    fontSet.add(font)
  })
  await Promise.all(
    Array.from(fontSet).map((font) => document.fonts.load(`10px "${font}"`))
  )
}
