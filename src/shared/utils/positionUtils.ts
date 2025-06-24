import type { TextItem } from '~shared/types/textItems'

/**
 * 根据 position 计算其在 canvas 上的 x, y 坐标
 * @param position 'top' | 'middle' | 'bottom'
 * @param canvasWidth 画布宽度
 * @param canvasHeight 画布高度
 * @param textItem 文字项，包含text/fontSize/fontFamily等
 * @param margin 边距
 * @returns { x: number, y: number }
 */
export function getTextItemPosition(
  textItem: TextItem,
  imageElement: HTMLImageElement,
  imagePadding: number
): { x: number; y: number } {
  // 计算文本宽度
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  ctx.font = `${textItem.fontSize}px ${textItem.fontFamily}`
  const textWidth = ctx.measureText(textItem.text).width

  // 水平居中
  const x = (imageElement.width - textWidth) / 2 + imagePadding
  let y: number
  switch (textItem.position) {
    case 'top':
      y = imagePadding
      break
    case 'middle':
      y = (imageElement.height - textItem.fontSize) / 2
      break
    case 'bottom':
      y = imageElement.height - textItem.fontSize - imagePadding
      break
    default:
      y = imagePadding
  }
  return { x, y }
}
