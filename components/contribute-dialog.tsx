'use client'

import { PlusCircle } from 'lucide-react'
import { useContributeModal } from '@/components/contribute-provider'

export function ContributeDialog({
  defaultCountry = '',
  defaultCity = '',
}: {
  defaultCountry?: string
  defaultCity?: string
}) {
  const { openContribute } = useContributeModal()

  return (
    <button
      onClick={() => openContribute({ country: defaultCountry, city: defaultCity })}
      className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 transition-all hover:bg-emerald-500/20 active:scale-95 shadow-sm"
    >
      <PlusCircle className="size-3.5" />
      Contribute Info
    </button>
  )
}
