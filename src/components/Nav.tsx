import { useEffect, useState } from 'react'
import { Menu } from 'lucide-react'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { nav } from '@/data/site'
import { useScrollTo } from '@/hooks/useSmoothScroll'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')
  const scrollTo = useScrollTo()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    nav.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    scrollTo(`#${id}`)
  }

  return (
    <header className={`nav ${scrolled ? 'nav--solid' : ''}`}>
      <a className="nav__brand" href="#top" onClick={(e) => { e.preventDefault(); scrollTo(0) }} aria-label="Café Maya, back to top">
        <img src="/img/logo-xs.webp" alt="" width={40} height={40} />
        <span>café maya</span>
      </a>

      <nav className="nav__links" aria-label="Primary">
        {nav.map((n) => (
          <a key={n.id} href={`#${n.id}`} onClick={go(n.id)} aria-current={active === n.id ? 'true' : undefined}>
            {n.label}
          </a>
        ))}
      </nav>

      <Sheet>
        <SheetTrigger className="nav__burger" aria-label="Open menu">
          <Menu size={22} />
        </SheetTrigger>
        <SheetContent side="right" className="sheet">
          <SheetTitle className="sheet__title">café maya</SheetTitle>
          <SheetDescription className="sr-only">Site navigation</SheetDescription>
          <nav className="sheet__links" aria-label="Mobile">
            {nav.map((n) => (
              <SheetClose key={n.id} render={<a href={`#${n.id}`} onClick={go(n.id)} />}>
                {n.label}
              </SheetClose>
            ))}
          </nav>
          <p className="sheet__foot">Open every day, 8am to 10pm<br />33 Cuartero Street, Jaro, Iloilo City</p>
        </SheetContent>
      </Sheet>
    </header>
  )
}
