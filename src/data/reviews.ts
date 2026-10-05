/**
 * Real Google Maps reviews for Café Maya (4.9 average from 40 ratings, of which
 * 5 carry written text). Quotes are verbatim excerpts; an ellipsis marks where a
 * longer review was trimmed, and each card keeps the reviewer's own star rating
 * so a mixed review is never dressed up as a rave.
 * Re-check before launch: reviews change over time.
 */
export interface Review {
  quote: string
  name: string
  source: string
  when: string
  rating: 5 | 4
}

export const ratingSummary = { average: 4.9, count: 40, source: 'Google' }

export const reviewsUrl =
  'https://www.google.com/maps/place/Cafe+Maya/@10.7261815,122.5516998,17z/data=!4m8!3m7!1s0x33aee5a0fdb1fb3b:0xe4893880208dc6cf!9m1!1b1'

export const reviews: Review[] = [
  {
    quote: 'Cozy vibe and welcoming staff. LOVED their signature matcha drink, fave cafe in Iloilo hands down!',
    name: 'Melanie Au',
    source: 'Google review',
    when: '7 months ago',
    rating: 5,
  },
  {
    quote:
      'A small lovely and cozy cafe with good food and very friendly owners and staff. They gave us good suggestions on what to do, where to go and eat during our trip. It was a nice moment chatting with friendly people of Iloilo.',
    name: 'A. T.',
    source: 'Google review',
    when: '3 months ago',
    rating: 5,
  },
  {
    quote:
      'A nice and cozy café with good coffee, especially the Spanish Latte and matcha. It offers a variety of drinks and food at reasonable prices. Overall, it is a good place to relax, hang out, and enjoy quality drinks and food.',
    name: 'Ryne Emman P. Ebacuado',
    source: 'Google review',
    when: '2 months ago',
    rating: 5,
  },
  {
    quote:
      'I liked the vibe of the cafe and the staff were very accommodating… I liked that the music was kept low so it was easy to talk with friends or study and work. It felt relaxed without feeling too quiet.',
    name: 'Bret C.',
    source: 'Google review',
    when: '4 months ago',
    rating: 4,
  },
  {
    quote: 'Signature Coffee is GOOOD! Matcha is good too if you want your matcha sweet… Might comeback for the drinks!',
    name: "I am EXO's Trash",
    source: 'Google review',
    when: '11 months ago',
    rating: 4,
  },
]
