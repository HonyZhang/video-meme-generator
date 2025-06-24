import { useLayoutEffect, useRef } from 'react'

import { useMemeStore } from '~popup/stores/meme'
import { setupHiDPICanvas } from '~shared/utils/canvasUtils'

export default function TextDraw({ itemId }: { itemId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const textItem = useMemeStore((s) => s.textItemMap.get(itemId))
  const imageElement = useMemeStore((s) => s.imageElement)

  useLayoutEffect(() => {
    if (!canvasRef.current || !textItem || !imageElement) return

    const ctx = setupHiDPICanvas(
      canvasRef.current,
      imageElement.width,
      imageElement.height
    )
    if (!ctx) return

    ctx.font = `${textItem.fontSize}px ${textItem.fontFamily}`
    ctx.fillStyle = textItem.fontColor
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    ctx.fillText(textItem.text, textItem.x, textItem.y)
  }, [textItem, imageElement])

  return (
    <canvas
      ref={canvasRef}
      className="absolute z-20 top-0 left-0 max-w-full max-h-full"
    />
  )
}
