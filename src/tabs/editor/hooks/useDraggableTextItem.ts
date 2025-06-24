import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'

import { useEditorStore } from '../stores'

// 拖拽起始点类型
type Point = { x: number; y: number }

interface UseDraggableTextItemProps {
  textItemId: string
  textRef: RefObject<HTMLDivElement>
  scale: number
}

// 计算文本在图片坐标系下的宽高（包含 border 和 padding）
function getTextItemSize(textRef: RefObject<HTMLDivElement>, scale: number) {
  if (!textRef.current) return { width: 0, height: 0 }
  return {
    width: textRef.current.offsetWidth / scale,
    height: textRef.current.offsetHeight / scale,
  }
}

// 限制坐标在图片范围内
function clampPosition(
  x: number,
  y: number,
  maxX: number,
  maxY: number,
  imagePadding: number
) {
  return {
    x: Math.max(imagePadding, Math.min(x, maxX - imagePadding)),
    y: Math.max(imagePadding, Math.min(y, maxY - imagePadding)),
  }
}

export function useDraggableTextItem({
  textItemId,
  textRef,
  scale,
}: UseDraggableTextItemProps) {
  const [isDragging, setIsDragging] = useState(false)
  const startMouseRef = useRef<Point>({ x: 0, y: 0 })
  const startPosRef = useRef<Point>({ x: 0, y: 0 })
  const textItem = useEditorStore((s) => s.textItemMap.get(textItemId))
  const imageElement = useEditorStore((s) => s.imageElement)
  const setTextItem = useEditorStore((s) => s.setTextItem)
  const imagePadding = useEditorStore((s) => s.imagePadding)

  // 鼠标按下，开始拖拽
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!textItem) return
    setIsDragging(true)
    console.log('handleMouseDown', e.clientX, e.clientY, textItem.x, textItem.y)
    startMouseRef.current = { x: e.clientX, y: e.clientY }
    startPosRef.current = { x: textItem.x || 0, y: textItem.y || 0 }
    e.preventDefault()
  }

  // 拖拽移动与边界限制
  useEffect(() => {
    if (!isDragging) return
    function handleMouseMove(e: MouseEvent) {
      if (!textItem || !textRef.current || !imageElement) return
      console.log('handleMouseMove', e.clientX, e.clientY)
      // 鼠标移动距离要除以 scale，得到 image 坐标系下的偏移
      const dx = (e.clientX - startMouseRef.current.x) / scale
      const dy = (e.clientY - startMouseRef.current.y) / scale
      let newX = startPosRef.current.x + dx
      let newY = startPosRef.current.y + dy
      // 计算文本实际宽高（image 坐标系下，包含 border 和 padding）
      const { width: textWidth, height: textHeight } = getTextItemSize(
        textRef,
        scale
      )
      // 限制在图片范围内
      const maxX = (imageElement.naturalWidth || 0) - textWidth
      const maxY = (imageElement.naturalHeight || 0) - textHeight
      const { x, y } = clampPosition(newX, newY, maxX, maxY, imagePadding)
      setTextItem({ ...textItem, x, y })
    }
    function handleMouseUp() {
      setIsDragging(false)
    }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, setTextItem, textItem, scale, imageElement, textRef])

  return { handleMouseDown, isDragging }
}
