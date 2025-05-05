<template>
  <div class="flex h-screen">
    <!-- 左侧边栏 -->
    <div class="flex flex-col w-100 h-full p-4 bg-base-200 border-r-2 border-base-300">
      <!-- 操作顺序提示 -->
      <div class="alert alert-info mb-4 flex items-center justify-center text-lg font-semibold">
        <span class="mx-auto"
          >👉 推荐操作顺序：<span class="font-bold">先裁剪并调整图像，再添加文字。</span></span
        >
      </div>
      <!-- DaisyUI Modal -->
      <dialog id="clearTextModal" class="modal">
        <form method="dialog" class="modal-box">
          <h3 class="font-bold text-lg mb-2 text-base-content">
            ⚠️ 切换到"裁剪/图像调整"将清除所有已添加文字，是否继续？
          </h3>
          <div class="modal-action flex justify-end gap-4">
            <button class="btn btn-error" @click.prevent="onModalConfirm">确定</button>
            <button class="btn" @click.prevent="onModalCancel">取消</button>
          </div>
        </form>
      </dialog>
      <div role="tablist" class="tabs tabs-border">
        <a
          v-for="tab in tabs"
          :key="tab.key"
          role="tab"
          class="tab border-b-2 text-base-content"
          :class="{ 'tab-active': activeTab === tab.key }"
          @click="onTabChange(tab.key)"
        >
          {{ tab.label }}
        </a>
      </div>
      <div class="flex-1 overflow-y-auto border-t-2 border-base-300 pt-2">
        <template v-if="activeTab === 'imageResize'">
          <div v-if="!cropping">
            <img
              v-if="memeImage"
              :src="memeImage"
              class="max-w-full max-h-96 rounded shadow bg-black mx-auto"
              alt="待裁剪图片"
            />
            <div class="flex gap-2 mt-4 justify-center">
              <button class="btn btn-primary" @click="startCrop" :disabled="!memeImage">开始裁剪</button>
            </div>
          </div>
          <div v-else>
            <Cropper
              ref="cropperRef"
              :src="memeImage"
              :stencil-props="{ aspectRatio: 1 }"
              class="max-w-full max-h-96 bg-base-100 border border-base-300 rounded mx-auto"
            />
            <div class="flex gap-2 mt-4 justify-center">
              <button class="btn btn-success" @click="confirmCrop">确认裁剪</button>
              <button class="btn" @click="cancelCrop">取消</button>
            </div>
          </div>
        </template>
        <template v-else-if="activeTab === 'addText'">
          <fieldset class="fieldset gap-2">
            <div class="flex mb-2">
              <input
                v-model="newText"
                class="input flex-1 bg-base-100 text-base-content border-base-300 ml-2"
                placeholder="请输入文字"
              />
              <button class="btn btn-primary ml-2" @click="addText">添加</button>
            </div>
            <div
              v-for="item in textItems"
              :key="item.id"
              class="mb-2 p-2 border-2 border-dashed border-base-content/40 rounded bg-base-100 text-base-content flex flex-col gap-2"
            >
              <div class="flex items-center gap-2">
                <input
                  v-model="item.text"
                  class="input flex-1 bg-base-100 text-base-content border-base-300"
                />
                <button class="btn btn-error btn-sm" @click="removeText(item.id)">删除</button>
              </div>
              <div class="flex items-center gap-2">
                <label>字体：</label>
                <select
                  v-model="item.fontFamily"
                  class="select flex-1 bg-base-100 text-base-content border-base-300"
                >
                  <option value="Impact">Impact</option>
                  <option value="Arial">Arial</option>
                  <option value="Comic Sans MS">Comic Sans</option>
                  <option value="Alibaba PuHuiTi">阿里巴巴普惠体</option>
                  <option value="Smiley Sans">得意黑</option>
                </select>
                <label>颜色：</label>
                <input
                  v-model="item.fontColor"
                  type="color"
                  class="input w-10 h-10 bg-base-100 border-base-300"
                />
                <label>大小：</label>
                <input
                  v-model.number="item.fontSize"
                  type="number"
                  min="10"
                  max="120"
                  class="input w-15 bg-base-100 text-base-content border-base-300"
                />
                <span>px</span>
              </div>
            </div>
          </fieldset>
        </template>
      </div>

      <div class="divider"></div>
      <!-- 下载按钮 -->
      <button class="btn btn-primary w-full" @click="downloadImage">下载表情包</button>
    </div>

    <!-- 右侧内容区域 -->
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
        <div
          v-for="item in textItems"
          :id="'text-box-' + item.id"
          :key="item.id"
          class="absolute pointer-events-auto flex items-start justify-center select-none0"
          :style="{
            left: imgBox.left + item.x * imgBox.width + 'px',
            top: imgBox.top + item.y * imgBox.height + 'px',
            fontSize: item.fontSize + 'px',
            color: item.fontColor,
            textShadow: '2px 2px 4px #000',
            fontFamily: item.fontFamily,
            cursor: draggingId === item.id ? 'grabbing' : 'grab',
            userSelect: 'none',
            position: 'absolute',
            zIndex: 10,
          }"
          @mousedown="(e) => onTextMouseDown(e, item.id)"
        >
          <div
            class="w-max text-center border-2 border-dashed border-base-100 rounded-md px-2 py-0.5 box-border pointer-events-none leading-none"
          >
            {{ item.text }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import '@/assets/styles/fonts.css';
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

const tabs = [
  { key: 'imageResize', label: '调整图片' },
  { key: 'addText', label: '添加文字' },
];
const activeTab = ref('imageResize');
const memeImage = ref<string | null>(null);
const imgNaturalWidth = ref(0);
const imgNaturalHeight = ref(0);
const imgRef = ref<HTMLImageElement | null>(null);
const imgBox = ref({ left: 0, top: 0, width: 0, height: 0 });
const dragOffset = ref({ x: 0, y: 0 });

// 多行文字数据结构
interface TextItem {
  id: number;
  text: string;
  x: number; // 相对图片区域的百分比
  y: number;
  fontFamily: string;
  fontColor: string;
  fontSize: number;
}

const textItems = ref<TextItem[]>([]);
let idCounter = 1;
const newText = ref('');
const draggingId = ref<number | null>(null);
let pendingTab: string | null = null;
const cropping = ref(false);
const cropperRef = ref<any>(null);
const cropResult = ref<string | null>(null);

onMounted(async () => {
  const result = await chrome.storage.local.get('memeImage');
  memeImage.value = result.memeImage || null;
});

function onImgLoad(e: Event) {
  const img = e.target as HTMLImageElement;
  imgNaturalWidth.value = img.naturalWidth;
  imgNaturalHeight.value = img.naturalHeight;
}

function onTextMouseDown(e: MouseEvent, id: number) {
  const item = textItems.value.find((t) => t.id === id);
  if (!item || !imgBox.value.width || !imgBox.value.height) return;
  draggingId.value = id;
  dragOffset.value = {
    x: e.clientX - (imgBox.value.left + item.x * imgBox.value.width),
    y: e.clientY - (imgBox.value.top + item.y * imgBox.value.height),
  };
  window.addEventListener('mousemove', onTextMouseMove);
  window.addEventListener('mouseup', onTextMouseUp);
}

function onTextMouseMove(e: MouseEvent) {
  if (draggingId.value === null) return;
  const item = textItems.value.find((t) => t.id === draggingId.value);
  if (!item) return;
  const box = document.getElementById('text-box-' + item.id)?.getBoundingClientRect();
  const boxWidth = box?.width || 0;
  const boxHeight = box?.height || 0;
  let x = (e.clientX - imgBox.value.left - dragOffset.value.x) / imgBox.value.width;
  let y = (e.clientY - imgBox.value.top - dragOffset.value.y) / imgBox.value.height;
  x = Math.max(0, x);
  y = Math.max(0, y);
  if (boxWidth && imgBox.value.width) {
    x = Math.min(x, 1 - boxWidth / imgBox.value.width);
  }
  if (boxHeight && imgBox.value.height) {
    y = Math.min(y, 1 - boxHeight / imgBox.value.height);
  }
  item.x = x;
  item.y = y;
}

function onTextMouseUp() {
  draggingId.value = null;
  window.removeEventListener('mousemove', onTextMouseMove);
  window.removeEventListener('mouseup', onTextMouseUp);
}

async function downloadImage() {
  if (!memeImage.value || !imgNaturalWidth.value || !imgNaturalHeight.value || !imgRef.value)
    return;
  updateImgBox();
  await nextTick();
  const canvas = document.createElement('canvas');
  canvas.width = imgNaturalWidth.value;
  canvas.height = imgNaturalHeight.value;
  const ctx = canvas.getContext('2d')!;
  const img = new window.Image();
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    for (const item of textItems.value) {
      const el = document.getElementById('text-box-' + item.id);
      let paddingLeft = 0,
        paddingTop = 0,
        borderLeft = 0,
        borderTop = 0;
      if (el && el.firstElementChild) {
        const style = window.getComputedStyle(el.firstElementChild);
        paddingLeft = parseFloat(style.paddingLeft) || 0;
        paddingTop = parseFloat(style.paddingTop) || 0;
        borderLeft = parseFloat(style.borderLeftWidth) || 0;
        borderTop = parseFloat(style.borderTopWidth) || 0;
      }
      const imgRect = imgRef.value!.getBoundingClientRect();
      const scaleX = canvas.width / imgRect.width;
      const scaleY = canvas.height / imgRect.height;
      const drawX = item.x * canvas.width + (paddingLeft + borderLeft) * scaleX;
      const drawY = item.y * canvas.height + (paddingTop + borderTop) * scaleY;
      ctx.font = `${item.fontSize}px ${item.fontFamily}`;
      ctx.fillStyle = item.fontColor;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(item.text, drawX, drawY);
    }
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = 'meme.png';
    a.click();
  };
  img.src = memeImage.value;
}

