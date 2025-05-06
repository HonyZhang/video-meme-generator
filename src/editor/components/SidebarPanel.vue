<template>
  <div class="flex flex-col w-100 h-full p-4 bg-base-200 border-r-2 border-base-300">
    <!-- 操作顺序提示 -->
    <div class="alert alert-info mb-4 flex items-center justify-center text-lg font-semibold">
      <span class="mx-auto"
        >👉 推荐操作顺序：<span class="font-bold">先裁剪并调整图像，再添加文字。</span></span
      >
    </div>
    <!-- DaisyUI Modal -->
    <dialog id="clearTextModal" class="modal">
      <form method="dialog" class="modal-box">
        <h3 class="font-bold text-lg mb-2 text-base-content">
          ⚠️ 切换到"裁剪/图像调整"将清除所有已添加文字，是否继续？
        </h3>
        <div class="modal-action flex justify-end gap-4">
          <button class="btn btn-error" @click.prevent="onModalConfirm">确定</button>
          <button class="btn" @click.prevent="onModalCancel">取消</button>
        </div>
      </form>
    </dialog>
    <div role="tablist" class="tabs tabs-border">
      <a
        v-for="tab in tabs"
        :key="tab.key"
        role="tab"
        class="tab border-b-2 text-base-content"
        :class="{ 'tab-active': activeTab === tab.key }"
        @click="onTabChange(tab.key)"
      >
        {{ tab.label }}
      </a>
    </div>
    <div class="flex-1 overflow-y-auto border-t-2 border-base-300 pt-2">
      <template v-if="activeTab === 'imageResize'">
        <div v-if="!cropping">
          <img
            v-if="memeImage"
            :src="memeImage"
            class="max-w-full max-h-96 rounded shadow bg-black mx-auto"
            alt="待裁剪图片"
          />
          <div class="flex gap-2 mt-4 justify-center">
            <button class="btn btn-primary" :disabled="!memeImage" @click="startCrop">
              开始裁剪
            </button>
          </div>
        </div>
        <div v-else>
          <cropper
            ref="cropperRef"
            :src="memeImage"
            :stencil-props="{ aspectRatio: NaN }"
            class="max-w-full max-h-96 bg-base-100 border border-base-300 rounded mx-auto"
          />
          <div class="flex gap-2 mt-4 justify-center">
            <button class="btn btn-success" @click="confirmCrop">确认裁剪</button>
            <button class="btn" @click="cancelCrop">取消</button>
          </div>
        </div>
      </template>
      <template v-else-if="activeTab === 'addText'">
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
            class="mb-2 p-2 border-2 border-dashed border-base-content/40 rounded bg-base-100 text-base-content flex flex-col gap-2"
          >
            <div class="flex items-center gap-2">
              <input
                :value="item.text"
                class="input flex-1 bg-base-100 text-base-content border-base-300"
                @input="
                  (e) => updateTextItem(item.id, 'text', (e.target as HTMLInputElement)?.value)
                "
              />
              <button class="btn btn-error btn-sm" @click="removeText(item.id)">删除</button>
            </div>
            <div class="flex items-center gap-2">
              <label>字体：</label>
              <select
                :value="item.fontFamily"
                class="select flex-1 bg-base-100 text-base-content border-base-300"
                @change="
                  (e) =>
                    updateTextItem(item.id, 'fontFamily', (e.target as HTMLSelectElement)?.value)
                "
              >
                <option value="Impact">Impact</option>
                <option value="Arial">Arial</option>
                <option value="Comic Sans MS">Comic Sans</option>
                <option value="Alibaba PuHuiTi">阿里巴巴普惠体</option>
                <option value="Smiley Sans">得意黑</option>
              </select>
              <label>颜色：</label>
              <input
                :value="item.fontColor"
                type="color"
                class="input w-10 h-10 bg-base-100 border-base-300"
                @input="
                  (e) => updateTextItem(item.id, 'fontColor', (e.target as HTMLInputElement)?.value)
                "
              />
              <label>大小：</label>
              <input
                :value="item.fontSize"
                type="number"
                min="10"
                max="120"
                class="input w-15 bg-base-100 text-base-content border-base-300"
                @input="
                  (e) =>
                    updateTextItem(
                      item.id,
                      'fontSize',
                      Number((e.target as HTMLInputElement)?.value)
                    )
                "
              />
              <span>px</span>
            </div>
          </div>
        </fieldset>
      </template>
    </div>
    <div class="divider"></div>
    <!-- 下载按钮 -->
    <button class="btn btn-primary w-full" @click="props.downloadImage">下载表情包</button>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import { useCropper } from '../composables/useCropper';
import { useTextItems } from '../composables/useTextItems';

const props = defineProps<{
  memeImage: string | null;
  textItems: TextItem[];
  downloadImage: () => void;
}>();
const emit = defineEmits(['update:memeImage', 'update:textItems']);

const tabs = [
  { key: 'imageResize', label: '调整图片' },
  { key: 'addText', label: '添加文字' },
];
const activeTab = ref('imageResize');
let pendingTab: string | null = null;

const { cropping, cropperRef, startCrop, confirmCrop, cancelCrop } = useCropper(props, emit);

const { newText, addText, removeText, updateTextItem } = useTextItems(props, emit);

onMounted(async () => {
  if (!props.memeImage) {
    const result = await chrome.storage.local.get('memeImage');
    emit('update:memeImage', result.memeImage || null);
  }
});

function onTabChange(newTab: string) {
  if (newTab === 'imageResize' && props.textItems.length > 0) {
    pendingTab = newTab;
    (document.getElementById('clearTextModal') as HTMLDialogElement)?.showModal();
    return;
  }
  activeTab.value = newTab;
}

function onModalConfirm() {
  emit('update:textItems', []);
  if (pendingTab) {
    activeTab.value = pendingTab;
    pendingTab = null;
  }
  (document.getElementById('clearTextModal') as HTMLDialogElement)?.close();
}

function onModalCancel() {
  pendingTab = null;
  (document.getElementById('clearTextModal') as HTMLDialogElement)?.close();
}
</script>
