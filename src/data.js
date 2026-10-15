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

// ---- Agenda (demo, dados fictícios) ----
export const agendaShows = [
  {
    id: 'a1', date: day(-12), city: 'Campinas', uf: 'SP', event: 'Festival Exemplo', status: 'realizado',
    obs: 'Show encerrado. Pendente envio da NF.',
    horarios: { chegada: '14:00', passagem: '16:00', show: '22:30' },
    local: { nome: 'Parque de Eventos Exemplo', endereco: 'Av. Exemplo, 1000 - Centro, Campinas - SP' },
    hotelArtista: { nome: 'Hotel Modelo', endereco: 'Rua das Flores, 120 - Centro, Campinas - SP' },
    hotelBanda: { nome: 'Hotel Modelo', endereco: 'Rua das Flores, 120 - Centro, Campinas - SP' },
    contratante: { nome: 'Produtora Exemplo Ltda', telefone: '(19) 90000-0001' },
    responsaveis: [{ nome: 'Ciclano Souza', funcao: 'Produtor local', telefone: '(19) 90000-0002' }],
  },
  {
    id: 'a2', date: day(3), city: 'Curitiba', uf: 'PR', event: 'Festival Exemplo', status: 'confirmado',
    obs: 'Voo fretado. Camarim para 8 pessoas.',
    horarios: { chegada: '15:00', passagem: '17:00', show: '23:00' },
    local: { nome: 'Pedreira Exemplo', endereco: 'Rua Modelo, 500 - Pilarzinho, Curitiba - PR' },
    hotelArtista: { nome: 'Grand Hotel Exemplo', endereco: 'Av. Central, 800 - Batel, Curitiba - PR' },
    hotelBanda: { nome: 'Hotel Centro Exemplo', endereco: 'Rua XV, 45 - Centro, Curitiba - PR' },
    contratante: { nome: 'Fulano da Silva', telefone: '(41) 90000-0003' },
    responsaveis: [
      { nome: 'Beltrano Lima', funcao: 'Produtor local', telefone: '(41) 90000-0004' },
      { nome: 'Sicrano Alves', funcao: 'Segurança / acessos', telefone: '(41) 90000-0005' },
    ],
  },
  {
    id: 'a3', date: day(9), city: 'São Paulo', uf: 'SP', event: 'Casa de Shows A', status: 'confirmado',
    obs: 'Contrato enviado, aguardando assinatura.',
    horarios: { chegada: '16:00', passagem: '18:00', show: '22:00' },
    local: { nome: 'Casa de Shows A', endereco: 'Av. Paulista, 1500 - Bela Vista, São Paulo - SP' },
    hotelArtista: { nome: 'Hotel Paulista Exemplo', endereco: 'Rua Augusta, 900 - Consolação, São Paulo - SP' },
    hotelBanda: { nome: 'Hotel Paulista Exemplo', endereco: 'Rua Augusta, 900 - Consolação, São Paulo - SP' },
    contratante: { nome: 'Empresa Exemplo S.A.', telefone: '(11) 90000-0006' },
    responsaveis: [{ nome: 'Ciclano Souza', funcao: 'Gerente da casa', telefone: '(11) 90000-0007' }],
  },
  {
    id: 'a4', tipo: 'evento', date: day(16), city: 'Belo Horizonte', uf: 'MG', event: 'Evento Corporativo Modelo', status: 'confirmado',
    obs: 'Show de 1h30. Evento fechado, sem divulgação.',
    horarios: { chegada: '17:00', passagem: '19:00', show: '21:30' },
    local: { nome: 'Centro de Convenções Exemplo', endereco: 'Av. Afonso Pena, 2000 - Funcionários, Belo Horizonte - MG' },
    hotelArtista: { nome: 'Hotel Savassi Exemplo', endereco: 'Rua Pernambuco, 300 - Savassi, Belo Horizonte - MG' },
    hotelBanda: { nome: 'Hotel Savassi Exemplo', endereco: 'Rua Pernambuco, 300 - Savassi, Belo Horizonte - MG' },
    contratante: { nome: 'Beltrano Lima', telefone: '(31) 90000-0008' },
    responsaveis: [{ nome: 'Fulano da Silva', funcao: 'Cerimonial', telefone: '(31) 90000-0009' }],
  },
  {
    id: 'a5', date: day(24), city: 'Goiânia', uf: 'GO', event: 'Casa de Shows B', status: 'proposta',
    obs: 'Aguardando retorno da proposta.',
    horarios: { chegada: '', passagem: '', show: '' },
    local: { nome: 'Casa de Shows B', endereco: 'Rua 10, 200 - Setor Oeste, Goiânia - GO' },
    hotelArtista: { nome: '', endereco: '' },
    hotelBanda: { nome: '', endereco: '' },
    contratante: { nome: 'Sicrano Alves', telefone: '(62) 90000-0010' },
    responsaveis: [],
  },
  {
    id: 'a6', date: day(40), city: 'Florianópolis', uf: 'SC', event: 'Festival Modelo', status: 'proposta',
    obs: 'Cachê em negociação.',
    horarios: { chegada: '', passagem: '', show: '' },
    local: { nome: 'Arena Praia Exemplo', endereco: 'Av. Beira Mar, 700 - Jurerê, Florianópolis - SC' },
    hotelArtista: { nome: '', endereco: '' },
    hotelBanda: { nome: '', endereco: '' },
    contratante: { nome: 'Produtora Modelo', telefone: '(48) 90000-0011' },
    responsaveis: [],
  },
  {
    id: 'a7', tipo: 'evento', date: day(6), city: 'Ribeirão Preto', uf: 'SP', event: 'Jantar Beneficente Exemplo', status: 'confirmado',
    obs: 'Apresentação curta, formato acústico.',
    horarios: { chegada: '18:00', passagem: '19:00', show: '21:00' },
    local: { nome: 'Clube Exemplo', endereco: 'Av. Modelo, 300 - Centro, Ribeirão Preto - SP' },
    hotelArtista: { nome: 'Hotel Modelo', endereco: 'Rua Central, 50 - Centro, Ribeirão Preto - SP' },
    hotelBanda: { nome: 'Hotel Modelo', endereco: 'Rua Central, 50 - Centro, Ribeirão Preto - SP' },
    contratante: { nome: 'Ciclano Souza', telefone: '(16) 90000-0012' },
    responsaveis: [{ nome: 'Sicrano Alves', funcao: 'Cerimonial', telefone: '(16) 90000-0013' }],
  },
]

