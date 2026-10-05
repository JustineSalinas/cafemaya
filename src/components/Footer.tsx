import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight, Navigation, Clock, ArrowUp } from 'lucide-react'
import { photo, src, srcSet } from '@/data/images'
import { delivery, nav, site } from '@/data/site'
import { useOpenStatus } from '@/hooks/useOpenStatus'
import { useScrollTo } from '@/hooks/useSmoothScroll'
import { Button } from '@/components/ui/button'
import { FacebookIcon, InstagramIcon, FoodpandaIcon, GrabFoodIcon } from './Icons'

const WORDMARK = 'café maya'

export function Footer() {
  const scrollTo = useScrollTo()
  const status = useOpenStatus()
  const reduce = useReducedMotion()
  const band = useRef<HTMLDivElement>(null)
  const foot = useRef<HTMLElement>(null)

  const { scrollYProgress: bandProgress } = useScroll({ target: band, offset: ['start end', 'end start'] })
  const imgY = useTransform(bandProgress, [0, 1], reduce ? ['0%', '0%'] : ['-12%', '12%'])

  const { scrollYProgress: footProgress } = useScroll({ target: foot, offset: ['start end', 'end end'] })
  const markY = useTransform(footProgress, [0, 1], reduce ? [0, 0] : [60, 0])
  const markOpacity = useTransform(footProgress, [0.1, 0.9], [0.25, 1])

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    scrollTo(`#${id}`)
  }

  return (
    <>
      <section className="band" ref={band} aria-labelledby="band-title">
        <motion.div className="band__media" style={{ y: imgY }} aria-hidden="true">
          <img src={src(photo.p06)} srcSet={srcSet(photo.p06)} sizes="100vw" width={photo.p06.w} height={photo.p06.h} alt="" loading="lazy" decoding="async" />
        </motion.div>
        <div className="band__inner">
          <p className="eyebrow eyebrow--light">Come say hello</p>
          <h2 className="band__title">
            <span id="band-title">There is a seat with your name on it.</span>
          </h2>
          <div className="band__actions">
            <a className="btn btn--solid" href={site.mapsUrl} target="_blank" rel="noreferrer">
              <Navigation size={16} aria-hidden="true" /> Get directions
            </a>
            <span className="band__status">
              <Clock size={15} aria-hidden="true" /> {status.label}
            </span>
          </div>
          <div className="band__delivery">
            <span className="text-sm text-white/70">Or stay in:</span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {delivery.map((d) => {
                const isPanda = d.name.toLowerCase().includes('foodpanda')
                const isGrab = d.name.toLowerCase().includes('grab')
                const Icon = isPanda ? FoodpandaIcon : isGrab ? GrabFoodIcon : null

                return d.href ? (
                  <Button
                    key={d.name}
                    variant="outline"
                    size="sm"
                    className="h-8 gap-2 rounded-full border-white/20 bg-white/10 px-3.5 text-xs font-normal text-white hover:bg-white/20 hover:text-white backdrop-blur-sm"
                    render={<a href={d.href} target="_blank" rel="noreferrer" />}
                  >
                    {Icon && <Icon size={15} />}
                    <span>{d.name}</span>
                    <ArrowUpRight size={13} className="opacity-60" />
                  </Button>
                ) : (
                  <span
                    key={d.name}
                    className="inline-flex h-8 items-center gap-2 rounded-full border border-dashed border-white/20 px-3.5 text-xs text-white/60"
                    title={d.note}
                  >
                    {Icon && <Icon size={15} />}
                    <span>{d.name}</span>
                  </span>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <footer className="footer" ref={foot}>
        <div className="footer__grid">
          <div className="footer__brand">
            <img src="/img/logo-sm.webp" alt="Café Maya" width={96} height={96} loading="lazy" />
            <p>{site.tagline}. Beans sourced all over the Philippines.</p>
            <p className="footer__status"><span className={`dot ${status.open ? 'dot--open' : ''}`} aria-hidden="true" />{status.label}</p>
          </div>

          <div>
            <h2 className="footer__h">Find us</h2>
            <address>
              <a className="link" href={site.mapsUrl} target="_blank" rel="noreferrer">
                <span>{site.address[0]}<br />{site.address[1]}</span>
              </a>
            </address>
            <p className="footer__muted">Open {site.hours.days.toLowerCase()}<br />{site.hours.label}</p>
          </div>

          <nav aria-label="Footer">
            <h2 className="footer__h">Explore</h2>
            <ul>
              {nav.map((n) => (
                <li key={n.id}>
                  <a className="link" href={`#${n.id}`} onClick={go(n.id)}><span>{n.label}</span></a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="footer__h">Order & follow</h2>
            <ul>
              {delivery.map((d) => {
                const isPanda = d.name.toLowerCase().includes('foodpanda')
                const isGrab = d.name.toLowerCase().includes('grab')
                const Icon = isPanda ? FoodpandaIcon : isGrab ? GrabFoodIcon : null
                const linkClass = isPanda ? 'link link--foodpanda' : isGrab ? 'link link--grab' : 'link'

                return (
                  <li key={d.name}>
                    {d.href ? (
                      <a className={linkClass} href={d.href} target="_blank" rel="noreferrer">
                        <span>
                          {Icon && <Icon size={17} />} {d.name} <ArrowUpRight size={13} aria-hidden="true" />
                        </span>
                      </a>
                    ) : (
                      <span className="footer__muted">
                        {Icon && <Icon size={17} />} {d.name}, {d.note.toLowerCase()}
                      </span>
                    )}
                  </li>
                )
              })}
              <li><a className="link" href={site.instagram} target="_blank" rel="noreferrer"><span><InstagramIcon /> {site.handle}</span></a></li>
              <li><a className="link" href={site.facebook} target="_blank" rel="noreferrer"><span><FacebookIcon /> Café Maya</span></a></li>
            </ul>
          </div>
        </div>

        <motion.div className="footer__mark" style={{ y: markY, opacity: markOpacity }} aria-hidden="true">
          {WORDMARK.split('').map((ch, i) => (
            <motion.span
              key={i}
              initial={reduce ? false : { opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -8% 0px' }}
              transition={{ duration: 0.9, delay: i * 0.045, ease: [0.22, 1, 0.36, 1] }}
            >
              {ch === ' ' ? ' ' : ch}
            </motion.span>
          ))}
        </motion.div>

        <div className="footer__legal">
          <p>© {new Date().getFullYear()} Café Maya. Made with care in Jaro, Iloilo City.</p>
          <button className="totop" onClick={() => scrollTo(0)}>
            <ArrowUp size={15} aria-hidden="true" /> Back to top
          </button>
        </div>
      </footer>
    </>
  )
}
