import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Responsive } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import { AreaChart, Bars, ChartBox, Donut } from '../components/Charts.jsx'
import {
  agendaShows, initialMissions, initialTasks, kpis, people, proximosShows, receitaMensal, showsPorDia, showsPorStatus,
} from '../data.js'

const brl = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
const fmt = (iso) => iso.split('-').reverse().slice(0, 2).join('/')
const TIPOS = { show: 'Show', privado: 'Voo privado', extra: 'Extra' }
const STORAGE_KEY = 'ecx.dashboard.v2'
const BREAKPOINTS = { lg: 1000, md: 600, sm: 0 }
const COLS = { lg: 12, md: 6, sm: 2 }
const ROW_H = 40
const GAP = 16

const upcomingMissions = () =>
  [...initialMissions].sort((a, b) => a.data.localeCompare(b.data)).slice(0, 4).map((m) => {
    const s = agendaShows.find((x) => x.id === m.showId)
    return { ...m, title: m.tipo === 'show' ? (s ? `${s.event} · ${s.city}/${s.uf}` : 'Show') : m.motivo }
  })
const openTasks = () => initialTasks.filter((t) => t.status !== 'done').sort((a, b) => a.due.localeCompare(b.due)).slice(0, 5)

// Catálogo de widgets. sizes = [largura, altura] em células da grade, por faixa de tela; min = tamanho mínimo.
const KPI = { sizes: { lg: [3, 3], md: [3, 3], sm: [2, 3] }, min: [2, 3] }
const PANEL = { sizes: { lg: [6, 8], md: [6, 8], sm: [2, 8] }, min: [3, 5] }

const Panel = ({ title, children }) => (
  <section className="panel">
    <h3>{title}</h3>
    {children}
  </section>
)

const WIDGETS = {
  kpiProximo: {
    ...KPI, title: 'Próximo show',
    render: () => (
      <div className="kpi grad-red">
        <small>Próximo show</small>
        <strong>{kpis.proximoShow.title}</strong>
        <span>{fmt(kpis.proximoShow.date)} · {kpis.proximoShow.city}</span>
      </div>
    ),
  },
  kpiCache: {
    ...KPI, title: 'Cachê confirmado no mês',
    render: () => (
      <div className="kpi grad-cyan">
        <small>Cachê confirmado no mês</small>
        <strong>{brl(kpis.cacheMes)}</strong>
        <span>+14% vs. mês anterior</span>
      </div>
    ),
  },
  kpiShows: {
    ...KPI, title: 'Shows no mês',
    render: () => (<div className="kpi"><small>Shows no mês</small><strong>{kpis.showsMes}</strong><span>3 a confirmar</span></div>),
  },
  kpiVoo: {
    ...KPI, title: 'Horas de voo no mês',
    render: () => (<div className="kpi"><small>Horas de voo no mês</small><strong>{kpis.horasVoo} h</strong><span>6 voos realizados</span></div>),
  },
  receita: {
    ...PANEL, title: 'Receita de cachês',
    render: () => (
      <Panel title="Receita de cachês (mil R$)">
        <ChartBox>{(w, h) => <AreaChart data={receitaMensal} width={w} height={h} />}</ChartBox>
      </Panel>
    ),
  },
  status: {
    ...PANEL, title: 'Shows por status',
    render: () => (
      <Panel title="Shows por status">
        <ChartBox>{(w, h) => <Donut data={showsPorStatus} width={w} height={h} />}</ChartBox>
      </Panel>
    ),
  },
  diaSemana: {
    ...PANEL, title: 'Shows por dia da semana',
    render: () => (
      <Panel title="Shows por dia da semana">
        <ChartBox>{(w, h) => <Bars data={showsPorDia} height={h} />}</ChartBox>
      </Panel>
    ),
  },
  proximos: {
    ...PANEL, title: 'Próximos shows',
    render: () => (
      <Panel title="Próximos shows">
        <ul className="upcoming list-scroll">
          {proximosShows.map((s) => (
            <li key={s.id}>
              <div className="date">{fmt(s.date)}</div>
              <div><b>{s.title}</b><small>{s.city}</small></div>
              <span className={'badge ' + s.status}>{s.status}</span>
            </li>
          ))}
        </ul>
      </Panel>
    ),
  },
  missoes: {
    ...PANEL, title: 'Próximas missões de voo',
    render: () => (
      <Panel title="Próximas missões de voo">
        <ul className="upcoming list-scroll">
          {upcomingMissions().map((m) => (
            <li key={m.id}>
              <div className="date">{fmt(m.data)}</div>
              <div><b>{m.decola.sigla} → {m.pousa.sigla}</b><small>{m.title}</small></div>
              <em className={'tipo-tag ' + m.tipo}>{TIPOS[m.tipo]}</em>
            </li>
          ))}
        </ul>
      </Panel>
    ),
  },
  tarefas: {
    ...PANEL, title: 'Tarefas em aberto',
    render: () => (
      <Panel title="Tarefas em aberto">
        <ul className="upcoming list-scroll">
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
      </Panel>
    ),
  },
}

