import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { setupI18n } from './i18n'
import App from './App'

// i18n dir/lang applied synchronously before mount so no RTL/LTR flash.
// Render even if i18n init rejects, so the page never stays blank.
const render = () =>
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
setupI18n().then(render, render)
