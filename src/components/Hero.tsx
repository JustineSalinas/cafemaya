import { useEffect, useState } from 'react'
import { MapPin } from 'lucide-react'
import { heroSlides } from '@/data/images'
import { site } from '@/data/site'
import { useOpenStatus } from '@/hooks/useOpenStatus'
import { useScrollTo } from '@/hooks/useSmoothScroll'

const INTERVAL = 7000

/**
 * The photograph sits inside an arched plate rather than behind the type, so
 * the headline never has to fight an image for contrast. No animation library
 * here: the hero is the first paint and runs on CSS alone.
 */
export function Hero() {
  const [index, setIndex] = useState(0)
  const [seen, setSeen] = useState<number[]>([0])
  const [reduce, setReduce] = useState(false)
  const status = useOpenStatus()
  const scrollTo = useScrollTo()
  const slide = heroSlides[index]

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduce(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (reduce) return
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % heroSlides.length), INTERVAL)
    return () => window.clearTimeout(id)
  }, [index, reduce])

  useEffect(() => {
    setSeen((s) => (s.includes(index) ? s : [...s, index]))
    // warm the next plate so the crossfade never shows a gap
    const next = heroSlides[(index + 1) % heroSlides.length]
    const img = new Image()
    img.sizes = '(max-width: 900px) 78vw, 34vw'
    img.srcset = next.srcset
    img.src = next.fallback
  }, [index])

  return (
    <section className="hero" id="top" aria-label="Welcome to Café Maya">
      <div className="hero__inner">
        <div className="hero__copy">
          <h1 className="hero__title">
            Beans from all over the Philippines, poured on one street in Jaro.
          </h1>
          <p className="hero__lede">
            A community coffeeshop at 33 Cuartero Street, named for the maya bird that nests in the eaves.
          </p>
          <div className="hero__actions">
            <button className="btn btn--solid" onClick={() => scrollTo('#menu')}>See the menu</button>
            <a className="btn btn--quiet" href={site.mapsUrl} target="_blank" rel="noreferrer">
              <MapPin size={15} aria-hidden="true" /> Find us
            </a>
          </div>
        </div>

        <figure className="plate">
          <div className="plate__frame">
            {heroSlides.map((s, i) =>
              seen.includes(i) ? (
                <img
                  key={s.id}
                  className={`plate__img ${i === index ? 'is-on' : ''}`}
                  src={s.fallback}
                  srcSet={s.srcset}
                  sizes="(max-width: 900px) 78vw, 34vw"
                  width={s.w}
                  height={s.h}
                  alt={i === index ? s.alt : ''}
                  aria-hidden={i !== index}
                  fetchPriority={i === 0 ? 'high' : 'low'}
                  decoding={i === 0 ? 'sync' : 'async'}
                />
              ) : null,
            )}
          </div>
          <figcaption className="plate__caption">
            <span key={slide.id}>{slide.caption}</span>
            <span className="plate__dots" role="group" aria-label="Choose photograph">
              {heroSlides.map((s, i) => (
                <button
                  key={s.id}
                  className={i === index ? 'is-on' : ''}
                  onClick={() => setIndex(i)}
                  aria-label={`Show ${s.caption}`}
                  aria-current={i === index}
                />
              ))}
            </span>
          </figcaption>
        </figure>
      </div>

      <dl className="rail">
        <div className="rail__cell">
          <dt>Today</dt>
          <dd>
            <span className={`dot ${status.open ? 'dot--open' : ''}`} aria-hidden="true" />
            {status.label}
          </dd>
        </div>
        <div className="rail__cell">
          <dt>Hours</dt>
          <dd>8am to 10pm, every day</dd>
        </div>
        <div className="rail__cell">
          <dt>Delivery</dt>
          <dd>Grab and Foodpanda</dd>
        </div>
        <div className="rail__cell">
          <dt>Address</dt>
          <dd>33 Cuartero Street, Jaro</dd>
        </div>
      </dl>
    </section>
  )
}
