<template>
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
      class="card bg-base-100 shadow-sm border border-base-300 mb-2"
    >
      <div class="card-body p-4 flex flex-col gap-2">
        <div class="flex items-center gap-2 mb-1">
          <input
            :value="item.text"
            class="input flex-1 bg-base-100 text-base-content border-base-300"
            @input="(e) => updateTextItem(item.id, 'text', (e.target as HTMLInputElement)?.value)"
          />
          <button class="btn btn-error btn-sm" @click="removeText(item.id)">删除</button>
        </div>
        <div class="flex items-center gap-2">
          <label>字体:</label>
          <select
            :value="item.fontFamily"
            class="select flex-1 bg-base-100 text-base-content border-base-300"
            @change="
              (e) => updateTextItem(item.id, 'fontFamily', (e.target as HTMLSelectElement)?.value)
            "
          >
            <option value="Impact">Impact</option>
            <option value="Arial">Arial</option>
            <option value="Comic Sans MS">Comic Sans</option>
            <option value="Alibaba PuHuiTi">阿里巴巴普惠体</option>
            <option value="Smiley Sans">得意黑</option>
          </select>
          <label>颜色:</label>
          <input
            :value="item.fontColor"
            type="color"
            class="input w-10 h-10 bg-base-100 border-base-300"
            @input="
              (e) => updateTextItem(item.id, 'fontColor', (e.target as HTMLInputElement)?.value)
            "
          />
          <label>大小:</label>
          <input
            :value="item.fontSize"
            type="number"
            min="10"
            max="120"
            class="input w-15 bg-base-100 text-base-content border-base-300"
            @input="
              (e) =>
                updateTextItem(item.id, 'fontSize', Number((e.target as HTMLInputElement)?.value))
            "
          />
          <span>px</span>
        </div>
      </div>
    </div>
  </fieldset>
</template>
<script setup lang="ts">
import { useMemeStore } from '../stores/meme';
import type { TextItem } from '@/types/textItems';

const { textItems } = storeToRefs(useMemeStore());

// 新增文字输入
const newText = ref('');
// id 计数器，保证唯一
let idCounter = ref(1 + (textItems.value[textItems.value.length - 1]?.id || 0));

function addText() {
  if (!newText.value.trim()) return;
  // 默认新文字居中或顶部，假设图片宽高为800x600，可根据实际图片宽高动态获取
  const defaultX = 200; // 可根据实际图片宽度动态设置
  const defaultY = 50 + textItems.value.length * 50; // 每行间隔50像素
  const newItem: TextItem = {
    id: idCounter.value++,
    text: newText.value.trim(),
    x: defaultX,
    y: defaultY,
    fontFamily: 'Impact',
    fontColor: '#ffffff',
    fontSize: 32,
  };
  textItems.value.push(newItem);
  newText.value = '';
}

function removeText(id: number) {
  textItems.value = textItems.value.filter((item) => item.id !== id);
}

function updateTextItem<T extends keyof TextItem>(id: number, key: T, value: TextItem[T]) {
  textItems.value.find((item) => item.id === id)![key] = value;
}
</script>
