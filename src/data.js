// Dados de demonstração. Serão substituídos por consultas ao Supabase.
const day = (n) => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

export const currentUser = { name: 'Fulano da Silva', initials: 'FS', role: 'admin', roleLabel: 'Proprietário' }

export const people = [
  { id: 'fs', name: 'Fulano da Silva', initials: 'FS', color: '#e11d2e' },
  { id: 'cs', name: 'Ciclano Souza', initials: 'CS', color: '#e0833a' },
  { id: 'bl', name: 'Beltrano Lima', initials: 'BL', color: '#3a7be0' },
  { id: 'sa', name: 'Sicrano Alves', initials: 'SA', color: '#2e9e6b' },
]

export const artists = [
  { id: 'art1', name: 'Fulano de Tal', initials: 'FT' },
  { id: 'esc', name: 'Escritório', initials: 'EX' },
]

export const initialTasks = [
  { id: 1, title: 'Enviar contrato Casa de Shows A para assinatura', ref: 'Show: Casa de Shows A', artist: 'art1', owner: 'fs', due: day(0), priority: 'alta', status: 'todo' },
  { id: 2, title: 'Aprovar rider técnico da Casa de Shows B', ref: 'Show: Casa de Shows B', artist: 'art1', owner: 'bl', due: day(0), priority: 'alta', status: 'doing' },
  { id: 3, title: 'Fechar hotel da equipe em Curitiba', ref: 'Show: Festival Exemplo', artist: 'art1', owner: 'cs', due: day(2), priority: 'media', status: 'todo' },
  { id: 4, title: 'Enviar release e fotos para a imprensa', ref: 'Evento: Entrevista Rádio Exemplo', artist: 'art1', owner: 'sa', due: day(5), priority: 'media', status: 'todo' },
  { id: 5, title: 'Revisar proposta Festival Modelo', ref: '', artist: 'esc', owner: 'fs', due: day(7), priority: 'baixa', status: 'doing' },
  { id: 6, title: 'Registrar NF do cachê Festival Exemplo', ref: '', artist: 'art1', owner: 'cs', due: day(-6), priority: 'media', status: 'done', doneAt: day(-6) },
  { id: 7, title: 'Confirmar voo da banda BH → CWB', ref: '', artist: 'art1', owner: 'sa', due: day(-7), priority: 'alta', status: 'done', doneAt: day(-7) },
]

// ---- Dashboard (demo) ----
export const kpis = {
  proximoShow: { title: 'Casa de Shows A', date: day(9), city: 'São Paulo · SP' },
  cacheMes: 485000,
  showsMes: 9,
  horasVoo: 38.5,
}
export const receitaMensal = [210, 260, 240, 310, 380, 350, 420, 485].map((v, i) => ({
  label: ['Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out'][i], value: v,
}))
export const showsPorStatus = [
  { label: 'Confirmado', value: 9, color: '#22d3ee' },
  { label: 'Proposta', value: 5, color: '#e11d2e' },
  { label: 'Realizado', value: 14, color: '#6366f1' },
]
export const showsPorDia = [
  { label: 'Seg', value: 1 }, { label: 'Ter', value: 0 }, { label: 'Qua', value: 2 },
  { label: 'Qui', value: 3 }, { label: 'Sex', value: 7 }, { label: 'Sáb', value: 9 }, { label: 'Dom', value: 4 },
]
export const proximosShows = [
  { id: 1, title: 'Casa de Shows A', city: 'São Paulo · SP', date: day(9), status: 'confirmado' },
  { id: 2, title: 'Festival Exemplo', city: 'Curitiba · PR', date: day(3), status: 'confirmado' },
  { id: 3, title: 'Casa de Shows B', city: 'Goiânia · GO', date: day(24), status: 'proposta' },
  { id: 4, title: 'Festival Modelo', city: 'Florianópolis · SC', date: day(40), status: 'proposta' },
]
