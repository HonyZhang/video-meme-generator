<template>
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
</template>
<script setup lang="ts">
import { nextTick, onMounted, onBeforeUnmount } from 'vue';
import { useTextDrag } from '../composables/useTextDrag';

const props = defineProps<{
  memeImage: string | null,
  textItems: any[],
}>();
const emit = defineEmits(['update:textItems']);

const {
  imgRef,
  imgBox,
  draggingId,
  updateImgBox,
  onTextMouseDown,
  onTextMouseMove,
  onTextMouseUp,
} = useTextDrag(props, emit);

function handleImgLoad(e: Event) {
  updateImgBox();
}

onMounted(() => {
  window.addEventListener('resize', () => {
    updateImgBox();
    nextTick(() => {});
  });
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateImgBox);
});
</script> 