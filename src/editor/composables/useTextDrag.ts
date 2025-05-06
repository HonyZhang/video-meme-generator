import { ref } from 'vue';

export function useTextDrag(props: { textItems: any[] }, emit: any) {
  const imgRef = ref<HTMLImageElement | null>(null);
  const imgBox = ref({ left: 0, top: 0, width: 0, height: 0 });
  const dragOffset = ref({ x: 0, y: 0 });
  const draggingId = ref<number | null>(null);

  function updateImgBox() {
    if (!imgRef.value) return;
    const rect = imgRef.value.getBoundingClientRect();
    const parentRect = imgRef.value.parentElement!.getBoundingClientRect();
    imgBox.value = {
      left: rect.left - parentRect.left,
      top: rect.top - parentRect.top,
      width: rect.width,
      height: rect.height,
    };
  }

  function onTextMouseDown(e: MouseEvent, id: number) {
    const item = props.textItems.find((t) => t.id === id);
    if (!item || !imgBox.value.width || !imgBox.value.height) return;
    draggingId.value = id;
    dragOffset.value = {
      x: e.clientX - (imgBox.value.left + item.x * imgBox.value.width),
      y: e.clientY - (imgBox.value.top + item.y * imgBox.value.height),
    };
    window.addEventListener('mousemove', onTextMouseMove);
    window.addEventListener('mouseup', onTextMouseUp);
  }

  function onTextMouseMove(e: MouseEvent) {
    if (draggingId.value === null) return;
    const idx = props.textItems.findIndex((t) => t.id === draggingId.value);
    if (idx === -1) return;
    const item = { ...props.textItems[idx] };
    const box = document.getElementById('text-box-' + item.id)?.getBoundingClientRect();
    const boxWidth = box?.width || 0;
    const boxHeight = box?.height || 0;
    let x = (e.clientX - imgBox.value.left - dragOffset.value.x) / imgBox.value.width;
    let y = (e.clientY - imgBox.value.top - dragOffset.value.y) / imgBox.value.height;
    x = Math.max(0, x);
    y = Math.max(0, y);
    if (boxWidth && imgBox.value.width) {
      x = Math.min(x, 1 - boxWidth / imgBox.value.width);
    }
    if (boxHeight && imgBox.value.height) {
      y = Math.min(y, 1 - boxHeight / imgBox.value.height);
    }
    item.x = x;
    item.y = y;
    const newItems = props.textItems.map((t, i) => (i === idx ? item : t));
    emit('update:textItems', newItems);
  }

  function onTextMouseUp() {
    draggingId.value = null;
    window.removeEventListener('mousemove', onTextMouseMove);
    window.removeEventListener('mouseup', onTextMouseUp);
  }

  return {
    imgRef,
    imgBox,
    draggingId,
    updateImgBox,
    onTextMouseDown,
    onTextMouseMove,
    onTextMouseUp,
  };
} 