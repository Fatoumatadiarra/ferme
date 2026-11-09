import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { StorageService } from '@/services'
import App from './App'
import './index.css'

StorageService.init()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
