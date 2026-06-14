import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import RevealSection from '../components/RevealSection'
import { GAME_VERSION } from '../constants'
import { boss3 } from '../assets'

const DOWNLOAD_DISABLED_MESSAGE = 'Próximamente estará disponible para descarga.'
const DOWNLOAD_MOBILE_DISABLED_MESSAGE = 'Próximamente disponible en Android y iOS.'

const REQUIREMENTS_PC = [
  { label: 'OS', minimum: 'Windows 10', recommended: 'Windows 11' },
  { label: 'CPU', minimum: 'Dual-core 2.5 GHz', recommended: 'Quad-core 3.0 GHz' },
  { label: 'RAM', minimum: '4 GB', recommended: '8 GB' },
  { label: 'GPU', minimum: 'GTX 750 Ti / RX 460 (Vulkan requerido)', recommended: 'GTX 1060 / RX 580' },
  { label: 'VRAM', minimum: '1 GB', recommended: '2 GB' },
  { label: 'Almacenamiento', minimum: '500 MB', recommended: '500 MB' },
  { label: 'Resolución', minimum: '1280x720', recommended: '1920x1080' },
]

const REQUIREMENTS_MOBILE = [
  { label: 'OS', minimum: 'Android 8.0 / iOS 16', recommended: 'Android 11 / iOS 17' },
  { label: 'RAM', minimum: '3 GB', recommended: '6 GB' },
  { label: 'GPU', minimum: 'Vulkan 1.0 (Android) / Metal (iOS)', recommended: 'Adreno 618 / Apple A13' },
  { label: 'Almacenamiento', minimum: '500 MB', recommended: '500 MB' },
  { label: 'Pantalla', minimum: '5.5" 720p', recommended: '6" 1080p' },
]

