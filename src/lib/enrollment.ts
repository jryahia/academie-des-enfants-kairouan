/* Enrollment submission, shared by the Magic overlay.
 * POSTs to the enrollment API (backend/main.py fans out to Sheets / Gmail /
 * Notion / webhook). Never throws: if the API is unreachable the lead is
 * queued in localStorage for a later retry, so the parent always sees success. */

export interface EnrollmentForm {
  name: string
  childName: string
  age: string
  phone: string
  message: string
}

export const EMPTY_FORM: EnrollmentForm = { name: '', childName: '', age: '', phone: '', message: '' }

export const isValidPhone = (phone: string) => /^[+0-9][0-9\s\-()]{6,}$/.test(phone.trim())

export async function submitEnrollment(form: EnrollmentForm, lang: string): Promise<void> {
  try {
    const res = await fetch('/api/enrollments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, lang }),
      signal: AbortSignal.timeout(6000),
    })
    if (!res.ok) throw new Error(String(res.status))
  } catch {
    try {
      const q = JSON.parse(localStorage.getItem('academie-pending') || '[]')
      q.push({ ...form, lang, ts: Date.now() })
      localStorage.setItem('academie-pending', JSON.stringify(q))
    } catch {
      /* storage full/unavailable: lead stays in the form state only */
    }
  }
}
