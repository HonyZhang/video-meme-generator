import React, { useEffect, useRef, useState } from 'react'
import { v4 as uuid } from 'uuid'

import { useHasScrollbar } from '~shared/hooks/useHasScrollbar'
import type { TextItem } from '~shared/types/textItems'
import { getDefaultFontSize } from '~shared/utils'
import { getTextItemPosition } from '~shared/utils/positionUtils'
import { useEditorStore } from '~tabs/editor/stores/index'

import TextItemCard from '../../components/TextItemCard'

const createDefaultTextItem = () => {
  return {
    id: uuid(),
    text: '',
    position: 'middle',
    fontFamily: 'SmileySans',
    fontColor: '#000000',
  } as TextItem
}

export default function TextEditor() {
  const textItemMap = useEditorStore((state) => state.textItemMap)
  const imageElement = useEditorStore((state) => state.imageElement)
  const imagePadding = useEditorStore((state) => state.imagePadding)
  const [newTextItem, setNewTextItem] = useState<TextItem>(
    createDefaultTextItem
  )

  const { setTextItem } = useEditorStore()

  const [scrollRef, hasVerticalScrollbar] = useHasScrollbar<HTMLDivElement>(
    'vertical',
    [textItemMap.size]
  )

  const handleAddText = () => {
    if (newTextItem.text.trim() === '') {
      return
    }
    const tempTextItem = {
      ...newTextItem,
      fontSize: getDefaultFontSize(imageElement?.height || 0),
    }
    const { x, y } = getTextItemPosition(
      tempTextItem,
      imageElement,
      imagePadding
    )
    setTextItem({
      ...tempTextItem,
      x,
      y,
    })
    setNewTextItem(createDefaultTextItem())
  }

  return (
    <fieldset className="flex flex-1 flex-col gap-2 rounded overflow-hidden">
      <div className="flex px-4 pt-2">
        <input
          value={newTextItem.text}
          onChange={(e) =>
            setNewTextItem({ ...newTextItem, text: e.target.value })
          }
          className="input flex-1 bg-base-100 text-base-content border-base-300"
          placeholder="请输入文字"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAddText()
            }
          }}
        />
        <button
          className="btn btn-primary ml-2"
          onClick={handleAddText}
          type="button">
          添加
        </button>
      </div>
      <div
        ref={scrollRef}
        className={`flex flex-col gap-2 p-4 overflow-y-auto flex-1 overscroll-y-contain ${hasVerticalScrollbar ? 'pr-0' : ''}`}>
        {Array.from(textItemMap.keys()).map((id) => (
          <TextItemCard key={id} textItemId={id} />
        ))}
      </div>
    </fieldset>
  )
}
