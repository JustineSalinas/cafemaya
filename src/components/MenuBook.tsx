import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { animate, motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { menu, type MenuSection } from '@/data/menu'
import { src, srcSet } from '@/data/images'
import { site } from '@/data/site'

/* ───────────────────────── pages ───────────────────────── */

const fmt = (n?: number) => (n == null ? null : `₱${n}`)

function Cover() {
  return (
    <div className="page page--cover">
      <img src="/img/logo-md.webp" alt="" width={760} height={760} loading="lazy" decoding="async" />
      <div className="page__coverlabel">
        <span>the menu</span>
        <small>open daily, eight until ten</small>
      </div>
    </div>
  )
}

function Intro() {
  return (
    <div className="page page--paper page--intro">
      <p className="page__kicker">welcome</p>
      <h3 className="page__title">Pugad Maya</h3>
      <p className="page__text">
        Named after the humble nest of the maya bird. A place built with patience, care and quiet love, for when the world feels too heavy, too loud, too much.
      </p>
      <p className="page__text">Everything here is made to order, so good things take a few minutes. Sit anywhere you like.</p>
      <p className="page__note">Prices and specials change with the season. Ask us at the bar, or check {site.handle} on Instagram.</p>
      <PageNo n={1} />
    </div>
  )
}

function Contents({ onJump }: { onJump: (page: number) => void }) {
  return (
    <div className="page page--paper page--toc">
      <p className="page__kicker">inside</p>
      <h3 className="page__title">What we pour</h3>
      <ol className="toc">
        {menu.map((s, i) => (
          <li key={s.id}>
            <button type="button" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); onJump(3 + i * 2) }}>
              <span>{s.title}</span>
              <i aria-hidden="true" />
              <b>{4 + i * 2}</b>
            </button>
          </li>
        ))}
      </ol>
      <p className="page__note">Plant-based? Swap in oat milk on any milk drink.</p>
      <PageNo n={2} />
    </div>
  )
}

function PhotoPage({ section, n, number }: { section: MenuSection; n: number; number: number }) {
  return (
    <div className="page page--photo">
      <img src={src(section.image)} srcSet={srcSet(section.image)} sizes="(max-width: 820px) 88vw, 520px" width={section.image.w} height={section.image.h} alt={section.image.alt} loading="lazy" decoding="async" draggable={false} />
      <div className="page__photocap">
        <span>no. {n}</span>
        <strong>{section.title}</strong>
      </div>
      <PageNo n={number} light />
    </div>
  )
}

function ItemsPage({ section, number }: { section: MenuSection; number: number }) {
  return (
    <div className="page page--paper page--items">
      <p className="page__kicker">{section.id === 'signature' ? 'our signature' : 'from the bar'}</p>
      <h3 className="page__title">{section.title}</h3>
      <p className="page__blurb">{section.blurb}</p>
      <ul className="items">
        {section.items.map((it) => (
          <li key={it.name}>
            <div className="items__row">
              <span className="items__name">{it.name}</span>
              {fmt(it.price) && (<><i aria-hidden="true" /><span className="items__price">{fmt(it.price)}</span></>)}
            </div>
            {it.note && <p className="items__note">{it.note}</p>}
          </li>
        ))}
      </ul>
      <PageNo n={number} />
    </div>
  )
}

function Closing() {
  return (
    <div className="page page--paper page--closing">
      <p className="page__kicker">thank you</p>
      <h3 className="page__title">Stay a while</h3>
      <p className="page__text">Also on {site.delivery.join(' and ')} if home is where you are.</p>
      <p className="page__text">33 Cuartero Street, Jaro, Iloilo City</p>
      <p className="page__note">{site.handle}</p>
      <PageNo n={11} />
    </div>
  )
}

function BackCover() {
  return (
    <div className="page page--cover page--back">
      <img src="/img/logo-md.webp" alt="" width={760} height={760} loading="lazy" decoding="async" />
      <div className="page__coverlabel"><span>see you tomorrow</span></div>
    </div>
  )
}

function PageNo({ n, light }: { n: number; light?: boolean }) {
  return <span className={`pageno ${light ? 'pageno--light' : ''}`} aria-hidden="true">{n}</span>
}

/* ───────────────────────── leaf (one sheet, two faces) ───────────────────────── */

