import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useInView, type PanInfo } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import RevealSection from '../components/RevealSection'
import { GAME_TITLE, GAME_DESCRIPTION, GAME_VERSION } from '../constants'
import { boss6, BOSS_SLIDER, GALLERY_IMAGES } from '../assets'

function HeroSection() {
  const scrollAnimRef = useRef<number | null>(null)
  const baseScrollBehaviorRef = useRef<string | null>(null)

  const handleScrollToGallery = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    const target = document.getElementById('galeria')
    if (!target) return

    const startY = window.scrollY
    const targetY = target.getBoundingClientRect().top + window.scrollY - 18
    const distance = targetY - startY
    if (Math.abs(distance) < 2) return

    const duration = Math.min(2400, Math.max(900, Math.abs(distance) * 0.8))
    let startTime: number | null = null

    const root = document.documentElement
    if (baseScrollBehaviorRef.current === null) {
      baseScrollBehaviorRef.current = root.style.scrollBehavior
    }
    root.style.scrollBehavior = 'auto'

    if (scrollAnimRef.current !== null) {
      window.cancelAnimationFrame(scrollAnimRef.current)
      scrollAnimRef.current = null
    }

    const restore = () => {
      root.style.scrollBehavior = baseScrollBehaviorRef.current ?? ''
    }

    const easeCinematic = (t: number) => {
      return -(Math.cos(Math.PI * t) - 1) / 2
    }

    const step = (time: number) => {
      if (startTime === null) startTime = time
      const elapsed = time - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeCinematic(progress)
      window.scrollTo(0, startY + distance * eased)
      if (progress < 1) {
        scrollAnimRef.current = requestAnimationFrame(step)
      } else {
        scrollAnimRef.current = null
        restore()
      }
    }

    scrollAnimRef.current = requestAnimationFrame(step)
  }

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <motion.div
        className="absolute inset-x-0 bottom-0 top-16"
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: [0.23, 1, 0.32, 1] }}
      >
        <img
          src={boss6}
          alt=""
          className="w-full h-full object-cover object-top ps1-image"
          draggable={false}
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-r from-horror-bg/95 via-horror-bg/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-horror-bg via-transparent to-horror-bg/40" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-20 w-full">
        <div className="max-w-xl">
          <motion.h1
            className="font-display leading-none tracking-wide text-white mb-2"
            style={{ fontSize: 'clamp(4rem, 12vw, 8rem)', lineHeight: 0.9 }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
          >
            {GAME_TITLE}
          </motion.h1>

          <motion.div
            className="h-px bg-horror-red origin-left mb-6"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.23, 1, 0.32, 1] }}
            style={{ width: '6rem' }}
          />

          <motion.p
            className="font-body text-lg text-horror-text leading-relaxed mb-10 max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45, ease: [0.23, 1, 0.32, 1] }}
          >
            {GAME_DESCRIPTION}
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.58, ease: [0.23, 1, 0.32, 1] }}
          >
            <Link to="/descargar" className="btn-primary gap-3">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 1v8M8 9l-2.8-2.8M8 9l2.8-2.8M2 13h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Descargar
            </Link>
            <button type="button" className="btn-secondary gap-3" onClick={handleScrollToGallery}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M1.5 8s2.5-4 6.5-4 6.5 4 6.5 4-2.5 4-6.5 4-6.5-4-6.5-4Z" stroke="currentColor" strokeWidth="1.2"/>
                <circle cx="8" cy="8" r="1.8" stroke="currentColor" strokeWidth="1.2"/>
              </svg>
              Ver Capturas
            </button>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-horror-bg to-transparent" />
    </section>
  )
}

