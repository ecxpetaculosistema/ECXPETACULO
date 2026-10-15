import { useEffect, useMemo, useState } from 'react'
import { agendaShows } from '../data.js'

const parse = (iso) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}
const fmtDate = (iso) => parse(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
const weekday = (iso) => {
  const w = parse(iso).toLocaleDateString('pt-BR', { weekday: 'long' }).replace('-', ' ')
  return w[0].toUpperCase() + w.slice(1)
}
const monthLabel = (iso) => {
  const l = parse(iso).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  return l[0].toUpperCase() + l.slice(1)
}
const today = () => new Date().toISOString().slice(0, 10)
const STATUS = { confirmado: 'Confirmado', proposta: 'Proposta', realizado: 'Realizado' }
const mapsUrl = (q) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`
const telUrl = (t) => 'tel:' + t.replace(/[^\d+]/g, '')

export default function Agenda() {
  const [selected, setSelected] = useState(null)
  const [showPast, setShowPast] = useState(false)
  const [query, setQuery] = useState('')

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return [...agendaShows]
      .sort((a, b) => a.date.localeCompare(b.date))
      .filter((s) => showPast || s.date >= today())
      .filter((s) => !q || `${s.city} ${s.uf} ${s.event} ${s.obs}`.toLowerCase().includes(q))
  }, [showPast, query])

  const groups = rows.reduce((acc, s) => {
    const k = monthLabel(s.date)
    ;(acc[k] = acc[k] || []).push(s)
    return acc
  }, {})

  return (
    <>
      <div className="page-head row">
        <h1 className="page-title">Agenda de shows</h1>
        <button className="btn-primary">+ Novo show</button>
      </div>

      <div className="agenda-tools">
        <input className="search" placeholder="Buscar cidade, evento ou observação" value={query} onChange={(e) => setQuery(e.target.value)} />
        <label className="toggle">
          <input type="checkbox" checked={showPast} onChange={(e) => setShowPast(e.target.checked)} /> Mostrar shows passados
        </label>
      </div>

      <div className="card agenda">
        <div className="agenda-head">
          <span>Data</span><span>Dia da semana</span><span>Cidade / UF</span><span>Evento</span><span>Observações</span>
        </div>
        {rows.length === 0 && <div className="empty">Nenhum show encontrado.</div>}
        {Object.entries(groups).map(([month, list]) => (
          <div key={month}>
            <div className="agenda-month">{month}</div>
            {list.map((s) => (
              <div key={s.id} className={'agenda-row' + (s.date < today() ? ' past' : '')}>
                <span className="a-date">{fmtDate(s.date)}</span>
                <span className="a-week">{weekday(s.date)}</span>
                <span className="a-city">{s.city} / {s.uf}</span>
                <span className="a-event">
                  <button className="event-link" onClick={() => setSelected(s)}>{s.event}</button>
                  <span className={'badge ' + s.status}>{STATUS[s.status]}</span>
                </span>
                <span className="a-obs">{s.obs}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {selected && <ShowModal show={selected} onClose={() => setSelected(null)} />}
    </>
  )
}

function Field({ label, children }) {
  return (
    <div className="m-field">
      <small>{label}</small>
      <div>{children}</div>
    </div>
  )
}

const Address = ({ nome, endereco }) =>
  endereco ? (
    <>
      {nome && <b>{nome}</b>}
      <a href={mapsUrl(endereco)} target="_blank" rel="noreferrer">{endereco}</a>
    </>
  ) : (
    <span className="dim">Não informado</span>
  )

const Phone = ({ nome, telefone, funcao }) => (
  <>
    <b>{nome}</b>{funcao && <span className="dim">{funcao}</span>}
    <a href={telUrl(telefone)}>{telefone}</a>
  </>
)

function ShowModal({ show: s, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const h = s.horarios
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <h2>{s.event}</h2>
            <p className="muted-sm">{weekday(s.date)}, {fmtDate(s.date)} · {s.city} / {s.uf}</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Fechar">×</button>
        </div>
        <span className={'badge ' + s.status}>{STATUS[s.status]}</span>

        <div className="modal-grid">
          <Field label="Endereço do local do evento"><Address {...s.local} /></Field>
          {(h.chegada || h.passagem || h.show) && (
            <Field label="Horários">
              <span>Chegada <b>{h.chegada || '—'}</b></span>
              <span>Passagem de som <b>{h.passagem || '—'}</b></span>
              <span>Show <b>{h.show || '—'}</b></span>
            </Field>
          )}
          <Field label="Endereço do hotel do artista"><Address {...s.hotelArtista} /></Field>
          <Field label="Endereço do hotel da banda"><Address {...s.hotelBanda} /></Field>
          <Field label="Telefone do contratante"><Phone {...s.contratante} /></Field>
          <Field label="Responsáveis no local">
            {s.responsaveis.length ? s.responsaveis.map((r) => <div key={r.telefone} className="resp"><Phone {...r} /></div>) : <span className="dim">Não informado</span>}
          </Field>
        </div>

        {s.obs && <Field label="Observações"><span>{s.obs}</span></Field>}
      </div>
    </div>
  )
}
