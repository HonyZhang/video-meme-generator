<template>
  <div v-if="image" class="flex gap-2">
    <button
      class="btn btn-accent flex-1"
      :disabled="downloading"
      title="下载当前表情图"
      @click="handleDownload"
    >
      <span v-if="downloading" class="loading loading-spinner"></span>
      {{ downloadText }}
    </button>
    <button
      class="btn btn-secondary flex-1"
      :disabled="opening"
      title="打开高级编辑器"
      @click="handleOpenEditor"
    >
      <span v-if="opening" class="loading loading-spinner"></span>
      {{ openEditorText }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useMemeStore } from '../stores/meme';

const { image, textItems } = storeToRefs(useMemeStore());
const { triggerDownload, clear } = useMemeStore();

const downloading = ref(false);
const opening = ref(false);

const downloadText = '💾 下载';
const openEditorText = '🧩 高级定制';

async function handleDownload() {
  if (downloading.value) return;
  downloading.value = true;
  try {
    triggerDownload();
    // 这里假设下载很快，1秒后自动结束 loading
    setTimeout(() => {
      downloading.value = false;
    }, 1000);
  } catch {
    downloading.value = false;
    alert('下载失败，请重试');
  }
}

async function handleOpenEditor() {
  if (opening.value) return;
  opening.value = true;
  try {
    if (!image.value) {
      alert('请先加载截图');
      opening.value = false;
      return;
    }
    await chrome.storage.local.set({
      memeImage: image.value,
      memeTextItems: textItems.value,
    });
    const editorUrl = chrome.runtime.getURL('editor.html');
    chrome.tabs.create({ url: editorUrl }, () => {
      clear();
      opening.value = false;
    });
  } catch {
    opening.value = false;
    alert('打开编辑器失败，请重试');
  }
}
</script>
