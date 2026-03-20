// Abstract SVG shape icons — stroke-only geometric designs

interface ShapeProps {
  className?: string
}

// === SERVICES ===

export function ShapeStrategy({ className = 'w-8 h-8' }: ShapeProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="16" cy="16" r="10" />
      <circle cx="16" cy="16" r="5" />
      <circle cx="16" cy="16" r="1.5" />
      <line x1="6" y1="6" x2="26" y2="26" />
    </svg>
  )
}

export function ShapeAgent({ className = 'w-8 h-8' }: ShapeProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="16,3 27.5,9.5 27.5,22.5 16,29 4.5,22.5 4.5,9.5" />
      <circle cx="16" cy="10" r="1.5" />
      <circle cx="10" cy="20" r="1.5" />
      <circle cx="22" cy="20" r="1.5" />
      <line x1="16" y1="11.5" x2="10" y2="18.5" />
      <line x1="16" y1="11.5" x2="22" y2="18.5" />
      <line x1="11.5" y1="20" x2="20.5" y2="20" />
    </svg>
  )
}

export function ShapeAutomation({ className = 'w-8 h-8' }: ShapeProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="4" y="6" width="10" height="8" rx="2" />
      <rect x="18" y="18" width="10" height="8" rx="2" />
      <path d="M14 10 C20 10, 12 22, 18 22" />
    </svg>
  )
}

export function ShapeEnablement({ className = 'w-8 h-8' }: ShapeProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="8,24 16,18 24,24" />
      <polyline points="8,18 16,12 24,18" />
      <polyline points="8,12 16,6 24,12" />
    </svg>
  )
}

// === INDUSTRIES ===

export function ShapeHealthcare({ className = 'w-8 h-8' }: ShapeProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="16" cy="10" r="2.5" />
      <circle cx="10" cy="22" r="2.5" />
      <circle cx="22" cy="22" r="2.5" />
      <circle cx="16" cy="16" r="2.5" />
    </svg>
  )
}

export function ShapeFinance({ className = 'w-8 h-8' }: ShapeProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="6" y1="26" x2="6" y2="18" />
      <line x1="12" y1="26" x2="12" y2="14" />
      <line x1="18" y1="26" x2="18" y2="10" />
      <line x1="24" y1="26" x2="24" y2="6" />
      <path d="M6 18 C10 12, 18 14, 24 6" />
    </svg>
  )
}

export function ShapeRealEstate({ className = 'w-8 h-8' }: ShapeProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="4,18 16,6 28,18" />
      <line x1="8" y1="15" x2="8" y2="26" />
      <line x1="24" y1="15" x2="24" y2="26" />
      <line x1="8" y1="26" x2="24" y2="26" />
    </svg>
  )
}

export function ShapeEcommerce({ className = 'w-8 h-8' }: ShapeProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="16" r="7" />
      <circle cx="20" cy="16" r="7" />
    </svg>
  )
}

export function ShapeLegal({ className = 'w-8 h-8' }: ShapeProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="10,22 6,8 14,8" />
      <polygon points="22,22 18,8 26,8" />
      <line x1="4" y1="22" x2="28" y2="22" />
    </svg>
  )
}

export function ShapeManufacturing({ className = 'w-8 h-8' }: ShapeProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="13" r="5" />
      <circle cx="21" cy="19" r="5" />
      <path d="M15 10.5 C17 12, 17 16, 17 16.5" />
    </svg>
  )
}

export function ShapeProfessional({ className = 'w-8 h-8' }: ShapeProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="6" y1="8" x2="20" y2="8" />
      <line x1="8" y1="13" x2="22" y2="13" />
      <line x1="10" y1="18" x2="24" y2="18" />
      <line x1="12" y1="23" x2="26" y2="23" />
    </svg>
  )
}

export function ShapeTechnology({ className = 'w-8 h-8' }: ShapeProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="8,10 4,16 8,22" />
      <polyline points="24,10 28,16 24,22" />
      <circle cx="16" cy="16" r="2" />
    </svg>
  )
}

// === PROCESS ===

export function ShapeDiscovery({ className = 'w-8 h-8' }: ShapeProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="16" cy="16" r="10" />
      <line x1="26" y1="16" x2="30" y2="6" />
    </svg>
  )
}

export function ShapeCompass({ className = 'w-8 h-8' }: ShapeProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="16" y1="2" x2="16" y2="8" />
      <line x1="16" y1="24" x2="16" y2="30" />
      <line x1="2" y1="16" x2="8" y2="16" />
      <line x1="24" y1="16" x2="30" y2="16" />
      <polygon points="16,10 19,16 16,22 13,16" />
    </svg>
  )
}

export function ShapeImplementation({ className = 'w-8 h-8' }: ShapeProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="6" y1="10" x2="14" y2="10" />
      <line x1="6" y1="16" x2="20" y2="16" />
      <line x1="6" y1="22" x2="26" y2="22" />
    </svg>
  )
}

export function ShapeScaling({ className = 'w-8 h-8' }: ShapeProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 26 C8 24, 12 22, 16 16 C20 10, 24 6, 28 4" />
      <polyline points="22,4 28,4 28,10" />
    </svg>
  )
}
