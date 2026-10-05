import { site } from './site'

export interface Intent {
  id: string
  label: string
  /** short form used on the quick-reply chips, where space is tight */
  chip?: string
  keywords: string[]
  answer: string
}

const ig = `Instagram ${site.handle}`

export const intents: Intent[] = [
  {
    id: 'hours',
    label: 'Opening hours',
    chip: 'Hours',
    keywords: ['hour', 'open', 'close', 'closing', 'time', 'schedule', 'late', 'early', 'sunday', 'weekend', 'holiday', 'until', 'what time'],
    answer: 'We are open daily from 8:00 am to 10:00 pm, every day of the week. For holiday changes, check our latest posts on Instagram or Facebook.',
  },
  {
    id: 'location',
    label: 'Where are you?',
    chip: 'Location',
    keywords: ['where', 'address', 'location', 'direction', 'map', 'find', 'locate', 'jaro', 'cuartero', 'iloilo', 'how to get', 'commute', 'near', 'landmark'],
    answer: `You will find us at 33 Cuartero Street, Jaro, Iloilo City. Tap "Get directions" in the Visit section for Google Maps.`,
  },
  {
    id: 'menu',
    label: 'What is on the menu?',
    chip: 'Menu',
    keywords: ['menu', 'drink', 'food', 'eat', 'serve', 'coffee', 'latte', 'espresso', 'matcha', 'pizza', 'rice', 'pastry', 'price', 'cost', 'how much', 'pugad'],
    answer: 'Coffee made from beans sourced across the Philippines, our signature Pugad Maya latte, matcha and oat-milk drinks, plus pizza and rice plates. Flip through the menu book above. Prices and daily specials change, so check Instagram or the Grab and Foodpanda listings for the latest.',
  },
  {
    id: 'delivery',
    label: 'Do you deliver?',
    chip: 'Delivery',
    keywords: ['deliver', 'delivery', 'grab', 'foodpanda', 'panda', 'order', 'take out', 'takeout', 'take-out', 'pickup', 'pick up', 'to go'],
    answer: 'Yes. We are on Grab and Foodpanda delivery. You can also grab a cup to go when you drop by.',
  },
  {
    id: 'beans',
    label: 'Where are your beans from?',
    chip: 'Our beans',
    keywords: ['bean', 'source', 'origin', 'roast', 'roaster', 'local', 'philippines', 'single origin', 'buy beans', 'whole bean'],
    answer: 'We source our beans from all over the Philippines. If you want to take beans home, ask the baristas what is on the shelf today.',
  },
  {
    id: 'pugad',
    label: 'What is Pugad Maya?',
    chip: 'Pugad Maya',
    keywords: ['pugad', 'nest', 'maya bird', 'bird', 'name', 'meaning', 'story', 'logo', 'sparrow', 'about'],
    answer: 'Pugad Maya is our signature cup, named after the humble nest of the maya bird. It stands for a place built with patience, care and quiet love, somewhere you return to when the world feels too loud. Warm, familiar, grounding.',
  },
  {
    id: 'popups',
    label: 'Pop-ups & events',
    chip: 'Pop-ups',
    keywords: ['popup', 'pop-up', 'pop up', 'event', 'jungle', 'concrete', 'market', 'bazaar', 'cater', 'catering', 'booth', 'collab', 'konek'],
    answer: `We bring Café Maya out to local markets and creative gatherings, like Jungle Made at Concrete Jungle, alongside other cafes, makers and community builders. Follow ${ig} to see where we show up next. For booth or catering requests, message us there.`,
  },
  {
    id: 'merch',
    label: 'Merch',
    chip: 'Merch',
    keywords: ['merch', 'shirt', 't-shirt', 'tee', 'thanos', 'size', 'apparel', 'clothes', 'buy shirt'],
    answer: 'Our first merch drop celebrates Thanos, the café dog and official customer greeter. Tees come in S to 2XL in a loose fit. To place an order, send us a message on Instagram or Facebook.',
  },
  {
    id: 'solar',
    label: 'Power & brownouts',
    chip: 'Wifi & power',
    keywords: ['solar', 'brownout', 'power', 'outage', 'blackout', 'electric', 'aircon', 'air con', 'wifi', 'wi-fi', 'internet', 'outlet', 'charge', 'work', 'study', 'laptop'],
    answer: 'Café Maya runs on solar energy, so no more brownouts. For details like wifi and outlets, ask the baristas when you arrive, since setups can change.',
  },
  {
    id: 'reserve',
    label: 'Reservations',
    chip: 'Groups',
    keywords: ['reserve', 'reservation', 'book', 'table', 'group', 'big group', 'party', 'birthday', 'private', 'capacity', 'seat'],
    answer: `We welcome walk-ins. For groups or special occasions, message us on ${ig} or Facebook so we can plan the space with you.`,
  },
  {
    id: 'pets',
    label: 'Pets & kids',
    chip: 'Pets & kids',
    keywords: ['pet', 'dog', 'cat', 'kid', 'child', 'baby', 'family', 'friendly', 'thanos', 'stroller'],
    answer: 'We are a community coffeeshop, so everyone is welcome. Thanos, our café dog, usually greets guests at the door.',
  },
  {
    id: 'contact',
    label: 'Contact us',
    chip: 'Contact',
    keywords: ['contact', 'message', 'call', 'phone', 'number', 'email', 'dm', 'reach', 'facebook', 'instagram', 'social', 'follow', 'inquir'],
    answer: `The fastest way to reach us is a message on ${ig} or on Facebook at facebook.com/cafemaya.ph.`,
  },
  {
    id: 'payment',
    label: 'Payment',
    chip: 'Payment',
    keywords: ['pay', 'payment', 'gcash', 'card', 'cash', 'credit', 'debit', 'maribank'],
    answer: 'For which payment methods we accept in store, please ask our baristas or message us on Instagram. We would rather confirm than guess.',
  },
]

export const greeting = 'Hi, I am the Café Maya assistant. Ask me about hours, the menu, delivery or how to find us.'
export const fallback = `I am not sure about that one. The best place to ask is a direct message on ${ig} or Facebook. Or pick a topic below.`
export const quickReplies = ['hours', 'location', 'menu', 'delivery', 'popups', 'contact']

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ')

export function answerFor(input: string): { intent: Intent | null; text: string } {
  const text = normalize(input)
  let best: Intent | null = null
  let bestScore = 0
  for (const intent of intents) {
    let score = 0
    for (const k of intent.keywords) {
      if (text.includes(k)) score += k.includes(' ') ? 3 : k.length > 4 ? 2 : 1
    }
    if (score > bestScore) {
      best = intent
      bestScore = score
    }
  }
  return best ? { intent: best, text: best.answer } : { intent: null, text: fallback }
}
