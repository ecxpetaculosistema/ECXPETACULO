// Dados de demonstração. Serão substituídos por consultas ao Supabase.
const day = (n) => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

export const currentUser = { name: 'Rafael Monteiro', role: 'admin', roleLabel: 'Proprietário' }

export const people = [
  { id: 'rm', name: 'Rafael Monteiro', initials: 'RM', color: '#e11d2e' },
  { id: 'br', name: 'Bianca Rocha', initials: 'BR', color: '#e0833a' },
  { id: 'hd', name: 'Henrique Dias', initials: 'HD', color: '#3a7be0' },
  { id: 'mv', name: 'Marina Vaz', initials: 'MV', color: '#2e9e6b' },
]

export const artists = [
  { id: 'koda', name: 'Koda', initials: 'K' },
  { id: 'esc', name: 'Escritório', initials: 'NC' },
]

export const initialTasks = [
  { id: 1, title: 'Enviar contrato Arena Hall para assinatura', ref: 'Show: Arena Hall', artist: 'koda', owner: 'rm', due: day(0), priority: 'alta', status: 'todo' },
  { id: 2, title: 'Aprovar rider técnico do Vila Country', ref: 'Show: Vila Country', artist: 'koda', owner: 'hd', due: day(0), priority: 'alta', status: 'doing' },
  { id: 3, title: 'Fechar hotel da equipe em Curitiba', ref: 'Show: Festival Primavera', artist: 'koda', owner: 'br', due: day(2), priority: 'media', status: 'todo' },
  { id: 4, title: 'Enviar release e fotos para a imprensa', ref: 'Evento: Entrevista Rádio Mix', artist: 'koda', owner: 'mv', due: day(5), priority: 'media', status: 'todo' },
  { id: 5, title: 'Revisar proposta Sunset Beach Fest', ref: '', artist: 'esc', owner: 'rm', due: day(7), priority: 'baixa', status: 'doing' },
  { id: 6, title: 'Registrar NF do cachê Festival Primavera', ref: '', artist: 'koda', owner: 'br', due: day(-6), priority: 'media', status: 'done', doneAt: day(-6) },
  { id: 7, title: 'Confirmar voo da banda BH → CWB', ref: '', artist: 'koda', owner: 'mv', due: day(-7), priority: 'alta', status: 'done', doneAt: day(-7) },
]

// ---- Dashboard (demo) ----
export const kpis = {
  proximoShow: { title: 'Arena Hall', date: day(9), city: 'São Paulo · SP' },
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
  { id: 1, title: 'Arena Hall', city: 'São Paulo · SP', date: day(9), status: 'confirmado' },
  { id: 2, title: 'Festival Primavera', city: 'Curitiba · PR', date: day(3), status: 'confirmado' },
  { id: 3, title: 'Vila Country', city: 'Goiânia · GO', date: day(24), status: 'proposta' },
  { id: 4, title: 'Sunset Beach Fest', city: 'Florianópolis · SC', date: day(40), status: 'proposta' },
]