const DEG = 180 / Math.PI
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))
interface LeafProps {
  i: number
  total: number
  flipped: boolean
  delay: number
  single: boolean
  index: number
  maxIndex: number
  front: ReactNode
  back: ReactNode | null
  onSet: (index: number) => void
  reduce: boolean
}

function Leaf({ i, total, flipped, delay, single, index, maxIndex, front, back, onSet, reduce }: LeafProps) {
  const rot = useMotionValue(flipped ? -180 : 0)
  const isDraggingRef = useRef(false)
  const frontRef = useRef<HTMLDivElement>(null)
  const backRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isDraggingRef.current) return
    const target = flipped ? -180 : 0
    if (reduce) { rot.set(target); return }
    const controls = animate(rot, target, {
      type: 'spring',
      stiffness: 180,
      damping: 24,
      mass: 0.8,
      restDelta: 0.2,
      delay,
    })
    return () => controls.stop()
  }, [flipped, delay, reduce, rot])

  // While turning, maintain high z-index so the active sheet never drops beneath neighboring pages
  const z = useTransform(rot, (r) => {
    if (isDraggingRef.current || (r > -178 && r < -2)) {
      return total + 50
    }
    return r <= -90 ? i + 1 : total - i
  })

  // The face darkens as it rolls away from the light source
  const shade = useTransform(rot, [-180, -135, -90, -45, 0], [0, 0.12, 0.45, 0.14, 0])
  // Specular sweep cross-lighting as page stands perpendicular
  const sheen = useTransform(rot, [-180, -120, -90, -60, 0], [0, 0.4, 0.6, 0.35, 0])
  // Dynamic 3D elevation towards camera during the turn
  const lift = useTransform(rot, [-180, -90, 0], [0, 24, 0])

  const frontVisible = i === index
  const backVisible = !single && i === index - 1
  const canFlipForward = !flipped && i === index && index < maxIndex
  const canFlipBack = flipped && !single && i === index - 1

  const handlePointerDown = (face: 'front' | 'back') => (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    const turnable = face === 'front' ? canFlipForward : canFlipBack
    if (!turnable && !(single && i === index)) return

    const el = (face === 'front' ? frontRef : backRef).current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const spineX = single ? rect.left : face === 'front' ? rect.left : rect.right
    const pageW = Math.max(100, rect.width)
    const startX = e.clientX
    const startY = e.clientY
    const grabOffset = face === 'front' ? Math.max(20, startX - spineX) : Math.max(20, spineX - startX)
    const R = Math.max(pageW * 0.45, grabOffset)

    let dragging = false
    let lastX = startX
    let lastT = performance.now()
    let velocity = 0

    isDraggingRef.current = true

    const onPointerMove = (ev: PointerEvent) => {
      const dx = ev.clientX - startX
      const dy = ev.clientY - startY
      if (!dragging) {
        if (Math.hypot(dx, dy) < 6) return
        if (Math.abs(dy) > Math.abs(dx) * 1.5) {
          cleanup()
          return
        }
        dragging = true
      }

      const now = performance.now()
      const dt = now - lastT
      if (dt > 8) {
        velocity = ((ev.clientX - lastX) / dt) * 1000
        lastX = ev.clientX
        lastT = now
      }

      if (single) {
        const progress = clamp(-dx / pageW, 0, 1)
        rot.set(-progress * 180)
        return
      }

      if (!turnable) return
      const dist = ev.clientX - spineX
      const ratio = clamp(dist / R, -1, 1)
      const angle = -Math.acos(ratio) * DEG
      rot.set(angle)
    }

    const onPointerUp = (ev: PointerEvent) => {
      cleanup()
      const dx = ev.clientX - startX

      if (!dragging) {
        if (turnable) onSet(face === 'front' ? i + 1 : i)
        return
      }

      if (single) {
        if (dx < -40 || velocity < -250) {
          onSet(i + 1)
        } else if (dx > 40 || velocity > 250) {
          onSet(i - 1)
        } else {
          animate(rot, 0, { type: 'spring', stiffness: 220, damping: 24 })
        }
        return
      }

      if (!turnable) return

      const currentAngle = rot.get()
      if (face === 'front') {
        const shouldFlip = currentAngle < -50 || velocity < -200
        if (shouldFlip) {
          onSet(i + 1)
          animate(rot, -180, { type: 'spring', stiffness: 210, damping: 24, velocity: velocity * 0.4 })
        } else {
          animate(rot, 0, { type: 'spring', stiffness: 230, damping: 24, velocity: -velocity * 0.4 })
        }
      } else {
        const shouldFlip = currentAngle > -130 || velocity > 200
        if (shouldFlip) {
          onSet(i)
          animate(rot, 0, { type: 'spring', stiffness: 210, damping: 24, velocity: velocity * 0.4 })
        } else {
          animate(rot, -180, { type: 'spring', stiffness: 230, damping: 24, velocity: -velocity * 0.4 })
        }
      }
    }

    const cleanup = () => {
      isDraggingRef.current = false
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)
  }

  return (
    <motion.div
      className={`leaf ${single ? 'leaf--single' : ''}`}
      style={{ rotateY: rot, z: lift, zIndex: z as MotionValue<number>, pointerEvents: frontVisible || backVisible ? 'auto' : 'none' }}
    >
      <motion.div
        ref={frontRef}
        className="leaf__face leaf__face--front"
        inert={!frontVisible}
        aria-hidden={!frontVisible}
        data-turnable={canFlipForward || undefined}
        onPointerDown={handlePointerDown('front')}
      >
        {front}
        <motion.span className="leaf__sheen" style={{ opacity: sheen }} aria-hidden="true" />
        <motion.span className="leaf__shade" style={{ opacity: shade }} aria-hidden="true" />
        {canFlipForward && <span className="curl" aria-hidden="true" />}
      </motion.div>
      {back && (
        <motion.div
          ref={backRef}
          className="leaf__face leaf__face--back"
          inert={!backVisible}
          aria-hidden={!backVisible}
          data-turnable={canFlipBack || undefined}
          onPointerDown={handlePointerDown('back')}
        >
          {back}
          <motion.span className="leaf__sheen leaf__sheen--back" style={{ opacity: sheen }} aria-hidden="true" />
          <motion.span className="leaf__shade" style={{ opacity: shade }} aria-hidden="true" />
          {canFlipBack && <span className="curl curl--left" aria-hidden="true" />}
        </motion.div>
      )}
    </motion.div>
  )
}

