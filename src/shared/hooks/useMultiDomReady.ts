import React, { useEffect, useState } from 'react'

/**
 * 检查多个 dom 是否都挂载
 */
export function useMultiDomReady(
  refs: React.MutableRefObject<HTMLCanvasElement[]>
) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // 检查所有 ref 是否都已挂载
    const allReady = refs.current.every((ref) => !!ref)
    if (allReady) {
      setReady(true)
    }
  }, [refs.current.join(',')]) // 依赖所有 ref.current

  return ready
}
