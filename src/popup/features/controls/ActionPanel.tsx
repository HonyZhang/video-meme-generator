import { useState } from 'react'

import { Storage } from '@plasmohq/storage'

import { useMemeStore } from '~popup/stores/meme' // 初始化 Plasmo 存储
import { setupHiDPICanvas } from '~shared/utils/canvasUtils'
import { loadFontsFromTextItems } from '~shared/utils/fontUtils'

// 初始化 Plasmo 存储
const storage = new Storage({ area: 'local' })

export default function ActionPanel() {
  const [downloading, setDownloading] = useState(false)
  const [opening, setOpening] = useState(false)

  const imageElement = useMemeStore((state) => state.imageElement)
  const textItemMap = useMemeStore((state) => state.textItemMap)
  const imagePadding = useMemeStore((state) => state.imagePadding)
  const { clear } = useMemeStore()

  const handleDownload = async () => {
    if (downloading) return
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

  const handleOpenEditor = async () => {
    if (opening) return
    setOpening(true)
    try {
      if (!imageElement) {
        alert(chrome.i18n.getMessage('popup_no_image'))
        setOpening(false)
        return
      }

      // 使用 Plasmo Storage 设置数据
      await storage.set('imageSrc', imageElement.src)
      await storage.set('imagePadding', imagePadding)
      await storage.set('textItems', Array.from(textItemMap.values()))

      clear()

      await chrome.tabs.create({
        url: chrome.runtime.getURL('tabs/editor.html'),
      })
    } catch {
      alert(chrome.i18n.getMessage('popup_open_failed'))
    } finally {
      setOpening(false)
    }
  }

  if (!imageElement) return null

  return (
    <div className="flex gap-2">
      <button
        className="btn btn-accent flex-1"
        disabled={downloading}
        title={chrome.i18n.getMessage('popup_download_title')}
        onClick={handleDownload}>
        {downloading && <span className="loading loading-spinner" />}
        {chrome.i18n.getMessage('popup_download')}
      </button>
      <button
        className="btn btn-secondary flex-1"
        disabled={opening}
        title={chrome.i18n.getMessage('popup_open_title')}
        onClick={handleOpenEditor}>
        {opening && <span className="loading loading-spinner" />}
        {chrome.i18n.getMessage('popup_open_editor')}
      </button>
    </div>
  )
}
