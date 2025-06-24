export async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

export function getDefaultImagePadding(imageElement: HTMLImageElement): number {
  const { width, height } = imageElement
  const padding = Math.min(Math.min(width, height) * 0.1, 8)
  return padding
}