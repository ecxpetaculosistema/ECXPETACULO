import { useLayoutEffect, useRef, useState } from 'react'

// Mede a caixa disponível (px) e re-renderiza quando o widget é redimensionado.
export function ChartBox({ children }) {
  const ref = useRef(null)
  const [s, setS] = useState({ w: 0, h: 0 })
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const ro = new ResizeObserver(([e]) => setS({ w: Math.round(e.contentRect.width), h: Math.round(e.contentRect.height) }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return (
    <div ref={ref} className="chart-box">
      <div className="chart-fill">{s.w > 0 && s.h > 0 && children(s.w, s.h)}</div>
    </div>
  )
}

// Gráficos em SVG puro (sem dependências).
export function AreaChart({ data, width, height, color = '#22d3ee' }) {
  const padX = 24, padTop = 14, padBottom = 24
  const max = Math.max(...data.map((d) => d.value)) * 1.15
  const x = (i) => padX + (i * (width - padX * 2)) / (data.length - 1)
  const y = (v) => height - padBottom - (v / max) * (height - padBottom - padTop)
  const pts = data.map((d, i) => [x(i), y(d.value)])
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join(' ')
  const area = `${line} L${x(data.length - 1)},${height - padBottom} L${x(0)},${height - padBottom} Z`
  const every = width < 360 ? 2 : 1
  return (
    <svg width={width} height={height} className="chart" role="img">
      <defs>
        <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity=".35" /><stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3].map((i) => {
        const gy = padTop + (i * (height - padTop - padBottom)) / 3
        return <line key={i} x1={padX} x2={width - padX} y1={gy} y2={gy} className="grid" />
      })}
      <path d={area} fill="url(#ag)" />
      <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
      {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={i === pts.length - 1 ? 5 : 3} fill={color} />)}
      {data.map((d, i) => i % every === 0 && <text key={i} x={x(i)} y={height - 6} textAnchor="middle" className="axis">{d.label}</text>)}
    </svg>
  )
}

export function Donut({ data, width, height }) {
  const total = data.reduce((s, d) => s + d.value, 0)
  const wide = width >= 340
  const size = Math.max(80, Math.min(wide ? height - 8 : height - (data.length * 26 + 12), wide ? width * 0.45 : width - 8, 240))
  const r = 52, c = 2 * Math.PI * r
  let acc = 0
  return (
    <div className="donut" style={{ flexDirection: wide ? 'row' : 'column', height }}>
      <svg viewBox="0 0 140 140" width={size} height={size} style={{ flex: 'none' }}>
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

export function Bars({ data, height }) {
  const max = Math.max(...data.map((d) => d.value)) || 1
  return (
    <div className="bars" style={{ height }}>
      {data.map((d) => (
        <div key={d.label} className="bar-col">
          <div className="bar" style={{ height: `calc((100% - 22px) * ${d.value / max})` }} title={d.value} />
          <span>{d.label}</span>
        </div>
      ))}
    </div>
  )
}
