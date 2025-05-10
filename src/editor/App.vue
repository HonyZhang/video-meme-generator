<template>
  <div class="flex h-screen">
    <sidebar-panel />
    <meme-preview />
  </div>
</template>
<script setup lang="ts">
import SidebarPanel from './components/SidebarPanel.vue';
import MemePreview from './components/MemePreview.vue';
import { useMemeStore } from './stores/meme';

const { image, textItems } = storeToRefs(useMemeStore());

onMounted(async () => {
  const result = await chrome.storage?.local?.get?.(['memeImage', 'memeTextItems']);
  image.value = result?.memeImage || null;
  textItems.value = Array.isArray(result.memeTextItems)
    ? result.memeTextItems
    : Object.values(result.memeTextItems);
});
</script>
