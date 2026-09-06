'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'

export type SlidingMenuItem = {
  id: string
  title: string
  subtitle?: string
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
      <div className="rounded-2xl border border-border bg-card/50 p-8 text-center backdrop-blur-sm shadow-sm">
        <p className="text-sm font-medium text-muted-foreground">{emptyText}</p>
      </div>
    )
  }

  return (
    <div className="relative group/sliding-menu py-1">
      {/* Left Navigation Arrow */}
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scroll('left')}
          aria-label="Scroll left"
          className="absolute -left-3 top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border/80 bg-background/95 text-foreground shadow-md backdrop-blur-md transition-all hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/50 hover:scale-110 active:scale-95"
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
          className="absolute -right-3 top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border/80 bg-background/95 text-foreground shadow-md backdrop-blur-md transition-all hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/50 hover:scale-110 active:scale-95"
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
        className={`flex gap-4 overflow-x-auto py-3 px-1 scroll-smooth select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
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
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                  item.isActive
                    ? 'border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'border-border bg-card/80 text-muted-foreground hover:border-emerald-500/40 hover:text-foreground hover:bg-accent'
                }`}
              >
                {item.icon}
                <span>{item.title}</span>
              </Link>
            )
          }

          // Default Card variant
          return (
            <Link
              key={item.id}
              href={item.href}
              draggable={false}
              className={`group relative flex min-w-[260px] max-w-[320px] shrink-0 flex-col justify-between rounded-2xl border p-6 transition-all duration-300 ${
                item.isActive
                  ? 'border-emerald-500/60 bg-card shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-500/20'
                  : 'border-border/80 bg-card hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/5'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    {item.icon && (
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                        {item.icon}
                      </span>
                    )}
                    <span className="text-lg font-semibold tracking-tight text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {item.title}
                    </span>
                  </div>
                </div>

                {item.subtitle && (
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground/90 line-clamp-2 font-normal">
                    {item.subtitle}
                  </p>
                )}
              </div>

              <div className="mt-6 flex items-center justify-between pt-4 border-t border-border/40">
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform duration-200">
                  Explore guide
                </span>
                <span className="flex size-7 items-center justify-center rounded-full bg-accent text-muted-foreground group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                  <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
