// Logo oficial em public/logo.png (fundo transparente, letras claras para o tema escuro).
export default function Logo({ height = 20 }) {
  return <img src="/logo.png" alt="ECXPETACULO" height={height} className="logo" />
}
