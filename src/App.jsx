// src/App.jsx
import { useState } from 'react'
import Ticker     from './components/Ticker'
import Navbar     from './components/Navbar'
import AuthModal  from './components/AuthModal'
import SupportFAB from './components/SupportFAB'
import Home       from './pages/Home'
import { Rates }  from './pages/Rates'
import { News, Support, About } from './pages/OtherPages'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [authOpen, setAuthOpen]       = useState(false)
  const [authTab, setAuthTab]         = useState('login')

  const navigate = page => { setCurrentPage(page); window.scrollTo({top:0,behavior:'smooth'}) }
  const openAuth = tab  => { setAuthTab(tab); setAuthOpen(true) }

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>
      <Ticker />
      <Navbar currentPage={currentPage} onNavigate={navigate} onOpenAuth={openAuth} />
      {currentPage==='home'    && <Home    onNavigate={navigate} onOpenAuth={openAuth} />}
      {currentPage==='rates'   && <Rates   />}
      {currentPage==='news'    && <News    />}
      {currentPage==='support' && <Support />}
      {currentPage==='about'   && <About   onNavigate={navigate} />}
      <AuthModal  isOpen={authOpen} initialTab={authTab} onClose={()=>setAuthOpen(false)} />
      <SupportFAB />
    </div>
  )
}

export default App