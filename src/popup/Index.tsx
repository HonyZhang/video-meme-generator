import { useEffect, useState } from 'react'

import '~styles/main.css'

import { useHasScrollbar } from '~shared/hooks/useHasScrollbar'
import { useEditorStore } from '~tabs/editor/stores/index'

import CanvasView from './features/canvas/CanvasView'
import ActionPanel from './features/controls/ActionPanel'
import TextEditor from './features/text/TextEditor'
import { useMemeStore } from './stores/meme'

export default function Index() {
  const textItemMap = useEditorStore((s) => s.textItemMap)
  const imageSrc = useMemeStore((s) => s.imageSrc)
  const { setImageSrc } = useMemeStore()
  const [ready, setReady] = useState(false)
  const [scrollRef, hasVerticalScrollbar] = useHasScrollbar<HTMLDivElement>(
    'vertical',
    [textItemMap.size]
  )

  useEffect(() => {
    const init = async () => {
      try {
        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        })

        if (tab?.id) {
          const res = await chrome.tabs.sendMessage(tab.id, {
            type: 'capture-frame',
          })
          res?.image && setImageSrc(res.image)
        }
        setReady(true)
      } catch (err) {
        console.error('初始化失败:', err)
      }
    }

    init()
  }, [setImageSrc])

  if (!ready) {
    return (
      <div
        className={`p-4 space-y-4 w-100 max-h-150 overflow-y-auto ${hasVerticalScrollbar ? 'pr-0' : ''}`}
        ref={scrollRef}>
        <h1 className="text-xl font-bold text-center">
          {chrome.i18n.getMessage('popup_title')}
        </h1>
        <p className="flex justify-center items-center min-h-20 text-primary text-sm">
          {chrome.i18n.getMessage('popup_loading') || '加载中...'}
        </p>
      </div>
    )
  }

  if (!imageSrc) {
    return (
      <div className="p-4 space-y-4 w-100 max-h-150 overflow-y-auto">
        <h1 className="text-xl font-bold text-center">
          {chrome.i18n.getMessage('popup_title')}
        </h1>
        <p className="flex justify-center items-center min-h-20 text-error text-sm">
          {chrome.i18n.getMessage('popup_no_video_tip')}
        </p>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4 w-100 max-h-150 overflow-y-auto">
      <h1 className="text-xl font-bold text-center">
        {chrome.i18n.getMessage('popup_title')}
      </h1>

      <CanvasView />
      <ActionPanel />
      <TextEditor />
    </div>
  )
}
