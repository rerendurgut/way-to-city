'use client'

import { useState, useEffect } from 'react'
import {
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Lock,
  ExternalLink,
  RefreshCw,
  Eye,
  X,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import {
  getPois,
  getFoods,
  getStays,
  getArrivals,
  getTransport,
} from '@/lib/sheets'

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [processingId, setProcessingId] = useState<string | null>(null)

  // Inspection / Diff modal state
  const [inspectingSub, setInspectingSub] = useState<any | null>(null)
  const [originalRecord, setOriginalRecord] = useState<any | null>(null)
  const [loadingOriginal, setLoadingOriginal] = useState<boolean>(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'waytocity2026!') {
      setIsAuthenticated(true)
      fetchSubmissions()
    } else {
      alert('Invalid admin password')
    }
  }

  const fetchSubmissions = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setSubmissions(data || [])
    } catch (err) {
      console.error('Error fetching submissions:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (sub: any) => {
    setProcessingId(sub.id)
    try {
      const extra = sub.extra_info || {}
      const targetId = extra.target_id

      if (sub.category === 'city') {
        await supabase.from('cities').insert([
          {
            id: `city-${Date.now()}`,
            country: sub.country,
            name: sub.title,
            desc: sub.description || '',
          },
        ])
      } else {
        const targetTable =
          sub.category === 'tocity'
            ? 'tocity'
            : sub.category === 'transport'
            ? 'transport'
            : sub.category + 's'

        let recordData: any = {
          city: sub.city,
          name: sub.title,
          desc: sub.description || '',
          link: sub.link || '',
          status: 'approved',
        }

        if (sub.category === 'food') {
          recordData = {
            city: sub.city,
            name: sub.title,
            desc: sub.description || '',
            is_meat: Boolean(extra.isMeat),
            is_spicy: Boolean(extra.isSpicy),
            is_vegan: Boolean(extra.isVegan),
            is_vegetarian: Boolean(extra.isVegetarian),
            status: 'approved',
          }
        } else if (sub.category === 'stay') {
          recordData = {
            city: sub.city,
            where_stay: sub.title,
            desc: sub.description || '',
            link: sub.link || '',
            status: 'approved',
          }
        } else if (sub.category === 'tocity') {
          recordData = {
            city: sub.city,
            type: extra.arrivalType || 'plane',
            name: sub.title,
            desc: sub.description || '',
            link: sub.link || '',
            note: sub.description || '',
            note_link: extra.noteLink || '',
            status: 'approved',
          }
        } else if (sub.category === 'transport') {
          recordData = {
            city: sub.city,
            card_name: extra.cardName || sub.title,
            card_fee: extra.cardFee || '',
            fare: extra.fare || '',
            where_to_buy: sub.description || '',
            taxi_app: extra.taxiApp || '',
            car_share_app: extra.carShareApp || '',
            car_rental: extra.carRental || '',
            mobile_app: extra.mobileApp || '',
            passes: Array.isArray(extra.passes) ? extra.passes : [],
            contactless: Boolean(extra.contactless),
            qr: Boolean(extra.qr),
            status: 'approved',
          }
        } else if (sub.category === 'poi') {
          recordData = {
            city: sub.city,
            name: sub.title,
            desc: sub.description || '',
            link: sub.link || '',
            status: 'approved',
          }
        }

        let updated = false
        if (targetId) {
          const { error: updateErr } = await supabase
            .from(targetTable)
            .update(recordData)
            .eq('id', targetId)

          if (!updateErr) updated = true
        } else if (sub.category === 'transport') {
          const { data: existing } = await supabase
            .from('transport')
            .select('id')
            .ilike('city', sub.city)
            .limit(1)

          if (existing && existing.length > 0) {
            await supabase
              .from('transport')
              .update(recordData)
              .eq('id', existing[0].id)
            updated = true
          }
        }

        if (!updated) {
          const { error: insertErr } = await supabase.from(targetTable).insert([
            { id: `user-${Date.now()}`, ...recordData },
          ])
          if (insertErr) {
            console.error(`Insert to ${targetTable} error:`, insertErr)
          }
        }
      }

      // Update submission status to approved
      const { error: subErr } = await supabase
        .from('submissions')
        .update({ status: 'approved' })
        .eq('id', sub.id)

      if (subErr) throw subErr

      // Optimistically update state so it immediately leaves pending list
      setSubmissions((prev) =>
        prev.map((s) => (s.id === sub.id ? { ...s, status: 'approved' } : s))
      )

      if (inspectingSub?.id === sub.id) {
        setInspectingSub(null)
      }
    } catch (err) {
      console.error('Approve error:', err)
      alert('Failed to approve submission')
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (id: string) => {
    setProcessingId(id)
    try {
      const { error } = await supabase
        .from('submissions')
        .update({ status: 'rejected' })
        .eq('id', id)

      if (error) throw error

      // Optimistically update state so it immediately leaves pending list
      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: 'rejected' } : s))
      )

      if (inspectingSub?.id === id) {
        setInspectingSub(null)
      }
    } catch (err) {
      console.error('Reject error:', err)
      alert('Failed to reject submission')
    } finally {
      setProcessingId(null)
    }
  }

  const handleInspect = async (sub: any) => {
    setInspectingSub(sub)
    setOriginalRecord(null)
    setLoadingOriginal(true)

    try {
      const extra = sub.extra_info || {}
      const targetId = extra.target_id
      const city = sub.city

      let items: any[] = []
      if (sub.category === 'poi') {
        items = await getPois(city)
      } else if (sub.category === 'food') {
        items = await getFoods(city)
      } else if (sub.category === 'stay') {
        items = await getStays(city)
      } else if (sub.category === 'tocity') {
        items = await getArrivals(city)
      } else if (sub.category === 'transport') {
        const t = await getTransport(city)
        items = t ? [t] : []
      }

      let found = null
      if (targetId) {
        found = items.find((i) => String(i.id) === String(targetId))
      }
      if (!found && sub.title) {
        found = items.find(
          (i) =>
            (i.name || i.cardName || i.where || '').toLowerCase() ===
            sub.title.toLowerCase()
        )
      }
      if (!found && items.length > 0) {
        found = items[0]
      }

      setOriginalRecord(found)
    } catch (err) {
      console.error('Error fetching original record for diff:', err)
    } finally {
      setLoadingOriginal(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-svh bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4">
          <div className="text-center space-y-2">
            <div className="inline-flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
              <ShieldCheck className="size-6" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Admin Portal</h1>
            <p className="text-xs text-muted-foreground">
              Enter password to access community moderation queue
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                <input
                  type="password"
                  placeholder="Admin Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-emerald-600 py-2 text-xs font-semibold text-white transition-all hover:bg-emerald-700 active:scale-95"
            >
              Unlock Dashboard
            </button>
          </form>
        </div>
      </div>
    )
  }

  const pendingSubmissions = submissions.filter((s) => s.status === 'pending')
  const historySubmissions = submissions.filter((s) => s.status !== 'pending')

  return (
    <div className="min-h-svh bg-background p-6 max-w-5xl mx-auto space-y-8 animate-fade-in">
      <header className="flex items-center justify-between border-b border-border pb-5">
        <div>
          <span className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
            WayToCity Admin
          </span>
          <h1 className="text-3xl font-extrabold text-foreground">
            Moderation Queue
          </h1>
        </div>

        <button
          onClick={fetchSubmissions}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent"
        >
          <RefreshCw className={`size-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </header>

      {/* Pending Queue */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            Pending Submissions
            <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 font-mono text-xs font-semibold text-amber-600 dark:text-amber-400">
              {pendingSubmissions.length}
            </span>
          </h2>
        </div>

        {pendingSubmissions.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-8 text-center text-xs text-muted-foreground">
            🎉 No pending submissions right now! Everything is up to date.
          </div>
        ) : (
          <div className="grid gap-3">
            {pendingSubmissions.map((sub) => {
              const isCorrection =
                sub.extra_info?.submission_type === 'correction'
              return (
                <article
                  key={sub.id}
                  className="rounded-xl border border-border bg-card p-5 space-y-3 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                          {sub.category}
                        </span>
                        {isCorrection ? (
                          <span className="rounded-md bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase">
                            ✏️ Correction / Edit
                          </span>
                        ) : (
                          <span className="rounded-md bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                            ➕ New Entry
                          </span>
                        )}
                        <span className="text-xs font-semibold text-foreground">
                          {sub.city}, {sub.country}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-foreground">
                        {sub.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleInspect(sub)}
                        className="inline-flex items-center gap-1 rounded-lg border border-border bg-accent/60 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-accent active:scale-95"
                      >
                        <Eye className="size-3.5 text-amber-500" />
                        Inspect (Neydi ➔ Ne Oldu)
                      </button>

                      <button
                        onClick={() => handleReject(sub.id)}
                        disabled={processingId === sub.id}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-500/20 active:scale-95"
                      >
                        <XCircle className="size-3.5" />
                        Reject
                      </button>
                      <button
                        onClick={() => handleApprove(sub)}
                        disabled={processingId === sub.id}
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 active:scale-95 shadow-sm"
                      >
                        <CheckCircle2 className="size-3.5" />
                        Approve &amp; Publish
                      </button>
                    </div>
                  </div>

                  {sub.description && (
                    <p className="text-xs leading-relaxed text-muted-foreground bg-accent/40 p-3 rounded-lg border border-border/40">
                      {sub.description}
                    </p>
                  )}

                  {/* Render Transport Passes if present */}
                  {Array.isArray(sub.extra_info?.passes) &&
                    sub.extra_info.passes.length > 0 && (
                      <div className="space-y-1 border-t border-border/40 pt-2">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground">
                          🎟️ Passes:
                        </span>
                        <div className="flex flex-wrap gap-2 text-xs">
                          {sub.extra_info.passes.map((p: any, i: number) => (
                            <span
                              key={i}
                              className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-emerald-700 dark:text-emerald-400 font-mono text-[11px]"
                            >
                              {p.name}: {p.price} ({p.desc})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  {sub.link && (
                    <a
                      href={sub.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 hover:underline"
                    >
                      {sub.link}
                      <ExternalLink className="size-3" />
                    </a>
                  )}
                </article>
              )
            })}
          </div>
        )}
      </section>

      {/* History */}
      {historySubmissions.length > 0 && (
        <section className="space-y-3 pt-6 border-t border-border">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider font-mono">
            Past Moderation History ({historySubmissions.length})
          </h2>
          <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
            {historySubmissions.map((sub) => (
              <div
                key={sub.id}
                className="flex items-center justify-between p-4 text-xs"
              >
                <div>
                  <span className="font-semibold text-foreground">
                    {sub.title}
                  </span>
                  <span className="text-muted-foreground ml-2">
                    ({sub.city}, {sub.country})
                  </span>
                  <span className="text-muted-foreground/60 text-[10px] ml-2 font-mono">
                    [{sub.category}]
                  </span>
                </div>
                <span
                  className={`font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    sub.status === 'approved'
                      ? 'bg-emerald-500/10 text-emerald-600'
                      : 'bg-red-500/10 text-red-600'
                  }`}
                >
                  {sub.status}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Inspection & Diff Modal ("Neydi ➔ Ne Oldu") */}
      {inspectingSub && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-2xl my-auto max-h-[85vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-5">
            <button
              onClick={() => setInspectingSub(null)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
            >
              <X className="size-5" />
            </button>

            <div className="border-b border-border pb-3">
              <span className="font-mono text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">
                Inspection &amp; Diff Comparison
              </span>
              <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2 mt-0.5">
                {inspectingSub.title} ({inspectingSub.city},{' '}
                {inspectingSub.country})
              </h2>
            </div>

            {loadingOriginal ? (
              <div className="py-8 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                <RefreshCw className="size-4 animate-spin text-emerald-500" />
                Loading original record for comparison...
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <p className="text-muted-foreground">
                  Below is the side-by-side comparison between the original
                  existing record in {inspectingSub.city} and the proposed
                  suggestion:
                </p>

                <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
                  {/* Row: Title / Name */}
                  <div className="grid grid-cols-12 p-3 bg-accent/20">
                    <div className="col-span-3 font-semibold text-muted-foreground">
                      Title / Name
                    </div>
                    <div className="col-span-4 text-red-600 dark:text-red-400 font-mono">
                      🔴 Neydi: {originalRecord?.name || originalRecord?.cardName || originalRecord?.where || '(New / None)'}
                    </div>
                    <div className="col-span-5 text-emerald-600 dark:text-emerald-400 font-semibold font-mono flex items-center gap-1">
                      <ArrowRight className="size-3 shrink-0" />
                      🟢 Ne Oldu: {inspectingSub.title}
                    </div>
                  </div>

                  {/* Row: Description */}
                  <div className="grid grid-cols-12 p-3">
                    <div className="col-span-3 font-semibold text-muted-foreground">
                      Description / Tips
                    </div>
                    <div className="col-span-4 text-muted-foreground leading-relaxed">
                      🔴 {originalRecord?.desc || originalRecord?.whereToBuy || originalRecord?.note || '(None)'}
                    </div>
                    <div className="col-span-5 text-foreground font-medium leading-relaxed bg-emerald-500/5 p-2 rounded border border-emerald-500/20">
                      🟢 {inspectingSub.description || '(None)'}
                    </div>
                  </div>

                  {/* Row: Link */}
                  {(originalRecord?.link || inspectingSub.link) && (
                    <div className="grid grid-cols-12 p-3 bg-accent/20">
                      <div className="col-span-3 font-semibold text-muted-foreground">
                        Website / Link
                      </div>
                      <div className="col-span-4 text-muted-foreground break-all">
                        🔴 {originalRecord?.link || '(None)'}
                      </div>
                      <div className="col-span-5 text-emerald-600 break-all">
                        🟢 {inspectingSub.link || '(None)'}
                      </div>
                    </div>
                  )}

                  {/* Category Specific Diffs */}
                  {inspectingSub.category === 'transport' && (
                    <>
                      <div className="grid grid-cols-12 p-3">
                        <div className="col-span-3 font-semibold text-muted-foreground">
                          Single Fare / Card Fee
                        </div>
                        <div className="col-span-4 text-muted-foreground">
                          🔴 Fare: {originalRecord?.fare || 'N/A'}, Fee:{' '}
                          {originalRecord?.cardFee || 'N/A'}
                        </div>
                        <div className="col-span-5 text-emerald-600 font-mono font-semibold">
                          🟢 Fare: {inspectingSub.extra_info?.fare || 'N/A'},
                          Fee: {inspectingSub.extra_info?.cardFee || 'N/A'}
                        </div>
                      </div>

                      <div className="grid grid-cols-12 p-3 bg-accent/20">
                        <div className="col-span-3 font-semibold text-muted-foreground">
                          Passes
                        </div>
                        <div className="col-span-4 text-muted-foreground">
                          🔴{' '}
                          {Array.isArray(originalRecord?.passes) &&
                          originalRecord.passes.length > 0
                            ? originalRecord.passes
                                .map((p: any) => `${p.name}: ${p.price}`)
                                .join(', ')
                            : '(None)'}
                        </div>
                        <div className="col-span-5 text-emerald-600 font-mono">
                          🟢{' '}
                          {Array.isArray(inspectingSub.extra_info?.passes) &&
                          inspectingSub.extra_info.passes.length > 0
                            ? inspectingSub.extra_info.passes
                                .map((p: any) => `${p.name}: ${p.price}`)
                                .join(', ')
                            : '(None)'}
                        </div>
                      </div>
                    </>
                  )}

                  {inspectingSub.category === 'food' && (
                    <div className="grid grid-cols-12 p-3">
                      <div className="col-span-3 font-semibold text-muted-foreground">
                        Dietary Badges
                      </div>
                      <div className="col-span-4 text-muted-foreground">
                        🔴 Meat:{' '}
                        {originalRecord?.isMeat ? 'Yes 🥩' : 'No'}, Spicy:{' '}
                        {originalRecord?.isSpicy ? 'Yes 🌶️' : 'No'}
                      </div>
                      <div className="col-span-5 text-emerald-600 font-medium">
                        🟢 Meat:{' '}
                        {inspectingSub.extra_info?.isMeat ? 'Yes 🥩' : 'No'},
                        Spicy:{' '}
                        {inspectingSub.extra_info?.isSpicy ? 'Yes 🌶️' : 'No'},
                        Vegan:{' '}
                        {inspectingSub.extra_info?.isVegan ? 'Yes 🌱' : 'No'}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 flex items-center justify-end gap-3 border-t border-border">
                  <button
                    onClick={() => setInspectingSub(null)}
                    className="rounded-lg border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-accent"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => handleReject(inspectingSub.id)}
                    disabled={processingId === inspectingSub.id}
                    className="inline-flex items-center gap-1 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-500/20 active:scale-95"
                  >
                    <XCircle className="size-3.5" />
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(inspectingSub)}
                    disabled={processingId === inspectingSub.id}
                    className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 active:scale-95 shadow-sm"
                  >
                    <CheckCircle2 className="size-3.5" />
                    Approve &amp; Publish
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
