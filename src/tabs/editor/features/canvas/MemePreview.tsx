import { useEffect, useMemo, useRef, useState } from 'react'

import ImageCanvas from '~tabs/editor/components/ImageCanvas'
import ImageCropPreview from '~tabs/editor/components/ImageCropPreview'
import TextItemPreview from '~tabs/editor/components/TextItemPreview'
import TextItemsCanvas from '~tabs/editor/components/TextItemsCanvas'
import { useEditorStore } from '~tabs/editor/stores'

export default function MemePreview() {
  const activeTab = useEditorStore((s) => s.activeTab)
  const textItemMap = useEditorStore((s) => s.textItemMap)
  const imageElement = useEditorStore((s) => s.imageElement)
  const imagePreviewRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const node = imagePreviewRef.current
    if (!node) return

    setContainerSize({
      width: node.clientWidth,
      height: node.clientHeight,
    })
  }, [imagePreviewRef.current])

  const dynamicStyleForDiv = useMemo(() => {
    if (!imageElement || !containerSize.width || !containerSize.height)
      return {}

    const imageAspectRatio =
      imageElement.naturalWidth / imageElement.naturalHeight
    const containerAspectRatio = containerSize.width / containerSize.height

    let width: string
    let height: string

    if (imageAspectRatio > containerAspectRatio) {
      // 图片更宽，宽度撑满，高度自适应
      width = '100%'
      height = 'auto'
    } else {
      // 图片更高或等宽， 高度撑满，宽度自适应
      height = '100%'
      width = 'auto'
    }

    return {
      width,
      height,
      aspectRatio: imageAspectRatio,
    }
  }, [imageElement, containerSize])

  return (
    <div
      ref={imagePreviewRef}
      className="flex flex-1 items-center justify-center h-full w-full p-4">
      <div
        className="relative border-2 border-base-300 rounded-lg"
        style={dynamicStyleForDiv}>
        {activeTab === 'imageResize' && (
          <>
            <ImageCropPreview />
            {/* <TextItemsCanvas /> */}
          </>
        )}
        {activeTab === 'addText' && (
          <>
            <ImageCanvas />
          </>
        )}
        {Array.from(textItemMap.values()).map((item) => (
          <TextItemPreview key={item.id} textItemId={item.id} />
        ))}
      </div>
    </div>
  )
}
