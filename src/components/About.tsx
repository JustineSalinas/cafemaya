import { photo, src, srcSet } from '@/data/images'

const facts = [
  { title: 'Eight in the morning until ten at night', text: 'Every day of the week, holidays included.' },
  { title: 'Beans from all over the country', text: 'Sourced across the Philippines, never anonymous.' },
  { title: 'Run on solar', text: 'The lights stay on through a brownout, and so does the grinder.' },
  { title: '33 Cuartero Street, Jaro', text: 'Thatched roof, garden tables, a sparrow on the wall.' },
]

export function About() {
  return (
    <section className="about section" aria-labelledby="about-title">
      <div className="about__grid">
        <div className="about__copy">
          <p className="eyebrow">Pugad Maya</p>
          <h2 className="display">
            <span id="about-title">A nest for the whole neighborhood.</span>
          </h2>
          <div className="prose">
            <p>
              Café Maya is a community coffeeshop in Jaro, Iloilo City. We source our beans from all over the Philippines and pour them slowly, for neighbors, for friends, and for anyone passing through.
            </p>
            <p>
              Our signature cup, <strong>Pugad Maya</strong>, takes its name from the humble nest of the maya bird: a place built with patience, care and quiet love. A place you return to when the world feels too heavy, too loud, too much.
            </p>
            <p>
              Not something you drink so much as something you feel. Warm, familiar, grounding, like coming home to something that understands you without a word.
            </p>
          </div>
          <p className="about__quote">Because deep down, we all long for a place that feels like home.</p>
        </div>

        <div className="about__media">
          <figure className="about__img about__img--big">
            <img src={src(photo.p10)} srcSet={srcSet(photo.p10)} sizes="(max-width: 900px) 90vw, 34vw" width={photo.p10.w} height={photo.p10.h} alt={photo.p10.alt} loading="lazy" decoding="async" />
            <figcaption>the sparrow painted on the back wall</figcaption>
          </figure>
          <figure className="about__img">
            <img src={src(photo.p06)} srcSet={srcSet(photo.p06)} sizes="(max-width: 900px) 90vw, 34vw" width={photo.p06.w} height={photo.p06.h} alt={photo.p06.alt} loading="lazy" decoding="async" />
            <figcaption>the thatched roof on Cuartero Street</figcaption>
          </figure>
        </div>
      </div>

      <div className="facts">
        <dl className="facts__grid">
          {facts.map((f) => (
            <div className="fact" key={f.title}>
              <dt className="fact__title">{f.title}</dt>
              <dd className="fact__text">{f.text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
