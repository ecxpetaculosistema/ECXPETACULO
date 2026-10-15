import { useEffect, useRef, useState } from 'react'

const UFS = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO']
const MAX_FILE = 15 * 1024 * 1024
const pad = (n) => String(n).padStart(2, '0')
const todayIso = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` }
const fmtSize = (b) => (b >= 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`)
const emptyResp = () => ({ nome: '', funcao: '', telefone: '' })

export const emptyShow = () => ({
  id: null, tipo: 'show', status: 'proposta', event: '', date: todayIso(), city: '', uf: '',
  horarios: { chegada: '', passagem: '', show: '' },
  local: { nome: '', endereco: '' },
  hotelArtista: { nome: '', endereco: '' }, hotelBanda: { nome: '', endereco: '' },
  contratante: { nome: '', telefone: '' },
  responsaveis: [], cache: '', obs: '', contratos: [],
})

export default function ShowForm({ initial, onSave, onClose }) {
  const isEdit = !!initial.id
  const [f, setF] = useState(() => {
    const base = { ...emptyShow(), ...initial }
    const same = base.hotelBanda.endereco && base.hotelBanda.endereco === base.hotelArtista.endereco && base.hotelBanda.nome === base.hotelArtista.nome
    return { ...base, mesmoHotel: !!same, responsaveis: base.responsaveis.length ? base.responsaveis : [emptyResp()] }
  })
  const [fileError, setFileError] = useState('')
  const fileRef = useRef(null)

  const set = (patch) => setF((x) => ({ ...x, ...patch }))
  const setIn = (key, patch) => setF((x) => ({ ...x, [key]: { ...x[key], ...patch } }))
  const setResp = (i, patch) => setF((x) => ({ ...x, responsaveis: x.responsaveis.map((r, k) => (k === i ? { ...r, ...patch } : r)) }))

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const addFiles = (list) => {
    const added = []
    let err = ''
    Array.from(list).forEach((file) => {
      if (file.size > MAX_FILE) { err = `“${file.name}” passa de 15 MB e não foi anexado.`; return }
      added.push({ name: file.name, size: file.size, type: file.type, url: URL.createObjectURL(file) })
    })
    setFileError(err)
    if (added.length) setF((x) => ({ ...x, contratos: [...x.contratos, ...added] }))
    if (fileRef.current) fileRef.current.value = ''
  }

  const valid = f.event.trim() && f.date && f.city.trim() && f.uf

  const submit = (e) => {
    e.preventDefault()
    if (!valid) return
    const { mesmoHotel, ...rest } = f
    onSave({
      ...rest,
      id: f.id || 's' + Date.now(),
      event: f.event.trim(), city: f.city.trim(),
      hotelBanda: mesmoHotel ? { ...f.hotelArtista } : f.hotelBanda,
      responsaveis: f.responsaveis.filter((r) => r.nome.trim() || r.telefone.trim()),
    })
  }

  const hb = f.mesmoHotel ? f.hotelArtista : f.hotelBanda

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form className="modal wide" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <div className="modal-head">
          <div>
            <h2>{isEdit ? 'Editar show' : 'Novo show'}</h2>
            <p className="muted-sm">Campos com * são obrigatórios.</p>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Fechar">×</button>
        </div>

        <div className="form-grid">
          <fieldset className="f-group wide-group">
            <legend>Evento</legend>
            <label className="f full">
              <span>Nome do evento *</span>
              <input value={f.event} onChange={(e) => set({ event: e.target.value })} placeholder="Ex.: Festival Exemplo" required />
            </label>
            <label className="f">
              <span>Tipo</span>
              <select value={f.tipo} onChange={(e) => set({ tipo: e.target.value })}>
                <option value="show">Show</option>
                <option value="evento">Evento / corporativo</option>
              </select>
            </label>
            <label className="f">
              <span>Status</span>
              <select value={f.status} onChange={(e) => set({ status: e.target.value })}>
                <option value="proposta">Proposta</option>
                <option value="confirmado">Confirmado</option>
                <option value="realizado">Realizado</option>
              </select>
            </label>
            <label className="f">
              <span>Data *</span>
              <input type="date" value={f.date} onChange={(e) => set({ date: e.target.value })} required />
            </label>
            <label className="f">
              <span>Cachê (R$)</span>
              <input inputMode="decimal" value={f.cache} onChange={(e) => set({ cache: e.target.value.replace(/[^\d.,]/g, '') })} placeholder="0,00" />
            </label>
            <label className="f">
              <span>Cidade *</span>
              <input value={f.city} onChange={(e) => set({ city: e.target.value })} placeholder="Cidade" required />
            </label>
            <label className="f">
              <span>UF *</span>
              <select value={f.uf} onChange={(e) => set({ uf: e.target.value })} required>
                <option value="">Selecione</option>
                {UFS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </label>
          </fieldset>

          <fieldset className="f-group wide-group three">
            <legend>Horários</legend>
            <label className="f"><span>Chegada</span><input type="time" value={f.horarios.chegada} onChange={(e) => setIn('horarios', { chegada: e.target.value })} /></label>
            <label className="f"><span>Passagem de som</span><input type="time" value={f.horarios.passagem} onChange={(e) => setIn('horarios', { passagem: e.target.value })} /></label>
            <label className="f"><span>Show</span><input type="time" value={f.horarios.show} onChange={(e) => setIn('horarios', { show: e.target.value })} /></label>
          </fieldset>

          <fieldset className="f-group wide-group">
            <legend>Local do evento</legend>
            <label className="f full"><span>Nome do local</span><input value={f.local.nome} onChange={(e) => setIn('local', { nome: e.target.value })} placeholder="Ex.: Arena Exemplo" /></label>
            <label className="f full"><span>Endereço</span><input value={f.local.endereco} onChange={(e) => setIn('local', { endereco: e.target.value })} placeholder="Rua, número, bairro, cidade - UF" /></label>
          </fieldset>

          <fieldset className="f-group">
            <legend>Hotel do artista</legend>
            <label className="f full"><span>Nome do hotel</span><input value={f.hotelArtista.nome} onChange={(e) => setIn('hotelArtista', { nome: e.target.value })} /></label>
            <label className="f full"><span>Endereço</span><input value={f.hotelArtista.endereco} onChange={(e) => setIn('hotelArtista', { endereco: e.target.value })} /></label>
          </fieldset>

          <fieldset className="f-group">
            <legend>Hotel da banda</legend>
            <label className="check-opt base-opt full-row">
              <input type="checkbox" checked={f.mesmoHotel} onChange={(e) => set({ mesmoHotel: e.target.checked })} /> Mesmo hotel do artista
            </label>
            <label className="f full"><span>Nome do hotel</span>
              <input value={hb.nome} readOnly={f.mesmoHotel} onChange={(e) => setIn('hotelBanda', { nome: e.target.value })} />
            </label>
            <label className="f full"><span>Endereço</span>
              <input value={hb.endereco} readOnly={f.mesmoHotel} onChange={(e) => setIn('hotelBanda', { endereco: e.target.value })} />
            </label>
          </fieldset>

          <fieldset className="f-group wide-group">
            <legend>Contratante</legend>
            <label className="f"><span>Nome / empresa</span><input value={f.contratante.nome} onChange={(e) => setIn('contratante', { nome: e.target.value })} /></label>
            <label className="f"><span>Telefone</span><input type="tel" value={f.contratante.telefone} placeholder="(00) 00000-0000" onChange={(e) => setIn('contratante', { telefone: e.target.value })} /></label>
          </fieldset>

          <fieldset className="f-group wide-group one">
            <legend>Responsáveis no local</legend>
            {f.responsaveis.map((r, i) => (
              <div className="resp-row" key={i}>
                <label className="f"><span>Nome</span><input value={r.nome} onChange={(e) => setResp(i, { nome: e.target.value })} /></label>
                <label className="f"><span>Função</span><input value={r.funcao} placeholder="Produtor local, segurança…" onChange={(e) => setResp(i, { funcao: e.target.value })} /></label>
                <label className="f"><span>Telefone</span><input type="tel" value={r.telefone} placeholder="(00) 00000-0000" onChange={(e) => setResp(i, { telefone: e.target.value })} /></label>
                <button type="button" className="btn-mini rm" onClick={() => set({ responsaveis: f.responsaveis.filter((_, k) => k !== i) })} aria-label="Remover responsável" title="Remover">✕</button>
              </div>
            ))}
            <button type="button" className="btn-mini add" onClick={() => set({ responsaveis: [...f.responsaveis, emptyResp()] })}>+ Adicionar responsável</button>
          </fieldset>

          <fieldset className="f-group wide-group one">
            <legend>Contrato e documentos</legend>
            <div className="file-add">
              <input ref={fileRef} id="contrato-file" type="file" multiple accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" onChange={(e) => addFiles(e.target.files)} hidden />
              <label htmlFor="contrato-file" className="btn-ghost as-label">+ Anexar contrato</label>
              <span className="muted-sm">PDF, Word ou imagem, até 15 MB cada. Pode anexar vários (contrato, aditivos, rider…).</span>
            </div>
            {fileError && <p className="form-error">{fileError}</p>}
            {f.contratos.length > 0 && (
              <ul className="file-list">
                {f.contratos.map((c, i) => (
                  <li key={c.name + i}>
                    <span className="file-ico">▤</span>
                    <span className="file-name">{c.name}</span>
                    <span className="muted-sm">{fmtSize(c.size)}</span>
                    <button type="button" className="btn-mini" onClick={() => set({ contratos: f.contratos.filter((_, k) => k !== i) })}>Remover</button>
                  </li>
                ))}
              </ul>
            )}
          </fieldset>

          <label className="f full">
            <span>Observações</span>
            <textarea rows={3} value={f.obs} onChange={(e) => set({ obs: e.target.value })} placeholder="Informações adicionais do show" />
          </label>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-ghost" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn-primary" disabled={!valid}>{isEdit ? 'Salvar alterações' : 'Salvar show'}</button>
        </div>
      </form>
    </div>
  )
}
