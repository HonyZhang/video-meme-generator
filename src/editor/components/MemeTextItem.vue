<template>
  <div
    ref="textItemBoxRef"
    class="absolute pointer-events-auto flex items-start justify-start select-none0"
    :style="{
      left: imgBox.left + textItem.x - 10 + 'px',
      top: imgBox.top + textItem.y - 4 + 'px',
      fontSize: textItem.fontSize + 'px',
      color: textItem.fontColor,
      fontFamily: textItem.fontFamily,
      cursor: isDragging ? 'grabbing' : 'grab',
      userSelect: 'none',
      position: 'absolute',
      zIndex: 10,
    }"
    @mousedown="onTextMouseDown($event)"
  >
    <div
      class="w-max text-center border-2 border-dashed border-base-100 rounded-md px-2 py-0.5 box-border pointer-events-none leading-none"
    >
      {{ textItem.text }}
    </div>
  </div>
</template>
<script setup lang="ts">
import type { TextItem } from '@/types/textItems';
import { useMemeStore } from '@/editor/stores/meme.ts';
import { useTemplateRef } from 'vue';

const props = defineProps<{
  textItemId: number;
}>();

const { imgBox, textItems } = storeToRefs(useMemeStore());

const textItem = computed<TextItem>(() => {
  console.log('textItems', textItems.value);
  return textItems.value.find((item) => item.id === props.textItemId) as TextItem;
});
const isDragging = ref(false);
const dragOffset = ref({ x: 0, y: 0 });
const textItemBoxRef = useTemplateRef<HTMLDivElement>('textItemBoxRef');

function onTextMouseDown(e: MouseEvent) {
  isDragging.value = true;
  dragOffset.value = {
    x: e.clientX - (imgBox.value.left + textItem.value.x),
    y: e.clientY - (imgBox.value.top + textItem.value.y),
  };
  window.addEventListener('mousemove', onTextMouseMove);
  window.addEventListener('mouseup', onTextMouseUp);
}

function onTextMouseMove(e: MouseEvent) {
  const box = textItemBoxRef.value?.getBoundingClientRect();
  const boxWidth = box?.width || 20;
  const boxHeight = box?.height || 8;
  let x = e.clientX - imgBox.value.left - dragOffset.value.x;
  let y = e.clientY - imgBox.value.top - dragOffset.value.y;
  x = Math.max(18, x);
  y = Math.max(4, y);
  if (imgBox.value.width) {
    x = Math.min(x, imgBox.value.width - boxWidth + 18);
  }
  if (boxHeight && imgBox.value.height) {
    y = Math.min(y, imgBox.value.height - boxHeight + 4);
  }

  textItems.value.find((item) => item.id === props.textItemId)!.x = x;
  textItems.value.find((item) => item.id === props.textItemId)!.y = y;
}

function onTextMouseUp() {
  isDragging.value = false;
  window.removeEventListener('mousemove', onTextMouseMove);
  window.removeEventListener('mouseup', onTextMouseUp);
}
</script>
