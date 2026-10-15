import { useEffect, useRef, useState } from 'react'
import { AreaChart, Bars, Donut } from '../components/Charts.jsx'
import {
  agendaShows, initialMissions, initialTasks, kpis, people, proximosShows, receitaMensal, showsPorDia, showsPorStatus,
} from '../data.js'

const brl = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
const fmt = (iso) => iso.split('-').reverse().slice(0, 2).join('/')
const TIPOS = { show: 'Show', privado: 'Voo privado', extra: 'Extra' }
const STORAGE_KEY = 'ecx.dashboard.v1'

const upcomingMissions = () =>
  [...initialMissions].sort((a, b) => a.data.localeCompare(b.data)).slice(0, 4).map((m) => {
    const s = agendaShows.find((x) => x.id === m.showId)
    return { ...m, title: m.tipo === 'show' ? (s ? `${s.event} · ${s.city}/${s.uf}` : 'Show') : m.motivo }
  })
const openTasks = () => initialTasks.filter((t) => t.status !== 'done').sort((a, b) => a.due.localeCompare(b.due)).slice(0, 5)

// Catálogo de widgets. size = nº de colunas (de 4) ocupadas por padrão.
const WIDGETS = {
  kpiProximo: {
    title: 'Próximo show', size: 1,
    render: () => (
      <div className="kpi grad-red">
        <small>Próximo show</small>
        <strong>{kpis.proximoShow.title}</strong>
        <span>{fmt(kpis.proximoShow.date)} · {kpis.proximoShow.city}</span>
      </div>
    ),
  },
  kpiCache: {
    title: 'Cachê confirmado no mês', size: 1,
    render: () => (
      <div className="kpi grad-cyan">
        <small>Cachê confirmado no mês</small>
        <strong>{brl(kpis.cacheMes)}</strong>
        <span>+14% vs. mês anterior</span>
      </div>
    ),
  },
  kpiShows: {
    title: 'Shows no mês', size: 1,
    render: () => (
      <div className="kpi"><small>Shows no mês</small><strong>{kpis.showsMes}</strong><span>3 a confirmar</span></div>
    ),
  },
  kpiVoo: {
    title: 'Horas de voo no mês', size: 1,
    render: () => (
      <div className="kpi"><small>Horas de voo no mês</small><strong>{kpis.horasVoo} h</strong><span>6 voos realizados</span></div>
    ),
  },
  receita: {
    title: 'Receita de cachês', size: 2,
    render: () => (<section className="panel"><h3>Receita de cachês (mil R$)</h3><AreaChart data={receitaMensal} /></section>),
  },
  status: {
    title: 'Shows por status', size: 2,
    render: () => (<section className="panel"><h3>Shows por status</h3><Donut data={showsPorStatus} /></section>),
  },
  diaSemana: {
    title: 'Shows por dia da semana', size: 2,
    render: () => (<section className="panel"><h3>Shows por dia da semana</h3><Bars data={showsPorDia} /></section>),
  },
  proximos: {
    title: 'Próximos shows', size: 2,
    render: () => (
      <section className="panel">
        <h3>Próximos shows</h3>
        <ul className="upcoming">
          {proximosShows.map((s) => (
            <li key={s.id}>
              <div className="date">{fmt(s.date)}</div>
              <div><b>{s.title}</b><small>{s.city}</small></div>
              <span className={'badge ' + s.status}>{s.status}</span>
            </li>
          ))}
        </ul>
      </section>
    ),
  },
  missoes: {
    title: 'Próximas missões de voo', size: 2,
    render: () => (
      <section className="panel">
        <h3>Próximas missões de voo</h3>
        <ul className="upcoming">
          {upcomingMissions().map((m) => (
            <li key={m.id}>
              <div className="date">{fmt(m.data)}</div>
              <div><b>{m.decola.sigla} → {m.pousa.sigla}</b><small>{m.title}</small></div>
              <em className={'tipo-tag ' + m.tipo}>{TIPOS[m.tipo]}</em>
            </li>
          ))}
        </ul>
      </section>
    ),
  },
  tarefas: {
    title: 'Tarefas em aberto', size: 2,
    render: () => (
      <section className="panel">
        <h3>Tarefas em aberto</h3>
        <ul className="upcoming">
          {openTasks().map((t) => {
            const o = people.find((p) => p.id === t.owner)
            return (
              <li key={t.id}>
                <div className="date">{fmt(t.due)}</div>
                <div><b>{t.title}</b><small>{o ? o.name : ''}</small></div>
              </li>
            )
          })}
        </ul>
      </section>
    ),
  },
}

const DEFAULT_LAYOUT = [
  'kpiProximo', 'kpiCache', 'kpiShows', 'kpiVoo', 'receita', 'status', 'diaSemana', 'proximos',
].map((id) => ({ id, size: WIDGETS[id].size }))

