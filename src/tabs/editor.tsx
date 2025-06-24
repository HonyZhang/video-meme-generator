// src/tabs/editor.tsx
import { useEffect, useState } from 'react'

import { Storage } from '@plasmohq/storage'

import { loadFonts } from '~shared/utils/fontUtils'
import { useEditorStore } from '~tabs/editor/stores'

import MemePreview from './editor/features/canvas/MemePreview'
import ControlPanel from './editor/features/ControlPanel'

import '../styles/main.css'

import type { TextItem } from '~shared/types/textItems'
import { getDefaultImagePadding } from '~shared/utils'

const storage = new Storage({ area: 'local' })

const isVite = typeof import.meta.env !== 'undefined'

export default function Editor() {
  const [imageSrc, setImageSrc] = useState('')
  const [fontsLoaded, setFontsLoaded] = useState(false)
  const imageElement = useEditorStore((s) => s.imageElement)
  const { setImageElement, setImagePadding, setTextItemMap } = useEditorStore()

  // 预加载所有字体
  useEffect(() => {
    const loadAllFonts = async () => {
      try {
        const availableFonts = [
          'SourceHanSansSC',
          'CEFFontsCJK',
          'LXGWWenKai',
          'Anton',
          'Bangers',
          'AlibabaSans',
          'SmileySans',
          'Arial',
        ]
        await loadFonts(availableFonts)
        setFontsLoaded(true)
        console.log('所有字体已预加载完成')
      } catch (error) {
        console.error('字体加载失败:', error)
        setFontsLoaded(true) // 即使失败也继续显示
      }
    }
    loadAllFonts()
  }, [])

  useEffect(() => {
    const loadData = async () => {
      const src = isVite
        ? localStorage.getItem('imageSrc') ?? ''
        : (await storage.get('imageSrc')) ?? ''
      setImageSrc(src)
      if (isVite) {
        const textItems = JSON.parse(localStorage.getItem('textItems') ?? '[]')
        const textItemMap = new Map()
        textItems.forEach((item: TextItem) => {
          textItemMap.set(item.id, item)
        })
        setTextItemMap(textItemMap)
      } else {
        const textItems = ((await storage.get('textItems')) as TextItem[]) ?? []
        const textItemMap = new Map()
        textItems.forEach((item: TextItem) => {
          textItemMap.set(item.id, item)
        })
        setTextItemMap(textItemMap)
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    if (!imageSrc) return
    const img = new Image()
    img.src = imageSrc
    img.onload = async () => {
      setImageElement(img)
      if (isVite) {
        const padding =
          Number(localStorage.getItem('imagePadding') ?? 0) ??
          getDefaultImagePadding(img)
        setImagePadding(padding)
      } else {
        const padding =
          Number((await storage.get('imagePadding')) ?? 0) ??
          getDefaultImagePadding(img)
        setImagePadding(padding)
      }
    }
    img.onerror = () => {
      console.error('Failed to load image:', imageSrc)
      setImageElement(null)
    }
  }, [imageSrc])

  if (!imageElement || !fontsLoaded) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <div className="text-center">
          {!imageElement && <div>正在加载图片...</div>}
          {!fontsLoaded && <div>正在加载字体...</div>}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center h-screen w-screen overflow-hidden">
      <ControlPanel />
      <MemePreview />
    </div>
  )
}
