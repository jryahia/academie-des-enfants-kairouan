import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { setupI18n } from './i18n'
import App from './App'

// i18n dir/lang applied synchronously before mount so no RTL/LTR flash.
setupI18n().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
