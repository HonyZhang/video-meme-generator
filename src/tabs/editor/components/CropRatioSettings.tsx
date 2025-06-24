import { useEffect, useMemo, useState } from 'react'

import { useEditorStore } from '~tabs/editor/stores/index'

import { useAspectRatioCropSize } from '../hooks/useAspectRatioCropSize'

const ratioOptions = [
  { label: '1:1', value: 0, aspectRatio: { width: 1, height: 1 } },
  { label: '16:9', value: 1, aspectRatio: { width: 16, height: 9 } },
  { label: '9:16', value: 2, aspectRatio: { width: 9, height: 16 } },
  { label: '自定义', value: 3, aspectRatio: { width: 1, height: 1 } },
]

function calculateCropSize(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  const mediaAspect = mediaWidth / mediaHeight

  if (mediaAspect > aspect) {
    // 宽比目标宽多，以高度为基准计算宽
    const height = mediaHeight
    const width = height * aspect
    return { width, height }
  } else {
    // 高比目标高多，以宽度为基准计算高
    const width = mediaWidth
    const height = width / aspect
    return { width, height }
  }
}

export default function CropRatioSettings() {
  const [selectedRatio, setSelectedRatio] = useState(ratioOptions[0])
  const aspectRatio = useMemo(() => {
    return selectedRatio.aspectRatio.width / selectedRatio.aspectRatio.height
  }, [selectedRatio])

  const mediaSize = useEditorStore((s) => s.mediaSize)
  const { setCrop, setCropSize } = useEditorStore()

  const cropSize = useAspectRatioCropSize(aspectRatio, mediaSize)

  useEffect(() => {
    setCropSize(cropSize)
    setCrop({ x: 0, y: 0 })
  }, [cropSize, setCrop, setCropSize])

  return (
    <div className="flex flex-col gap-4">
      <label className="text-sm font-semibold">预设比例</label>
      <select
        className="select select-sm w-full"
        value={selectedRatio.value}
        onChange={(e) =>
          setSelectedRatio(ratioOptions[Number(e.target.value)])
        }>
        {ratioOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {selectedRatio.value === ratioOptions[ratioOptions.length - 1].value && (
        <div className="flex items-center gap-4">
          <label className="text-sm font-semibold">宽</label>
          <input
            type="number"
            className="input input-sm w-20"
            min={1}
            value={selectedRatio.aspectRatio.width}
            onChange={(e) =>
              setSelectedRatio({
                ...selectedRatio,
                aspectRatio: {
                  ...selectedRatio.aspectRatio,
                  width: Number(e.target.value),
                },
              })
            }
          />
          <label className="text-sm font-semibold">高</label>
          <input
            type="number"
            className="input input-sm w-20"
            min={1}
            value={selectedRatio.aspectRatio.height}
            onChange={(e) =>
              setSelectedRatio({
                ...selectedRatio,
                aspectRatio: {
                  ...selectedRatio.aspectRatio,
                  height: Number(e.target.value),
                },
              })
            }
          />
        </div>
      )}
    </div>
  )
}
