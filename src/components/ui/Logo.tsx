export function LogoMark({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="40" height="40" rx="8" fill="white" fillOpacity="0.1" />
      <text
        x="50%"
        y="54%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontFamily="var(--font-heading), 'Space Grotesk', sans-serif"
        fontWeight="700"
        fontSize="22"
      >
        <tspan fill="#e8e6f0">L</tspan>
      </text>
    </svg>
  )
}

export function LogoFull({ className = 'h-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <text
        x="0"
        y="30"
        fontFamily="var(--font-heading), 'Space Grotesk', sans-serif"
        fontWeight="700"
        fontSize="32"
        letterSpacing="-0.5"
      >
        <tspan fill="#e8e6f0">lux</tspan>
        <tspan fill="#7088ab">it</tspan>
      </text>
    </svg>
  )
}
