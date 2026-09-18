import { useEffect } from 'react'

// Locking body scroll with `document.body.style.overflow = 'hidden'` alone is
// NOT reliable on mobile Safari/Chrome: the background can still rubber-band
// scroll behind a `position: fixed` overlay, which desyncs touch coordinates
// from what's on screen. That's what made inputs inside the admin modals feel
// "dead" on phones — taps looked like they landed on a field but the page had
// silently shifted underneath, especially once the keyboard opened.
//
// This hook uses the standard, battle-tested iOS-safe technique: pin the body
// in place with `position: fixed` (preserving scroll position) instead of
// just hiding overflow. Combined with `overscroll-behavior: contain` on the
// modal panel itself, background scroll/touch fully stops and taps land where
// they visually appear.
export default function useBodyScrollLock(active) {
  useEffect(() => {
    if (!active) return undefined

    const scrollY = window.scrollY || window.pageYOffset
    const body = document.body
    const prev = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
    }

    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.width = '100%'
    body.style.overflow = 'hidden'

    return () => {
      body.style.position = prev.position
      body.style.top = prev.top
      body.style.left = prev.left
      body.style.right = prev.right
      body.style.width = prev.width
      body.style.overflow = prev.overflow
      window.scrollTo(0, scrollY)
    }
  }, [active])
}
