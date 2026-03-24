import { type CSSProperties, type ElementType, type ReactNode } from 'react'

type StarBorderProps = {
  as?: ElementType
  className?: string
  color?: string
  speed?: string
  thickness?: number
  children?: ReactNode
  style?: CSSProperties
  [key: string]: unknown
}

export default function StarBorder({
  as,
  className = '',
  color = '#52B5F7',
  speed = '6s',
  thickness = 1,
  children,
  style,
  ...rest
}: StarBorderProps) {
  const Component = as || 'button'

  return (
    <Component
      className={`star-border-container ${className}`}
      style={{
        padding: `${thickness}px 0`,
        ...style,
      }}
      {...rest}
    >
      <div
        className="border-gradient-bottom"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      />
      <div
        className="border-gradient-top"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      />
      <div className="star-border-inner">{children}</div>
    </Component>
  )
}
