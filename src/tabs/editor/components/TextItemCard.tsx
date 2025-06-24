import { useEditorStore } from '~tabs/editor/stores'

const fontOptions = [
  { value: 'SourceHanSansSC', label: '思源黑体 - 粗体强劲' },
  { value: 'CEFFontsCJK', label: '快去写作业 - 鼠标手绘' },
  { value: 'LXGWWenKai', label: '霞鹜文楷 - 文艺手写' },
  { value: 'Anton', label: 'Anton - 极粗显示' },
  { value: 'Bangers', label: 'Bangers - 漫画风格' },
  { value: 'AlibabaSans', label: '阿里巴巴普惠体' },
  { value: 'SmileySans', label: '得意黑' },
  { value: 'Arial', label: 'Arial - 经典无衬线' },
]

export default function TextItemCard({ textItemId }: { textItemId: string }) {
  const textItem = useEditorStore((state) => state.textItemMap.get(textItemId))
  const { setTextItem, deleteTextItem } = useEditorStore()

  return (
    <div className="card bg-base-100 shadow-sm border border-base-300 mb-2">
      <div className="card-body p-4 flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-1">
          <input
            value={textItem.text}
            className="input flex-1 bg-base-100 text-base-content border-base-300"
            onChange={(e) => setTextItem({ ...textItem, text: e.target.value })}
          />
          <button
            className="btn btn-error btn-sm"
            onClick={() => deleteTextItem(textItem.id)}
            type="button">
            删除
          </button>
        </div>
        <div className="flex items-center gap-2">
          <label>字体:</label>
          <select
            value={textItem.fontFamily}
            className="select flex-1 bg-base-100 text-base-content border-base-300 cursor-pointer"
            onChange={(e) =>
              setTextItem({ ...textItem, fontFamily: e.target.value })
            }>
            {fontOptions.map((opt) => (
              <option
                className="cursor-pointer"
                key={opt.value}
                value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <label>颜色:</label>
          <input
            value={textItem.fontColor}
            type="color"
            className="input w-12 h-10 bg-base-100 border-base-300"
            onChange={(e) =>
              setTextItem({ ...textItem, fontColor: e.target.value })
            }
          />
          <label>大小:</label>
          <input
            value={textItem.fontSize}
            type="number"
            min={10}
            max={120}
            className="input w-13 bg-base-100 text-base-content border-base-300"
            onChange={(e) =>
              setTextItem({ ...textItem, fontSize: Number(e.target.value) })
            }
          />
          <span>px</span>
        </div>
      </div>
    </div>
  )
}
