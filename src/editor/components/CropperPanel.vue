<template>
  <div>
    <img
      v-if="memeImage && !cropping"
      :src="memeImage"
      class="max-w-full max-h-96 rounded shadow bg-black mx-auto"
      alt="待裁剪图片"
    />
    <div v-if="!cropping" class="flex gap-2 mt-4 justify-center">
      <button class="btn btn-primary" :disabled="!memeImage" @click="startCrop">开始裁剪</button>
    </div>
    <cropper
      v-if="cropping"
      ref="cropperRef"
      :src="memeImage"
      :stencil-props="{ aspectRatio: NaN }"
      class="max-w-full max-h-96 bg-base-100 border border-base-300 rounded mx-auto"
    />
    <div v-if="cropping" class="flex gap-2 mt-4 justify-center">
      <button class="btn btn-success" @click="confirmCrop">确认裁剪</button>
      <button class="btn" @click="cancelCrop">取消</button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import { useMemeStore } from '../stores/meme';

const { image: memeImage } = storeToRefs(useMemeStore());

// 裁剪相关状态
const cropping = ref(false);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cropperRef = ref<any>(null);

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
</script>
