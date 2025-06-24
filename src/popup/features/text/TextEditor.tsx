import { useMemo, useState } from 'react'
import { v4 as uuid } from 'uuid'

import TextItemCard from '~popup/components/TextItemCard'
import { useMemeStore } from '~popup/stores/meme'
import type { TextItem } from '~shared/types/textItems'
import { getDefaultFontSize, i18n } from '~shared/utils'

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
  const textItemMap = useMemeStore((state) => state.textItemMap)
  const imageElement = useMemeStore((state) => state.imageElement)
  const { setTextItem } = useMemeStore()

  const [newTextItem, setNewTextItem] = useState<TextItem>(
    createDefaultTextItem
  )

  const handleAddText = () => {
    if (newTextItem.text.trim() === '') {
      return
    }
    setTextItem({
      ...newTextItem,
      fontSize: getDefaultFontSize(imageElement?.height || 0),
    })
    setNewTextItem(createDefaultTextItem())
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          value={newTextItem.text}
          onChange={(e) =>
            setNewTextItem({ ...newTextItem, text: e.target.value })
          }
          className="input input-bordered w-full"
          type="text"
          placeholder={i18n('popup_input_placeholder')}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAddText()
            }
          }}
        />
        <button
          className="btn btn-primary"
          onClick={handleAddText}
          disabled={newTextItem.text.trim() === ''}>
          {i18n('popup_add_text')}
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {Array.from(textItemMap.keys()).map((id) => (
          <TextItemCard key={id} itemId={id} />
        ))}
      </div>
    </div>
  )
}
