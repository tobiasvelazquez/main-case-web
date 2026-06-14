import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import RevealSection from '../components/RevealSection'

type Motivo = 'contacto' | 'colaboracion' | 'bug' | 'feedback'

interface FormState {
  nombre: string
  email: string
  motivo: Motivo
  mensaje: string
}

interface Errors {
  nombre?: string
  email?: string
  mensaje?: string
  archivo?: string
}

const MOTIVOS: Array<{ value: Motivo; label: string }> = [
  { value: 'contacto', label: 'Contacto general' },
  { value: 'bug', label: 'Reporte de bug' },
  { value: 'colaboracion', label: 'Colaboración' },
  { value: 'feedback', label: 'Feedback' },
]

const MAX_FILE_MB = 10
const ACCEPTED = 'image/*,.pdf,.zip,.txt,.log'
const CONTACT_ENDPOINT = `${import.meta.env.BASE_URL}api/contact.php`

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function validate(form: FormState): Errors {
  const errors: Errors = {}
  if (!form.nombre.trim()) errors.nombre = 'El nombre es requerido.'
  if (!form.email.trim()) {
    errors.email = 'El email es requerido.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'El email no es valido.'
  }
  if (!form.mensaje.trim()) errors.mensaje = 'El mensaje es requerido.'
  else if (form.mensaje.trim().length < 10) errors.mensaje = 'El mensaje es demasiado corto.'
  return errors
}

