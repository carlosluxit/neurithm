'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'

interface TrueFocusProps {
  sentence?: string
  separator?: string
  manualMode?: boolean
  blurAmount?: number
  borderColor?: string
  glowColor?: string
  animationDuration?: number
  pauseBetweenAnimations?: number
  className?: string
}

export default function TrueFocus({
  sentence = 'True Focus',
  separator = ' ',
  manualMode = false,
  blurAmount = 5,
  borderColor = 'green',
  glowColor = 'rgba(0, 255, 0, 0.6)',
  animationDuration = 0.5,
  pauseBetweenAnimations = 1,
  className = '',
}: TrueFocusProps) {
  const words = sentence.split(separator)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [lastActiveIndex, setLastActiveIndex] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([])
  const [focusRect, setFocusRect] = useState({ x: 0, y: 0, width: 0, height: 0 })

  useEffect(() => {
    if (!manualMode) {
      const interval = setInterval(
        () => {
          setCurrentIndex(prev => (prev + 1) % words.length)
        },
        (animationDuration + pauseBetweenAnimations) * 1000
      )
      return () => clearInterval(interval)
    }
  }, [manualMode, animationDuration, pauseBetweenAnimations, words.length])

  useEffect(() => {
    if (currentIndex === null || currentIndex === -1) return
    if (!wordRefs.current[currentIndex] || !containerRef.current) return

    const parentRect = containerRef.current.getBoundingClientRect()
    const activeRect = wordRefs.current[currentIndex]!.getBoundingClientRect()

    setFocusRect({
      x: activeRect.left - parentRect.left,
      y: activeRect.top - parentRect.top,
      width: activeRect.width,
      height: activeRect.height,
    })
  }, [currentIndex, words.length])

  const handleMouseEnter = (index: number) => {
    if (manualMode) {
      setLastActiveIndex(index)
      setCurrentIndex(index)
    }
  }

  const handleMouseLeave = () => {
    if (manualMode && lastActiveIndex !== null) {
      setCurrentIndex(lastActiveIndex)
    }
  }

  return (
    <div
      className={`relative flex gap-[0.5em] justify-center items-center flex-wrap select-none ${className}`}
      ref={containerRef}
    >
      {words.map((word, index) => {
        const isActive = index === currentIndex
        return (
          <span
            key={index}
            ref={el => { wordRefs.current[index] = el }}
            className={`relative cursor-pointer ${manualMode ? '' : ''}`}
            style={{
              filter: isActive ? 'blur(0px)' : `blur(${blurAmount}px)`,
              transition: `filter ${animationDuration}s ease`,
            }}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            {word}
          </span>
        )
      })}

      <motion.div
        className="absolute top-0 left-0 pointer-events-none"
        animate={{
          x: focusRect.x,
          y: focusRect.y,
          width: focusRect.width,
          height: focusRect.height,
          opacity: currentIndex >= 0 ? 1 : 0,
        }}
        transition={{ duration: animationDuration }}
        style={{
          boxSizing: 'content-box',
        }}
      >
        {/* Corner brackets */}
        <span
          className="absolute w-4 h-4 rounded-sm"
          style={{
            top: -10, left: -10,
            borderTop: `3px solid ${borderColor}`,
            borderLeft: `3px solid ${borderColor}`,
            filter: `drop-shadow(0 0 4px ${glowColor})`,
          }}
        />
        <span
          className="absolute w-4 h-4 rounded-sm"
          style={{
            top: -10, right: -10,
            borderTop: `3px solid ${borderColor}`,
            borderRight: `3px solid ${borderColor}`,
            filter: `drop-shadow(0 0 4px ${glowColor})`,
          }}
        />
        <span
          className="absolute w-4 h-4 rounded-sm"
          style={{
            bottom: -10, left: -10,
            borderBottom: `3px solid ${borderColor}`,
            borderLeft: `3px solid ${borderColor}`,
            filter: `drop-shadow(0 0 4px ${glowColor})`,
          }}
        />
        <span
          className="absolute w-4 h-4 rounded-sm"
          style={{
            bottom: -10, right: -10,
            borderBottom: `3px solid ${borderColor}`,
            borderRight: `3px solid ${borderColor}`,
            filter: `drop-shadow(0 0 4px ${glowColor})`,
          }}
        />
      </motion.div>
    </div>
  )
}
