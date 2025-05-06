import { ref } from 'vue';

export function useTextItems(props: { textItems: any[] }, emit: any) {
  let idCounter = ref(1);
  const newText = ref('');

  function addText() {
    if (!newText.value.trim()) return;
    const newItem = {
      id: idCounter.value++,
      text: newText.value.trim(),
      x: 0.5,
      y: 0.05 + props.textItems.length * 0.1,
      fontFamily: 'Impact',
      fontColor: '#ffffff',
      fontSize: 32,
    };
    emit('update:textItems', [...props.textItems, newItem]);
    newText.value = '';
  }

  function removeText(id: number) {
    emit('update:textItems', props.textItems.filter((t) => t.id !== id));
  }

  function updateTextItem(id: number, key: string, value: any) {
    const newItems = props.textItems.map((item) =>
      item.id === id ? { ...item, [key]: value } : item
    );
    emit('update:textItems', newItems);
  }

  return {
    newText,
    addText,
    removeText,
    updateTextItem,
  };
} 