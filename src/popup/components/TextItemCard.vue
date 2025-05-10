<template>
  <li class="flex gap-2 items-center bg-base-100 p-2 rounded shadow">
    <input v-model="localText" class="input input-sm flex-1" @input="textChange" />
    <select v-model="localPosition" class="select select-sm w-24" @change="positionChange">
      <option value="top">顶部</option>
      <option value="middle">中部</option>
      <option value="bottom">底部</option>
    </select>
    <button class="btn btn-sm btn-error" @click="deleteTextItem">删除</button>
  </li>
</template>
<script setup lang="ts">
import { useMemeStore } from '@/popup/stores/meme.ts';
import { getTextItemPosition } from '@/popup/utils/positionUtils.ts';

const props = defineProps<{ textItemId: number }>();
const { textItems, imageWidth, imageHeight, margin } = storeToRefs(useMemeStore());

const localText = ref(textItems.value.find((item) => item.id === props.textItemId)?.text || '');
const localPosition = ref(
  textItems.value.find((item) => item.id === props.textItemId)?.position || 'middle'
);

function textChange() {
  const textItem = textItems.value.find((item) => item.id === props.textItemId);
  if (textItem) {
    textItem.text = localText.value;
  }
}

function positionChange() {
  const textItem = textItems.value.find((item) => item.id === props.textItemId);
  if (textItem) {
    textItem.position = localPosition.value;
    const { x, y } = getTextItemPosition(
      textItem,
      imageWidth.value,
      imageHeight.value,
      margin.value
    );
    textItem.x = x;
    textItem.y = y;
  }
}

function deleteTextItem() {
  const index = textItems.value.findIndex((item) => item.id === props.textItemId);
  if (index !== -1) {
    textItems.value.splice(index, 1);
  }
}
</script>
