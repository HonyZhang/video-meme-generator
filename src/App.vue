<template>
  <div class="p-4 space-y-4 max-w-sm mx-auto">
    <h1 class="text-xl font-bold text-center">🎬 表情图生成器</h1>

    <!-- ❌ 错误提示 -->
    <p v-if="errorMessage" class="text-red-500 text-sm text-center">
      {{ errorMessage }}
    </p>

    <!-- ✅ 主操作区 -->
    <div v-if="!errorMessage" class="space-y-4">
      <!-- 🖼️ 图片预览 -->
      <div class="border rounded overflow-hidden">
        <canvas v-show="hasImage" ref="canvasEl" class="w-full h-auto max-h-[300px]" />
      </div>

      <!-- 📥 下载 / 🧩 高级定制 -->
      <div class="flex gap-2">
        <button class="btn btn-accent flex-1" @click="download">💾 下载</button>
        <button class="btn btn-secondary flex-1" @click="openEditor">🧩 高级定制</button>
      </div>

      <!-- ➕ 添加文字 -->
      <div class="flex gap-2">
        <input
          v-model="newText"
          type="text"
          placeholder="添加文字"
          class="input input-bordered w-full"
        />
        <select v-model="newPosition" class="select select-bordered w-28">
          <option value="top">顶部</option>
          <option value="middle">中部</option>
          <option value="bottom">底部</option>
        </select>
        <button class="btn btn-primary" @click="addTextItem">添加</button>
      </div>

      <!-- 📝 已添加文字项：可编辑 + 删除 -->
      <ul class="space-y-2">
        <li
          v-for="item in textItems"
          :key="item.id"
          class="flex gap-2 items-center bg-base-100 p-2 rounded shadow"
        >
          <input v-model="item.text" class="input input-sm flex-1" @input="draw" />
          <select v-model="item.position" class="select select-sm w-24" @change="draw">
            <option value="top">顶部</option>
            <option value="middle">中部</option>
            <option value="bottom">底部</option>
          </select>
          <button class="btn btn-sm btn-error" @click="removeTextItem(item.id)">删除</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue';

interface TextItem {
  id: number;
  text: string;
  position: 'top' | 'middle' | 'bottom';
}

const canvasEl = ref<HTMLCanvasElement | null>(null);
const imageRef = ref<HTMLImageElement | null>(null);
const hasImage = ref(false);
const errorMessage = ref('');
const textItems = ref<TextItem[]>([]);
let idCounter = 1;

const newText = ref('');
const newPosition = ref<'top' | 'middle' | 'bottom'>('middle');

// 🧠 添加新文字项
const addTextItem = () => {
  if (!newText.value.trim()) return;
  textItems.value.push({
    id: idCounter++,
    text: newText.value.trim(),
    position: newPosition.value,
  });
  newText.value = '';
  draw();
};

// 🧠 删除文字项
const removeTextItem = (id: number) => {
  textItems.value = textItems.value.filter((item) => item.id !== id);
  draw();
};

// ✅ 页面加载后自动截图
onMounted(async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    console.log('🎬 正在截图:', tab);
    const res = await chrome.tabs.sendMessage(tab.id!, { type: 'capture-frame' });

    if (!res?.image) {
      errorMessage.value = '❌ 当前页面未检测到视频，请打开含视频的页面后再试';
      return;
    }

    const img = new Image();
    img.onload = async () => {
      imageRef.value = img;
      hasImage.value = true;

      await nextTick();
      const canvas = canvasEl.value;
      if (!canvas) return;
      const ctx = canvas.getContext('2d')!;
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = res.image;
  } catch (err) {
    console.error('插件通信失败:', err);
    errorMessage.value = '❌ 当前页面未检测到视频，请打开含视频的页面后再试';
  }
});

// 🧠 统一绘图函数（用于新增 / 修改 / 删除）
const draw = () => {
  const canvas = canvasEl.value;
  const img = imageRef.value;
  if (!canvas || !img) return;

  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);

  const fontSize = Math.floor(canvas.height / 12);
  ctx.font = `${fontSize}px Impact, sans-serif`;
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineWidth = 3;

  const positions = {
    top: 50,
    middle: canvas.height / 2,
    bottom: canvas.height - 50,
  };

  textItems.value.forEach((item) => {
    const y = positions[item.position];
    if (!item.text.trim()) return;
    ctx.fillText(item.text.toUpperCase(), canvas.width / 2, y);
    ctx.strokeText(item.text.toUpperCase(), canvas.width / 2, y);
  });
};

// 💾 下载图片
const download = () => {
  const canvas = canvasEl.value;
  if (!canvas) return;
  const a = document.createElement('a');
  a.download = 'meme.png';
  a.href = canvas.toDataURL('image/png');
  a.click();
};

// 🧩 进入高级定制页面
const openEditor = async () => {
  const img = imageRef.value;
  if (!img) {
    alert('请先加载截图');
    return;
  }

  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = img.width;
  tempCanvas.height = img.height;
  const ctx = tempCanvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0);

  const imageBase64 = tempCanvas.toDataURL('image/png');
  await chrome.storage.local.set({ memeImage: imageBase64 });

  const editorUrl = chrome.runtime.getURL('editor.html');
  chrome.tabs.create({ url: editorUrl });
};
</script>
