<template>
  <div class="flex h-screen">
    <SidebarPanel
      :memeImage="memeImage"
      :textItems="textItems"
      @update:memeImage="val => memeImage = val"
      @update:textItems="val => textItems = val"
      :downloadImage="downloadImage"
    />
    <MemePreview
      :memeImage="memeImage"
      :textItems="textItems"
      @update:textItems="val => textItems = val"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, nextTick } from 'vue';
import SidebarPanel from './components/SidebarPanel.vue';
import MemePreview from './components/MemePreview.vue';

interface TextItem {
  id: number;
  text: string;
  x: number;
  y: number;
  fontFamily: string;
  fontColor: string;
  fontSize: number;
}

const memeImage = ref<string | null>(null);
const textItems = ref<TextItem[]>([]);

// 下载图片逻辑
async function downloadImage() {
  if (!memeImage.value) return;
  // 创建图片对象
  const img = new window.Image();
  img.src = memeImage.value;
  await new Promise((resolve) => {
    if (img.complete) resolve(true);
    img.onload = resolve;
  });
  // 计算最大文字尺寸
  const maxFontSize = Math.max(...textItems.value.map(t => t.fontSize), 32);
  // 创建画布
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  // 绘制文字
  for (const item of textItems.value) {
    ctx.save();
    ctx.font = `${item.fontSize}px ${item.fontFamily}`;
    ctx.fillStyle = item.fontColor;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.shadowColor = '#000';
    ctx.shadowBlur = 4;
    const drawX = item.x * canvas.width;
    const drawY = item.y * canvas.height;
    ctx.fillText(item.text, drawX, drawY);
    ctx.restore();
  }
  // 下载
  const a = document.createElement('a');
  a.href = canvas.toDataURL('image/png');
  a.download = 'meme.png';
  a.click();
}
</script>