function updateImgBox() {
  if (!imgRef.value) return;
  const rect = imgRef.value.getBoundingClientRect();
  const parentRect = imgRef.value.parentElement!.getBoundingClientRect();
  console.log('imgRect:', rect, 'parentRect:', parentRect);
  imgBox.value = {
    left: rect.left - parentRect.left,
    top: rect.top - parentRect.top,
    width: rect.width,
    height: rect.height,
  };
  console.log('imgBox:', imgBox.value);
}

function handleImgLoad(e: Event) {
  onImgLoad(e);
  updateImgBox();
}

// 添加文字
function addText() {
  if (!newText.value.trim()) return;
  textItems.value.push({
    id: idCounter++,
    text: newText.value.trim(),
    x: 0.5,
    y: 0.05 + textItems.value.length * 0.1,
    fontFamily: 'Impact',
    fontColor: '#ffffff',
    fontSize: 32,
  });
  newText.value = '';
}

// 删除文字
function removeText(id: number) {
  textItems.value = textItems.value.filter((t) => t.id !== id);
}

function onTabChange(newTab: string) {
  if (newTab === 'imageResize' && textItems.value.length > 0) {
    pendingTab = newTab;
    (document.getElementById('clearTextModal') as HTMLDialogElement)?.showModal();
    return;
  }
  activeTab.value = newTab;
}

function onModalConfirm() {
  textItems.value = [];
  if (pendingTab) {
    activeTab.value = pendingTab;
    pendingTab = null;
  }
  (document.getElementById('clearTextModal') as HTMLDialogElement)?.close();
}

function onModalCancel() {
  pendingTab = null;
  (document.getElementById('clearTextModal') as HTMLDialogElement)?.close();
}

function startCrop() {
  cropping.value = true;
}

function confirmCrop() {
  if (cropperRef.value) {
    const canvas = cropperRef.value.getResult().canvas;
    if (canvas) {
      memeImage.value = canvas.toDataURL('image/png');
      cropping.value = false;
    }
  }
}

function cancelCrop() {
  cropping.value = false;
}

onMounted(() => {
  window.addEventListener('resize', () => {
    updateImgBox();
    nextTick(() => {}); // 强制刷新DOM
  });
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateImgBox);
});
</script>
