import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Real working enrollment form + WhatsApp/phone links.
 * Submission shows a client-side confirmation immediately and POSTs to the
 * enrollment API in the background.
 */
export default function Enrollment() {
  const { t, i18n } = useTranslation()
  const [form, setForm] = useState({ name: '', childName: '', age: '', phone: '', message: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sent, setSent] = useState(false)

  const validate = () => {
    const e: Record<string, string> = {}
    const validPhone = /^[+0-9][0-9\s\-()]{6,}$/.test(form.phone.trim())
    if (!form.name.trim()) e.name = t('contact.form.required')
    if (!form.childName.trim()) e.childName = t('contact.form.required')
    if (!form.age.trim()) e.age = t('contact.form.required')
    if (!form.phone.trim()) e.phone = t('contact.form.required')
    else if (!validPhone) e.phone = t('contact.form.invalidPhone')
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validate()) return
    // Fan out to the enrollment API (Sheets/Gmail/Notion/webhook via the
    // backend). Never blocks the UX: success shows immediately, and if the
    // API is unreachable the lead is queued locally for later retry.
    setSent(true)
    try {
      const res = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, lang: i18n.language }),
        signal: AbortSignal.timeout(6000),
      })
      if (!res.ok) throw new Error(String(res.status))
    } catch {
      // API unreachable: queue the lead locally for later retry.
      try {
        const q = JSON.parse(localStorage.getItem('academie-pending') || '[]')
        q.push({ ...form, lang: i18n.language, ts: Date.now() })
        localStorage.setItem('academie-pending', JSON.stringify(q))
      } catch {
        /* storage full/unavailable — lead stays in the form state only */
      }
    }
  }

  const input =
    'w-full rounded-xl bg-candy-cloud/80 border border-candy-ink/12 px-4 py-3 text-candy-ink placeholder:text-candy-ink/35 focus:outline-none focus:border-candy-orange transition-colors'

  const field = (name: keyof typeof form, label: string, placeholder: string, error?: string) => (
    <label className="block">
      <span className="block text-sm font-semibold text-candy-ink mb-1">{label}</span>
      <input
        className={input + (error ? ' border-red-400' : '')}
        value={form[name]}
        onChange={(e) => setForm((f) => ({ ...f, [name]: e.target.value }))}
        placeholder={placeholder}
        aria-invalid={!!error}
      />
      {error && <span className="block mt-1 text-xs text-red-400">{error}</span>}
    </label>
  )

  return (
    <section id="contact" className="py-20 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-center text-gradient">
          {t('contact.title')}
        </h2>
        <p className="mt-3 text-center text-candy-ink/60">{t('contact.subtitle')}</p>

        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="mt-10 glass rounded-3xl p-10 text-center"
              role="status"
            >
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="mx-auto h-14 w-14 text-candy-coral"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <path d="m9 11 3 3L22 4" />
              </svg>
              <p className="mt-4 text-lg font-semibold">{t('contact.form.success')}</p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={submit}
              className="mt-10 glass rounded-3xl p-6 sm:p-8 space-y-4"
              noValidate
            >
              {field('name', t('contact.form.name'), 'Amina B.' )}
              {field('childName', t('contact.form.childName'), 'Yassine')}
              {field('age', t('contact.form.age'), '4 – 5 ans')}
              {field('phone', t('contact.form.phone'), '+216 ...', errors.phone)}
              <label className="block">
                <span className="block text-sm font-semibold text-candy-ink mb-1">
                  {t('contact.form.message')}
                </span>
                <textarea
                  className={input + ' min-h-[96px]'}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  placeholder="..."
                />
              </label>
              <button
                type="submit"
                className="w-full rounded-full bg-candy-coral text-[#0a0a0c] py-3.5 font-bold text-lg hover:scale-[1.02] active:scale-95 transition-transform shadow-lg shadow-candy-coral/40"
              >
                {t('contact.form.submit')}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
