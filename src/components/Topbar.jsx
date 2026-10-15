import Logo from './Logo.jsx'

export default function Topbar({ onMenu }) {
  return (
    <header className="topbar">
      <button className="menu-btn" onClick={onMenu} aria-label="Abrir menu">☰</button>
      <span className="company">Empresa Exemplo</span>
      <span className="topbar-logo"><Logo /></span>
    </header>
  )
}
