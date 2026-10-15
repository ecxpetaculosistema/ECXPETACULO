import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar.jsx'
import Topbar from './components/Topbar.jsx'
import Tarefas from './pages/Tarefas.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Placeholder from './pages/Placeholder.jsx'
import { nav } from './nav.js'

export default function App() {
  const pages = nav.flatMap((s) => s.items)
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => setMenuOpen(false), [pathname])
  return (
    <div className="shell">
      <Sidebar open={menuOpen} />
      {menuOpen && <div className="backdrop" onClick={() => setMenuOpen(false)} />}
      <div className="main">
        <Topbar onMenu={() => setMenuOpen((o) => !o)} />
        <div className="content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tarefas" element={<Tarefas />} />
            {pages
              .filter((p) => p.path !== '/tarefas' && p.path !== '/dashboard')
              .map((p) => (
                <Route key={p.path} path={p.path} element={<Placeholder title={p.label} />} />
              ))}
          </Routes>
        </div>
      </div>
    </div>
  )
}
