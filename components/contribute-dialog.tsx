'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { PlusCircle, Send, CheckCircle2, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export function ContributeDialog({
  defaultCountry = '',
  defaultCity = '',
}: {
  defaultCountry?: string
  defaultCity?: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [category, setCategory] = useState<string>('poi')
  const [country, setCountry] = useState(defaultCountry)
  const [city, setCity] = useState(defaultCity)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [link, setLink] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!country || !city || !title) return

    setIsSubmitting(true)
    try {
      const { error } = await supabase.from('submissions').insert([
        {
          category,
          country,
          city,
          title,
          description,
          link,
          status: 'pending',
        },
      ])

      if (error) throw error

      setIsSubmitted(true)
      setTimeout(() => {
        setIsSubmitted(false)
        setIsOpen(false)
        setTitle('')
        setDescription('')
        setLink('')
      }, 2500)
    } catch (err) {
      console.error('Submission error:', err)
      alert('Failed to submit. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const modalContent = isOpen ? (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-lg my-auto max-h-[85vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-5">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
        >
          <X className="size-5" />
        </button>

        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <PlusCircle className="size-5 text-emerald-600 dark:text-emerald-400" />
            Contribute to WayToCity
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Share a local food spot, place to see, stay, or transit tip. Submissions go to moderation before publishing.
          </p>
        </div>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="size-12 text-emerald-500 mx-auto animate-bounce" />
            <h3 className="text-base font-bold text-foreground">Thank You!</h3>
            <p className="text-xs text-muted-foreground">
              Your recommendation has been submitted for review.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              >
                <option value="poi">Place to See (POI)</option>
                <option value="food">Local Food / Dish</option>
                <option value="stay">Stay / Hotel</option>
                <option value="tocity">Arrival / Transit Tip</option>
                <option value="city">New City Suggestion</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Country
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Turkey, France"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  City
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bursa, Paris"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Title / Spot Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Iskender Kebab, Eiffel Tower"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Description / Local Tips
              </label>
              <textarea
                rows={3}
                placeholder="Tell travelers why this spot is worth visiting, prices, or how to get there..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Website or Booking Link (Optional)
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-accent"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
              >
                <Send className="size-3.5" />
                {isSubmitting ? 'Submitting...' : 'Submit Spot'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  ) : null

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 transition-all hover:bg-emerald-500/20 active:scale-95 shadow-sm"
      >
        <PlusCircle className="size-3.5" />
        Contribute Info
      </button>

      {mounted && modalContent && createPortal(modalContent, document.body)}
    </>
  )
}
