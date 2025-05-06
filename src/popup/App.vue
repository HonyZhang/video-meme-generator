<template>
  <div class="p-4 space-y-4 max-w-sm mx-auto">
    <h1 class="text-xl font-bold text-center">🎬 表情图生成器</h1>
    <meme-canvas
      ref="canvasRef"
      :image="image"
      :text-items="textItems"
      :error-message="errorMessage"
      :has-image="hasImage"
    />
    <toolbar-panel :has-image="hasImage" @download="download" @open-editor="openEditor" />
    <text-list-panel :text-items="textItems" @update:text-items="(val) => (textItems = val)" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import MemeCanvas from './components/MemeCanvas.vue';
import TextListPanel from './components/TextListPanel.vue';
import ToolbarPanel from './components/ToolbarPanel.vue';

interface TextItem {
  id: number;
  text: string;
  position: 'top' | 'middle' | 'bottom';
}

const canvasRef = ref<InstanceType<typeof MemeCanvas> | null>(null);
const image = ref<string | null>(null);
const hasImage = ref(false);
const errorMessage = ref('');
const textItems = ref<TextItem[]>([]);

// ✅ 页面加载后自动截图
onMounted(async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const res = await chrome.tabs.sendMessage(tab.id!, { type: 'capture-frame' });
    if (!res?.image) {
      errorMessage.value = '❌ 当前页面未检测到视频，请打开含视频的页面后再试';
      return;
    }
    image.value = res.image;
    hasImage.value = true;
  } catch {
    errorMessage.value = '❌ 当前页面未检测到视频，请打开含视频的页面后再试';
  }
});

function download() {
  canvasRef.value?.download();
}

async function openEditor() {
  if (!image.value) {
    alert('请先加载截图');
    return;
  }
  const img = new window.Image();
  img.src = image.value;
  await new Promise((resolve) => {
    if (img.complete) resolve(true);
    img.onload = resolve;
  });
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = img.width;
  tempCanvas.height = img.height;
  const ctx = tempCanvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0);
  const imageBase64 = tempCanvas.toDataURL('image/png');
  await chrome.storage.local.set({ memeImage: imageBase64 });
  const editorUrl = chrome.runtime.getURL('editor.html');
  await chrome.tabs.create({ url: editorUrl });
}
</script>
