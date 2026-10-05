import { photo, type Photo } from './images'

/**
 * DRAFT MENU. Built only from what is visible in the café's public photos.
 * Instagram and Facebook menu posts are login-gated, so item names and prices
 * must be confirmed against the café's real menu before launch.
 * Leave `price` undefined to hide it. Set to a number (PHP) to show it.
 */
export interface MenuItem {
  name: string
  note?: string
  price?: number
}

export interface MenuSection {
  id: string
  title: string
  blurb: string
  items: MenuItem[]
  image: Photo
}

export const menuIsDraft = true

export const menu: MenuSection[] = [
  {
    id: 'coffee',
    title: 'Coffee',
    blurb: 'Beans sourced across the Philippines, pulled and poured to order.',
    image: photo.p12,
    items: [
      { name: 'Espresso', note: 'Short, dense, honest' },
      { name: 'Americano', note: 'Hot or iced' },
      { name: 'Cappuccino', note: 'Silky foam, balanced' },
      { name: 'Café Latte', note: 'Hot or iced, with latte art' },
      { name: 'Pour Over', note: 'Brewed by hand, one cup at a time' },
    ],
  },
  {
    id: 'signature',
    title: 'Pugad Maya',
    blurb: 'Our signature cup. Warm, familiar and grounding, like coming home.',
    image: photo.p28,
    items: [
      { name: 'Pugad Maya Latte', note: 'Dusted with cinnamon, served with a saucer' },
      { name: 'Pugad Maya, iced', note: 'The same comfort, over ice' },
    ],
  },
  {
    id: 'matcha',
    title: 'Matcha & Oat',
    blurb: 'Green, creamy and cold. Made with oat milk if you like.',
    image: photo.p33,
    items: [
      { name: 'Matcha Latte', note: 'Hot or iced' },
      { name: 'Matcha Cold Foam', note: 'Iced matcha under a cloud of foam' },
      { name: 'Oat Milk Swap', note: 'On any milk drink' },
    ],
  },
  {
    id: 'bites',
    title: 'Plates & Pizza',
    blurb: 'Food to share, built for long afternoons.',
    image: photo.p15,
    items: [
      { name: 'Pizza', note: 'Pepperoni and cheese, baked to order' },
      { name: 'Rice Plate', note: 'Sausage, egg and rice, with a cold coffee on the side' },
      { name: 'Loaded Plate', note: 'Ask what is on today' },
    ],
  },
]
