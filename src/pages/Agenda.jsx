import { useEffect, useMemo, useState } from 'react'
import ShowForm, { emptyShow } from '../components/ShowForm.jsx'
import { deleteShow, saveShow, useShows } from '../store.js'

const pad = (n) => String(n).padStart(2, '0')
const isoOf = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const parse = (iso) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}
const fmtDate = (iso) => iso.split('-').reverse().join('/')
const cap = (t) => t[0].toUpperCase() + t.slice(1)
const weekday = (iso) => cap(parse(iso).toLocaleDateString('pt-BR', { weekday: 'long' }).replace('-', ' '))
const todayIso = () => isoOf(new Date())
const brl = (v) => (parseFloat(String(v).replace(/\./g, '').replace(',', '.')) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const fmtSize = (b) => (b >= 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`)
const STATUS = { confirmado: 'Confirmado', proposta: 'Proposta', realizado: 'Realizado' }
const mapsUrl = (q) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`
const telUrl = (t) => 'tel:' + t.replace(/[^\d+]/g, '')

export default function Agenda() {
  const shows = useShows()
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(null) // show em edição (ou novo)
  const [offset, setOffset] = useState(0) // 0 = mês atual
  const [showAll, setShowAll] = useState(false)

  const today = todayIso()
  const base = new Date(new Date().getFullYear(), new Date().getMonth() + offset, 1)
  const title = cap(base.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }))
  // No mês atual os dias que já passaram saem da lista (a menos que "ver mês completo" esteja ligado).
  const hidePast = offset === 0 && !showAll

  const { days, count } = useMemo(() => {
    const total = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate()
    const list = []
    let n = 0
    for (let d = 1; d <= total; d++) {
      const iso = isoOf(new Date(base.getFullYear(), base.getMonth(), d))
      const events = shows.filter((s) => s.date === iso)
      n += events.length
      if (hidePast && iso < today) continue
      list.push({ iso, events })
    }
    return { days: list, count: n }
  }, [offset, hidePast, today, shows])

  // Depois de salvar, mostra o mês do show para o usuário ver onde ele ficou.
  const onSave = (show) => {
    saveShow(show)
    setForm(null)
    const d = parse(show.date)
    const now = new Date()
    setOffset((d.getFullYear() - now.getFullYear()) * 12 + d.getMonth() - now.getMonth())
    if (show.date < todayIso()) setShowAll(true)
  }

  return (
    <>
      <div className="page-head row">
        <h1 className="page-title">Agenda de shows</h1>
        <button className="btn-primary" onClick={() => setForm(emptyShow())}>+ Novo show</button>
      </div>

      <div className="agenda-tools">
        <div className="month-nav">
          <button onClick={() => setOffset(offset - 1)} aria-label="Mês anterior">‹</button>
          <strong>{title}</strong>
          <button onClick={() => setOffset(offset + 1)} aria-label="Próximo mês">›</button>
        </div>
        <span className="muted-sm">{count} {count === 1 ? 'evento' : 'eventos'} no mês</span>
        {offset !== 0 && <button className="btn-ghost" onClick={() => setOffset(0)}>Voltar ao mês atual</button>}
        {offset === 0 && (
          <button className="btn-ghost" onClick={() => setShowAll(!showAll)}>
            {showAll ? 'Mostrar só os próximos' : 'Ver mês completo'}
          </button>
        )}
      </div>

      <div className="card agenda">
        <div className="agenda-head">
          <span>Dia da semana</span><span>Data</span><span>Cidade / UF</span><span>Evento</span><span>Observações</span>
        </div>
        {days.length === 0 && <div className="empty">Nenhum dia restante neste mês. Use “Ver mês completo” ou avance de mês.</div>}
        {days.map(({ iso, events }) => {
          const dow = parse(iso).getDay()
          const weekend = dow === 0 || dow === 6
          const dayCls = 'd-week' + (weekend ? ' weekend' : '')
          if (!events.length) {
            return (
              <div key={iso} className={'agenda-row empty-day' + (iso === today ? ' is-today' : '')}>
                <span className={dayCls}>{weekday(iso)}</span>
                <span className={'d-date' + (weekend ? ' weekend' : '')}>{fmtDate(iso)}</span>
                <span className="d-city" /><span className="d-event" /><span className="d-obs" />
              </div>
            )
          }
          return events.map((s) => (
            <div
              key={s.id}
              className={`agenda-row has-event tipo-${s.tipo || 'show'}` + (iso === today ? ' is-today' : '')}
              role="button" tabIndex={0}
              onClick={() => setSelected(s)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelected(s)}
            >
              <span className={dayCls}>{weekday(iso)}</span>
              <span className={'d-date' + (weekend ? ' weekend' : '')}>{fmtDate(iso)}</span>
              <span className="d-city">{s.city} / {s.uf}</span>
              <span className="d-event">{s.event}{s.status === 'proposta' && <em className="tag-prop">proposta</em>}</span>
              <span className="d-obs">{s.obs}</span>
            </div>
          ))
        })}
      </div>
      <div className="agenda-legend">
        <i className="lg-show" /> Show <i className="lg-evento" /> Evento / corporativo
        <span className="muted-sm"> · Clique em um evento para ver os detalhes</span>
      </div>

      {selected && (
        <ShowModal
          show={shows.find((x) => x.id === selected.id) || selected}
          onClose={() => setSelected(null)}
          onEdit={(sh) => { setSelected(null); setForm(sh) }}
          onDelete={(sh) => {
            if (window.confirm(`Excluir o show “${sh.event}”?`)) { deleteShow(sh.id); setSelected(null) }
          }}
        />
      )}
      {form && <ShowForm key={form.id || 'novo'} initial={form} onSave={onSave} onClose={() => setForm(null)} />}
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

const Phone = ({ nome, telefone, funcao }) =>
  nome || telefone ? (
    <>
      {nome && <b>{nome}</b>}{funcao && <span className="dim">{funcao}</span>}
      {telefone && <a href={telUrl(telefone)}>{telefone}</a>}
    </>
  ) : (
    <span className="dim">Não informado</span>
  )

function ShowModal({ show: s, onClose, onEdit, onDelete }) {
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
            {s.responsaveis.length ? s.responsaveis.map((r, i) => <div key={i} className="resp"><Phone {...r} /></div>) : <span className="dim">Não informado</span>}
          </Field>
          {s.cache && <Field label="Cachê"><b>{brl(s.cache)}</b></Field>}
          <Field label="Contrato e documentos">
            {s.contratos && s.contratos.length ? (
              s.contratos.map((c, i) => (
                <div key={i} className="resp">
                  {c.url ? <a href={c.url} target="_blank" rel="noreferrer" download={c.name}>{c.name}</a> : <b>{c.name}</b>}
                  <span className="dim">{fmtSize(c.size)}{!c.url && ' · reenvie o arquivo para abrir (demonstração)'}</span>
                </div>
              ))
            ) : <span className="dim">Nenhum arquivo anexado</span>}
          </Field>
        </div>

        {s.obs && <Field label="Observações"><span>{s.obs}</span></Field>}

        <div className="form-actions">
          <button className="btn-danger" onClick={() => onDelete(s)}>Excluir</button>
          <button className="btn-ghost" onClick={() => onEdit(s)}>Editar show</button>
        </div>
      </div>
    </div>
  )
}
