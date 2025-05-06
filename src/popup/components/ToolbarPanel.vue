<template>
  <div class="flex gap-2">
    <button class="btn btn-accent flex-1" :disabled="!hasImage" @click="$emit('download')">💾 下载</button>
    <button class="btn btn-secondary flex-1" :disabled="!hasImage" @click="$emit('openEditor')">🧩 高级定制</button>
  </div>
</template>
<script setup lang="ts">
defineProps<{ hasImage: boolean }>();
defineEmits(['download', 'openEditor']);
</script> 