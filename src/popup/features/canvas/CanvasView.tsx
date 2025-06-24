import React, { useEffect, useMemo } from 'react'

import ImageDraw from '~popup/components/ImageDraw'
import TextDraw from '~popup/components/TextDraw'
import { useMemeStore } from '~popup/stores/meme'
import { getDefaultImagePadding } from '~shared/utils'

export default function CanvasView() {
  const imageSrc = useMemeStore((s) => s.imageSrc)
  const imageElement = useMemeStore((s) => s.imageElement)
  const textItemMap = useMemeStore((s) => s.textItemMap)
  const { setImageElement, setImagePadding } = useMemeStore()

  // 加载图片，仅在 imageSrc 变化时执行一次
  useEffect(() => {
    if (!imageSrc) return

    const img = new Image()
    img.onload = () => {
      setImageElement(img)
      const padding = getDefaultImagePadding(img)
      setImagePadding(padding)
    }
    img.onerror = () => {
      console.error('Failed to load image:', imageSrc)
      setImageElement(null)
    }
    img.src = imageSrc
  }, [imageSrc])

  // 动态样式计算
  const dynamicStyleForDiv = useMemo(() => {
    if (!imageElement) return {}

    const styles: React.CSSProperties = {
      aspectRatio: `${imageElement.naturalWidth} / ${imageElement.naturalHeight}`,
    }

    if (imageElement.naturalWidth > imageElement.naturalHeight) {
      styles.width = '100%'
    } else {
      styles.height = '100%'
    }

    return styles
  }, [imageElement])

  if (!imageSrc || !imageElement) {
    return <></>
  }

  return (
    <div className="w-full aspect-square bg-base-200 flex items-center justify-center">
      <div className="relative" style={dynamicStyleForDiv}>
        <ImageDraw />
        {Array.from(textItemMap.keys()).map((key) => (
          <TextDraw key={key} itemId={key} />
        ))}
      </div>
    </div>
  )
}
