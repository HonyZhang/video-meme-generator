function getCurrentPlayingVideo(): HTMLVideoElement | null {
  const videos = Array.from(
    document.querySelectorAll('video')
  ) as HTMLVideoElement[]
  return videos[0] || null
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === 'capture-frame') {
    const video = getCurrentPlayingVideo()
    if (!video) {
      sendResponse({ image: null })
      return
    }

    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      sendResponse({ image: null })
      return
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    const image = canvas.toDataURL('image/png')
    sendResponse({ image })
  } else {
    sendResponse({ image: null })
  }
})
