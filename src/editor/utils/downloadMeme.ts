import type { TextItem } from '@/types/textItems';

export async function downloadMeme(image: string, textItems: TextItem[]) {
  if (!image) return;
  // 创建图片对象
  const img = new window.Image();
  img.src = image;
  await new Promise((resolve) => {
    if (img.complete) resolve(true);
    img.onload = resolve;
  });
  // 创建画布
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  // 绘制文字
  for (const item of textItems) {
    ctx.save();
    ctx.font = `${item.fontSize}px ${item.fontFamily}`;
    ctx.fillStyle = item.fontColor;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(item.text, item.x, item.y);
    ctx.restore();
  }
  // 下载
  const a = document.createElement('a');
  a.href = canvas.toDataURL('image/png');
  a.download = 'meme.png';
  a.click();
}