const DEFAULT_IDS = ['kpiProximo', 'kpiCache', 'kpiShows', 'kpiVoo', 'receita', 'status', 'diaSemana', 'proximos']

// Posiciona os widgets em sequência, quebrando linha quando não cabem (layout padrão de cada faixa de tela).
const pack = (ids, bp) => {
  const cols = COLS[bp]
  let x = 0, y = 0, rowH = 0
  return ids.map((id) => {
    const [w, h] = WIDGETS[id].sizes[bp]
    if (x + w > cols) { x = 0; y += rowH; rowH = 0 }
    const item = { i: id, x, y, w, h }
    x += w
    rowH = Math.max(rowH, h)
    return item
  })
}
const defaultLayouts = (ids) => ({ lg: pack(ids, 'lg'), md: pack(ids, 'md'), sm: pack(ids, 'sm') })

// Aplica os limites mínimos do catálogo (não são salvos).
const decorate = (layouts) =>
  Object.fromEntries(Object.entries(layouts).map(([bp, items]) => [
    bp,
    items.map((it) => ({ ...it, minW: Math.min(WIDGETS[it.i].min[0], COLS[bp]), minH: WIDGETS[it.i].min[1] })),
  ]))

const loadLayouts = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY))
    const ids = raw && raw.lg && raw.lg.map((it) => it.i)
    if (ids && ids.length && ids.every((id) => WIDGETS[id])) {
      const ok = Object.keys(COLS).every((bp) => raw[bp] && raw[bp].length === ids.length && raw[bp].every((it) => WIDGETS[it.i]))
      if (ok) return raw
    }
  } catch { /* sem armazenamento: usa o padrão */ }
  return defaultLayouts(DEFAULT_IDS)
}

const clean = (layouts) =>
  Object.fromEntries(Object.entries(layouts).map(([bp, items]) => [bp, items.map(({ i, x, y, w, h }) => ({ i, x, y, w, h }))]))

// Largura disponível para a grade (acompanha a janela e o menu lateral).
function useWidth() {
  const ref = useRef(null)
  const [width, setWidth] = useState(0)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return undefined
    setWidth(el.offsetWidth)
    const ro = new ResizeObserver(([e]) => setWidth(Math.round(e.contentRect.width)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, width]
}

export default function Dashboard() {
  const [gridRef, gridWidth] = useWidth()
  const [layouts, setLayouts] = useState(loadLayouts)
  const [editing, setEditing] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const addRef = useRef(null)

  const ids = layouts.lg.map((it) => it.i)
  const hidden = Object.keys(WIDGETS).filter((id) => !ids.includes(id))

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(layouts)) } catch { /* ignora */ }
  }, [layouts])

  useEffect(() => {
    const close = (e) => addRef.current && !addRef.current.contains(e.target) && setAddOpen(false)
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const onLayoutChange = (_current, all) => {
    const next = clean(all)
    setLayouts((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next))
  }
  const remove = (id) => setLayouts((l) => Object.fromEntries(Object.entries(l).map(([bp, items]) => [bp, items.filter((it) => it.i !== id)])))
  const add = (id) => {
    setLayouts((l) => Object.fromEntries(Object.entries(l).map(([bp, items]) => {
      const [w, h] = WIDGETS[id].sizes[bp]
      return [bp, [...items, { i: id, x: 0, y: Infinity, w, h }]]
    })))
    setAddOpen(false)
  }
  const reset = () => setLayouts(defaultLayouts(DEFAULT_IDS))

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

      {editing && (
        <p className="edit-hint">
          Arraste um widget para mudar a posição e puxe as bordas ou o canto inferior direito para ajustar largura e altura.
          Eles encaixam na grade e os demais se reorganizam sozinhos.
        </p>
      )}

      <div ref={gridRef}>
      {gridWidth > 0 && (
      <Responsive
        width={gridWidth}
        className={'dash-grid' + (editing ? ' is-editing' : '')}
        layouts={decorate(layouts)}
        breakpoints={BREAKPOINTS}
        cols={COLS}
        rowHeight={ROW_H}
        margin={[GAP, GAP]}
        containerPadding={[0, 0]}
        isDraggable={editing}
        isResizable={editing}
        draggableCancel=".wd-btn"
        resizeHandles={['se', 'e', 's', 'sw', 'w']}
        compactType="vertical"
        onLayoutChange={onLayoutChange}
      >
        {ids.map((id) => (
          <div key={id} className={'wd' + (id.startsWith('kpi') ? ' wd-kpi' : '')}>
            {editing && (
              <button className="wd-btn wd-remove" onClick={() => remove(id)} aria-label={`Remover ${WIDGETS[id].title}`} title="Remover widget">✕</button>
            )}
            {WIDGETS[id].render()}
          </div>
        ))}
      </Responsive>
      )}
      </div>
      {ids.length === 0 && <div className="empty card">Nenhum widget. Use “Adicionar widget” ou “Restaurar padrão”.</div>}
    </>
  )
}