const loadLayout = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (Array.isArray(raw)) {
      const ok = raw.filter((w) => WIDGETS[w.id] && [1, 2, 3, 4].includes(w.size))
      if (ok.length) return ok
    }
  } catch { /* sem armazenamento: usa o padrão */ }
  return DEFAULT_LAYOUT
}

export default function Dashboard() {
  const [layout, setLayout] = useState(loadLayout)
  const [editing, setEditing] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [dragId, setDragId] = useState(null)
  const [overId, setOverId] = useState(null)
  const addRef = useRef(null)

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(layout)) } catch { /* ignora */ }
  }, [layout])

  useEffect(() => {
    const close = (e) => addRef.current && !addRef.current.contains(e.target) && setAddOpen(false)
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const hidden = Object.keys(WIDGETS).filter((id) => !layout.some((w) => w.id === id))

  const move = (from, to) => {
    if (from === to) return
    setLayout((l) => {
      const a = [...l]
      const i = a.findIndex((w) => w.id === from)
      const j = a.findIndex((w) => w.id === to)
      if (i < 0 || j < 0) return l
      a.splice(j, 0, a.splice(i, 1)[0])
      return a
    })
  }
  const shift = (id, d) =>
    setLayout((l) => {
      const a = [...l]
      const i = a.findIndex((w) => w.id === id)
      const j = i + d
      if (j < 0 || j >= a.length) return l
      ;[a[i], a[j]] = [a[j], a[i]]
      return a
    })
  const resize = (id) => setLayout((l) => l.map((w) => (w.id === id ? { ...w, size: (w.size % 4) + 1 } : w)))
  const remove = (id) => setLayout((l) => l.filter((w) => w.id !== id))
  const add = (id) => { setLayout((l) => [...l, { id, size: WIDGETS[id].size }]); setAddOpen(false) }
  const reset = () => setLayout(DEFAULT_LAYOUT)

  return (
    <>
      <div className="page-head row">
        <h1 className="page-title">Dashboard</h1>
        <div className="dash-tools">
          {editing && (
            <>
              <div className="menu-wrap" ref={addRef}>
                <button className="btn-ghost" onClick={() => setAddOpen(!addOpen)} disabled={!hidden.length}>+ Adicionar widget</button>
                {addOpen && (
                  <div className="dropdown">
                    {hidden.map((id) => <button key={id} onClick={() => add(id)}>{WIDGETS[id].title}</button>)}
                  </div>
                )}
              </div>
              <button className="btn-ghost" onClick={reset}>Restaurar padrão</button>
            </>
          )}
          <button className={editing ? 'btn-primary' : 'btn-ghost'} onClick={() => { setEditing(!editing); setAddOpen(false) }}>
            {editing ? 'Concluir' : 'Personalizar'}
          </button>
        </div>
      </div>

      {editing && <p className="edit-hint">Arraste os widgets para mudar a posição, ou use as setas. O botão de largura altera quantas colunas ele ocupa.</p>}

      <div className={'dash-grid' + (editing ? ' is-editing' : '')}>
        {layout.map((w, idx) => (
          <div
            key={w.id}
            className={'wd' + (w.id.startsWith('kpi') ? ' wd-kpi' : '') + (dragId === w.id ? ' dragging' : '') + (overId === w.id && dragId && dragId !== w.id ? ' drop-target' : '')}
            data-span={w.size}
            draggable={editing}
            onDragStart={(e) => { setDragId(w.id); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', w.id) }}
            onDragOver={(e) => { if (editing && dragId) { e.preventDefault(); setOverId(w.id) } }}
            onDrop={(e) => { e.preventDefault(); move(dragId, w.id); setDragId(null); setOverId(null) }}
            onDragEnd={() => { setDragId(null); setOverId(null) }}
          >
            {editing && (
              <div className="wd-controls">
                <span className="wd-name" title="Arraste para mover">⠿ {WIDGETS[w.id].title}</span>
                <button onClick={() => shift(w.id, -1)} disabled={idx === 0} aria-label="Mover para antes">◀</button>
                <button onClick={() => shift(w.id, 1)} disabled={idx === layout.length - 1} aria-label="Mover para depois">▶</button>
                <button onClick={() => resize(w.id)} aria-label="Alterar largura" title="Largura">{w.size}/4</button>
                <button onClick={() => remove(w.id)} aria-label="Remover widget" title="Remover">✕</button>
              </div>
            )}
            {WIDGETS[w.id].render()}
          </div>
        ))}
        {layout.length === 0 && <div className="empty card full-grid">Nenhum widget. Use “Adicionar widget” ou “Restaurar padrão”.</div>}
      </div>
    </>
  )
}
