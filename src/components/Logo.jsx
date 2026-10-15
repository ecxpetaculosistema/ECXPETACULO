// Aproximação em SVG do logotipo. Para usar o arquivo oficial, coloque-o em public/logo.svg (ou .png)
// e troque este componente por <img src="/logo.svg" alt="ECXPETACULO" />.
export default function Logo({ height = 22 }) {
  return (
    <svg viewBox="0 0 330 44" height={height} role="img" aria-label="ECXPETACULO" className="logo">
      <path d="M118 12 Q150 -2 178 4" fill="none" stroke="#e11d2e" strokeWidth="3" strokeLinecap="round" />
      <text x="0" y="36" fontSize="34" fontWeight="200" letterSpacing="3" fill="currentColor"
            fontFamily="'Century Gothic','Avenir Next',Futura,system-ui,sans-serif">
        EC<tspan fill="#e11d2e" fontWeight="800">X</tspan>PETACULO
      </text>
    </svg>
  )
}
