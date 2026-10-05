import { lazy, Suspense, useEffect, useState } from 'react'
import { Hero } from '@/components/Hero'
import { LazySection } from '@/components/LazySection'
import { Nav } from '@/components/Nav'
import { SmoothScroll } from '@/hooks/useSmoothScroll'

/** Everything below the hero is its own chunk, fetched as the visitor nears it. */
const About = lazy(() => import('@/components/About').then((m) => ({ default: m.About })))
const MenuBook = lazy(() => import('@/components/MenuBook').then((m) => ({ default: m.MenuBook })))
const Gallery = lazy(() => import('@/components/Gallery').then((m) => ({ default: m.Gallery })))
const Reviews = lazy(() => import('@/components/Reviews').then((m) => ({ default: m.Reviews })))
const Visit = lazy(() => import('@/components/Visit').then((m) => ({ default: m.Visit })))
const Footer = lazy(() => import('@/components/Footer').then((m) => ({ default: m.Footer })))
const Chatbot = lazy(() => import('@/components/Chatbot').then((m) => ({ default: m.Chatbot })))

export default function App() {
  const [chat, setChat] = useState(false)

  useEffect(() => {
    // the assistant is a late guest: bring it in once the page has settled
    const start = () => window.setTimeout(() => setChat(true), 1200)
    if (document.readyState === 'complete') {
      const t = start()
      return () => window.clearTimeout(t)
    }
    window.addEventListener('load', start, { once: true })
    return () => window.removeEventListener('load', start)
  }, [])

  return (
    <SmoothScroll>
      <a className="skip" href="#about">Skip to content</a>
      <Nav />
      <main>
        <Hero />
        <LazySection id="about" minHeight="90vh"><About /></LazySection>
        <LazySection id="menu" minHeight="100vh" dark><MenuBook /></LazySection>
        <LazySection id="gallery" minHeight="90vh"><Gallery /></LazySection>
        <LazySection id="reviews" minHeight="60vh"><Reviews /></LazySection>
        <LazySection id="visit" minHeight="80vh"><Visit /></LazySection>
      </main>
      <LazySection id="footer" minHeight="60vh" dark><Footer /></LazySection>
      {chat && <Suspense fallback={null}><Chatbot /></Suspense>}
    </SmoothScroll>
  )
}
