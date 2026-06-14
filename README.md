# MAIN CASE — Sitio Web Oficial

Sitio web oficial del juego **MAIN CASE**, un FPS de terror con estética PS1 desarrollado de forma independiente.

**Sitio en vivo:** [maincase.hachitec.com.ar](https://maincase.hachitec.com.ar)

---

## Stack tecnológico

- **React 18** + **TypeScript**
- **Vite** — bundler y servidor de desarrollo
- **Tailwind CSS** — estilos utilitarios con paleta de horror personalizada
- **Framer Motion** — animaciones y transiciones de página
- **React Router v6** — navegación SPA
- **PHP** — handler del formulario de contacto (servidor Apache)

---

## Páginas

| Ruta | Descripción |
|------|-------------|
| `/` | Landing page — hero, galería, carousel de enemigos, CTA |
| `/descargar` | Página de descarga con requisitos del sistema |
| `/contacto` | Formulario de contacto con soporte para adjuntos |
| `/creditos` | Carousel animado de créditos del juego |

---

## Desarrollo local

### Requisitos
- Node.js 18+
- npm

### Instalación

```bash
git clone https://github.com/tobiasvelazquez/main-case-web.git
cd main-case-web
npm install
npm run dev
```

El servidor de desarrollo estará disponible en `http://localhost:5173`.

### Scripts disponibles

```bash
npm run dev       # Servidor de desarrollo
npm run build     # Build de producción (output en dist/)
npm run preview   # Preview del build de producción
```

---

## Deployment

El sitio corre en un servidor **Apache** con hosting compartido.

### Proceso de deploy

1. Generar el build de producción:
   ```bash
   npm run build
   ```

2. Subir el contenido de la carpeta `dist/` al servidor vía FTP/SFTP (raíz del dominio).

3. El archivo `.htaccess` incluido en `dist/` se encarga del routing SPA en Apache — no requiere configuración adicional.

### Formulario de contacto

El formulario de contacto requiere PHP en el servidor. La configuración se realiza mediante variables de entorno en el servidor:

| Variable | Descripción | Default |
|----------|-------------|---------|
| `CONTACT_TO` | Email destinatario | `maincase@hachitec.com.ar` |
| `CONTACT_FROM` | Email remitente | `maincase@hachitec.com.ar` |

---

## Estructura del proyecto

```
main-case-web/
├── src/
│   ├── assets/images/      # Imágenes del juego
│   │   ├── bosses/         # Capturas de enemigos
│   │   ├── map/            # Capturas de escenarios
│   │   └── credits/        # Fondos de la pantalla de créditos
│   ├── components/         # Componentes reutilizables
│   ├── pages/              # Páginas de la aplicación
│   ├── assets.ts           # Exports centralizados de imágenes
│   ├── constants.ts        # Constantes del juego
│   └── App.tsx             # Rutas y layout principal
├── public/
│   ├── api/contact.php     # Handler PHP del formulario
│   └── .htaccess           # Routing SPA para Apache
└── index.html              # Entry point HTML
```

---

## Licencia

Todos los derechos reservados © Tobias Velazquez. El código fuente de este sitio no puede ser reutilizado sin permiso explícito.
