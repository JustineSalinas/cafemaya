import heroManifest from './heroManifest.json'

export interface Photo {
  id: string
  w: number
  h: number
  alt: string
}

const p = (id: string, w: number, h: number, alt: string): Photo => ({ id, w, h, alt })

export const photo = {
  p00: p('p00', 1440, 1800, 'Iced coffee and a rice plate with sausage and egg on a sunlit wooden table'),
  p01: p('p01', 1440, 1800, 'Pizza and a loaded plate shared at the table'),
  p02: p('p02', 1440, 1440, 'The Café Maya pop-up cart among tropical plants'),
  p03: p('p03', 1536, 1536, 'A Café Maya cup on a wooden chair beside scattered coffee beans'),
  p04: p('p04', 733, 1101, 'A hand pouring filter coffee into two waiting cups'),
  p05: p('p05', 1440, 1800, 'The Café Maya glass door, open daily'),
  p06: p('p06', 1440, 1648, 'Café Maya storefront with a thatched roof and garden benches'),
  p09: p('p09', 1440, 1801, 'The back of the Thanos merch tee, worn by a guest'),
  p10: p('p10', 1440, 1440, 'A sparrow mural on the textured wall inside Café Maya'),
  p11: p('p11', 1440, 1440, 'Interior with a timber slat ceiling, bar stools and window seating'),
  p12: p('p12', 2000, 1333, 'Hands cradling a latte with latte art'),
  p13: p('p13', 1169, 780, 'Café Maya lettering on the glass door'),
  p14: p('p14', 1440, 959, 'Matcha poured over an iced drink at the bar'),
  p15: p('p15', 1185, 791, 'Iced drinks and a cheesy pizza slice on a rustic table'),
  p16: p('p16', 1333, 2000, 'Espresso machine with locally sourced coffee bags'),
  p17: p('p17', 1333, 2000, 'Golden milk pitchers beside the glass door'),
  p18: p('p18', 2000, 1333, 'Latte art being poured into a cup'),
  p19: p('p19', 2000, 1333, 'Coffee beans, syrups and goods on the front table'),
  p20: p('p20', 1500, 2000, 'Café Maya team and guests at a pop-up'),
  p21: p('p21', 1500, 2000, 'Smiling crowd at the Café Maya pop-up cart'),
  p22: p('p22', 1500, 2000, 'Guests holding drinks at a garden pop-up'),
  p23: p('p23', 1500, 2000, 'Pop-up guests gathered around the Café Maya cart'),
  p24: p('p24', 1440, 960, 'Café Maya glowing at night with guests inside'),
  p25: p('p25', 1440, 960, 'The round Café Maya sign with its blue bird mark'),
  p27: p('p27', 1638, 1597, 'A tall latte on a saucer in a shaft of afternoon sun'),
  p28: p('p28', 1638, 1843, 'Pugad Maya latte dusted with cinnamon, seen from above'),
  p29: p('p29', 1599, 2000, 'Matcha and oat drinks beside an Oatside carton on a navy wall'),
  p30: p('p30', 1500, 2000, 'Two Café Maya baristas at a Konek Kita pop-up'),
  p31: p('p31', 1500, 2000, 'A guest with an iced drink seen through leafy window light'),
  p33: p('p33', 1765, 2000, 'A matcha cold foam drink in warm afternoon light'),
  p34: p('p34', 1500, 2000, 'Two friends sharing a table in the garden seating area'),
  p35: p('p35', 2000, 1702, 'A cinnamon-dusted latte resting in a pool of window light'),
  storefront: p('storefront', 1161, 775, 'Café Maya storefront in the afternoon'),
} satisfies Record<string, Photo>

export const src = (ph: Photo) => `/img/${ph.id}-lg.webp`
export const srcSet = (ph: Photo) =>
  `/img/${ph.id}-xs.webp 400w, /img/${ph.id}-sm.webp 720w, /img/${ph.id}-lg.webp ${Math.min(ph.w, 2000)}w`

/**
 * Hero photographs sit inside the arched plate, so each one is cut to the same
 * 4:5 crop at build time and carries the caption that runs beneath the frame.
 */
export interface HeroSlide extends Photo {
  srcset: string
  fallback: string
  caption: string
}

const hero = (ph: Photo, alt: string, caption: string): HeroSlide => {
  const m = heroManifest[ph.id as keyof typeof heroManifest]
  return {
    ...ph,
    alt,
    w: m.plate[0],
    h: m.plate[1],
    srcset: `/img/${ph.id}-platesm.webp ${m.platesm[0]}w, /img/${ph.id}-plate.webp ${m.plate[0]}w`,
    fallback: `/img/${ph.id}-platesm.webp`,
    caption,
  }
}

export const heroSlides: HeroSlide[] = [
  hero(photo.p05, 'The Café Maya glass door, open daily from eight until ten', 'the door on Cuartero Street'),
  hero(photo.p31, 'A guest with an iced drink, framed by leaves at the window', 'afternoon light through the leaves'),
  hero(photo.p28, 'A Pugad Maya latte dusted with cinnamon, seen from above', 'Pugad Maya, dusted with cinnamon'),
  hero(photo.p34, 'Two friends sharing a table in the garden seating', 'the garden tables out front'),
  hero(photo.p16, 'The espresso machine with bags of coffee on the bar', 'the espresso bar'),
  hero(photo.p33, 'A matcha drink under a cap of cold foam', 'matcha under cold foam'),
]

export type GalleryTab = 'place' | 'pours' | 'popups'

export const galleryTabs: { id: GalleryTab; label: string; blurb: string }[] = [
  { id: 'place', label: 'The place', blurb: 'Thatch, timber and leaves. Come in from the street and stay a while.' },
  { id: 'pours', label: 'Pours & plates', blurb: 'What lands on the table, from the first pour to the last slice.' },
  { id: 'popups', label: 'Out & about', blurb: 'Pop-ups, markets and weekends away from Cuartero Street.' },
]

export const gallery: Record<GalleryTab, Photo[]> = {
  place: [photo.p06, photo.p11, photo.p10, photo.p24, photo.p05, photo.p25, photo.p34, photo.p16, photo.p13, photo.storefront],
  pours: [photo.p03, photo.p12, photo.p28, photo.p00, photo.p18, photo.p33, photo.p01, photo.p14, photo.p29, photo.p15, photo.p31, photo.p19, photo.p17, photo.p04, photo.p27, photo.p35],
  popups: [photo.p02, photo.p20, photo.p21, photo.p22, photo.p23, photo.p30, photo.p09],
}
