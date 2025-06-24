import { useState } from 'react'

import { setupHiDPICanvas } from '~shared/utils/canvasUtils'
import { loadFontsFromTextItems } from '~shared/utils/fontUtils'

import { useEditorStore } from '../stores'
import ImageResize from './image/ImageResize'
import TextEditor from './text/TextEditor'

const tabs = [
  {
    name: 'imageResize',
    label: '调整图片',
  },
  {
    name: 'addText',
    label: '添加文字',
  },
]

export default function ControlPanel() {
  const [downloading, setDownloading] = useState(false)
  const activeTab = useEditorStore((s) => s.activeTab)
  const imageElement = useEditorStore((s) => s.imageElement)
  const textItemMap = useEditorStore((s) => s.textItemMap)
  const { setActiveTab } = useEditorStore()

  const handleDownloadMeme = async () => {
    if (downloading || !imageElement) return
    setDownloading(true)

    try {
      const canvas = document.createElement('canvas')
      const ctx = setupHiDPICanvas(
        canvas,
        imageElement.naturalWidth,
        imageElement.naturalHeight
      )
      if (!ctx) {
        throw new Error('无法创建画布上下文')
      }

      // 绘制背景图片
      ctx.drawImage(
        imageElement,
        0,
        0,
        imageElement.naturalWidth,
        imageElement.naturalHeight
      )

      // 获取所有文字项并加载字体
      const textItems = Array.from(textItemMap.values())
      if (textItems.length > 0) {
        await loadFontsFromTextItems(textItems)

        // 绘制所有文字
        for (const item of textItems) {
          if (item.text && item.x !== undefined && item.y !== undefined) {
            ctx.font = `${item.fontSize || 16}px "${item.fontFamily || 'sans-serif'}", sans-serif`
            ctx.fillStyle = item.fontColor || '#000000'
            ctx.textAlign = 'left'
            ctx.textBaseline = 'top'
            ctx.fillText(item.text, item.x, item.y)
          }
        }
      }

      // 下载图片
      const image = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = image
      a.download = 'meme.png'
      a.click()

      canvas.remove()
      a.remove()
    } catch (error) {
      console.error('下载失败:', error)
      alert('下载失败，请重试')
    }

    setTimeout(() => setDownloading(false), 1000)
  }

  return (
    <div className="flex flex-col flex-none bg-base-200 w-110 h-full border-r border-base-300">
      {/* Tab 切换按钮 */}
      <div className="join mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            className={`flex-1 join-item btn rounded-none border-none ${activeTab === tab.name ? 'btn-active' : ''}`}
            name="editor-tabs"
            aria-label={tab.label}
            onClick={() => setActiveTab(tab.name)}>
            {tab.label}
          </button>
        ))}
      </div>
      {/* 内容区 */}
      {activeTab === 'imageResize' && <ImageResize />}
      {activeTab === 'addText' && <TextEditor />}
      <div className="p-4">
        <button
          className="btn btn-primary w-full"
          onClick={handleDownloadMeme}
          disabled={downloading || !imageElement}>
          {downloading && <span className="loading loading-spinner" />}
          下载图片
        </button>
      </div>
    </div>
  )
}
