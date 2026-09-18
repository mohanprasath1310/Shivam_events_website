import { useEffect, useRef, useState } from 'react'

// Animates from 0 to `end` once, over `duration` ms, when `start` becomes true.
export function useCountUp(end, { start = false, duration = 1400 } = {}) {
  const [value, setValue] = useState(0)
  const hasRun = useRef(false)

  useEffect(() => {
    if (!start || hasRun.current) return
    hasRun.current = true

    const numericEnd = Number(end) || 0
    const startTime = performance.now()

    let frame
    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      setValue(Math.round(eased * numericEnd))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [start, end, duration])

  return value
}
