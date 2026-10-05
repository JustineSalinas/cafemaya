import { useState } from 'react'
import { motion } from 'framer-motion'
import { Expand } from 'lucide-react'
import { gallery, galleryTabs, srcSet, type GalleryTab } from '@/data/images'
import { Lightbox } from './Lightbox'

export function Gallery() {
  const [tab, setTab] = useState<GalleryTab>('place')
  const [open, setOpen] = useState<number | null>(null)
  const photos = gallery[tab]
  const current = galleryTabs.find((t) => t.id === tab)!


  return (
    <section className="gallery section" aria-labelledby="gallery-title">
      <div className="section__head">
        <p className="eyebrow">Photographs</p>
        <h2 className="display"><span id="gallery-title">The place, up close.</span></h2>
        <div className="tabs" role="tablist" aria-label="Gallery categories">
          {galleryTabs.map((t) => (
            <button key={t.id} role="tab" id={`tab-${t.id}`} aria-selected={tab === t.id} aria-controls="gallery-panel" className={tab === t.id ? 'is-on' : ''} onClick={() => setTab(t.id)}>
              {tab === t.id && <motion.span layoutId="tabpill" className="tabs__pill" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
              <span>{t.label}</span>
            </button>
          ))}
        </div>
        <p className="lede" key={tab}>{current.blurb}</p>
      </div>

      <div className="masonry" key={tab} id="gallery-panel" role="tabpanel" aria-labelledby={`tab-${tab}`}>
        {photos.map((ph, i) => (
          <button
            key={`${tab}-${ph.id}`}
            className="masonry__item"
            style={{ aspectRatio: `${ph.w} / ${ph.h}` }}
            onClick={() => setOpen(i)}
            aria-label={`Open photo: ${ph.alt}`}
          >
            <img src={`/img/${ph.id}-xs.webp`} srcSet={srcSet(ph)} sizes="(max-width: 640px) 50vw, (max-width: 1100px) 33vw, 25vw" width={ph.w} height={ph.h} alt={ph.alt} loading="lazy" decoding="async" />
            <span className="masonry__zoom" aria-hidden="true"><Expand size={16} /></span>
          </button>
        ))}
      </div>

      <div className="popup">
        <p className="eyebrow">Out and about</p>
        <h3 className="popup__title">We came to the jungle with coffee and left with memories.</h3>
        <p>
          It was a privilege to share the space with an amazing mix of local creatives, makers, entrepreneurs and community builders at Concrete Jungle, our first Jungle Made experience. We pop up at markets and gatherings alongside other cafes too. Watch {`@cafemaya.ph`} to see where we land next.
        </p>
      </div>

      <Lightbox photos={photos} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
    </section>
  )
}
