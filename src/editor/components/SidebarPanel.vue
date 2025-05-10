<template>
  <!-- 侧边栏主容器 -->
  <div class="flex flex-col items-center w-100 h-full p-4 bg-base-200 border-r-2 border-base-300">
    <!-- Tab 切换按钮 -->
    <div class="join mb-4">
      <input
        class="join-item btn btn-outline"
        type="radio"
        name="editor-tabs"
        aria-label="调整图片"
        :checked="activeTab === 'imageResize'"
        @change="activeTab = 'imageResize'"
      />
      <input
        class="join-item btn btn-outline"
        type="radio"
        name="editor-tabs"
        aria-label="添加文字"
        :checked="activeTab === 'addText'"
        @change="activeTab = 'addText'"
      />
    </div>
    <!-- Tab 内容区 -->
    <div class="flex-1 overflow-y-auto w-full border-t-2 border-base-300 pt-2">
      <cropper-panel v-if="activeTab === 'imageResize'" />
      <text-panel v-else-if="activeTab === 'addText'" />
    </div>
    <div class="divider"></div>
    <!-- 下载按钮 -->
    <download-button />
  </div>
</template>
<script setup lang="ts">
import CropperPanel from './CropperPanel.vue';
import TextPanel from './TextPanel.vue';
import DownloadButton from './DownloadButton.vue';

// 当前激活的 Tab，imageResize 或 addText
const activeTab = ref('imageResize');
</script>
