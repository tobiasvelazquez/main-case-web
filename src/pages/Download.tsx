import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import RevealSection from '../components/RevealSection'
import { GAME_VERSION, DOWNLOAD_URL } from '../constants'
import { boss3 } from '../assets'

const REQUIREMENTS_PC = [
  { label: 'OS', minimum: 'Windows 10', recommended: 'Windows 11' },
  { label: 'CPU', minimum: 'Dual-core 2.5 GHz', recommended: 'Quad-core 3.0 GHz' },
  { label: 'RAM', minimum: '4 GB', recommended: '8 GB' },
  { label: 'GPU', minimum: 'GTX 750 Ti / RX 460 (Vulkan requerido)', recommended: 'GTX 1060 / RX 580' },
  { label: 'VRAM', minimum: '1 GB', recommended: '2 GB' },
  { label: 'Almacenamiento', minimum: '500 MB', recommended: '500 MB' },
  { label: 'Resolución', minimum: '1280x720', recommended: '1920x1080' },
]

export default function Download() {
  const [downloadCount, setDownloadCount] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/downloads.php')
      .then((r) => r.json())
      .then((data) => {
        if (typeof data.count === 'number') setDownloadCount(data.count)
      })
      .catch(() => {})
  }, [])

  function handleDownload() {
    fetch('/api/downloads.php', { method: 'POST' })
      .then((r) => r.json())
      .then((data) => {
        if (typeof data.count === 'number') setDownloadCount(data.count)
      })
      .catch(() => {})
  }

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

              {downloadCount !== null && (
                <p className="font-mono text-xs tracking-[0.2em] uppercase text-horror-text-muted/60 mb-8">
                  {downloadCount.toLocaleString()} {downloadCount === 1 ? 'descarga' : 'descargas'}
                </p>
              )}

              <div className="mt-4 flex items-center justify-center">
                <motion.a
                  href={DOWNLOAD_URL}
                  download
                  className="btn-primary inline-flex items-center gap-2 sm:gap-4 text-xs sm:text-base px-5 sm:px-12 py-4 sm:py-5 whitespace-nowrap"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
                  onClick={handleDownload}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M2 3.2L8 2.3v6H2V3.2ZM9 2.2l7-1.1v7.2H9V2.2ZM2 9.6h6v6.1L2 14.8V9.6ZM9 9.6h7V17l-7-1.1V9.6Z" fill="currentColor" />
                  </svg>
                  Descargar Windows
                </motion.a>
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

              <div className="grid gap-3">
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
