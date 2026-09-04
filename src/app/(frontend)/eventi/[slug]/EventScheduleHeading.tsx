import React from 'react'

export const EventScheduleHeading = ({ title }: { title: string }) => (
  <div className="event-detail-section-heading">
    <h2 className="mt-2 font-rye-western text-2xl uppercase leading-none text-[var(--theme-text-green)] md:text-3xl">
      {title.toLocaleUpperCase('it-IT')}
    </h2>
  </div>
)
