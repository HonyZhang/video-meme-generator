<template>
  <div v-if="!!imageRef" class="w-full aspect-square bg-gray-100 flex items-center justify-center">
    <canvas
      ref="canvasEl"
      :width="imageRef.width"
      :height="imageRef.height"
      class="max-w-full max-h-full"
    />
  </div>
  <p v-else class="text-red-500 text-sm text-center">
    ❌ 当前页面未检测到视频，请打开含视频的页面后再试
  </p>
</template>

<script setup lang="ts">
import { useMemeStore } from '../stores/meme';
import { ref } from 'vue';
import { loadImage } from '@/popup/utils/imageUtils.ts';

const { image, textItems, imageWidth, imageHeight, margin, downloadTrigger } =
  storeToRefs(useMemeStore());
const { resetDownloadTrigger } = useMemeStore();
const canvasEl = ref<HTMLCanvasElement | null>(null);
const imageRef = ref<HTMLImageElement | null>(null);

// 监听图片变化，只在图片加载完成后绘制一次并存储宽高
watch(image, async (val) => {
  console.log('image变化', val);
  if (val) {
    imageRef.value = await loadImage(val);
    await nextTick();
    console.log('imageRef', imageRef.value);
    if (!canvasEl.value || !imageRef.value) {
      console.log('canvasEl 或 imageRef 为空');
      return;
    }
    const ctx = canvasEl.value.getContext('2d');
    if (ctx) {
      console.log('开始绘制图片');
      ctx.drawImage(imageRef.value, 0, 0);
    }
    imageWidth.value = imageRef.value.width;
    imageHeight.value = imageRef.value.height;

    // 计算margin
    if (imageHeight.value && imageWidth.value) {
      const minSide = Math.min(imageWidth.value, imageHeight.value);
      margin.value = minSide * 0.03;
    }
  }
});

// 监听文字变化，只在宽高已知时重绘内容
watch(
  textItems,
  async () => {
    if (!canvasEl.value || !imageRef.value) return;
    const ctx = canvasEl.value.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(imageRef.value, 0, 0);
    textItems.value.forEach((item) => {
      if (!item.text.trim()) return;
      ctx.font = `${item.fontSize}px ${item.fontFamily || 'sans-serif'}`;
      ctx.fillStyle = item.fontColor || 'white';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(item.text, item.x, item.y);
    });
  },
  { deep: true }
);

// 监听下载触发变化
watch(downloadTrigger, (val) => {
  if (val > 0) {
    if (canvasEl.value) {
      const a = document.createElement('a');
      a.download = 'meme.png';
      a.href = canvasEl.value.toDataURL('image/png');
      a.click();
    }
    resetDownloadTrigger();
  }
});
</script>
