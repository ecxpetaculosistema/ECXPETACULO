# ECXPETACULO

Sistema de gestão de shows para artistas: agenda, financeiro, contratantes, rider/equipe/logística e
operação de aviação (voos, custos, checklist), com login por perfil (admin, produção, piloto).

Stack: React + Vite + Supabase.

## Rodar localmente

```bash
npm install
cp .env.example .env   # preencha com as credenciais do Supabase
npm run dev
```

Sem credenciais o app abre em modo demonstração, com dados de exemplo (`src/data.js`).

## Supabase

1. Crie um projeto em supabase.com.
2. **SQL Editor → New query**: cole `supabase/schema.sql` e rode.
3. **Authentication → Users**: crie os usuários e, na tabela `profiles`, defina o `role` de cada um
   (`admin`, `producao` ou `piloto`).
4. Copie a Project URL e a Publishable key para o `.env`.

## Estado atual

- [x] Layout base (menu lateral por seção, topo, Tarefas com Lista/Kanban/Calendário)
- [x] Esquema do banco com permissões por perfil
- [ ] Login com Supabase Auth e menu por perfil
- [ ] Shows, Agenda, Contratantes
- [ ] Financeiro
- [ ] Rider, equipe e logística
- [ ] Aviação: voos, custos, checklist e área do piloto
