import { create } from 'zustand'

import type { TextItem } from '~shared/types/textItems'

interface EditorStore {
  activeTab: string
  setActiveTab: (tab: string) => void

  imageElement: HTMLImageElement | null
  setImageElement: (element: HTMLImageElement | null) => void

  textItemMap: Map<string, TextItem>
  setTextItemMap: (map: Map<string, TextItem>) => void
  setTextItem: (item: TextItem) => void
  deleteTextItem: (id: string) => void

  imagePadding: number
  setImagePadding: (v: number) => void

  crop: { x: number; y: number }
  setCrop: (crop: { x: number; y: number }) => void

  cropSize: { width: number; height: number }
  setCropSize: (cropSize: { width: number; height: number }) => void

  mediaSize: { width: number; height: number }
  setMediaSize: (mediaSize: { width: number; height: number }) => void

  zoom: number
  setZoom: (zoom: number) => void

  aspectRatio: { width: number; height: number }
  setAspectRatio: (aspectRatio: { width: number; height: number }) => void

  // 实际裁剪像素区域（由react-easy-crop提供）
  actualCropPixels: {
    x: number
    y: number
    width: number
    height: number
  } | null
  setActualCropPixels: (
    cropPixels: { x: number; y: number; width: number; height: number } | null
  ) => void

  clear: () => void
}

export const useEditorStore = create<EditorStore>((set) => ({
  activeTab: 'imageResize',
  setActiveTab: (tab) => set({ activeTab: tab }),

  imageElement: null,
  setImageElement: (element) => set({ imageElement: element }),

  textItemMap: new Map(),
  setTextItemMap: (map) => set({ textItemMap: map }),
  setTextItem: (item) =>
    set((state) => {
      const newMap = new Map(state.textItemMap)
      const tempItem = { ...item }

      newMap.set(item.id, tempItem)
      return { textItemMap: newMap }
    }),
  deleteTextItem: (id) =>
    set((state) => {
      const newMap = new Map(state.textItemMap)
      newMap.delete(id)
      return { textItemMap: newMap }
    }),

  imagePadding: 0,
  setImagePadding: (v) => set({ imagePadding: v }),

  crop: { x: 0, y: 0 },
  setCrop: (crop) => set({ crop }),
  zoom: 1,
  setZoom: (zoom) => set({ zoom }),

  aspectRatio: { width: 1, height: 1 },
  setAspectRatio: (aspectRatio) => set({ aspectRatio }),

  cropSize: { width: 100, height: 100 },
  setCropSize: (cropSize) => set({ cropSize }),

  mediaSize: { width: 0, height: 0 },
  setMediaSize: (mediaSize) => set({ mediaSize }),

  actualCropPixels: null,
  setActualCropPixels: (cropPixels) => set({ actualCropPixels: cropPixels }),

  clear: () =>
    set({
      imageElement: null,
      textItemMap: new Map(),
      imagePadding: 0,
      actualCropPixels: null,
    }),
}))
