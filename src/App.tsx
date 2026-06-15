import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Contact from './pages/Contact'
import Download from './pages/Download'
import Credits from './pages/Credits'
import HallOfFame from './pages/HallOfFame'

export default function App() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) return
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [location.pathname, location.hash])

  return (
    <>
      <div className="noise-overlay" aria-hidden="true" />
      <div className="scanlines-overlay" aria-hidden="true" />
      <div className="vignette-overlay" aria-hidden="true" />

      <Navbar />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="/descargar" element={<Download />} />
          <Route path="/creditos" element={<Credits />} />
          <Route path="/hall-of-fame" element={<HallOfFame />} />
        </Routes>
      </AnimatePresence>

      <Footer />
    </>
  )
}