/* ───────────────────────── book ───────────────────────── */

export function MenuBook() {
  const reduce = !!useReducedMotion()
  const [single, setSingle] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 820px)').matches)
  const [state, setState] = useState({ index: 0, from: 0 })
  const { index, from } = state

  // the whole book leans a touch toward the cursor
  const tiltX = useSpring(0, { stiffness: 60, damping: 18 })
  const tiltY = useSpring(0, { stiffness: 60, damping: 18 })

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 820px)')
    const on = () => { setSingle(mq.matches); setState({ index: 0, from: 0 }) }
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  const go = useCallback((next: number, max: number) => {
    setState((s) => {
      const clamped = clamp(next, 0, max)
      return clamped === s.index ? s : { index: clamped, from: s.index }
    })
  }, [])

  const pages = useMemo<ReactNode[]>(() => {
    const jump = (p: number) => go(single ? p : Math.ceil(p / 2), single ? 12 : 6)
    const list: ReactNode[] = [<Cover key="c" />, <Intro key="i" />, <Contents key="t" onJump={jump} />]
    menu.forEach((s, k) => {
      list.push(<PhotoPage key={`${s.id}-p`} section={s} n={k + 1} number={3 + k * 2} />)
      list.push(<ItemsPage key={`${s.id}-i`} section={s} number={4 + k * 2} />)
    })
    list.push(<Closing key="x" />, <BackCover key="b" />)
    return list
  }, [go, single])

  const leaves = single ? pages.length : Math.ceil(pages.length / 2)
  const maxIndex = leaves - 1
  const set = useCallback((n: number) => go(n, maxIndex), [go, maxIndex])

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); set(index + 1) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); set(index - 1) }
    if (e.key === 'Home') { e.preventDefault(); set(0) }
    if (e.key === 'End') { e.preventDefault(); set(maxIndex) }
  }

  const tilt = (e: React.MouseEvent) => {
    if (reduce || single) return
    const r = e.currentTarget.getBoundingClientRect()
    tiltY.set(((e.clientX - r.left) / r.width - 0.5) * 6)
    tiltX.set(((e.clientY - r.top) / r.height - 0.5) * -5)
  }
  const untilt = () => { tiltX.set(0); tiltY.set(0) }

  const blank = <div className="page page--paper" />
  const leafNodes = Array.from({ length: leaves }, (_, k) => {
    // only sheets near the current spread carry real content; the rest stay blank paper
    const near = Math.abs(k - index) <= 2
    const front = near ? (single ? pages[k] : pages[k * 2]) : blank
    const back = single ? null : near ? (pages[k * 2 + 1] ?? blank) : blank
    const flipped = k < index
    // stagger the turns when jumping several spreads at once
    const delay = reduce ? 0 : flipped ? Math.max(0, k - from) * 0.07 : Math.max(0, from - 1 - k) * 0.07
    return <Leaf key={k} i={k} total={leaves} flipped={flipped} delay={delay} single={single} index={index} maxIndex={maxIndex} front={front} back={back} onSet={set} reduce={reduce} />
  })

  const closed = !single && index === 0
  const label = single ? `Page ${index + 1} of ${pages.length}` : index === 0 ? 'Cover' : `Pages ${index * 2 - 1} and ${index * 2}`
  const progress = maxIndex ? index / maxIndex : 0

  return (
    <section className="menu section section--dark" aria-labelledby="menu-title">
      <div className="menu__glow" aria-hidden="true" />
      <div className="section__head">
        <p className="eyebrow eyebrow--light">The menu</p>
        <h2 className="display display--light"><span id="menu-title">Take a seat. Turn a page.</span></h2>
        <p className="lede lede--light">Drag a corner, tap a page, or use the arrow keys to leaf through what we pour.</p>
      </div>

      <div className="bookwrap" onKeyDown={onKey} onMouseMove={tilt} onMouseLeave={untilt}>
        <motion.div
          className={`book ${single ? 'book--single' : ''} ${closed ? 'is-closed' : ''}`}
          tabIndex={0}
          role="group"
          aria-roledescription="book"
          aria-label={`Menu book. ${label}. Use left and right arrow keys to turn pages.`}
          animate={{ x: closed ? '-25%' : '0%' }}
          transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 70, damping: 17 }}
          style={{ touchAction: 'pan-y' }}
        >
          <motion.div className="book__tilt" style={{ rotateX: tiltX, rotateY: tiltY }}>
            {!single && <motion.div className="book__stack book__stack--left" animate={{ width: `${2 + progress * 13}px` }} aria-hidden="true" />}
            {!single && <motion.div className="book__stack book__stack--right" animate={{ width: `${2 + (1 - progress) * 13}px` }} aria-hidden="true" />}
            {leafNodes}
            {!single && <div className="book__spine" aria-hidden="true" />}
          </motion.div>
          <div className="book__shadow" aria-hidden="true" />
        </motion.div>
      </div>

      <div className="bookbar">
        <button type="button" className="roundbtn" onClick={() => set(index - 1)} disabled={index === 0} aria-label="Previous page"><ChevronLeft size={20} /></button>
        <div className="bookbar__mid">
          <span aria-live="polite">{label}</span>
          <div className="bookbar__chips" role="group" aria-label="Jump to a section">
            <button type="button" onClick={() => set(0)} className={index === 0 ? 'is-on' : ''}>Cover</button>
            {menu.map((s, k) => {
              const target = single ? 3 + k * 2 : Math.ceil((3 + k * 2) / 2)
              const on = single ? index === 3 + k * 2 || index === 4 + k * 2 : index === target
              return <button type="button" key={s.id} onClick={() => set(target)} className={on ? 'is-on' : ''}>{s.title}</button>
            })}
          </div>
          <div className="bookbar__rail" aria-hidden="true"><motion.i animate={{ scaleX: Math.max(0.04, progress) }} transition={{ type: 'spring', stiffness: 90, damping: 18 }} /></div>
        </div>
        <button type="button" className="roundbtn" onClick={() => set(index + 1)} disabled={index === maxIndex} aria-label="Next page"><ChevronRight size={20} /></button>
      </div>

      <details className="plainmenu">
        <summary>Prefer a plain list?</summary>
        <div className="plainmenu__grid">
          {menu.map((s) => (
            <div key={s.id}>
              <h3>{s.title}</h3>
              <p>{s.blurb}</p>
              <ul>{s.items.map((it) => <li key={it.name}><strong>{it.name}</strong>{it.note ? `, ${it.note.toLowerCase()}` : ''}{fmt(it.price) ? ` — ${fmt(it.price)}` : ''}</li>)}</ul>
            </div>
          ))}
        </div>
      </details>
    </section>
  )
}
