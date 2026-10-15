import { useEffect, useRef, useState } from 'react'
import { agendaShows, initialMissions } from '../data.js'

const TIPOS = { show: 'Show', privado: 'Voo privado', extra: 'Extra' }
const pad = (n) => String(n).padStart(2, '0')
const fmtDate = (iso) => iso.split('-').reverse().join('/')
const todayIso = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` }
const num = (v) => parseFloat(String(v).replace(/\./g, '').replace(',', '.')) || 0
const brl = (v) => (typeof v === 'number' ? v : num(v)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const showLabel = (s) => `${fmtDate(s.date)} · ${s.city}/${s.uf} · ${s.event}`
const showById = (id) => agendaShows.find((s) => s.id === id)

const emptyMission = (tipo) => ({
  id: null, tipo, showId: '', motivo: '', data: todayIso(),
  decola: { sigla: '', hora: '' }, pousa: { sigla: '', hora: '' },
  respDecola: { nome: '', telefone: '' }, respPousa: { nome: '', telefone: '' },
  hangar: false, patio: false, pernoite: false, valor: '', obs: '',
})

const missionTitle = (m) => {
  if (m.tipo === 'show') {
    const s = showById(m.showId)
    return s ? `${s.event} · ${s.city}/${s.uf}` : 'Show (não selecionado)'
  }
  return m.motivo || '—'
}

export default function Voos() {
  const [missions, setMissions] = useState(initialMissions)
  const [menuOpen, setMenuOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const menuRef = useRef(null)

  useEffect(() => {
    const close = (e) => menuRef.current && !menuRef.current.contains(e.target) && setMenuOpen(false)
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const sorted = [...missions].sort((a, b) => a.data.localeCompare(b.data))
  const total = missions.reduce((s, m) => s + num(m.valor), 0)

  const save = (m) => {
    setMissions((ms) => (m.id ? ms.map((x) => (x.id === m.id ? m : x)) : [...ms, { ...m, id: 'm' + Date.now() }]))
    setEditing(null)
  }
  const remove = (id) => {
    setMissions((ms) => ms.filter((x) => x.id !== id))
    setEditing(null)
  }

  return (
    <>
      <div className="page-head row">
        <h1 className="page-title">Voos</h1>
        <div className="menu-wrap" ref={menuRef}>
          <button className="btn-primary" onClick={() => setMenuOpen(!menuOpen)}>+ Adicionar missão</button>
          {menuOpen && (
            <div className="dropdown">
              {Object.entries(TIPOS).map(([k, label]) => (
                <button key={k} onClick={() => { setEditing(emptyMission(k)); setMenuOpen(false) }}>{label}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="agenda-tools">
        <span className="muted-sm">{missions.length} {missions.length === 1 ? 'missão' : 'missões'}</span>
        <span className="muted-sm">Total: <b className="total">{brl(total)}</b></span>
        <span className="muted-sm hint">Clique em uma missão para editar</span>
      </div>

      <div className="card voos">
        <div className="voos-head">
          <span>Data</span><span>Tipo</span><span>Missão</span><span>Rota</span><span>Horários</span><span>Pernoite</span><span>Valor</span>
        </div>
        {sorted.length === 0 && <div className="empty">Nenhuma missão cadastrada.</div>}
        {sorted.map((m) => (
          <div key={m.id} className={'voos-row tipo-m-' + m.tipo} role="button" tabIndex={0}
               onClick={() => setEditing(m)} onKeyDown={(e) => e.key === 'Enter' && setEditing(m)}>
            <span className="v-date">{fmtDate(m.data)}</span>
            <span><em className={'tipo-tag ' + m.tipo}>{TIPOS[m.tipo]}</em></span>
            <span className="v-title">{missionTitle(m)}</span>
            <span className="v-route">{m.decola.sigla || '—'} → {m.pousa.sigla || '—'}</span>
            <span className="v-times">{m.decola.hora || '--:--'} / {m.pousa.hora || '--:--'}</span>
            <span>{m.pernoite ? 'Sim' : 'Não'}</span>
            <span className="v-val">{brl(m.valor)}</span>
          </div>
        ))}
      </div>

      {editing && <MissionForm initial={editing} onSave={save} onRemove={remove} onClose={() => setEditing(null)} />}
    </>
  )
}

function MissionForm({ initial, onSave, onRemove, onClose }) {
  const [m, setM] = useState(initial)
  const set = (patch) => setM((x) => ({ ...x, ...patch }))
  const setIn = (key, patch) => setM((x) => ({ ...x, [key]: { ...x[key], ...patch } }))

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const shows = [...agendaShows].sort((a, b) => a.date.localeCompare(b.date))
  const pickShow = (id) => {
    const s = showById(id)
    set({ showId: id, ...(s ? { data: s.date } : {}) })
  }
  const motivoOk = m.tipo === 'show' ? !!m.showId : !!m.motivo.trim()
  const valid = motivoOk && m.decola.sigla.length >= 3 && m.pousa.sigla.length >= 3

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}
            onSubmit={(e) => { e.preventDefault(); valid && onSave(m) }}>
        <div className="modal-head">
          <div>
            <h2>{initial.id ? 'Editar missão' : 'Nova missão'}</h2>
            <p className="muted-sm"><em className={'tipo-tag ' + m.tipo}>{TIPOS[m.tipo]}</em></p>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Fechar">×</button>
        </div>

        <div className="form-grid">
          {m.tipo === 'show' ? (
            <label className="f full">
              <span>Show / cidade da missão</span>
              <select value={m.showId} onChange={(e) => pickShow(e.target.value)} required>
                <option value="">Selecione o show…</option>
                {shows.map((s) => <option key={s.id} value={s.id}>{showLabel(s)}</option>)}
              </select>
            </label>
          ) : (
            <label className="f full">
              <span>Motivo da missão</span>
              <input value={m.motivo} onChange={(e) => set({ motivo: e.target.value })} placeholder="Descreva o motivo" required />
            </label>
          )}

          <label className="f">
            <span>Data da missão</span>
            <input type="date" value={m.data} onChange={(e) => set({ data: e.target.value })} required />
          </label>
          <label className="f">
            <span>Valor (R$)</span>
            <input inputMode="decimal" value={m.valor} onChange={(e) => set({ valor: e.target.value.replace(/[^\d.,]/g, '') })} placeholder="0,00" />
          </label>

          <fieldset className="f-group">
            <legend>Decolagem</legend>
            <label className="f">
              <span>Aeroporto (sigla)</span>
              <input value={m.decola.sigla} maxLength={4} placeholder="SBSP" className="sigla"
                     onChange={(e) => setIn('decola', { sigla: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') })} required />
            </label>
            <label className="f">
              <span>Horário previsto</span>
              <input type="time" value={m.decola.hora} onChange={(e) => setIn('decola', { hora: e.target.value })} />
            </label>
            <label className="f full">
              <span>Responsável local (decolagem)</span>
              <input value={m.respDecola.nome} placeholder="Nome" onChange={(e) => setIn('respDecola', { nome: e.target.value })} />
            </label>
            <label className="f full">
              <span>Telefone</span>
              <input type="tel" value={m.respDecola.telefone} placeholder="(00) 00000-0000" onChange={(e) => setIn('respDecola', { telefone: e.target.value })} />
            </label>
          </fieldset>

          <fieldset className="f-group">
            <legend>Pouso</legend>
            <label className="f">
              <span>Aeroporto (sigla)</span>
              <input value={m.pousa.sigla} maxLength={4} placeholder="SBCT" className="sigla"
                     onChange={(e) => setIn('pousa', { sigla: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') })} required />
            </label>
            <label className="f">
              <span>Horário previsto</span>
              <input type="time" value={m.pousa.hora} onChange={(e) => setIn('pousa', { hora: e.target.value })} />
            </label>
            <label className="f full">
              <span>Responsável local (pouso)</span>
              <input value={m.respPousa.nome} placeholder="Nome" onChange={(e) => setIn('respPousa', { nome: e.target.value })} />
            </label>
            <label className="f full">
              <span>Telefone</span>
              <input type="tel" value={m.respPousa.telefone} placeholder="(00) 00000-0000" onChange={(e) => setIn('respPousa', { telefone: e.target.value })} />
            </label>
          </fieldset>

          <div className="f full checks">
            <label className="check-opt"><input type="checkbox" checked={m.hangar} onChange={(e) => set({ hangar: e.target.checked })} /> Hangar</label>
            <label className="check-opt"><input type="checkbox" checked={m.patio} onChange={(e) => set({ patio: e.target.checked })} /> Pátio</label>
            <label className="check-opt"><input type="checkbox" checked={m.pernoite} onChange={(e) => set({ pernoite: e.target.checked })} /> Pernoite</label>
          </div>

          <label className="f full">
            <span>Observações</span>
            <textarea rows={3} value={m.obs} onChange={(e) => set({ obs: e.target.value })} placeholder="Informações adicionais da missão" />
          </label>
        </div>

        <div className="form-actions">
          {initial.id && <button type="button" className="btn-danger" onClick={() => onRemove(initial.id)}>Excluir</button>}
          <button type="button" className="btn-ghost" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn-primary" disabled={!valid}>Salvar missão</button>
        </div>
      </form>
    </div>
  )
}
