console.log('[content-script] ready');

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log('[content-script] message received', msg);

  if (msg.type === 'capture-frame') {
    const video = document.querySelector('video');
    if (!video) return sendResponse({ error: 'No video found' });

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return sendResponse({ error: 'Canvas error' });

    ctx.drawImage(video, 0, 0);
    const image = canvas.toDataURL('image/png');
    sendResponse({ image });
  }
  return true;
});
