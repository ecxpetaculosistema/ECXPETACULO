import { useMemo, useState } from 'react'
import { artists, initialTasks, people } from '../data.js'

const today = () => new Date().toISOString().slice(0, 10)
const fmt = (iso) => iso.split('-').reverse().slice(0, 2).join('/')
const PRIORITY = { alta: 'Alta', media: 'Média', baixa: 'Baixa' }
const COLUMNS = [
  { id: 'todo', label: 'A fazer' },
  { id: 'doing', label: 'Em andamento' },
  { id: 'done', label: 'Concluídas' },
]

const person = (id) => people.find((p) => p.id === id)

function Avatar({ id }) {
  const p = person(id)
  return <span className="avatar sm" style={{ background: p.color + '22', color: p.color }}>{p.initials}</span>
}

function dueLabel(t) {
  if (t.status === 'done') return `Concluída em ${fmt(t.doneAt || t.due)}`
  if (t.due < today()) return `Atrasada · ${fmt(t.due)}`
  if (t.due === today()) return 'Vence hoje'
  return `Vence ${fmt(t.due)}`
}

export default function Tarefas() {
  const [tasks, setTasks] = useState(initialTasks)
  const [view, setView] = useState('lista')
  const [filter, setFilter] = useState('todas')
  const [artist, setArtist] = useState(null)
  const [owner, setOwner] = useState(null)
  const [query, setQuery] = useState('')

  const toggle = (id) =>
    setTasks((ts) =>
      ts.map((t) =>
        t.id === id
          ? t.status === 'done'
            ? { ...t, status: 'todo', doneAt: undefined }
            : { ...t, status: 'done', doneAt: today() }
          : t
      )
    )

  const counts = useMemo(() => {
    const open = tasks.filter((t) => t.status !== 'done')
    return {
      hoje: open.filter((t) => t.due === today()).length,
      atrasadas: open.filter((t) => t.due < today()).length,
      todas: tasks.length,
      concluidas: tasks.filter((t) => t.status === 'done').length,
    }
  }, [tasks])

  const visible = tasks.filter((t) => {
    if (filter === 'hoje' && !(t.status !== 'done' && t.due === today())) return false
    if (filter === 'atrasadas' && !(t.status !== 'done' && t.due < today())) return false
    if (filter === 'concluidas' && t.status !== 'done') return false
    if (artist && t.artist !== artist) return false
    if (owner && t.owner !== owner) return false
    const q = query.trim().toLowerCase()
    if (q && !`${t.title} ${person(t.owner).name} ${t.ref}`.toLowerCase().includes(q)) return false
    return true
  })

  const open = visible.filter((t) => t.status !== 'done')
  const done = visible.filter((t) => t.status === 'done')

  const Row = ({ t }) => (
    <div className={'task-row' + (t.status === 'done' ? ' done' : '')}>
      <button className="check" onClick={() => toggle(t.id)} aria-label="Concluir">{t.status === 'done' ? '✓' : ''}</button>
      <div className="task-main">
        <div className="task-title">
          {t.title}
          {t.ref && <span className="chip">{t.ref}</span>}
        </div>
        <div className="task-meta">
          <Avatar id={t.owner} /> {person(t.owner).name} ·{' '}
          <span className={t.status !== 'done' && t.due <= today() ? 'due-hot' : ''}>{dueLabel(t)}</span>
        </div>
      </div>
      {t.status !== 'done' && <span className={'prio ' + t.priority}>{PRIORITY[t.priority]}</span>}
    </div>
  )

  const tile = (id, label, n) => (
    <button className={'tile' + (filter === id ? ' active' : '')} onClick={() => setFilter(id)}>
      <b>{n}</b>
      <span>{label}</span>
    </button>
  )

  return (
    <>
      <div className="page-head row">
        <span className="muted">Tarefas operacionais</span>
        <button className="btn-primary">+ Nova tarefa</button>
      </div>
      <div className="card tasks">
        <div className="filters">
          <input className="search" placeholder="Buscar tarefa, responsável, artista" value={query} onChange={(e) => setQuery(e.target.value)} />
          <div className="tiles">
            {tile('hoje', 'Hoje', counts.hoje)}
            {tile('atrasadas', 'Atrasadas', counts.atrasadas)}
            {tile('todas', 'Todas', counts.todas)}
            {tile('concluidas', 'Concluídas', counts.concluidas)}
          </div>
          <div className="list-title">Listas · por artista</div>
          {artists.map((a) => (
            <button key={a.id} className={'side-row' + (artist === a.id ? ' active' : '')} onClick={() => setArtist(artist === a.id ? null : a.id)}>
              <span className="avatar sm">{a.initials}</span> {a.name}
              <em>{tasks.filter((t) => t.artist === a.id).length}</em>
            </button>
          ))}
          <div className="list-title">Pessoas · quem executa</div>
          {people.map((p) => (
            <button key={p.id} className={'side-row' + (owner === p.id ? ' active' : '')} onClick={() => setOwner(owner === p.id ? null : p.id)}>
              <Avatar id={p.id} /> {p.name}
              <em>{tasks.filter((t) => t.owner === p.id && t.status !== 'done').length}</em>
            </button>
          ))}
        </div>

        <div className="board">
          <div className="board-head">
            <div>
              <h2>{{ todas: 'Todas', hoje: 'Hoje', atrasadas: 'Atrasadas', concluidas: 'Concluídas' }[filter]}</h2>
              <div className={counts.atrasadas ? 'warn' : 'ok'}>
                {counts.atrasadas ? `${counts.atrasadas} tarefa(s) em atraso` : 'Nenhuma tarefa em atraso'}
              </div>
            </div>
            <div className="segmented">
              {['lista', 'kanban', 'calendário'].map((v) => (
                <button key={v} className={view === v ? 'active' : ''} onClick={() => setView(v)}>
                  {v[0].toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {view === 'lista' && (
            <>
              <div className="group-title">Em aberto <span>{open.length}</span></div>
              {open.map((t) => <Row key={t.id} t={t} />)}
              <div className="group-title">Concluídas <span>{done.length}</span></div>
              {done.map((t) => <Row key={t.id} t={t} />)}
            </>
          )}

          {view === 'kanban' && (
            <div className="kanban">
              {COLUMNS.map((c) => (
                <div key={c.id} className="kcol">
                  <div className="group-title">{c.label} <span>{visible.filter((t) => t.status === c.id).length}</span></div>
                  {visible.filter((t) => t.status === c.id).map((t) => <Row key={t.id} t={t} />)}
                </div>
              ))}
            </div>
          )}

          {view === 'calendário' && <Calendar tasks={visible} />}
        </div>
      </div>
    </>
  )
}

function Calendar({ tasks }) {
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth()
  const first = new Date(y, m, 1).getDay()
  const days = new Date(y, m + 1, 0).getDate()
  const cells = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)]
  const iso = (d) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
  return (
    <div className="cal">
      {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => <div key={i} className="cal-h">{d}</div>)}
      {cells.map((d, i) => (
        <div key={i} className={'cal-c' + (d && iso(d) === today() ? ' today' : '')}>
          {d && <span>{d}</span>}
          {d && tasks.filter((t) => t.due === iso(d)).map((t) => <div key={t.id} className="cal-t">{t.title}</div>)}
        </div>
      ))}
    </div>
  )
}
