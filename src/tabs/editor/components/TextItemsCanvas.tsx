import { useLayoutEffect, useRef } from 'react'

import { setupHiDPICanvas } from '~shared/utils/canvasUtils'
import { loadFontsFromTextItems } from '~shared/utils/fontUtils'
import { useEditorStore } from '~tabs/editor/stores'

export default function TextItemsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const textItemMap = useEditorStore((s) => s.textItemMap)
  const imageElement = useEditorStore((s) => s.imageElement)

  useLayoutEffect(() => {
    if (!canvasRef.current || !textItemMap || !imageElement) return

    const renderCanvas = async () => {
      const ctx = setupHiDPICanvas(
        canvasRef.current!,
        imageElement.width,
        imageElement.height
      )
      if (!ctx) return

      // 先加载所有需要的字体
      const textItems = Array.from(textItemMap.values())
      await loadFontsFromTextItems(textItems)

      // 清除画布
      ctx.clearRect(0, 0, imageElement.width, imageElement.height)

      // 渲染文本
      for (const item of textItems) {
        ctx.font = `${item.fontSize}px "${item.fontFamily}", sans-serif`
        ctx.fillStyle = item.fontColor
        ctx.textAlign = 'left'
        ctx.textBaseline = 'top'
        ctx.fillText(item.text, item.x, item.y)
      }
    }

    renderCanvas()
  }, [textItemMap, imageElement])

  return (
    <canvas
      ref={canvasRef}
      className="absolute z-20 top-0 left-0 w-full h-full"
    />
  )
}
