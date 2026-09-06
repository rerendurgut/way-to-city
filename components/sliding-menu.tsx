'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'

export type SlidingMenuItem = {
  id: string
  title: string
  subtitle?: string
  badge?: string
  href: string
  icon?: React.ReactNode
  isActive?: boolean
}

interface SlidingMenuProps {
  items: SlidingMenuItem[]
  variant?: 'card' | 'pill'
  emptyText?: string
}

export function SlidingMenu({
  items,
  variant = 'card',
  emptyText = 'No items found.',
}: SlidingMenuProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeftState, setScrollLeftState] = useState(0)

  const updateScrollButtons = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    setCanScrollLeft(scrollLeft > 5)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5)
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    updateScrollButtons()
    el.addEventListener('scroll', updateScrollButtons, { passive: true })
    window.addEventListener('resize', updateScrollButtons)

    return () => {
      el.removeEventListener('scroll', updateScrollButtons)
      window.removeEventListener('resize', updateScrollButtons)
    }
  }, [items, updateScrollButtons])

  const scroll = (direction: 'left' | 'right') => {
    const el = containerRef.current
    if (!el) return
    const scrollAmount = el.clientWidth * 0.75
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  // Mouse Drag to Scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = containerRef.current
    if (!el) return
    setIsDragging(true)
    setStartX(e.pageX - el.offsetLeft)
    setScrollLeftState(el.scrollLeft)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()
    const el = containerRef.current
    if (!el) return
    const x = e.pageX - el.offsetLeft
    const walk = (x - startX) * 1.5
    el.scrollLeft = scrollLeftState - walk
  }

  if (items.length === 0) {
    return (
      <p className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
        {emptyText}
      </p>
    )
  }

  return (
    <div className="relative group/sliding-menu">
      {/* Left Navigation Arrow */}
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scroll('left')}
          aria-label="Scroll left"
          className="absolute -left-3 top-1/2 z-20 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-md backdrop-blur-sm transition-all hover:bg-accent hover:scale-105 active:scale-95"
        >
          <ChevronLeft className="size-5" />
        </button>
      )}

      {/* Right Navigation Arrow */}
      {canScrollRight && (
        <button
          type="button"
          onClick={() => scroll('right')}
          aria-label="Scroll right"
          className="absolute -right-3 top-1/2 z-20 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-md backdrop-blur-sm transition-all hover:bg-accent hover:scale-105 active:scale-95"
        >
          <ChevronRight className="size-5" />
        </button>
      )}

      {/* Scrollable Track */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`flex gap-4 overflow-x-auto py-2 px-1 scroll-smooth select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {items.map((item) => {
          if (variant === 'pill') {
            return (
              <Link
                key={item.id}
                href={item.href}
                draggable={false}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                  item.isActive
                    ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                    : 'border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground hover:bg-accent'
                }`}
              >
                {item.icon}
                <span>{item.title}</span>
                {item.badge && (
                  <span className="font-mono text-xs opacity-75">
                    ({item.badge})
                  </span>
                )}
              </Link>
            )
          }

          // Default Card variant
          return (
            <Link
              key={item.id}
              href={item.href}
              draggable={false}
              className={`group flex min-w-[240px] max-w-[300px] shrink-0 flex-col justify-between rounded-xl border p-5 transition-all ${
                item.isActive
                  ? 'border-primary bg-accent/60 shadow-md'
                  : 'border-border bg-card hover:border-primary/50 hover:bg-accent/40 hover:shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {item.icon && (
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-soft text-primary">
                        {item.icon}
                      </span>
                    )}
                    <span className="text-base font-medium text-foreground group-hover:text-primary transition-colors">
                      {item.title}
                    </span>
                  </div>
                  <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-all group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                {item.subtitle && (
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                    {item.subtitle}
                  </p>
                )}
              </div>

              {item.badge && (
                <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
                  <span className="font-mono">{item.badge}</span>
                </div>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
