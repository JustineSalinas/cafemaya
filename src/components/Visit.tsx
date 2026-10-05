import { useEffect, useRef } from 'react'
import { Clock, ExternalLink, MapPin, Navigation, Bike } from 'lucide-react'
import { Map, MapControls, MapMarker, MarkerContent, MarkerPopup } from '@/components/ui/map'
import { site } from '@/data/site'
import { useOpenStatus } from '@/hooks/useOpenStatus'
import { FacebookIcon, InstagramIcon } from './Icons'

export function Visit() {
  const status = useOpenStatus()
  const { lat, lng } = site.coords
  const mapBox = useRef<HTMLDivElement>(null)

  // maplibre injects its attribution links at runtime without rel="noreferrer"
  useEffect(() => {
    const el = mapBox.current
    if (!el) return
    const harden = () => el.querySelectorAll('a[target="_blank"]').forEach((a) => a.setAttribute('rel', 'noopener noreferrer'))
    harden()
    const mo = new MutationObserver(harden)
    mo.observe(el, { childList: true, subtree: true })
    return () => mo.disconnect()
  }, [])

  return (
    <section className="visit section" aria-labelledby="visit-title">
      <div className="section__head">
        <p className="eyebrow">Visit</p>
        <h2 className="display"><span id="visit-title">Find your way to the nest.</span></h2>
      </div>

      <div className="visit__grid">
        <div className="visit__map">
          <div ref={mapBox} className="visit__mapinner">
          <Map center={[lng, lat]} zoom={16.2} theme="light" scrollZoom={false} aria-label="Map showing Café Maya at 33 Cuartero Street, Jaro, Iloilo City">
            <MapControls showZoom position="bottom-right" />
            <MapMarker longitude={lng} latitude={lat}>
              <MarkerContent>
                <div className="pin"><img src="/img/logo-xs.webp" alt="Café Maya" width={48} height={48} /></div>
              </MarkerContent>
              <MarkerPopup closeButton>
                <div className="mappopup">
                  <strong>Café Maya</strong>
                  <span>{site.address.join(', ')}</span>
                  <a href={site.mapsUrl} target="_blank" rel="noreferrer">Open in Google Maps</a>
                </div>
              </MarkerPopup>
            </MapMarker>
          </Map>
          </div>
        </div>

        <div className="visit__card">
          <p className="visit__status"><span className={`dot ${status.open ? 'dot--open' : ''}`} aria-hidden="true" />{status.label}</p>
          <dl>
            <div>
              <dt><MapPin size={18} aria-hidden="true" /> Address</dt>
              <dd>{site.address[0]}<br />{site.address[1]}</dd>
            </div>
            <div>
              <dt><Clock size={18} aria-hidden="true" /> Hours</dt>
              <dd>{site.hours.days}<br />{site.hours.label}</dd>
            </div>
            <div>
              <dt><Bike size={18} aria-hidden="true" /> Delivery</dt>
              <dd>{site.delivery.join(' and ')}</dd>
            </div>
          </dl>
          <a className="btn btn--solid" href={site.mapsUrl} target="_blank" rel="noreferrer"><Navigation size={16} aria-hidden="true" /> Get directions</a>
          <div className="visit__social">
            <a href={site.instagram} target="_blank" rel="noreferrer"><InstagramIcon /> {site.handle} <ExternalLink size={13} aria-hidden="true" /></a>
            <a href={site.facebook} target="_blank" rel="noreferrer"><FacebookIcon /> Café Maya <ExternalLink size={13} aria-hidden="true" /></a>
          </div>
        </div>
      </div>
    </section>
  )
}
