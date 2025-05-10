<template>
  <button class="btn btn-primary w-full" @click="handleDownload">下载表情包</button>
</template>
<script setup lang="ts">
import { useMemeStore } from '../stores/meme';
import { storeToRefs } from 'pinia';
import { downloadMeme } from '../utils/downloadMeme';

const { image: memeImage, textItems, scale } = storeToRefs(useMemeStore());

async function handleDownload() {
  const rawTextItems = textItems.value.map((item) => ({
    ...item,
    x: item.x / scale.value,
    y: item.y / scale.value,
    fontSize: item.fontSize / scale.value,
  }));
  await downloadMeme(memeImage.value!, rawTextItems);
}
</script>
