import { useEffect, useRef } from 'react'
import Cropper from 'react-easy-crop'

import { useEditorStore } from '../stores'

export default function ImageCropPreview() {
  const imageElement = useEditorStore((s) => s.imageElement)
  const crop = useEditorStore((s) => s.crop)
  const cropSize = useEditorStore((s) => s.cropSize)
  const zoom = useEditorStore((s) => s.zoom)
  const { setCrop, setZoom, setCropSize, setMediaSize, setActualCropPixels } =
    useEditorStore()

  const containerRef = useRef(null)

  // 计算最佳zoom值的函数
  const calculateOptimalZoom = (imageWidth, imageHeight) => {
    if (!containerRef.current) return 1

    const containerWidth = containerRef.current.clientWidth
    const containerHeight = containerRef.current.clientHeight

    if (containerWidth === 0 || containerHeight === 0) return 1

    const scaleX = containerWidth / imageWidth
    const scaleY = containerHeight / imageHeight
    const optimalZoom = Math.min(scaleX, scaleY, 3) // 限制最大zoom为3，确保不会太大

    console.log('容器尺寸:', containerWidth, 'x', containerHeight)
    console.log('图片尺寸:', imageWidth, 'x', imageHeight)
    console.log('计算最佳zoom:', optimalZoom)

    return Math.max(optimalZoom, 0.1) // 确保zoom不小于0.1
  }

  // 监听图片变化，确保新图片加载时重置参数
  useEffect(() => {
    if (
      imageElement &&
      imageElement.naturalWidth &&
      imageElement.naturalHeight
    ) {
      const optimalZoom = calculateOptimalZoom(
        imageElement.naturalWidth,
        imageElement.naturalHeight
      )

      setCrop({ x: 0, y: 0 })
      setZoom(optimalZoom)
      console.log('图片已更新，设置zoom:', optimalZoom)
    }
  }, [imageElement?.src, setCrop, setZoom, imageElement])

  const handleMediaLoaded = (mediaSize) => {
    setMediaSize(mediaSize)

    // 计算合适的zoom让图片充满容器
    const optimalZoom = calculateOptimalZoom(
      mediaSize.naturalWidth,
      mediaSize.naturalHeight
    )

    // 设置参数让图片充满容器
    setCrop({ x: 0, y: 0 })
    setZoom(optimalZoom)
    setCropSize({
      width: mediaSize.naturalWidth,
      height: mediaSize.naturalHeight,
    })

    console.log(
      '媒体已加载, 原始尺寸:',
      mediaSize.naturalWidth,
      'x',
      mediaSize.naturalHeight,
      ', zoom:',
      optimalZoom
    )
  }

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    // 直接存储裁剪像素信息，不进行额外的坐标转换
    setActualCropPixels(croppedAreaPixels)
    console.log('当前裁剪区域 (原始像素):', croppedAreaPixels)
  }

  const handleCropChange = (newCrop) => {
    // 直接更新crop坐标
    setCrop(newCrop)
  }

  const handleCropSizeChange = (newCropSize) => {
    // 直接更新crop尺寸
    setCropSize(newCropSize)
  }

  return (
    <div
      ref={containerRef}
      className="absolute top-0 left-0 w-full h-full z-100">
      <Cropper
        image={imageElement.src}
        crop={crop}
        cropSize={cropSize}
        zoom={zoom}
        onCropChange={handleCropChange}
        onCropSizeChange={handleCropSizeChange}
        onMediaLoaded={handleMediaLoaded}
        onZoomChange={setZoom}
        onCropComplete={onCropComplete}
        restrictPosition={true}
      />
    </div>
  )
}
