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
