'use client'

import { useState, type ReactNode } from 'react'
import { Plus } from 'lucide-react'

export type AccordionItem = {
  key: string
  icon: ReactNode
  title: string
  description: string
}

/*
  Dark accordion list matching the reference "What We Do" services band —
  icon chip + title + expand toggle, hairline dividers, single open panel.
*/
export function EditableAccordionList({ items }: { items: AccordionItem[] }) {
  const [openKey, setOpenKey] = useState<string | null>(items[0]?.key ?? null)

  return (
    <div className="divide-y divide-white/10 border-t border-white/10">
      {items.map((item) => {
        const open = openKey === item.key
        return (
          <div key={item.key}>
            <button
              type="button"
              onClick={() => setOpenKey(open ? null : item.key)}
              className="flex w-full items-center justify-between gap-4 py-6 text-left"
              aria-expanded={open}
            >
              <span className="flex items-center gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-white">{item.icon}</span>
                <span className="text-lg font-semibold text-white sm:text-xl">{item.title}</span>
              </span>
              <Plus className={`h-5 w-5 shrink-0 text-white/60 transition duration-300 ${open ? 'rotate-45' : ''}`} />
            </button>
            <div className={`grid overflow-hidden transition-all duration-300 ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
              <div className="min-h-0">
                <p className="max-w-2xl pb-6 pl-[60px] text-sm leading-7 text-white/60">{item.description}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
