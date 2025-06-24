import { useLayoutEffect, useRef } from 'react'

import { setupHiDPICanvas } from '~shared/utils'

import { useEditorStore } from '../stores'

export default function ImageCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageElement = useEditorStore((s) => s.imageElement)

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
      className="absolute top-0 left-0 w-full h-full z-10"
    />
  )
}
