import { ref } from 'vue';

interface CropperInstance {
  getResult: () => { canvas: HTMLCanvasElement | null };
}

export function useCropper(
  _props: { memeImage: string | null },
  emit: (event: string, ...args: unknown[]) => void
) {
  const cropping = ref(false);
  const cropperRef = ref<CropperInstance | null>(null);

  function startCrop() {
    cropping.value = true;
  }

  function confirmCrop() {
    if (cropperRef.value) {
      const canvas = cropperRef.value.getResult().canvas;
      if (canvas) {
        emit('update:memeImage', canvas.toDataURL('image/png'));
        cropping.value = false;
      }
    }
  }

  function cancelCrop() {
    cropping.value = false;
  }

  return {
    cropping,
    cropperRef,
    startCrop,
    confirmCrop,
    cancelCrop,
  };
} 