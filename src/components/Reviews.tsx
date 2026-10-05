import { useEffect, useRef, useState } from 'react'
import { motion, useAnimationFrame, useMotionValue, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Quote, Star } from 'lucide-react'
import { ratingSummary, reviews, reviewsUrl } from '@/data/reviews'

const SPEED = 38 // px per second, a slow drift

export function Reviews() {
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const setRef = useRef<HTMLUListElement>(null)
  const width = useRef(0)
  const dragging = useRef(false)
  const hovering = useRef(false)
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    const measure = () => {
      const el = setRef.current
      if (!el) return
      width.current = el.scrollWidth
      // start in the middle copy so there is slack on both sides
      if (x.get() === 0) x.set(-width.current)
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (setRef.current) ro.observe(setRef.current)
    return () => ro.disconnect()
  }, [x])

  useAnimationFrame((_, delta) => {
    const w = width.current
    if (!w || dragging.current) return
    let next = x.get()
    if (!reduce && !hovering.current && !focused) next -= (SPEED * delta) / 1000
    // keep the track inside the middle copy so it loops seamlessly
    while (next <= -2 * w) next += w
    while (next > -w) next -= w
    x.set(next)
  })

  const copies = [0, 1, 2]

  return (
    <section className="reviews section section--tint" aria-labelledby="reviews-title">
      <div className="section__head">
        <p className="eyebrow">What people say</p>
        <h2 className="display"><span id="reviews-title">Four point nine, out of forty.</span></h2>
        <p className="lede">
          <span className="rating">
            <span className="rating__stars" role="img" aria-label={`${ratingSummary.average} out of 5 stars`}>
              {Array.from({ length: 5 }, (_, i) => <Star key={i} size={16} fill="currentColor" strokeWidth={0} />)}
            </span>
            <strong>{ratingSummary.average}</strong> from {ratingSummary.count} {ratingSummary.source} ratings
          </span>
          <a className="rating__link" href={reviewsUrl} target="_blank" rel="noreferrer">Read them all <ArrowUpRight size={14} aria-hidden="true" /></a>
        </p>
      </div>

      <div
        className="marquee"
        onMouseEnter={() => (hovering.current = true)}
        onMouseLeave={() => (hovering.current = false)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        role="region"
        aria-roledescription="carousel"
        aria-label="Customer reviews"
        tabIndex={0}
      >
        <motion.div
          className="marquee__track"
          style={{ x, touchAction: 'pan-y' }}
          drag="x"
          dragMomentum={false}
          dragElastic={0}
          onDragStart={() => (dragging.current = true)}
          onDragEnd={() => (dragging.current = false)}
        >
          {copies.map((c) => (
            <ul className="marquee__set" key={c} ref={c === 0 ? setRef : undefined} aria-hidden={c !== 1}>
              {reviews.map((r, i) => (
                <li className="review" key={`${c}-${i}`}>
                  <Quote size={22} strokeWidth={1.4} aria-hidden="true" />
                  <div className="review__stars" role="img" aria-label={`${r.rating} out of 5 stars`}>
                    {Array.from({ length: 5 }, (_, s) => <Star key={s} size={14} fill={s < r.rating ? 'currentColor' : 'none'} strokeWidth={1.5} />)}
                  </div>
                  <blockquote>{r.quote}</blockquote>
                  <p className="review__by"><strong>{r.name}</strong><span>{r.source}, {r.when}</span></p>
                </li>
              ))}
            </ul>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