export default function Download() {
  return (
    <PageTransition>
      <main className="min-h-screen bg-horror-bg">
        <section className="relative min-h-screen flex items-center overflow-hidden">
          <div className="absolute inset-x-0 bottom-0 top-16">
            <img
              src={boss3}
              alt=""
              className="w-full h-full object-cover object-top ps1-image"
              style={{ filter: 'brightness(0.35) saturate(0.4) contrast(1.1)' }}
              draggable={false}
              onError={(e) => {
                e.currentTarget.style.visibility = 'hidden'
              }}
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-r from-horror-bg/88 via-horror-bg/72 to-horror-bg/86" />
          <div className="absolute inset-0 bg-gradient-to-t from-horror-bg via-horror-bg/35 to-horror-bg/70" />

          <div className="relative z-10 w-full max-w-4xl mx-auto px-6 pt-28 pb-20">
            <RevealSection className="text-center">
              <h1 className="section-title mb-2">Descargar</h1>
              <div className="w-12 h-px bg-horror-red mx-auto mt-4 mb-6" />

              <div className="mt-12 flex items-center justify-center gap-3">
                <div className="relative inline-flex group">
                  <motion.button
                    type="button"
                    className="btn-primary inline-flex items-center gap-2 sm:gap-4 text-xs sm:text-base px-5 sm:px-12 py-4 sm:py-5 opacity-70 cursor-not-allowed whitespace-nowrap"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
                    onClick={(e) => {
                      e.preventDefault()
                    }}
                    aria-disabled="true"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path d="M2 3.2L8 2.3v6H2V3.2ZM9 2.2l7-1.1v7.2H9V2.2ZM2 9.6h6v6.1L2 14.8V9.6ZM9 9.6h7V17l-7-1.1V9.6Z" fill="currentColor" />
                    </svg>
                    Descargar Windows
                  </motion.button>

                  <span
                    className="pointer-events-none absolute left-1/2 top-[-2.8rem] -translate-x-1/2 whitespace-nowrap
                      rounded-sm border border-horror-border bg-horror-card px-3 py-1.5
                      font-mono text-[0.62rem] uppercase tracking-[0.14em] text-horror-text-muted
                      opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  >
                    {DOWNLOAD_DISABLED_MESSAGE}
                  </span>
                </div>

                <div className="relative inline-flex group">
                  <motion.button
                    type="button"
                    className="btn-secondary inline-flex items-center gap-2 sm:gap-4 text-xs sm:text-base px-4 sm:px-10 py-4 sm:py-5 opacity-80 cursor-not-allowed whitespace-nowrap"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
                    onClick={(e) => {
                      e.preventDefault()
                    }}
                    aria-disabled="true"
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                      <rect x="5" y="1.5" width="8" height="15" rx="1.4" stroke="currentColor" strokeWidth="1.4" />
                      <circle cx="9" cy="13.4" r="0.8" fill="currentColor" />
                    </svg>
                    Descargar Mobile
                  </motion.button>

                  <span
                    className="pointer-events-none absolute left-1/2 top-[-2.8rem] -translate-x-1/2 whitespace-nowrap
                      rounded-sm border border-horror-border bg-horror-card px-3 py-1.5
                      font-mono text-[0.62rem] uppercase tracking-[0.14em] text-horror-text-muted
                      opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  >
                    {DOWNLOAD_MOBILE_DISABLED_MESSAGE}
                  </span>
                </div>
              </div>
            </RevealSection>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-horror-bg to-transparent" />
        </section>

        <section className="pb-24">
          <div className="max-w-4xl mx-auto px-6">
            <RevealSection delay={0.15} className="mb-20">
              <div className="flex items-center gap-4 mb-8">
                <span className="section-label">Requisitos PC</span>
                <div className="flex-1 h-px bg-horror-border" />
              </div>

              <div className="grid gap-3 mb-12">
                <div className="grid grid-cols-[92px_1fr_1fr] md:grid-cols-[120px_1fr_1fr] gap-3 border border-horror-border bg-horror-card px-4 py-3">
                  <span className="font-mono text-xs tracking-widest uppercase text-horror-text-dim"> </span>
                  <span className="font-mono text-xs tracking-widest uppercase text-horror-gold">Mínimo</span>
                  <span className="font-mono text-xs tracking-widest uppercase text-horror-gold">Recomendado</span>
                </div>

                {REQUIREMENTS_PC.map(({ label, minimum, recommended }, i) => (
                  <motion.div
                    key={label}
                    className="grid grid-cols-[92px_1fr_1fr] md:grid-cols-[120px_1fr_1fr] gap-3 py-3.5 px-4 bg-horror-card border border-horror-border items-start"
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{
                      duration: 0.45,
                      delay: i * 0.05,
                      ease: [0.23, 1, 0.32, 1],
                    }}
                  >
                    <span className="font-mono text-xs text-horror-text-dim tracking-widest uppercase w-28 flex-shrink-0 pt-0.5">
                      {label}
                    </span>
                    <span className="font-ui text-xs md:text-sm text-horror-text">{minimum}</span>
                    <span className="font-ui text-xs md:text-sm text-horror-text">{recommended}</span>
                  </motion.div>
                ))}
              </div>

              <div className="flex items-center gap-4 mb-8">
                <span className="section-label">Requisitos mobile</span>
                <div className="flex-1 h-px bg-horror-border" />
              </div>

              <div className="grid gap-3">
                <div className="grid grid-cols-[92px_1fr_1fr] md:grid-cols-[120px_1fr_1fr] gap-3 border border-horror-border bg-horror-card px-4 py-3">
                  <span className="font-mono text-xs tracking-widest uppercase text-horror-text-dim"> </span>
                  <span className="font-mono text-xs tracking-widest uppercase text-horror-gold">Mínimo</span>
                  <span className="font-mono text-xs tracking-widest uppercase text-horror-gold">Recomendado</span>
                </div>

                {REQUIREMENTS_MOBILE.map(({ label, minimum, recommended }, i) => (
                  <motion.div
                    key={label}
                    className="grid grid-cols-[92px_1fr_1fr] md:grid-cols-[120px_1fr_1fr] gap-3 py-3.5 px-4 bg-horror-card border border-horror-border items-start"
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{
                      duration: 0.45,
                      delay: i * 0.05,
                      ease: [0.23, 1, 0.32, 1],
                    }}
                  >
                    <span className="font-mono text-xs text-horror-text-dim tracking-widest uppercase w-28 flex-shrink-0 pt-0.5">
                      {label}
                    </span>
                    <span className="font-ui text-xs md:text-sm text-horror-text">{minimum}</span>
                    <span className="font-ui text-xs md:text-sm text-horror-text">{recommended}</span>
                  </motion.div>
                ))}
              </div>
            </RevealSection>

            <RevealSection delay={0.2} className="mb-16">
              <div className="flex items-center gap-4 mb-6">
                <span className="section-label">Motor</span>
                <div className="flex-1 h-px bg-horror-border" />
              </div>
              <div className="border border-horror-border bg-horror-card px-5 py-4">
                <p className="font-mono text-xs tracking-[0.14em] uppercase text-horror-text-muted">
                  Godot 4.6
                </p>
              </div>
            </RevealSection>

          </div>
        </section>
      </main>
    </PageTransition>
  )
}
