import React from 'react'

import type { UpcomingEventsBlock as UpcomingEventsBlockProps } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'

export const UpcomingEventsBlock: React.FC<UpcomingEventsBlockProps> = ({
  events,
  featureImage,
  heading,
  posterText,
}) => {
  const eventItems = events || []

  if (!eventItems.length) return null

  return (
    <section className="container">
      <div className="overflow-hidden border border-[#3b302d] bg-[#19141e] shadow-[0_0_0_1px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.06)]">
        <div className="bg-lime-600 px-4 py-1">
          <h2 className="font-[family-name:'Cinzel','Times New Roman',serif] text-sm font-bold uppercase tracking-[0.08em] text-[#18120f]">
            {heading}
          </h2>
        </div>

        <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_38%]">
          <div className="divide-y divide-[#3b302d] px-5 py-2">
            {eventItems.map((event, index) => {
              return (
                <article className="grid grid-cols-[4.25rem_minmax(0,1fr)] gap-4 py-4" key={event.id || index}>
                  <div className="text-center font-[family-name:'Cinzel','Times New Roman',serif] uppercase leading-none">
                    <div className="text-3xl font-bold text-fuchsia-200">{event.day}</div>
                    <div className="mt-1 text-xs font-bold tracking-[0.12em] text-zinc-200">{event.month}</div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                    <div>
                      <h3 className="font-[family-name:'Cinzel','Times New Roman',serif] text-sm font-bold uppercase tracking-[0.07em] text-amber-100">
                        {event.title}
                      </h3>
                      <p className="mt-1 max-w-lg text-xs leading-relaxed text-zinc-300/85">
                        {event.description}
                      </p>
                    </div>

                    <CMSLink
                      {...event.link}
                      className="justify-self-start text-[10px] font-bold uppercase tracking-[0.08em] text-lime-400 hover:text-lime-300 sm:justify-self-end"
                      label={event.link?.label || 'Scopri di piu'}
                    />
                  </div>
                </article>
              )
            })}
          </div>

          <div className="relative min-h-56 border-t border-[#3b302d] lg:border-l lg:border-t-0">
            {featureImage && typeof featureImage === 'object' ? (
              <Media
                fill
                imgClassName="object-cover"
                pictureClassName="absolute inset-0"
                resource={featureImage}
              />
            ) : null}

            {posterText ? (
              <div className="absolute left-5 top-5 max-w-28 -rotate-6 bg-[#211027]/85 px-3 py-2 text-center font-[family-name:'Cinzel','Times New Roman',serif] text-base font-bold uppercase leading-tight tracking-[0.04em] text-fuchsia-300 shadow-[0_0_22px_rgba(217,70,239,0.35)]">
                {posterText}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
