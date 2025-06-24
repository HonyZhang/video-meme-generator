import { useEffect, useMemo, useState } from 'react'

import { useEditorStore } from '~tabs/editor/stores/index'

// 可选：你也可以将这个放在外部 utils 文件中
function calculateCropSize(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  const mediaAspect = mediaWidth / mediaHeight

  if (mediaAspect > aspect) {
    const height = mediaHeight
    const width = height * aspect
    return { width, height }
  } else {
    const width = mediaWidth
    const height = width / aspect
    return { width, height }
  }
}

/**
 * Hook: 自动根据选择的比例计算 cropSize，并更新到 store
 */
export function useAspectRatioCropSize(
  aspectRatio: number,
  mediaSize: { width: number; height: number }
) {
  // 使用 useMemo 来计算 cropSize，避免对象引用变化导致的无限循环
  const cropSize = useMemo(() => {
    if (!mediaSize?.width || !mediaSize?.height) {
      return { width: 0, height: 0 }
    }

    return calculateCropSize(mediaSize.width, mediaSize.height, aspectRatio)
  }, [aspectRatio, mediaSize?.width, mediaSize?.height])

  return cropSize
}
