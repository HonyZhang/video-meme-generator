import { useEffect, useMemo, useRef, useState } from 'react'

import { useEditorStore } from '~tabs/editor/stores'

import { useDraggableTextItem } from '../hooks/useDraggableTextItem'

// 拖拽起始点类型
type Point = { x: number; y: number }

export default function TextItemPreview({
  textItemId,
}: {
  textItemId: string
}) {
  // 获取文本项、图片元素、更新方法
  const textItem = useEditorStore((s) => s.textItemMap.get(textItemId))
  const setTextItem = useEditorStore((s) => s.setTextItem)
  const imageElement = useEditorStore((s) => s.imageElement)

  // DOM引用
  const textRef = useRef<HTMLDivElement>(null)
  const parentRef = useRef<HTMLElement | null>(null)
  const [parentSize, setParentSize] = useState<{
    width: number
    height: number
  }>({ width: 1, height: 1 })

  // 初始化父容器引用和尺寸
  useEffect(() => {
    if (textRef.current) {
      parentRef.current = textRef.current.parentElement as HTMLElement
      if (parentRef.current) {
        const rect = parentRef.current.getBoundingClientRect()
        setParentSize({ width: rect.width, height: rect.height })
      }
    }
  }, [])

  // 监听父容器尺寸变化（如窗口缩放）
  useEffect(() => {
    if (!parentRef.current) return
    const handleResize = () => {
      const rect = parentRef.current!.getBoundingClientRect()
      setParentSize({ width: rect.width, height: rect.height })
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 计算缩放比例（以图片宽度为基准）
  const scale = useMemo(() => {
    if (!imageElement?.naturalWidth) return 1
    return parentSize.width / imageElement.naturalWidth
  }, [imageElement, parentSize.width])

  // 使用拖拽 hooks
  const { handleMouseDown } = useDraggableTextItem({
    textItemId,
    textRef,
    scale,
  })

  // 渲染样式（缩放后）
  const style = useMemo(
    () => ({
      borderColor: textItem?.fontColor,
      fontSize: (textItem?.fontSize || 16) * scale,
      fontFamily: `"${textItem?.fontFamily}", sans-serif`,
      color: textItem?.fontColor,
      left: (textItem?.x || 0) * scale - 2,
      top: (textItem?.y || 0) * scale - 2,
    }),
    [textItem, scale]
  )

  return (
    <div
      ref={textRef}
      className="absolute text-left align-top z-101 border-2 border-dashed rounded-3xl cursor-move select-none leading-none"
      style={style}
      tabIndex={0}
      aria-label="可拖拽文本"
      onMouseDown={handleMouseDown}
      role="button">
      {textItem?.text}
    </div>
  )
}
