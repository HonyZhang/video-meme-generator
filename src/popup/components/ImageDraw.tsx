import { useLayoutEffect, useRef } from 'react'

import { useMemeStore } from '~popup/stores/meme'
import { setupHiDPICanvas } from '~shared/utils'

export default function ImageDraw() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageElement = useMemeStore((s) => s.imageElement)

  useLayoutEffect(() => {
    if (!canvasRef.current || !imageElement) return

    const ctx = setupHiDPICanvas(
      canvasRef.current,
      imageElement.width,
      imageElement.height
    )
    if (!ctx) return

    ctx.drawImage(imageElement, 0, 0)
  }, [imageElement])

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 max-w-full max-h-full z-10"
    />
  )
}
