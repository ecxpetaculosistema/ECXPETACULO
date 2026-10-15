// Gráficos em SVG puro (sem dependências).
export function AreaChart({ data, color = '#22d3ee', height = 180 }) {
  const w = 560, pad = 24
  const max = Math.max(...data.map((d) => d.value)) * 1.15
  const x = (i) => pad + (i * (w - pad * 2)) / (data.length - 1)
  const y = (v) => height - pad - (v / max) * (height - pad * 2)
  const pts = data.map((d, i) => [x(i), y(d.value)])
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join(' ')
  const area = `${line} L${x(data.length - 1)},${height - pad} L${x(0)},${height - pad} Z`
  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="chart" role="img">
      <defs>
        <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity=".35" /><stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3].map((i) => <line key={i} x1={pad} x2={w - pad} y1={pad + (i * (height - pad * 2)) / 3} y2={pad + (i * (height - pad * 2)) / 3} className="grid" />)}
      <path d={area} fill="url(#ag)" />
      <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
      {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={i === pts.length - 1 ? 5 : 3} fill={color} />)}
      {data.map((d, i) => <text key={i} x={x(i)} y={height - 6} textAnchor="middle" className="axis">{d.label}</text>)}
    </svg>
  )
}

export function Donut({ data, size = 150 }) {
  const total = data.reduce((s, d) => s + d.value, 0)
  const r = 52, c = 2 * Math.PI * r
  let acc = 0
  return (
    <div className="donut">
      <svg viewBox="0 0 140 140" width={size} height={size}>
        <circle cx="70" cy="70" r={r} fill="none" stroke="var(--surface-2)" strokeWidth="16" />
        {data.map((d) => {
          const len = (d.value / total) * c
          const el = (
            <circle key={d.label} cx="70" cy="70" r={r} fill="none" stroke={d.color} strokeWidth="16"
              strokeDasharray={`${Math.max(len - 3, 0)} ${c}`} strokeDashoffset={-acc} transform="rotate(-90 70 70)" strokeLinecap="butt" />
          )
          acc += len
          return el
        })}
        <text x="70" y="68" textAnchor="middle" className="donut-n">{total}</text>
        <text x="70" y="86" textAnchor="middle" className="axis">shows</text>
      </svg>
      <ul className="legend">
        {data.map((d) => <li key={d.label}><i style={{ background: d.color }} />{d.label}<b>{d.value}</b></li>)}
      </ul>
    </div>
  )
}

export function Bars({ data, height = 150 }) {
  const max = Math.max(...data.map((d) => d.value)) || 1
  return (
    <div className="bars" style={{ height }}>
      {data.map((d) => (
        <div key={d.label} className="bar-col">
          <div className="bar" style={{ height: `${(d.value / max) * 100}%` }} title={d.value} />
          <span>{d.label}</span>
        </div>
      ))}
    </div>
  )
}