export default function Contact() {
  const formStartRef = useRef<number>(Date.now())
  const [form, setForm] = useState<FormState>({
    nombre: '',
    email: '',
    motivo: 'contacto',
    mensaje: '',
  })
  const [website, setWebsite] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({})
  const [file, setFile] = useState<File | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (touched[name as keyof FormState]) {
      const newErrors = validate({ ...form, [name]: value })
      setErrors(prev => ({ ...prev, [name]: newErrors[name as keyof Errors] }))
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    setErrors(prev => ({ ...prev, [name]: validate(form)[name as keyof Errors] }))
  }

  const handleFile = (incoming: File | null | undefined) => {
    if (!incoming) return
    if (incoming.size > MAX_FILE_MB * 1024 * 1024) {
      setFile(null)
      setErrors(prev => ({ ...prev, archivo: `El archivo no puede superar ${MAX_FILE_MB} MB.` }))
      return
    }
    setErrors(prev => ({ ...prev, archivo: undefined }))
    setFile(incoming)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ nombre: true, email: true, mensaje: true })
    const newErrors = validate(form)
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setSubmitError(null)
    setStatus('sending')

    try {
      const payload = new FormData()
      payload.append('nombre', form.nombre.trim())
      payload.append('email', form.email.trim())
      payload.append('motivo', form.motivo)
      payload.append('mensaje', form.mensaje.trim())
      payload.append('website', website)
      payload.append('elapsed_ms', String(Date.now() - formStartRef.current))
      if (file) payload.append('archivo', file)

      const response = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        body: payload,
      })

      let result: { ok?: boolean; message?: string } | null = null
      try {
        result = await response.json()
      } catch {
        result = null
      }

      if (!response.ok || !result?.ok) {
        throw new Error(result?.message || 'No se pudo enviar el mensaje. Intenta nuevamente.')
      }

      setStatus('success')
    } catch (err) {
      setStatus('idle')
      setSubmitError(err instanceof Error ? err.message : 'No se pudo enviar el mensaje. Intenta nuevamente.')
    }
  }

  return (
    <PageTransition>
      <main className="min-h-screen bg-horror-bg pt-24 pb-24">
        <div className="max-w-2xl mx-auto px-6">
          <RevealSection className="mb-14">
            <span className="section-label mb-3 block">Comunicacion</span>
            <h1 className="section-title mb-4">Contacto</h1>
            <div className="w-12 h-px bg-horror-red" />
          </RevealSection>

          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.96, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                className="card-horror py-16 text-center"
              >
                <div className="font-mono text-5xl text-horror-red mb-6 animate-flicker">//</div>
                <h2 className="font-display text-4xl tracking-widest text-white mb-4">
                  Mensaje enviado
                </h2>
                <div className="w-8 h-px bg-horror-red mx-auto mb-6" />
                <p className="font-ui text-sm text-horror-text-muted max-w-sm mx-auto leading-relaxed">
                  Recibimos tu mensaje. Si corresponde, te responderemos al correo indicado.
                </p>
                <button
                  className="btn-secondary mt-10"
                  onClick={() => {
                    setStatus('idle')
                    setForm({ nombre: '', email: '', motivo: 'contacto', mensaje: '' })
                    setTouched({})
                    setErrors({})
                    setSubmitError(null)
                    setFile(null)
                    setWebsite('')
                    formStartRef.current = Date.now()
                    if (fileInputRef.current) fileInputRef.current.value = ''
                  }}
                >
                  Enviar otro
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                noValidate
                className="flex flex-col gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              >
                <div className="absolute -left-[9999px] opacity-0 pointer-events-none" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input
                    id="website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>

                {/* Nombre */}
                <RevealSection delay={0.05}>
                  <Field label="Nombre" required error={errors.nombre}>
                    <input
                      type="text"
                      name="nombre"
                      value={form.nombre}
                      onChange={handleChange}
                      onBlur={handleBlur}

                      className={`input-horror ${errors.nombre ? 'border-horror-red/60' : ''}`}
                      autoComplete="name"
                    />
                  </Field>
                </RevealSection>

                {/* Email */}
                <RevealSection delay={0.1}>
                  <Field label="Email" required error={errors.email}>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      onBlur={handleBlur}

                      className={`input-horror ${errors.email ? 'border-horror-red/60' : ''}`}
                      autoComplete="email"
                    />
                  </Field>
                </RevealSection>

                {/* Motivo */}
                <RevealSection delay={0.15}>
                  <Field label="Motivo">
                    <select
                      name="motivo"
                      value={form.motivo}
                      onChange={handleChange}
                      className="input-horror appearance-none cursor-pointer"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2365594a' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 1rem center',
                        paddingRight: '2.5rem',
                      }}
                    >
                      {MOTIVOS.map(({ value, label }) => (
                        <option key={value} value={value} className="bg-horror-surface">
                          {label}
                        </option>
                      ))}
                    </select>
                  </Field>
                </RevealSection>

                {/* Mensaje */}
                <RevealSection delay={0.2}>
                  <Field label="Mensaje" required error={errors.mensaje}>
                    <textarea
                      name="mensaje"
                      value={form.mensaje}
                      onChange={handleChange}
                      onBlur={handleBlur}

                      rows={6}
                      className={`input-horror resize-none ${errors.mensaje ? 'border-horror-red/60' : ''}`}
                    />
                    <div className="flex justify-end mt-1">
                      <span className={`font-mono text-xs tracking-widest ${
                        form.mensaje.length > 1000 ? 'text-horror-red' : 'text-horror-text-dim'
                      }`}>
                        {form.mensaje.length} / 1200
                      </span>
                    </div>
                  </Field>
                </RevealSection>

                {/* Adjunto */}
                <RevealSection delay={0.25}>
                  <Field label="Adjunto" error={errors.archivo}>
                    {/* Drop zone */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleDrop}
                      className={`input-horror cursor-pointer flex items-center gap-3 min-h-[52px]
                        transition-all duration-200 select-none
                        ${dragOver ? 'border-horror-red/60 bg-horror-red/5' : 'hover:border-horror-text-muted/40'}
                        ${errors.archivo ? 'border-horror-red/60' : ''}
                      `}
                      style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept={ACCEPTED}
                        className="hidden"
                        onChange={(e) => handleFile(e.target.files?.[0])}
                      />
                      {/* Icon */}
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 text-horror-text-muted" aria-hidden="true">
                        <path d="M8 1v9M5 4l3-3 3 3M2 12h12M2 12v2h12v-2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>

                      {file ? (
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-ui text-sm text-horror-text truncate">{file.name}</span>
                          <span className="font-mono text-xs text-horror-text-muted flex-shrink-0">
                            {formatBytes(file.size)}
                          </span>
                        </div>
                      ) : (
                        <span className="font-ui text-sm text-horror-text-dim">
                          {dragOver ? 'Soltar aca...' : 'Seleccionar o arrastrar archivo'}
                        </span>
                      )}
                    </div>

                    {/* Remove file */}
                    <AnimatePresence>
                      {file && (
                        <motion.button
                          type="button"
                          onClick={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = '' }}
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                          className="mt-1.5 font-mono text-xs text-horror-text-dim hover:text-horror-red transition-colors duration-150 tracking-widest"
                          style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
                        >
                          Quitar archivo -
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </Field>
                </RevealSection>

                {/* Submit */}
                <RevealSection delay={0.3}>
                  <AnimatePresence>
                    {submitError && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                        className="mb-3 border border-horror-red/40 bg-horror-red/10 px-3 py-2"
                      >
                        <p className="font-mono text-xs text-horror-red tracking-wide">{submitError}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="btn-primary w-full sm:w-auto flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {status === 'sending' ? (
                        <>
                          <span className="inline-block w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                            <path d="M2 8h12M10 4l4 4-4 4M2 4.5v7" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Enviar mensaje
                        </>
                      )}
                    </button>
                  </div>
                </RevealSection>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </main>
    </PageTransition>
  )
}

// Helper

function Field({
  label,
  required = false,
  error,
  children,
}: {
  label: React.ReactNode
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-mono text-xs tracking-[0.2em] text-horror-text-muted uppercase flex items-center gap-2">
        {label}
        {required && <span className="text-horror-red">*</span>}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
            className="font-mono text-xs text-horror-red tracking-wide"
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}