function GallerySection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px 0px' })

  return (
    <section id="galeria" className="py-24 md:py-32 bg-horror-surface/40">
      <div className="max-w-7xl mx-auto px-6">
        <RevealSection className="mb-14">
          <span className="section-label mb-3 block">Capturas</span>
          <h2 className="section-title">El entorno</h2>
        </RevealSection>

        <div ref={ref} className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
          {GALLERY_IMAGES.map(({ src }, i) => (
            <motion.figure
              key={i}
              className="relative overflow-hidden group cursor-pointer"
              style={{ aspectRatio: '4/3' }}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.55, delay: i * 0.06, ease: [0.23, 1, 0.32, 1] }}
            >
              <img
                src={src}
                alt="Captura del juego"
                className="w-full h-full object-cover ps1-image transition-transform duration-500 group-hover:scale-[1.04]"
                style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
                draggable={false}
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.parentElement!.style.background = '#191410'
                }}
              />
              <div
                className="absolute inset-0 bg-horror-red/0 group-hover:bg-horror-red/12 transition-colors duration-300 pointer-events-none"
                style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
              />
              <div
                className="absolute inset-0 border border-transparent group-hover:border-horror-red/25 transition-colors duration-300 pointer-events-none"
                style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
              />
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}

const SLIDE_VARIANTS = {
  enter: (dir: number) => ({ x: dir > 0 ? '36%' : '-36%', opacity: 0, scale: 0.97 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? '-36%' : '36%', opacity: 0, scale: 0.97 }),
}
const SWIPE_DISTANCE = 48
const SWIPE_VELOCITY = 360

function BossCarouselSection() {
  const [[index, direction], setPage] = useState([0, 0])

  useEffect(() => {
    const preloadedImages = BOSS_SLIDER.map((slide) => {
      const img = new Image()
      img.src = slide.src
      return img
    })

    return () => {
      preloadedImages.forEach((img) => {
        img.src = ''
      })
    }
  }, [])

  const paginate = (newDir: number) => {
    setPage(([prev]) => [(prev + newDir + BOSS_SLIDER.length) % BOSS_SLIDER.length, newDir])
  }

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const byDistance = Math.abs(info.offset.x) > SWIPE_DISTANCE
    const byVelocity = Math.abs(info.velocity.x) > SWIPE_VELOCITY
    if (!byDistance && !byVelocity) return

    if (info.offset.x < 0 || info.velocity.x < -SWIPE_VELOCITY) {
      paginate(1)
    } else {
      paginate(-1)
    }
  }

  return (
    <section className="py-24 md:py-32 bg-horror-surface/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <RevealSection>
            <span className="section-label mb-4 block">Archivo restringido</span>
            <h2 className="section-title mb-4">???</h2>
            <div className="w-12 h-px bg-horror-red mb-8" />
            <p className="font-body text-lg text-horror-text leading-relaxed mb-6">
              Cada pista te acerca a la verdad, y algo en la casa no quiere que la encuentres.
            </p>
          </RevealSection>

          <RevealSection delay={0.15}>
            <div className="flex flex-col items-center gap-0 max-w-xs mx-auto">
              <div
                className="relative w-full overflow-hidden border border-horror-border/50"
                style={{ aspectRatio: '3/4' }}
              >
                <AnimatePresence custom={direction} mode="sync">
                  <motion.div
                    key={index}
                    custom={direction}
                    variants={SLIDE_VARIANTS}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.22}
                    dragMomentum={false}
                    onDragEnd={handleDragEnd}
                    whileDrag={{ scale: 0.998 }}
                    className="absolute inset-0 cursor-grab active:cursor-grabbing"
                    style={{ touchAction: 'pan-y', willChange: 'transform' }}
                  >
                    <img
                      src={BOSS_SLIDER[index].src}
                      alt={BOSS_SLIDER[index].label}
                      className="w-full h-full object-cover object-top ps1-image"
                      draggable={false}
                      onError={(e) => {
                        e.currentTarget.parentElement!.style.background = '#191410'
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                    <div className="absolute top-0 left-0 w-6 h-px bg-horror-red" />
                    <div className="absolute top-0 left-0 w-px h-6 bg-horror-red" />
                    <div className="absolute bottom-0 right-0 w-6 h-px bg-horror-red" />
                    <div className="absolute bottom-0 right-0 w-px h-6 bg-horror-red" />
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="w-full flex items-center justify-center gap-4 mt-4">
                <button
                  onClick={() => paginate(-1)}
                  aria-label="Anterior"
                  className="w-8 h-8 flex items-center justify-center border border-horror-border
                    text-horror-text-muted hover:text-horror-text hover:border-horror-text-muted
                    transition-all duration-200 active:scale-[0.93]"
                  style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                    <path d="M7 1L3 5l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                <span className="font-mono text-xs text-horror-text-muted tracking-[0.15em] tabular-nums">
                  {String(index + 1).padStart(2, '0')}/{String(BOSS_SLIDER.length).padStart(2, '0')}
                </span>

                <button
                  onClick={() => paginate(1)}
                  aria-label="Siguiente"
                  className="w-8 h-8 flex items-center justify-center border border-horror-border
                    text-horror-text-muted hover:text-horror-text hover:border-horror-text-muted
                    transition-all duration-200 active:scale-[0.93]"
                  style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                    <path d="M3 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </RevealSection>
        </div>
      </div>
    </section>
  )
}

