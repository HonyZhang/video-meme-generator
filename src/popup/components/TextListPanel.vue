<template>
  <div v-if="image">
    <div class="flex gap-2 mb-2">
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
      <button class="btn btn-primary" @click="handleAddTextItem">添加</button>
    </div>
    <ul class="space-y-2">
      <text-item-card v-for="item in textItems" :key="item.id" :text-item-id="item.id" />
    </ul>
  </div>
</template>
<script setup lang="ts">
import { useMemeStore } from '../stores/meme';
import { getTextItemPosition } from '../utils/positionUtils';
import { getDefaultFontSize } from '../utils/fontUtils';
import TextItemCard from './TextItemCard.vue';
import type { TextItem } from '@/types/textItems';

const { image, textItems, imageWidth, imageHeight, margin } = storeToRefs(useMemeStore());

const newText = ref('');
const newPosition = ref<'top' | 'middle' | 'bottom'>('middle');
let idCounter = 1 + (textItems.value[textItems.value.length - 1]?.id || 0);

function handleAddTextItem() {
  if (!newText.value.trim()) return;
  textItems.value.push(createNewTextItem());
  idCounter++;
  newText.value = '';
}

function createNewTextItem(): TextItem {
  const newTextItem = {
    id: idCounter,
    text: newText.value.trim(),
    position: newPosition.value,
    fontFamily: 'Smiley Sans',
    fontSize: getDefaultFontSize(imageHeight.value),
    fontColor: 'white',
    x: 0,
    y: 0,
  };
  const { x, y } = getTextItemPosition(
    newTextItem,
    imageWidth.value,
    imageHeight.value,
    margin.value
  );
  return { ...newTextItem, x, y };
}

function handleRemoveTextItem(id: number) {
  textItems.value = textItems.value.filter((item) => item.id !== id);
}

function handleUpdateTextItem(item: TextItem) {
  const { x, y } = getTextItemPosition(item, imageWidth.value, imageHeight.value, margin.value);
  textItems.value = textItems.value.map((t) => (t.id === item.id ? { ...item, x, y } : t));
}
</script>
