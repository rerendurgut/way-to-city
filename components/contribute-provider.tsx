'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { PlusCircle, Send, CheckCircle2, X, Edit3 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export type ContributeModalOptions = {
  mode?: 'new' | 'correction'
  category?: string
  country?: string
  city?: string
  title?: string
  description?: string
  link?: string
  targetId?: string
  extra_info?: Record<string, any>
}

type ContributeContextType = {
  openContribute: (options?: ContributeModalOptions) => void
  closeContribute: () => void
}

const ContributeContext = createContext<ContributeContextType | undefined>(undefined)

export function useContributeModal() {
  const ctx = useContext(ContributeContext)
  if (!ctx) {
    throw new Error('useContributeModal must be used within ContributeProvider')
  }
  return ctx
}

export function ContributeProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  // Mode: 'new' or 'correction'
  const [mode, setMode] = useState<'new' | 'correction'>('new')
  const [targetId, setTargetId] = useState<string | undefined>()

  const [category, setCategory] = useState<string>('poi')
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [link, setLink] = useState('')

  // Specific dynamic fields
  const [coordinates, setCoordinates] = useState('')
  const [arrivalType, setArrivalType] = useState('plane')
  const [noteLink, setNoteLink] = useState('')

  // Food fields
  const [isMeat, setIsMeat] = useState(false)
  const [isSpicy, setIsSpicy] = useState(false)
  const [isVegan, setIsVegan] = useState(false)
  const [isVegetarian, setIsVegetarian] = useState(false)

  // Transport fields
  const [fare, setFare] = useState('')
  const [cardFee, setCardFee] = useState('')
  const [passesInfo, setPassesInfo] = useState('')
  const [taxiApp, setTaxiApp] = useState('')
  const [carShareApp, setCarShareApp] = useState('')
  const [carRental, setCarRental] = useState('')
  const [mobileApp, setMobileApp] = useState('')
  const [contactless, setContactless] = useState(false)
  const [qr, setQr] = useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const openContribute = (options?: ContributeModalOptions) => {
    const m = options?.mode || 'new'
    setMode(m)
    setCategory(options?.category || 'poi')
    setCountry(options?.country || '')
    setCity(options?.city || '')
    setTitle(options?.title || '')
    setDescription(options?.description || '')
    setLink(options?.link || '')
    setTargetId(options?.targetId)

    const extra = options?.extra_info || {}
    setCoordinates(extra.coordinates || '')
    setArrivalType(extra.arrivalType || 'plane')
    setNoteLink(extra.noteLink || '')
    setIsMeat(Boolean(extra.isMeat))
    setIsSpicy(Boolean(extra.isSpicy))
    setIsVegan(Boolean(extra.isVegan))
    setIsVegetarian(Boolean(extra.isVegetarian))

    setFare(extra.fare || '')
    setCardFee(extra.cardFee || '')
    setPassesInfo(extra.passesInfo || '')
    setTaxiApp(extra.taxiApp || '')
    setCarShareApp(extra.carShareApp || '')
    setCarRental(extra.carRental || '')
    setMobileApp(extra.mobileApp || '')
    setContactless(Boolean(extra.contactless))
    setQr(Boolean(extra.qr))

    setIsOpen(true)
  }

  const closeContribute = () => {
    setIsOpen(false)
  }

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setLink('')
    setCoordinates('')
    setNoteLink('')
    setIsMeat(false)
    setIsSpicy(false)
    setIsVegan(false)
    setIsVegetarian(false)
    setFare('')
    setCardFee('')
    setPassesInfo('')
    setTaxiApp('')
    setCarShareApp('')
    setCarRental('')
    setMobileApp('')
    setContactless(false)
    setQr(false)
    setTargetId(undefined)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!country || !city || !title) return

    setIsSubmitting(true)
    try {
      const extra_info: Record<string, any> = {
        submission_type: mode,
      }
      if (targetId) {
        extra_info.target_id = targetId
      }

      if (category === 'poi' && coordinates) {
        extra_info.coordinates = coordinates
      } else if (category === 'tocity') {
        extra_info.arrivalType = arrivalType
        extra_info.noteLink = noteLink
      } else if (category === 'food') {
        extra_info.isMeat = isMeat
        extra_info.isSpicy = isSpicy
        extra_info.isVegan = isVegan
        extra_info.isVegetarian = isVegetarian
      } else if (category === 'transport') {
        extra_info.cardName = title
        extra_info.fare = fare
        extra_info.cardFee = cardFee
        extra_info.passesInfo = passesInfo
        extra_info.taxiApp = taxiApp
        extra_info.carShareApp = carShareApp
        extra_info.carRental = carRental
        extra_info.mobileApp = mobileApp
        extra_info.contactless = contactless
        extra_info.qr = qr
      }

      const { error } = await supabase.from('submissions').insert([
        {
          category,
          country,
          city,
          title,
          description,
          link: category === 'city' ? '' : link,
          extra_info,
          status: 'pending',
        },
      ])

      if (error) throw error

      setIsSubmitted(true)
      setTimeout(() => {
        setIsSubmitted(false)
        setIsOpen(false)
        resetForm()
      }, 2200)
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
          onClick={closeContribute}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
        >
          <X className="size-5" />
        </button>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <button
            type="button"
            onClick={() => setMode('new')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              mode === 'new'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <PlusCircle className="size-3.5" />
            Add New Item
          </button>
          <button
            type="button"
            onClick={() => setMode('correction')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              mode === 'correction'
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Edit3 className="size-3.5" />
            Suggest Correction / Edit
          </button>
        </div>

        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            {mode === 'correction' ? (
              <>
                <Edit3 className="size-5 text-amber-500" />
                Suggest Correction for {city || 'City'}
              </>
            ) : (
              <>
                <PlusCircle className="size-5 text-emerald-500" />
                Contribute to WayToCity
              </>
            )}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            {mode === 'correction'
              ? 'Found outdated or missing details? Edit below to send a correction for review.'
              : 'Share a spot, food, stay, or transit tip. Submissions go to moderation before publishing.'}
          </p>
        </div>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="size-12 text-emerald-500 mx-auto animate-bounce" />
            <h3 className="text-base font-bold text-foreground">Thank You!</h3>
            <p className="text-xs text-muted-foreground">
              {mode === 'correction'
                ? 'Your correction has been submitted for review.'
                : 'Your recommendation has been submitted for review.'}
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
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              >
                <option value="poi">📍 Place to See (POI)</option>
                <option value="transport">🚆 Transit Guide / Urban Transport</option>
                <option value="tocity">✈️ Arrival / Airport &amp; Intercity</option>
                <option value="food">🍱 Local Food / Dish</option>
                <option value="stay">🏨 Stay / Hotel</option>
                <option value="city">🏙️ New City Suggestion</option>
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

            {/* Title / Primary Name */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                {category === 'poi' && 'Place / Attraction Name'}
                {category === 'transport' && 'Transit Card or Ticket Name'}
                {category === 'food' && 'Dish / Food Name'}
                {category === 'tocity' && 'Airport or Station Name'}
                {category === 'stay' && 'Hotel / Stay Name'}
                {category === 'city' && 'New City Name'}
              </label>
              <input
                type="text"
                required
                placeholder={
                  category === 'poi'
                    ? 'e.g. Eiffel Tower, Hagia Sophia'
                    : category === 'transport'
                    ? 'e.g. Istanbulkart, Navigo Pass, Oyster Card'
                    : category === 'food'
                    ? 'e.g. Iskender Kebab, Croissant'
                    : category === 'tocity'
                    ? 'e.g. Sabiha Gokcen (SAW), Charles de Gaulle'
                    : category === 'stay'
                    ? 'e.g. Grand Hotel Paris'
                    : 'e.g. Florence, Kyoto'
                }
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>

            {/* Category: POI Specific (Coordinates) */}
            {category === 'poi' && (
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Map Coordinates / Location (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 41°00'30 N 28°58'47 E or Google Maps link"
                  value={coordinates}
                  onChange={(e) => setCoordinates(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>
            )}

            {/* Category: Transit Specific (Fares, Passes, Apps, Payment Badges) */}
            {category === 'transport' && (
              <div className="space-y-3 border-t border-border pt-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      Single Fare / Ticket Price
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 15 ₺ or €2.15"
                      value={fare}
                      onChange={(e) => setFare(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      Card Fee / Deposit
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 50 ₺ or €5"
                      value={cardFee}
                      onChange={(e) => setCardFee(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Pass Options (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 24h Pass: $10, 7-Day Pass: $30"
                    value={passesInfo}
                    onChange={(e) => setPassesInfo(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      Taxi App
                    </label>
                    <input
                      type="text"
                      placeholder="Uber, BiTaksi"
                      value={taxiApp}
                      onChange={(e) => setTaxiApp(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-2.5 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      Car Sharing
                    </label>
                    <input
                      type="text"
                      placeholder="Zipcar, GetirDrive"
                      value={carShareApp}
                      onChange={(e) => setCarShareApp(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-2.5 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      Car Rental Link
                    </label>
                    <input
                      type="text"
                      placeholder="Rentalcars"
                      value={carRental}
                      onChange={(e) => setCarRental(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-2.5 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Mobile App / Top-Up Link (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={mobileApp}
                    onChange={(e) => setMobileApp(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-2">
                    Payment Options Supported
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-border p-2 hover:bg-accent">
                      <input
                        type="checkbox"
                        checked={contactless}
                        onChange={(e) => setContactless(e.target.checked)}
                        className="rounded border-border text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>💳 Contactless Bank Card</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-border p-2 hover:bg-accent">
                      <input
                        type="checkbox"
                        checked={qr}
                        onChange={(e) => setQr(e.target.checked)}
                        className="rounded border-border text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>📱 QR Code Payment</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Category: Arrival Specific (Type & Shuttle Link) */}
            {category === 'tocity' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Arrival Type
                  </label>
                  <select
                    value={arrivalType}
                    onChange={(e) => setArrivalType(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  >
                    <option value="plane">✈️ By Flight / Plane</option>
                    <option value="bus">🚌 By Bus</option>
                    <option value="train">🚆 By Train</option>
                    <option value="ferry">⛴️ By Ferry</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Shuttle Bus / Train Link (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://hava.ist"
                    value={noteLink}
                    onChange={(e) => setNoteLink(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>
              </div>
            )}

            {/* Category: Food Specific (Dietary Badges) */}
            {category === 'food' && (
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2">
                  Dietary Badges
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-border p-2 hover:bg-accent">
                    <input
                      type="checkbox"
                      checked={isMeat}
                      onChange={(e) => setIsMeat(e.target.checked)}
                      className="rounded border-border text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>🥩 Contains Meat</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-border p-2 hover:bg-accent">
                    <input
                      type="checkbox"
                      checked={isSpicy}
                      onChange={(e) => setIsSpicy(e.target.checked)}
                      className="rounded border-border text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>🌶️ Spicy</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-border p-2 hover:bg-accent">
                    <input
                      type="checkbox"
                      checked={isVegetarian}
                      onChange={(e) => setIsVegetarian(e.target.checked)}
                      className="rounded border-border text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>🥦 Vegetarian</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-border p-2 hover:bg-accent">
                    <input
                      type="checkbox"
                      checked={isVegan}
                      onChange={(e) => setIsVegan(e.target.checked)}
                      className="rounded border-border text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>🌱 Vegan</span>
                  </label>
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                {category === 'tocity'
                  ? 'How to get from Airport/Station to City Center'
                  : category === 'transport'
                  ? 'Where to Buy & Public Transit Tips'
                  : category === 'city'
                  ? 'Why add this city / Travel tips'
                  : 'Description / Local Tips'}
              </label>
              <textarea
                rows={3}
                placeholder={
                  category === 'tocity'
                    ? 'e.g. Take M11 Metro Line or Havaist shuttle directly to Taksim...'
                    : category === 'transport'
                    ? 'e.g. Purchase card at yellow kiosks in metro stations. Valid on all buses and trains...'
                    : category === 'city'
                    ? 'e.g. Popular historical city with high tourist demand...'
                    : 'Tell travelers why this spot is worth visiting, prices, or recommendations...'
                }
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>

            {/* Website / Booking Link (HIDDEN when category === 'city') */}
            {category !== 'city' && (
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  {category === 'tocity'
                    ? 'Main Ticket Search Link (e.g. Skyscanner, Obilet)'
                    : 'Website / Booking Link (Optional)'}
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={closeContribute}
                className="rounded-lg border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-accent"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold text-white transition-all active:scale-95 disabled:opacity-50 ${
                  mode === 'correction'
                    ? 'bg-amber-600 hover:bg-amber-700'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                <Send className="size-3.5" />
                {isSubmitting
                  ? 'Submitting...'
                  : mode === 'correction'
                  ? 'Submit Correction'
                  : 'Submit Spot'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  ) : null

  return (
    <ContributeContext.Provider value={{ openContribute, closeContribute }}>
      {children}
      {mounted && modalContent && createPortal(modalContent, document.body)}
    </ContributeContext.Provider>
  )
}
