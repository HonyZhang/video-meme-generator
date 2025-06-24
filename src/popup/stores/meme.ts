import { create } from 'zustand'

import type { TextItem } from '~shared/types/textItems'
import { getDefaultFontSize, getTextItemPosition } from '~shared/utils'

interface MemeStore {
  imageSrc: string | null
  setImageSrc: (v: string | null) => void

  imageElement: HTMLImageElement | null
  setImageElement: (v: HTMLImageElement | null) => void

  textItemMap: Map<string, TextItem>
  setTextItem: (item: TextItem) => void
  deleteTextItem: (id: string) => void

  imagePadding: number
  setImagePadding: (v: number) => void

  clear: () => void
}

export const useMemeStore = create<MemeStore>((set) => ({
  imageSrc: null,
  setImageSrc: (v) => set({ imageSrc: v }),

  imageElement: null,
  setImageElement: (v) => set({ imageElement: v }),

  textItemMap: new Map(),
  setTextItem: (item) =>
    set((state) => {
      const newMap = new Map(state.textItemMap)
      const tempItem = { ...item }
      const imageElement = state.imageElement
      const { x, y } = getTextItemPosition(
        item,
        imageElement,
        state.imagePadding
      )
      tempItem.x = x
      tempItem.y = y

      newMap.set(item.id, tempItem)
      return { textItemMap: newMap }
    }),
  deleteTextItem: (id) =>
    set((state) => {
      const newMap = new Map(state.textItemMap)
      newMap.delete(id)
      return { textItemMap: newMap }
    }),

  imagePadding: 10,
  setImagePadding: (v) => set({ imagePadding: v }),

  clear: () =>
    set({ imageSrc: null, imageElement: null, textItemMap: new Map() }),
}))
