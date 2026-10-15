// `roles` define quem vê o item no menu. A proteção real fica nas políticas RLS do banco.
export const nav = [
  {
    section: null,
    items: [
      { path: '/dashboard', label: 'Dashboard', icon: '▦', roles: ['admin', 'producao'] },
      { path: '/central', label: 'Minha central', icon: '◉', roles: ['admin', 'producao', 'piloto'] },
      { path: '/artistas', label: 'Artistas', icon: '♪', roles: ['admin', 'producao'] },
      { path: '/tarefas', label: 'Tarefas', icon: '☑', roles: ['admin', 'producao'] },
    ],
  },
  {
    section: 'Operação',
    items: [
      { path: '/agenda', label: 'Agenda', icon: '▤', roles: ['admin', 'producao'] },
      { path: '/shows', label: 'Shows', icon: '★', roles: ['admin', 'producao'] },
      { path: '/rider', label: 'Rider e equipe', icon: '≡', roles: ['admin', 'producao'] },
      { path: '/logistica', label: 'Logística', icon: '➜', roles: ['admin', 'producao'] },
    ],
  },
  {
    section: 'Aviação',
    items: [
      { path: '/voos', label: 'Voos', icon: '✈', roles: ['admin', 'piloto'] },
      { path: '/aeronave', label: 'Aeronave e checklist', icon: '⚙', roles: ['admin', 'piloto'] },
      { path: '/custos-aviao', label: 'Custos do avião', icon: '◈', roles: ['admin'] },
    ],
  },
  {
    section: 'Comercial e financeiro',
    items: [
      { path: '/contratantes', label: 'Contratantes', icon: '⚑', roles: ['admin', 'producao'] },
      { path: '/financeiro', label: 'Financeiro', icon: '¤', roles: ['admin'] },
    ],
  },
]
