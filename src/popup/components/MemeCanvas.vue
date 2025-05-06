<template>
  <div class="border rounded overflow-hidden">
    <canvas v-show="hasImage" ref="canvasEl" class="w-full h-auto max-h-[300px]" />
    <p v-if="errorMessage" class="text-red-500 text-sm text-center">{{ errorMessage }}</p>
  </div>
</template>
<script setup lang="ts">
import { defineEmits, defineProps, ref, watch } from 'vue';

const props = defineProps<{
  image: string | null;
  textItems: Array<{ id: number; text: string; position: string }>;
  errorMessage: string;
  hasImage: boolean;
}>();
const emit = defineEmits(['download']);

const canvasEl = ref<HTMLCanvasElement | null>(null);
const imageRef = ref<HTMLImageElement | null>(null);

watch(
  () => props.image,
  (val) => {
    if (val) {
      const img = new window.Image();
      img.onload = () => {
        imageRef.value = img;
        draw();
      };
      img.src = val;
    }
  }
);

watch(
  () => props.textItems,
  () => {
    draw();
  },
  { deep: true }
);

function draw() {
  const canvas = canvasEl.value;
  const img = imageRef.value;
  if (!canvas || !img) return;
  const ctx = canvas.getContext('2d')!;
  canvas.width = img.width;
  canvas.height = img.height;
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
  props.textItems.forEach((item) => {
    const y = positions[item.position as 'top' | 'middle' | 'bottom'];
    if (!item.text.trim()) return;
    ctx.fillText(item.text.toUpperCase(), canvas.width / 2, y);
    ctx.strokeText(item.text.toUpperCase(), canvas.width / 2, y);
  });
}

function download() {
  const canvas = canvasEl.value;
  if (!canvas) return;
  const a = document.createElement('a');
  a.download = 'meme.png';
  a.href = canvas.toDataURL('image/png');
  a.click();
  emit('download');
}

defineExpose({ download });
</script>
