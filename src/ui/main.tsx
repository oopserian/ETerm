import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { TooltipProvider } from './components/ui/tooltip.tsx'
import { Toaster } from './components/ui/sonner.tsx'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <>
    <React.StrictMode>
      <TooltipProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </TooltipProvider>
      <Toaster/>
    </React.StrictMode>
  </>
)
