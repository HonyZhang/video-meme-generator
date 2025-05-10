<template>
  <div class="p-4 space-y-4 max-w-sm mx-auto">
    <h1 class="text-xl font-bold text-center">🎬 表情图生成器</h1>
    <meme-canvas />
    <toolbar-panel />
    <text-list-panel />
  </div>
</template>

<script setup lang="ts">
import MemeCanvas from './components/MemeCanvas.vue';
import TextListPanel from './components/TextListPanel.vue';
import ToolbarPanel from './components/ToolbarPanel.vue';
import { useMemeStore } from './stores/meme';
import { loadFonts } from '@/utils/fontUtils';

const { image } = storeToRefs(useMemeStore());

onMounted(async () => {
  await loadFonts(['Smiley Sans', 'sans-serif']);
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const res = await chrome.tabs.sendMessage(tab.id!, { type: 'capture-frame' });
  if (!res?.image) {
    image.value = '';
    return;
  }
  image.value = res.image;
});
</script>
