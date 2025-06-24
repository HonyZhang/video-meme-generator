import React, { useEffect, useState } from 'react'

/**
 * 检查 dom 是否挂载
 */
export function useDomReady(ref: React.RefObject<HTMLElement>) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const dom = ref.current
    if (dom) {
      setReady(true)
    }
  }, [ref.current])

  return ready
}
