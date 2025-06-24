import { useMemeStore } from '~popup/stores/meme'
import { i18n } from '~shared/utils'

export default function TextItemCard({ itemId }: { itemId: string }) {
  const textItem = useMemeStore((state) => state.textItemMap.get(itemId))
  const { setTextItem, deleteTextItem } = useMemeStore()

  return (
    <div className="flex gap-2">
      <input
        type="text"
        className="input input-bordered w-full"
        value={textItem?.text}
        onChange={(e) => {
          setTextItem({ ...textItem, text: e.target.value })
        }}
      />
      <input
        type="color"
        className="input input-bordered w-28"
        value={textItem?.fontColor}
        onChange={(e) => {
          setTextItem({ ...textItem, fontColor: e.target.value })
        }}
      />
      <select
        className="select select-bordered w-28"
        value={textItem?.position}
        onChange={(e) => {
          setTextItem({
            ...textItem,
            position: e.target.value as 'top' | 'middle' | 'bottom',
          })
        }}>
        <option value="top">{i18n('popup_position_top')}</option>
        <option value="middle">{i18n('popup_position_middle')}</option>
        <option value="bottom">{i18n('popup_position_bottom')}</option>
      </select>
      
      <button
        className="btn btn-error"
        onClick={() => {
          deleteTextItem(itemId)
        }}>
        {i18n('popup_remove_text')}
      </button>
    </div>
  )
}
