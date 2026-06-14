import boss1 from './assets/images/bosses/boss1.png'
import boss2 from './assets/images/bosses/boss2.png'
import boss3 from './assets/images/bosses/boss3.png'
import boss4 from './assets/images/bosses/boss4.png'
import boss5 from './assets/images/bosses/boss5.png'
import boss6 from './assets/images/bosses/boss6.png'
import mapImg1 from './assets/images/map/img1.png'
import mapImg2 from './assets/images/map/img2.png'
import mapImg3 from './assets/images/map/img3.png'
import mapImg4 from './assets/images/map/img4.png'
import mapImg5 from './assets/images/map/img5.png'
import mapImg6 from './assets/images/map/img6.png'

export { boss1, boss2, boss3, boss4, boss5, boss6 }
export { mapImg1, mapImg2, mapImg3, mapImg4, mapImg5, mapImg6 }

export const BOSS_IMAGES = [boss1, boss2, boss3, boss4, boss5, boss6]
export const MAP_IMAGES = [mapImg1, mapImg2, mapImg3, mapImg4, mapImg5, mapImg6]

export const GALLERY_IMAGES: Array<{ src: string; label: string }> = [
  { src: mapImg1, label: 'Pasillo principal' },
  { src: mapImg2, label: 'Dormitorio sellado' },
  { src: mapImg3, label: 'Sótano' },
  { src: mapImg4, label: 'Cocina abandonada' },
  { src: mapImg5, label: 'Sala de estar' },
  { src: mapImg6, label: 'Exterior' },
]

export const BOSS_SLIDER: Array<{ src: string; label: string }> = [
  { src: boss2, label: 'Archivo 002' },
  { src: boss3, label: 'Archivo 003' },
  { src: boss4, label: 'Archivo 004' },
  { src: boss5, label: 'Archivo 005' },
]
