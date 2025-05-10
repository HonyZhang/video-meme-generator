<template>
  <div class="flex-1 p-4 bg-base-100 flex items-center justify-center">
    <div class="relative w-full h-full flex items-center justify-center">
      <img
        v-if="memeImage"
        ref="imgRef"
        :src="memeImage"
        alt="meme"
        class="object-contain max-w-full max-h-full rounded shadow bg-black"
        @load="handleImgLoad"
      />
      <meme-text-item v-for="item in textItems" :key="item.id" :text-item-id="item.id" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useMemeStore } from '../stores/meme';
import MemeTextItem from './MemeTextItem.vue';

const { image: memeImage, textItems, scale, imgBox } = storeToRefs(useMemeStore());

// 图片引用和盒子尺寸
const imgRef = ref<HTMLImageElement | null>(null);

function handleImgLoad() {
  if (!imgRef.value) return;
  const rect = imgRef.value.getBoundingClientRect();
  const parentRect = imgRef.value.parentElement!.getBoundingClientRect();
  imgBox.value = {
    left: rect.left - parentRect.left,
    top: rect.top - parentRect.top,
    width: rect.width,
    height: rect.height,
  };
  scale.value = imgBox.value.width / imgRef.value.naturalWidth;
  // 缩放 textItems
  textItems.value = textItems.value.map((item) => ({
    ...item,
    x: item.x * scale.value,
    y: item.y * scale.value,
    fontSize: item.fontSize * scale.value,
  }));
}
</script>
