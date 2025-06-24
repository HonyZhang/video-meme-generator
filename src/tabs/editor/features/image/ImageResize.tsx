import CropPixelSettings from '~tabs/editor/components/CropPixelSettings'
import { useEditorStore } from '~tabs/editor/stores/index'

// 裁剪主面板
export default function ImageResize() {
  const imageElement = useEditorStore((s) => s.imageElement)
  const actualCropPixels = useEditorStore((s) => s.actualCropPixels)
  const { setImageElement, setCrop, setCropSize, setActualCropPixels } =
    useEditorStore()

  // 裁剪操作
  const handleCrop = () => {
    if (!imageElement || !actualCropPixels) return

    const { x, y, width, height } = actualCropPixels
    console.log('开始裁剪:', { x, y, width, height })

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(imageElement, x, y, width, height, 0, 0, width, height)
    const croppedImg = new window.Image()
    croppedImg.src = canvas.toDataURL()
    croppedImg.onload = () => {
      console.log(
        '裁剪完成，新图片尺寸:',
        croppedImg.naturalWidth,
        'x',
        croppedImg.naturalHeight
      )

      // 重置基本参数（zoom会由ImageCropPreview自动计算）
      setCrop({ x: 0, y: 0 })
      setCropSize({
        width: croppedImg.naturalWidth,
        height: croppedImg.naturalHeight,
      })
      setActualCropPixels(null)

      // 设置新图片（ImageCropPreview会自动计算最佳zoom）
      setImageElement(croppedImg)

      console.log('裁剪完成，已重置参数，zoom将自动计算')
    }
  }

  return (
    <div className="flex flex-col flex-1 gap-4  p-4 rounded-xl mx-4">
      {/* <div className="text-sm font-semibold text-center mb-2">像素裁剪</div> */}
      <CropPixelSettings />
      <button
        className="btn btn-primary btn-sm w-full"
        onClick={handleCrop}
        disabled={!imageElement || !actualCropPixels}>
        裁剪
      </button>
    </div>
  )
}
