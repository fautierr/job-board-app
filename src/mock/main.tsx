import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../styles/index.css'
import MockPage from './MockPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MockPage />
  </StrictMode>,
)
