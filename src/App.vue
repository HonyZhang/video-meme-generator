<template>
  <div class="p-4 space-y-4 max-w-sm mx-auto">
    <h1 class="text-xl font-bold text-center">🎬 Video Meme Generator</h1>

    <input
      v-model="topText"
      type="text"
      placeholder="顶部文字"
      class="input input-bordered w-full"
    />
    <input
      v-model="bottomText"
      type="text"
      placeholder="底部文字"
      class="input input-bordered w-full"
    />

    <button class="btn btn-primary w-full" @click="capture">📸 生成截图</button>

    <!-- 永远渲染 canvas，防止 getContext 报错 -->
    <div v-show="hasImage" class="border rounded overflow-hidden">
      <canvas ref="canvasEl" class="w-full" />
    </div>

    <button v-if="hasImage" class="btn btn-accent w-full" @click="download">💾 下载表情图</button>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';

const topText = ref('');
const bottomText = ref('');
const canvasEl = ref<HTMLCanvasElement | null>(null);
const hasImage = ref(false);

const capture = async () => {
  console.log('[popup] capture button clicked');

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const res = await chrome.tabs.sendMessage(tab.id!, { type: 'capture-frame' });
  if (!res?.image) {
    alert('未获取到视频帧');
    return;
  }

  await nextTick();

  const canvas = canvasEl.value;
  if (!canvas) {
    console.error('Canvas 未挂载');
    return;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('无法获取 Canvas 上下文');
    return;
  }

  const img = new Image();
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const fontSize = Math.floor(img.height / 12);
    ctx.font = `${fontSize}px Impact, sans-serif`;
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.textAlign = 'center';
    ctx.lineWidth = 3;

    // 顶部文字
    if (topText.value) {
      ctx.fillText(topText.value.toUpperCase(), img.width / 2, fontSize + 10);
      ctx.strokeText(topText.value.toUpperCase(), img.width / 2, fontSize + 10);
    }

    // 底部文字
    if (bottomText.value) {
      ctx.fillText(bottomText.value.toUpperCase(), img.width / 2, img.height - 20);
      ctx.strokeText(bottomText.value.toUpperCase(), img.width / 2, img.height - 20);
    }

    hasImage.value = true;
  };
  img.src = res.image;
};

const download = () => {
  const canvas = canvasEl.value;
  if (!canvas) return;

  const a = document.createElement('a');
  a.download = 'meme.png';
  a.href = canvas.toDataURL('image/png');
  a.click();
};
</script>
