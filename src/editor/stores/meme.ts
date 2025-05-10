import { defineStore } from 'pinia';
import type { TextItem } from '@/types/textItems';

export const useMemeStore = defineStore('meme', () => {
  // 图片 base64
  const image = ref<string | null>(null);
  // 文字项数组
  const textItems = ref<TextItem[]>([]);
  // 缩放比例
  const scale = ref<number>(1);
  /**
   * imgBox 用于记录图片在画布中的像素级位置和尺寸，
   * 便于拖拽、缩放、定位等操作在多个组件间共享。
   * left/top/width/height 单位均为 px。
   */
  const imgBox = ref<{ left: number; top: number; width: number; height: number }>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });

  function clear() {
    image.value = null;
    textItems.value = [];
    imgBox.value = { left: 0, top: 0, width: 0, height: 0 };
  }

  return {
    image,
    textItems,
    scale,
    imgBox,
    clear,
  };
});
