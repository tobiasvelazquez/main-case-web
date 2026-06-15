import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import RevealSection from '../components/RevealSection'

const WINNERS: Array<{ pos: string; name: string | null }> = [
  { pos: '01', name: null },
  { pos: '02', name: null },
  { pos: '03', name: null },
  { pos: '04', name: null },
  { pos: '05', name: null },
]

export default function HallOfFame() {
  return (
    <PageTransition>
      <main className="min-h-screen bg-horror-bg flex flex-col items-center justify-center px-6 py-28">
        <RevealSection className="text-center mb-16">
          <span className="section-label block mb-4">Registro</span>
          <h1 className="font-display leading-none tracking-wide text-white mb-4"
            style={{ fontSize: 'clamp(3rem, 10vw, 6rem)' }}>
            Hall of Fame
          </h1>
          <div className="w-12 h-px bg-horror-red mx-auto mt-4 mb-6" />
          <p className="font-body text-horror-text-muted text-base max-w-sm mx-auto leading-relaxed">
            Los primeros cinco en completar Main Case. Sus nombres quedan grabados aquí para siempre.
          </p>
        </RevealSection>

        <div className="w-full max-w-md flex flex-col gap-3">
          {WINNERS.map(({ pos, name }, i) => (
            <motion.div
              key={pos}
              className="flex items-center gap-6 border border-horror-border bg-horror-card px-6 py-5"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: [0.23, 1, 0.32, 1] }}
            >
              <span className="font-mono text-horror-red tracking-[0.2em] text-sm tabular-nums flex-shrink-0">
                {pos}
              </span>
              <div className="flex-1 h-px bg-horror-border/40" />
              <span className={`font-body tracking-wide text-lg ${name ? 'text-white' : 'text-horror-text-dim/30'}`}>
                {name ?? '???'}
              </span>
            </motion.div>
          ))}
        </div>

        <RevealSection delay={0.5} className="mt-16 text-center">
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-horror-text-muted/40">
            ¿Serás uno de ellos?
          </p>
        </RevealSection>
      </main>
    </PageTransition>
  )
}
