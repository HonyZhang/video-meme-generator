// 字体相关工具方法
import type { TextItem } from '@/types/textItems';

export async function loadFonts(fonts: string[]) {
  await Promise.all(fonts.map((f) => document.fonts.load(`10px "${f}"`)));
}

// 根据文本项批量加载字体
export async function loadFontsFromTextItems(items: TextItem[]) {
  const fontSet = new Set<string>();
  const defaultFont = 'sans-serif';
  items.forEach((item) => {
    const font = item.fontFamily || defaultFont;
    fontSet.add(font);
  });
  await Promise.all(Array.from(fontSet).map((font) => document.fonts.load(`10px "${font}"`)));
}

// 这里可以扩展更多字体相关的工具函数