const PATCH_NOTES = [
  {
    version: '1.0',
    label: 'Lanzamiento inicial',
    current: true,
    notes: [
      'Capítulo 1 completo — casa suburbana y escape',
      'Boss Bagman que se enfurece al recibir disparos y al juntar las 5 grabaciones',
      '5 grabaciones coleccionables',
      '9 notas distribuidas en el escenario',
      'Sistema de stamina para sprint y salto',
      'Inventario con armas, munición y llaves',
      'Menú de opciones completo — video, audio, sensibilidad, screamer',
      'Settings persistentes entre sesiones',
      'Screamer de muerte configurable',
    ],
  },
  {
    version: '1.1',
    label: 'Próximamente',
    current: false,
    notes: [
      'Notas con historia completa y detallada',
      'Mejoras en la IA del boss',
      'Optimización de rendimiento general',
      'Nuevos sonidos ambientales',
      'Correcciones de bugs menores',
    ],
  },
]

function VersionPreviewSection() {
  return (
    <section className="py-16 max-w-7xl mx-auto px-6">
      <RevealSection className="mb-10">
        <div className="flex items-center gap-4">
          <span className="section-label">Versiones</span>
          <div className="flex-1 h-px bg-horror-border" />
        </div>
      </RevealSection>

      <div className="grid md:grid-cols-2 gap-6 items-stretch">
        {PATCH_NOTES.map(({ version, label, current, notes }, vi) => (
          <RevealSection key={version} delay={vi * 0.08} className="h-full">
            <div className={`card-horror h-full border ${current ? 'border-horror-border' : 'border-horror-border/40'}`}>
              <div className="flex items-baseline gap-3 mb-5">
                <p className={`font-mono text-xl tracking-widest ${current ? 'text-white' : 'text-horror-text-muted/60'}`}>
                  v{version}
                </p>
                <span className={`font-mono text-xs tracking-[0.18em] uppercase ${current ? 'text-horror-red' : 'text-horror-text-muted/40'}`}>
                  {label}
                </span>
              </div>
              <ul className="flex flex-col gap-2.5">
                {notes.map((note) => (
                  <li key={note} className="flex items-start gap-3">
                    <span className={`mt-[7px] w-1 h-1 rounded-full flex-shrink-0 ${current ? 'bg-horror-red' : 'bg-horror-text-muted/30'}`} />
                    <span className={`font-body text-sm leading-relaxed ${current ? 'text-horror-text-muted' : 'text-horror-text-muted/40'}`}>
                      {note}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </RevealSection>
        ))}
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="py-32 md:py-44 max-w-7xl mx-auto px-6 text-center">
      <RevealSection>
        <span className="section-label mb-6 block">Preparado?</span>
        <h2 className="font-display text-5xl md:text-8xl leading-none tracking-wide text-white mb-6">
          No hay vuelta atras
        </h2>
        <div className="w-12 h-px bg-horror-red mx-auto mb-12" />
        <Link to="/descargar" className="btn-primary gap-3">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M8 1v8M8 9l-2.8-2.8M8 9l2.8-2.8M2 13h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Descargar
        </Link>
      </RevealSection>
    </section>
  )
}

export default function Home() {
  return (
    <PageTransition>
      <main className="min-h-screen bg-horror-bg">
        <HeroSection />
        <BossCarouselSection />
        <GallerySection />
        <VersionPreviewSection />
        <CTASection />
      </main>
    </PageTransition>
  )
}










