<template>
  <div>
    <div class="flex gap-2 mb-2">
      <input v-model="newText" type="text" placeholder="添加文字" class="input input-bordered w-full" />
      <select v-model="newPosition" class="select select-bordered w-28">
        <option value="top">顶部</option>
        <option value="middle">中部</option>
        <option value="bottom">底部</option>
      </select>
      <button class="btn btn-primary" @click="addTextItem">添加</button>
    </div>
    <ul class="space-y-2">
      <li v-for="item in textItems" :key="item.id" class="flex gap-2 items-center bg-base-100 p-2 rounded shadow">
        <input v-model="item.text" class="input input-sm flex-1" @input="emitUpdate" />
        <select v-model="item.position" class="select select-sm w-24" @change="emitUpdate">
          <option value="top">顶部</option>
          <option value="middle">中部</option>
          <option value="bottom">底部</option>
        </select>
        <button class="btn btn-sm btn-error" @click="removeTextItem(item.id)">删除</button>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
const props = defineProps<{
  textItems: Array<{ id: number; text: string; position: string }>
}>();
const emit = defineEmits(['update:textItems']);

const newText = ref('');
const newPosition = ref<'top' | 'middle' | 'bottom'>('middle');
let idCounter = 1;

function addTextItem() {
  if (!newText.value.trim()) return;
  const newItem = {
    id: idCounter++,
    text: newText.value.trim(),
    position: newPosition.value,
  };
  emit('update:textItems', [...props.textItems, newItem]);
  newText.value = '';
}

function removeTextItem(id: number) {
  emit('update:textItems', props.textItems.filter((item) => item.id !== id));
}

function emitUpdate() {
  emit('update:textItems', props.textItems);
}
</script> 