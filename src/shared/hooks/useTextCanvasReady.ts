import { useDomReady } from './useDomReady'

export function useTextCanvasReady(
  textCanvasRefs: React.MutableRefObject<HTMLCanvasElement[]>
) {
  const ready = textCanvasRefs.current.every((ref) => useDomReady({ current: ref }))
  return ready
}
