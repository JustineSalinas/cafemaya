import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react'
import Lenis from 'lenis'

const LenisContext = createContext<{ scrollTo: (target: string | number, opts?: { offset?: number }) => void }>({
  scrollTo: () => {},
})

export const useScrollTo = () => useContext(LenisContext).scrollTo

export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenis = useRef<Lenis | null>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    const instance = new Lenis({ lerp: 0.09, wheelMultiplier: 0.95, anchors: false })
    lenis.current = instance
    let raf = 0
    const loop = (time: number) => {
      instance.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      instance.destroy()
      lenis.current = null
    }
  }, [])

  const scrollTo = (target: string | number, opts?: { offset?: number }) => {
    const offset = opts?.offset ?? -72
    if (lenis.current) {
      lenis.current.scrollTo(target, { offset, duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4) })
      return
    }
    const el = typeof target === 'string' ? document.querySelector(target) : null
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: 'smooth' })
    else if (typeof target === 'number') window.scrollTo({ top: target, behavior: 'smooth' })
  }

  return <LenisContext.Provider value={{ scrollTo }}>{children}</LenisContext.Provider>
}
