function getCurrentPlayingVideo(): HTMLVideoElement | null {
  const videos = Array.from(document.querySelectorAll('video')) as HTMLVideoElement[];
  // const playingVideos = videos
  //   .filter((v) => {
  //     const rect = v.getBoundingClientRect();
  //     const visible =
  //       rect.width > 0 &&
  //       rect.height > 0 &&
  //       rect.top < window.innerHeight &&
  //       rect.bottom > 0 &&
  //       getComputedStyle(v).display !== 'none' &&
  //       getComputedStyle(v).visibility !== 'hidden';
  //
  //     const isPlaying = !v.paused && !v.ended && v.readyState >= 2;
  //
  //     return visible && isPlaying;
  //   })
  //   .sort((a, b) => {
  //     const areaA = a.getBoundingClientRect().width * a.getBoundingClientRect().height;
  //     const areaB = b.getBoundingClientRect().width * b.getBoundingClientRect().height;
  //     return areaB - areaA; // 最大的排前面
  //   });

  // return playingVideos[0] || null;
  return videos[0] || null;
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'capture-frame') {
    const video = getCurrentPlayingVideo();
    if (!video) {
      sendResponse({ image: null });
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      sendResponse({ image: null });
      return;
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const image = canvas.toDataURL('image/png');
    sendResponse({ image });
  } else {
    sendResponse({ image: null });
  }
});
