import { Suspense, useEffect, useRef, useState, type ReactNode } from 'react'

interface LazySectionProps {
  id: string
  minHeight: string
  dark?: boolean
  children: ReactNode
}

/**
 * Mounts a section's chunk only as it comes within reach of the viewport, so the
 * first paint never competes with code the visitor has not scrolled to yet.
 * The wrapper owns the anchor id permanently, which keeps in-page links and the
 * nav's scroll-spy pointed at a node that is never replaced.
 */
export function LazySection({ id, minHeight, dark, children }: LazySectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || show) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true)
          io.disconnect()
        }
      },
      { rootMargin: '800px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [show])

  return (
    <div id={id} ref={ref} style={show ? undefined : { minHeight, background: dark ? 'var(--ink)' : undefined }}>
      {show && <Suspense fallback={<div style={{ minHeight, background: dark ? 'var(--ink)' : undefined }} />}>{children}</Suspense>}
    </div>
  )
}
