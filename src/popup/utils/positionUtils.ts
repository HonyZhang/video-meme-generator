import type { TextItem } from '@/types/textItems';

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
  canvasWidth: number,
  canvasHeight: number,
  margin: number
): { x: number; y: number } {
  // 计算文本宽度
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  ctx.font = `${textItem.fontSize}px ${textItem.fontFamily}`;
  const textWidth = ctx.measureText(textItem.text).width;

  // 水平居中
  const x = (canvasWidth - textWidth) / 2;
  let y: number;
  switch (textItem.position) {
    case 'top':
      y = margin;
      break;
    case 'middle':
      y = (canvasHeight - textItem.fontSize) / 2;
      break;
    case 'bottom':
      y = canvasHeight - textItem.fontSize - margin;
      break;
    default:
      y = margin;
  }
  return { x, y };
}