// ---- Voos / missões (demo) ----
export const initialMissions = [
  {
    id: 'm1', tipo: 'show', showId: 'a2', motivo: '', data: day(3),
    decola: { sigla: 'SBSP', hora: '13:00' }, pousa: { sigla: 'SBCT', hora: '14:20' },
    respDecola: { nome: 'Ciclano Souza', telefone: '(11) 90000-0101' }, respPousa: { nome: 'Beltrano Lima', telefone: '(41) 90000-0102' },
    hangar: true, patio: false, pernoite: true, valor: '38500', obs: 'Abastecimento em Curitiba antes da decolagem de volta.',
  },
  {
    id: 'm2', tipo: 'show', showId: 'a3', motivo: '', data: day(9),
    decola: { sigla: 'SBGR', hora: '15:30' }, pousa: { sigla: 'SBMT', hora: '16:10' },
    respDecola: { nome: 'Sicrano Alves', telefone: '(11) 90000-0103' }, respPousa: { nome: 'Fulano da Silva', telefone: '(11) 90000-0104' },
    hangar: false, patio: true, pernoite: false, valor: '12800', obs: '',
  },
  {
    id: 'm3', tipo: 'privado', showId: '', motivo: 'Traslado do artista – compromisso particular', data: day(12),
    decola: { sigla: 'SBMT', hora: '09:00' }, pousa: { sigla: 'SBRP', hora: '09:55' },
    respDecola: { nome: 'Fulano da Silva', telefone: '(11) 90000-0105' }, respPousa: { nome: 'Ciclano Souza', telefone: '(16) 90000-0106' },
    hangar: true, patio: false, pernoite: false, valor: '9600', obs: 'Retorno no mesmo dia.',
  },
  {
    id: 'm4', tipo: 'extra', showId: '', motivo: 'Reposicionamento da aeronave', data: day(20),
    decola: { sigla: 'SBRP', hora: '08:00' }, pousa: { sigla: 'SBSP', hora: '08:50' },
    respDecola: { nome: '', telefone: '' }, respPousa: { nome: '', telefone: '' },
    hangar: false, patio: false, pernoite: false, valor: '4200', obs: '',
  },
]
