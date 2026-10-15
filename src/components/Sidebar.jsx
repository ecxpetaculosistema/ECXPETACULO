import { NavLink } from 'react-router-dom'
import { nav } from '../nav.js'
import { currentUser } from '../data.js'
import Logo from './Logo.jsx'

export default function Sidebar({ open }) {
  return (
    <aside className={'sidebar' + (open ? ' open' : '')}>
      <div className="brand"><Logo /></div>
      {nav.map((group, i) => {
        const items = group.items.filter((it) => it.roles.includes(currentUser.role))
        if (!items.length) return null
        return (
          <div key={i} className="nav-group">
            {group.section && <div className="nav-section">{group.section}</div>}
            {items.map((it) => (
              <NavLink key={it.path} to={it.path} className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
                <span className="nav-icon">{it.icon}</span>
                {it.label}
              </NavLink>
            ))}
          </div>
        )
      })}
      <div className="sidebar-user">
        <div className="avatar">RM</div>
        <div>
          <strong>{currentUser.name}</strong>
          <small>{currentUser.roleLabel}</small>
        </div>
      </div>
    </aside>
  )
}
