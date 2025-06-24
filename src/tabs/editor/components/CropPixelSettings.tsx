import { useEditorStore } from '~tabs/editor/stores/index'

export default function CropPixelSettings() {
  const crop = useEditorStore((s) => s.crop)
  const cropSize = useEditorStore((s) => s.cropSize)
  const { setCrop, setCropSize } = useEditorStore()

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex items-center gap-4">
        <label className="text-sm font-semibold">X</label>
        <input
          type="number"
          className="input input-sm w-20"
          min={0}
          value={isFinite(crop.x) ? crop.x : 0}
          onChange={(e) => setCrop({ ...crop, x: Number(e.target.value) || 0 })}
        />
      </div>
      <div className="flex items-center gap-4">
        <label className="text-sm font-semibold">Y</label>
        <input
          type="number"
          className="input input-sm w-20"
          min={0}
          value={isFinite(crop.y) ? crop.y : 0}
          onChange={(e) => setCrop({ ...crop, y: Number(e.target.value) || 0 })}
        />
      </div>
      <div className="flex items-center gap-4">
        <label className="text-sm font-semibold">宽</label>
        <input
          type="number"
          className="input input-sm w-20"
          min={1}
          value={isFinite(cropSize.width) ? cropSize.width : 100}
          onChange={(e) =>
            setCropSize({ ...cropSize, width: Number(e.target.value) || 1 })
          }
        />
      </div>
      <div className="flex items-center gap-4">
        <label className="text-sm font-semibold">高</label>
        <input
          type="number"
          className="input input-sm w-20"
          min={1}
          value={isFinite(cropSize.height) ? cropSize.height : 100}
          onChange={(e) =>
            setCropSize({ ...cropSize, height: Number(e.target.value) || 1 })
          }
        />
      </div>
    </div>
  )
}
