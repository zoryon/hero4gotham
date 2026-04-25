import React from 'react'

import type { FeatureGridBlock as FeatureGridBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

const columnClasses = {
  four: 'md:grid-cols-2 lg:grid-cols-4',
  three: 'md:grid-cols-3',
  two: 'md:grid-cols-2',
}

const styleClasses = {
  gothamDark: 'border-y border-[#5c342e] bg-[#221429] text-zinc-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]',
  transparent: 'text-current',
}

export const FeatureGridBlock: React.FC<FeatureGridBlockProps> = ({
  columns = 'four',
  items,
  style = 'gothamDark',
}) => {
  const features = items || []

  if (!features.length) return null

  return (
    <section className="container">
      <div className={cn('overflow-hidden', styleClasses[style || 'gothamDark'])}>
        <div className={cn('grid grid-cols-1', columnClasses[columns || 'four'])}>
          {features.map((item, index) => {
            const hasIcon = Boolean(item.icon && typeof item.icon === 'object')

            return (
              <article
                className={cn(
                  'relative flex min-h-36 flex-col items-center justify-start px-6 py-5 text-center',
                  'border-[#5c342e]/80',
                  index > 0 && 'border-t md:border-t-0 md:border-l',
                )}
                key={item.id || index}
              >
                {hasIcon ? (
                  <div className="relative mb-2 h-11 w-11">
                    <Media
                      fill
                      imgClassName="object-contain"
                      pictureClassName="absolute inset-0"
                      resource={item.icon}
                    />
                  </div>
                ) : null}

                <h3 className="font-[family-name:'Cinzel','Times New Roman',serif] text-sm font-semibold uppercase tracking-[0.08em] text-amber-100">
                  {item.title}
                </h3>
                <p className="mt-2 max-w-44 text-[11px] leading-relaxed text-zinc-200/85">
                  {item.description}
                </p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
