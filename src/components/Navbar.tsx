import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { GAME_TITLE } from '../constants'

const NAV_LINKS = [
  { to: '/', label: 'INICIO' },
  { to: '/hall-of-fame', label: 'HALL OF FAME' },
  { to: '/contacto', label: 'CONTACTO' },
  { to: '/creditos', label: 'CREDITOS' },
]
const DOWNLOAD_LINK = { to: '/descargar', label: 'DESCARGAR' }

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const downloadActive = location.pathname === DOWNLOAD_LINK.to

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-horror-bg/96 backdrop-blur-md border-b border-horror-border'
          : 'bg-gradient-to-b from-horror-bg/80 to-transparent'
      }`}
      style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr]">
        <Link
          to="/"
          className="justify-self-start font-display text-2xl tracking-[0.12em] text-horror-text hover:text-white transition-colors duration-200"
          style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
        >
          {GAME_TITLE}
        </Link>

        <ul className="hidden md:flex items-center gap-10 justify-self-center">
          {NAV_LINKS.map(({ to, label }) => {
            const active = location.pathname === to
            return (
              <li key={to}>
                <Link
                  to={to}
                  className={`relative font-mono text-base tracking-[0.2em] group pb-1 ${
                    active ? 'text-horror-red' : 'text-horror-text-muted'
                  } transition-colors duration-200`}
                  style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
                >
                  <span
                    className="group-hover:text-horror-text transition-colors duration-200"
                    style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
                  >
                    {label}
                  </span>
                  <span
                    className={`absolute bottom-0 left-0 h-px bg-horror-red transition-all duration-300 ${
                      active ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                    style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
                  />
                </Link>
              </li>
            )
          })}
        </ul>

        <Link
          to={DOWNLOAD_LINK.to}
          className={`hidden md:inline-flex justify-self-end items-center h-10 px-5 border font-mono text-xs tracking-[0.18em] uppercase transition-all duration-200 active:scale-[0.97] ${
            downloadActive
              ? 'bg-horror-red border-horror-red text-white'
              : 'bg-horror-red/90 border-horror-red text-white hover:bg-horror-red-bright'
          }`}
          style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
        >
          {DOWNLOAD_LINK.label}
        </Link>

        <button
          className="md:hidden ml-auto relative w-8 h-8 flex flex-col justify-center items-center gap-[5px]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Cerrar menu' : 'Abrir menu'}
        >
          <span
            className="block w-6 h-px bg-horror-text transition-all duration-250 origin-center"
            style={{
              transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
              transform: mobileOpen ? 'translateY(6px) rotate(45deg)' : 'none',
            }}
          />
          <span
            className="block w-6 h-px bg-horror-text transition-all duration-200"
            style={{
              opacity: mobileOpen ? 0 : 1,
              transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
            }}
          />
          <span
            className="block w-6 h-px bg-horror-text transition-all duration-250 origin-center"
            style={{
              transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
              transform: mobileOpen ? 'translateY(-6px) rotate(-45deg)' : 'none',
            }}
          />
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -8, scaleY: 0.95 }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            className="md:hidden origin-top bg-horror-surface/98 backdrop-blur-md border-b border-horror-border"
          >
            <ul className="px-6 py-5 flex flex-col gap-1">
              {NAV_LINKS.map(({ to, label }, i) => (
                <motion.li
                  key={to}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                >
                  <Link
                    to={to}
                    className={`block font-mono text-xl tracking-[0.2em] py-3 border-b border-horror-border/40 last:border-0 transition-colors duration-200 ${
                      location.pathname === to ? 'text-horror-red' : 'text-horror-text-muted hover:text-horror-text'
                    }`}
                    style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
                  >
                    {label}
                  </Link>
                </motion.li>
              ))}

              <motion.li
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: NAV_LINKS.length * 0.05, duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                className="pt-3"
              >
                <Link
                  to={DOWNLOAD_LINK.to}
                  className={`block text-center font-mono text-sm tracking-[0.2em] py-3 border uppercase transition-colors duration-200 ${
                    downloadActive
                      ? 'bg-horror-red border-horror-red text-white'
                      : 'border-horror-red text-white hover:bg-horror-red/15'
                  }`}
                  style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
                >
                  {DOWNLOAD_LINK.label}
                </Link>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
