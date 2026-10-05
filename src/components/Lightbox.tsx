import { useCallback, useEffect, useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { src, srcSet, type Photo } from '@/data/images'

interface LightboxProps {
  photos: Photo[]
  index: number | null
  onClose: () => void
  onIndex: (next: number) => void
}

export function Lightbox({ photos, index, onClose, onIndex }: LightboxProps) {
  const reduce = useReducedMotion()
  const dir = useRef(1)
  const strip = useRef<HTMLDivElement>(null)
  const open = index !== null
  const photo = open ? photos[index] : null

  const step = useCallback(
    (d: number) => {
      if (index === null) return
      dir.current = d
      onIndex((index + d + photos.length) % photos.length)
    },
    [index, onIndex, photos.length],
  )

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose, step])

  // keep the active thumbnail in view
  useEffect(() => {
    if (index === null) return
    strip.current?.querySelector('[data-on="true"]')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest', inline: 'center' })
  }, [index, reduce])

  const swipe = useRef(0)

  return (
    <AnimatePresence>
      {open && photo && (
        <motion.div
          className="lb"
          role="dialog"
          aria-modal="true"
          aria-label={`Photo ${index + 1} of ${photos.length}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          data-lenis-prevent
        >
          <motion.div className="lb__scrim" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />

          <header className="lb__bar">
            <span className="lb__count"><b>{String(index + 1).padStart(2, '0')}</b> / {String(photos.length).padStart(2, '0')}</span>
            <button className="lb__close" onClick={onClose} aria-label="Close photo viewer"><X size={18} /><span>Close</span></button>
          </header>

          <div className="lb__stage">
            <button className="lb__nav lb__nav--prev" onClick={() => step(-1)} aria-label="Previous photo"><ChevronLeft size={26} /></button>

            <AnimatePresence initial={false} mode="popLayout" custom={dir.current}>
              <motion.figure
                key={photo.id}
                className="lb__fig"
                custom={dir.current}
                initial={reduce ? { opacity: 0 } : { opacity: 0, x: dir.current * 70, scale: 0.97 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, x: dir.current * -70, scale: 0.97 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                drag={reduce ? false : 'x'}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.18}
                onDragStart={(_, i) => (swipe.current = i.point.x)}
                onDragEnd={(_, i) => {
                  if (i.offset.x < -70 || i.velocity.x < -450) step(1)
                  else if (i.offset.x > 70 || i.velocity.x > 450) step(-1)
                }}
              >
                <img src={src(photo)} srcSet={srcSet(photo)} sizes="92vw" width={photo.w} height={photo.h} alt={photo.alt} draggable={false} />
                <figcaption>{photo.alt}</figcaption>
              </motion.figure>
            </AnimatePresence>

            <button className="lb__nav lb__nav--next" onClick={() => step(1)} aria-label="Next photo"><ChevronRight size={26} /></button>
          </div>

          <div className="lb__strip" ref={strip} role="group" aria-label="Choose a photo">
            {photos.map((ph, i) => (
              <button
                key={ph.id}
                data-on={i === index}
                className={i === index ? 'is-on' : ''}
                onClick={() => { dir.current = i > index ? 1 : -1; onIndex(i) }}
                aria-label={`Photo ${i + 1}: ${ph.alt}`}
                aria-current={i === index}
              >
                <img src={`/img/${ph.id}-xs.webp`} alt="" width={ph.w} height={ph.h} loading="lazy" decoding="async" />
              </button>
            ))}
          </div>

          <p className="lb__hint">Drag, swipe or use the arrow keys</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
