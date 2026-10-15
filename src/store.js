// Armazenamento local dos shows (demonstração). Guarda só o que o usuário criou, editou ou removeu,
// por cima dos dados de exemplo. Será substituído pelas tabelas do Supabase.
import { useSyncExternalStore } from 'react'
import { agendaShows as seed } from './data.js'

const KEY = 'ecx.shows.v1'
const empty = () => ({ added: [], edited: {}, removed: [] })

const load = () => {
  try {
    const r = JSON.parse(localStorage.getItem(KEY))
    if (r && Array.isArray(r.added) && r.edited && Array.isArray(r.removed)) return r
  } catch { /* sem armazenamento */ }
  return empty()
}

let state = load()
const compute = () => [
  ...seed.filter((s) => !state.removed.includes(s.id)).map((s) => state.edited[s.id] || s),
  ...state.added,
]
let cache = compute()
const listeners = new Set()

const commit = (next) => {
  state = next
  cache = compute()
  try {
    // URLs temporárias dos arquivos anexados não sobrevivem ao recarregar: não são salvas.
    localStorage.setItem(KEY, JSON.stringify(state, (k, v) => (k === 'url' ? undefined : v)))
  } catch { /* ignora */ }
  listeners.forEach((l) => l())
}

const isSeed = (id) => seed.some((s) => s.id === id)

export const getShows = () => cache
export const useShows = () =>
  useSyncExternalStore((cb) => { listeners.add(cb); return () => listeners.delete(cb) }, getShows)

export function saveShow(show) {
  if (isSeed(show.id)) return commit({ ...state, edited: { ...state.edited, [show.id]: show } })
  if (state.added.some((s) => s.id === show.id)) {
    return commit({ ...state, added: state.added.map((s) => (s.id === show.id ? show : s)) })
  }
  return commit({ ...state, added: [...state.added, show] })
}

export function deleteShow(id) {
  if (isSeed(id)) {
    const { [id]: _drop, ...edited } = state.edited
    return commit({ ...state, edited, removed: [...state.removed, id] })
  }
  return commit({ ...state, added: state.added.filter((s) => s.id !== id) })
}
