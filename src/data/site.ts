export const site = {
  name: 'Café Maya',
  tagline: 'a community coffeeshop',
  address: ['33 Cuartero Street', 'Jaro, Iloilo City'],
  hours: { open: 8, close: 22, label: '8:00 am – 10:00 pm', days: 'Daily' },
  coords: { lat: 10.7261815, lng: 122.5516998 },
  mapsUrl: 'https://maps.app.goo.gl/2ubZMdmpwMWVQWd68',
  instagram: 'https://www.instagram.com/cafemaya.ph/',
  facebook: 'https://www.facebook.com/cafemaya.ph',
  handle: '@cafemaya.ph',
  delivery: ['Grab', 'Foodpanda'],
} as const

export interface DeliveryOption {
  name: string
  href: string | null
  note: string
}

export const delivery: readonly DeliveryOption[] = [
  { name: 'Foodpanda', href: 'https://www.foodpanda.ph/restaurant/j48v/cafe-maya-cuartero-street', note: 'Order online' },
  { name: 'GrabFood', href: 'https://food.grab.com/ph/', note: 'Search Café Maya in the Grab app' },
]

export const nav = [
  { id: 'about', label: 'About' },
  { id: 'menu', label: 'Menu' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'visit', label: 'Visit' },
] as const
