import { useEffect, useRef, useState } from 'react'

type Direction = 'vertical' | 'horizontal'

/**
 * 检测元素是否出现滚动条
 * @param direction 'vertical' | 'horizontal'，默认'vertical'
 * @param deps 依赖项数组，内容变化时传入
 * @returns [ref, hasScrollbar]
 */
export const useHasScrollbar = <T extends HTMLElement = HTMLDivElement>(
  direction: Direction = 'vertical',
  deps: any[] = []
): [React.RefObject<T>, boolean] => {
  const ref = useRef<T>(null)
  const [hasScrollbar, setHasScrollbar] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (direction === 'vertical') {
      setHasScrollbar(el.scrollHeight > el.clientHeight)
    } else {
      setHasScrollbar(el.scrollWidth > el.clientWidth)
    }
  }, deps)

  return [ref, hasScrollbar]
}
