import { AreaChart, Bars, Donut } from '../components/Charts.jsx'
import { kpis, proximosShows, receitaMensal, showsPorDia, showsPorStatus } from '../data.js'

const brl = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
const fmt = (iso) => iso.split('-').reverse().slice(0, 2).join('/')

export default function Dashboard() {
  return (
    <>
      <div className="page-head row">
        <h1 className="page-title">Dashboard</h1>
        <span className="muted-sm">Visão geral · demonstração</span>
      </div>

      <div className="kpis">
        <div className="kpi grad-red">
          <small>Próximo show</small>
          <strong>{kpis.proximoShow.title}</strong>
          <span>{fmt(kpis.proximoShow.date)} · {kpis.proximoShow.city}</span>
        </div>
        <div className="kpi grad-cyan">
          <small>Cachê confirmado no mês</small>
          <strong>{brl(kpis.cacheMes)}</strong>
          <span>+14% vs. mês anterior</span>
        </div>
        <div className="kpi">
          <small>Shows no mês</small>
          <strong>{kpis.showsMes}</strong>
          <span>3 a confirmar</span>
        </div>
        <div className="kpi">
          <small>Horas de voo no mês</small>
          <strong>{kpis.horasVoo} h</strong>
          <span>6 voos realizados</span>
        </div>
      </div>

      <div className="grid-2">
        <section className="panel">
          <h3>Receita de cachês (mil R$)</h3>
          <AreaChart data={receitaMensal} />
        </section>
        <section className="panel">
          <h3>Shows por status</h3>
          <Donut data={showsPorStatus} />
        </section>
        <section className="panel">
          <h3>Shows por dia da semana</h3>
          <Bars data={showsPorDia} />
        </section>
        <section className="panel">
          <h3>Próximos shows</h3>
          <ul className="upcoming">
            {proximosShows.map((s) => (
              <li key={s.id}>
                <div className="date">{fmt(s.date)}</div>
                <div><b>{s.title}</b><small>{s.city}</small></div>
                <span className={'badge ' + s.status}>{s.status}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}
