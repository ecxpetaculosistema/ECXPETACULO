import Logo from './Logo.jsx'

export default function Topbar({ onMenu }) {
  return (
    <header className="topbar">
      <button className="menu-btn" onClick={onMenu} aria-label="Abrir menu">☰</button>
      <span className="topbar-logo"><Logo height={16} /></span>
      <span className="company">Nova Cena Produções</span>
    </header>
  )
}
