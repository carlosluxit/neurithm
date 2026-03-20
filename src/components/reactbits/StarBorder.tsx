import { type ComponentPropsWithoutRef, type ElementType, type ReactNode } from 'react'

type StarBorderProps<T extends ElementType = 'button'> = {
  as?: T
  className?: string
  color?: string
  speed?: string
  thickness?: number
  children?: ReactNode
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className' | 'color' | 'children'>

export default function StarBorder<T extends ElementType = 'button'>({
  as,
  className = '',
  color = '#9b7fff',
  speed = '6s',
  thickness = 1,
  children,
  ...rest
}: StarBorderProps<T>) {
  const Component = as || 'button'

  return (
    <Component
      className={`star-border-container ${className}`}
      style={{
        padding: `${thickness}px 0`,
        ...(rest as Record<string, unknown>).style,
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
