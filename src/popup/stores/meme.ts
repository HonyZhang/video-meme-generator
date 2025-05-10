import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { TextItem } from '@/types/textItems';

export const useMemeStore = defineStore('meme', () => {
  const image = ref<string | null>(null);
  const textItems = ref<TextItem[]>([]);
  const downloadTrigger = ref(0);
  const imageWidth = ref(0);
  const imageHeight = ref(0);
  const margin = ref<number>(0);

  function clear() {
    image.value = null;
    textItems.value = [];
    imageWidth.value = 0;
    imageHeight.value = 0;
    margin.value = 0;
  }

  function triggerDownload() {
    downloadTrigger.value++;
  }

  function resetDownloadTrigger() {
    downloadTrigger.value = 0;
  }

  return {
    image,
    textItems,
    downloadTrigger,
    imageWidth,
    imageHeight,
    margin,
    clear,
    triggerDownload,
    resetDownloadTrigger,
  };
});
