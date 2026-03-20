'use client'

import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { motion } from 'motion/react';

interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: 'start' | 'end' | 'center';
  characters?: string;
  className?: string;
  encryptedClassName?: string;
  parentClassName?: string;
  animateOn?: 'view' | 'hover';
}

export default function DecryptedText({
  text,
  speed = 50,
  maxIterations = 10,
  sequential = false,
  revealDirection = 'start',
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()',
  className = '',
  parentClassName = '',
  encryptedClassName = '',
  animateOn = 'view',
}: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState<string>(text);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
  const [hasAnimated, setHasAnimated] = useState<boolean>(false);
  const [isDecrypted, setIsDecrypted] = useState<boolean>(true);
  const containerRef = useRef<HTMLSpanElement>(null);

  const availableChars = useMemo<string[]>(() => characters.split(''), [characters]);

  const shuffleText = useCallback(
    (originalText: string, currentRevealed: Set<number>) => {
      return originalText
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' ';
          if (currentRevealed.has(i)) return originalText[i];
          return availableChars[Math.floor(Math.random() * availableChars.length)];
        })
        .join('');
    },
    [availableChars]
  );

  const triggerDecrypt = useCallback(() => {
    setRevealedIndices(new Set());
    setIsAnimating(true);
  }, []);

  useEffect(() => {
    if (!isAnimating) return;
    let currentIteration = 0;

    const getNextIndex = (revealedSet: Set<number>): number => {
      switch (revealDirection) {
        case 'start': return revealedSet.size;
        case 'end': return text.length - 1 - revealedSet.size;
        default: return revealedSet.size;
      }
    };

    const interval = setInterval(() => {
      setRevealedIndices(prev => {
        if (sequential) {
          if (prev.size < text.length) {
            const nextIndex = getNextIndex(prev);
            const newRevealed = new Set(prev);
            newRevealed.add(nextIndex);
            setDisplayText(shuffleText(text, newRevealed));
            return newRevealed;
          } else {
            clearInterval(interval);
            setIsAnimating(false);
            setIsDecrypted(true);
            return prev;
          }
        } else {
          setDisplayText(shuffleText(text, prev));
          currentIteration++;
          if (currentIteration >= maxIterations) {
            clearInterval(interval);
            setIsAnimating(false);
            setDisplayText(text);
            setIsDecrypted(true);
          }
          return prev;
        }
      });
    }, speed);
    return () => clearInterval(interval);
  }, [isAnimating, text, speed, maxIterations, sequential, revealDirection, shuffleText]);

  const triggerHoverDecrypt = useCallback(() => {
    if (isAnimating) return;
    setRevealedIndices(new Set());
    setIsDecrypted(false);
    setDisplayText(text);
    setIsAnimating(true);
  }, [isAnimating, text]);

  const resetToPlainText = useCallback(() => {
    setIsAnimating(false);
    setRevealedIndices(new Set());
    setDisplayText(text);
    setIsDecrypted(true);
  }, [text]);

  useEffect(() => {
    if (animateOn !== 'view') return;
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          triggerDecrypt();
          setHasAnimated(true);
        }
      });
    };
    const observer = new IntersectionObserver(observerCallback, { threshold: 0.1 });
    const currentRef = containerRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => { if (currentRef) observer.unobserve(currentRef); };
  }, [animateOn, hasAnimated, triggerDecrypt]);

  const animateProps =
    animateOn === 'hover'
      ? { onMouseEnter: triggerHoverDecrypt, onMouseLeave: resetToPlainText }
      : {};

  return (
    <motion.span
      ref={containerRef}
      className={`inline-block whitespace-pre-wrap ${parentClassName}`}
      {...animateProps}
    >
      <span className="sr-only">{displayText}</span>
      <span aria-hidden="true">
        {displayText.split('').map((char, index) => {
          const isRevealedOrDone = revealedIndices.has(index) || (!isAnimating && isDecrypted);
          return (
            <span key={index} className={isRevealedOrDone ? className : encryptedClassName}>
              {char}
            </span>
          );
        })}
      </span>
    </motion.span>
  );
}
