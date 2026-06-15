import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import creditsBg from '../assets/images/credits/creditsbg.png'

type AssetCredit = {
  name: string
  author: string
  license: string
  url?: string
}

type AssetCategory = {
  category: string
  items: AssetCredit[]
}

const ASSET_CREDITS: AssetCategory[] = [
  {
    category: 'Tipografía',
    items: [
      { name: 'Special Elite', author: 'Google Fonts', license: 'Apache License 2.0' },
    ],
  },
  {
    category: 'Escenario',
    items: [
      { name: 'Abandoned House', author: 'Elbolilloduro', license: 'CC0', url: 'https://elbolilloduro.itch.io/abandoned-house' },
    ],
  },
  {
    category: 'Boss',
    items: [
      { name: 'Sackhead Killer / PSX Character', author: 'Aredius (Daniel Arias)', license: 'Permiso del autor', url: 'https://arediuspsx.itch.io/sackhead-killer' },
    ],
  },
  {
    category: 'Armas y props',
    items: [
      { name: 'Animated FPS Axe', author: 'Levraicoincoin', license: 'CC BY 4.0', url: 'https://sketchfab.com/3d-models/animated-fps-axe-3c4e32a07d4146c69e297b26c565f343' },
      { name: 'Animated FPS Pistol', author: 'Levraicoincoin', license: 'Permiso del autor', url: 'https://levraicoincoin.itch.io/animated-fps-pistol' },
      { name: 'Animated FPS Lever Action', author: 'Levraicoincoin', license: 'CC BY 4.0', url: 'https://sketchfab.com/3d-models/animated-fps-lever-action-0ec3560f757448d78a344c99b7c528de' },
      { name: 'Flashlight', author: 'SketchyBot', license: 'CC BY 4.0', url: 'https://sketchfab.com/3d-models/flashlight-4776f56179af4891ac856316892c4cd8' },
      { name: 'Low Poly Key', author: 'RealityForge', license: 'CC BY 4.0', url: 'https://sketchfab.com/3d-models/low-poly-key-ca5b38659d6a49428de0aaa5abf2f3f6' },
      { name: 'Old Paper', author: 'tukuru_kunn', license: 'CC BY 4.0', url: 'https://sketchfab.com/3d-models/old-paper-0a7cf9d5bf7742b3a711d39eed36332f' },
      { name: 'PSX VHS', author: 'IIShazlyII', license: 'CC BY 4.0', url: 'https://sketchfab.com/3d-models/psx-vhs-0d8a684443dd464eb3b1c5a17e842891' },
    ],
  },
  {
    category: 'Entorno',
    items: [
      { name: 'Building Kit', author: 'Kenney', license: 'CC0', url: 'https://kenney.nl/assets/building-kit' },
      { name: 'Rat', author: 'Quaternius', license: 'CC0', url: 'https://poly.pizza/m/iltq5bVNaV' },
    ],
  },
]

const PERSONAL_CREDITS: Array<{ role: string; name: string | string[] }> = [
  { role: 'Programación', name: 'Tobias Velazquez' },
  { role: 'Diseño', name: 'Tobias Velazquez' },
  {
    role: 'Guión',
    name: ['Tobias Velazquez', 'Guguex', 'Lorenzo Velazquez'],
  },
  { role: 'Audio', name: 'Tobias Velazquez' },
]

const getWrappedIndex = (index: number, length: number) => (index + length) % length

export default function Credits() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % PERSONAL_CREDITS.length)
    }, 4200)

    return () => {
      window.clearInterval(timer)
    }
  }, [])

  const creditsVisible = [
    PERSONAL_CREDITS[getWrappedIndex(activeIndex - 1, PERSONAL_CREDITS.length)],
    PERSONAL_CREDITS[activeIndex],
    PERSONAL_CREDITS[getWrappedIndex(activeIndex + 1, PERSONAL_CREDITS.length)],
  ]

  return (
    <PageTransition>
      <main className="min-h-screen bg-horror-bg">
        <section className="relative min-h-screen overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={creditsBg}
              alt=""
              className="w-full h-full object-cover object-[left_48px] md:object-[left_72px]"
              draggable={false}
              onError={(e) => {
                e.currentTarget.style.visibility = 'hidden'
              }}
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/55 to-black/94" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/55" />

          <div className="relative z-10 min-h-screen max-w-7xl mx-auto px-6 pt-28 pb-16 flex items-center justify-end">
            <div className="w-full md:w-[42%] flex items-center justify-center">
              <div className="w-full max-w-[520px] text-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, y: 18, scale: 0.985 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -18, scale: 0.99 }}
                    transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                    className="min-h-[240px] md:min-h-[270px] flex flex-col items-center justify-center gap-6 md:gap-8"
                  >
                    {creditsVisible.map((credit, idx) => {
                      const isCenter = idx === 1
                      return (
                        <div key={`${credit.role}-${idx}`} className="leading-[1.03]">
                          <p
                            className={`font-body uppercase tracking-[0.07em] ${
                              isCenter
                                ? 'text-white text-3xl md:text-[2.35rem] md:whitespace-nowrap'
                                : 'text-horror-text-muted/35 text-xl md:text-[1.45rem]'
                            }`}
                            style={isCenter ? { textShadow: '0 0 22px rgba(255,255,255,0.16)' } : undefined}
                          >
                            {credit.role}
                          </p>
                          <p
                            className={`font-body mt-1.5 ${
                              isCenter
                                ? 'text-horror-gold text-3xl md:text-[2.3rem] md:whitespace-nowrap'
                                : 'text-horror-text-muted/35 text-xl md:text-[1.45rem]'
                            }`}
                            style={isCenter ? { textShadow: '0 0 22px rgba(255,255,255,0.16)' } : undefined}
                          >
                            {Array.isArray(credit.name)
                              ? credit.name.map((person) => (
                                  <span key={person} className="block md:whitespace-nowrap">
                                    {person}
                                  </span>
                                ))
                              : credit.name}
                          </p>
                        </div>
                      )
                    })}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-black py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-body uppercase tracking-[0.12em] text-horror-text-muted/60 text-sm mb-2">
              Assets de terceros
            </h2>
            <p className="font-body text-horror-text-muted/40 text-sm mb-12 max-w-xl">
              Main Case utiliza assets propios y de terceros bajo licencias CC0, CC BY 4.0, Apache License 2.0 y permisos expresos de sus autores.
            </p>

            <div className="flex flex-col gap-10">
              {ASSET_CREDITS.map((group) => (
                <div key={group.category}>
                  <p className="font-body uppercase tracking-[0.15em] text-horror-text-muted/40 text-xs mb-4">
                    {group.category}
                  </p>
                  <div className="flex flex-col gap-3">
                    {group.items.map((item) => (
                      <div
                        key={item.name}
                        className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 border-b border-white/5 pb-3"
                      >
                        <span className="font-body text-horror-gold text-base leading-snug flex-1">
                          {item.url ? (
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-white transition-colors duration-200"
                            >
                              {item.name}
                            </a>
                          ) : (
                            item.name
                          )}
                        </span>
                        <span className="font-body text-horror-text-muted/50 text-sm">
                          {item.author}
                        </span>
                        <span className="font-body text-horror-text-muted/30 text-xs uppercase tracking-widest whitespace-nowrap">
                          {item.license}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </PageTransition>
  )
}
