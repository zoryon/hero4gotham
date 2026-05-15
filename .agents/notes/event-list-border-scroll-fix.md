# Event List Border And Scroll Fix

## Context

The Event Suite list cards use vintage borders drawn with `.scribble-border::after`.
Event images are rendered with `absolute inset-0`, so they touch the real edge of their
grid cell. The border texture, however, can appear inset because the pseudo-element
draws a thick border inside the box unless it is pushed outward.

## Symptoms

- Event row grid gaps can be set to zero while the cards still look detached.
- Images appear flush to the card edge, but text/border areas look slightly separated.
- A tiny right-side gap can remain even after removing the row/card gap.
- Vertical and horizontal scrollbars can appear with only a couple of events.

## Root Causes

- The event content cell originally had `gap-4 px-5 py-4`, so the text/image cell had
  internal spacing even when the row gap was zero.
- The image wrapper compensated with negative margins (`-my-4 -mr-5`), making the image
  look flush while the bordered/text area still looked inset.
- `.scribble-border::after` used `inset: 0` with a 15px border image, which places much
  of the visible border inside the element.
- The scroll container used `pr-1`, leaving a small right gutter.
- The list wrapper always used `overflow-y-auto` and `maxHeight`; when borders were
  pushed outward, their pseudo-elements could contribute to perceived overflow and show
  unnecessary scrollbars.

## Fix Pattern

For `src/blocks/EventSuite/EventList/Component.client.tsx`:

- Keep the event row grid at `gap-0`.
- Remove padding and gap from the bordered content cell:
  `gap-0 overflow-visible p-0`.
- Move padding only to the text column:
  `px-5 py-4`.
- Remove image negative margins; keep the image wrapper flush:
  `relative min-h-full overflow-hidden`.
- Remove `pr-1` from the list scroll wrapper.
- Only enable scroll when there are more events than the visible step:
  use `overflow-visible` normally, and `overflow-x-hidden overflow-y-auto` only when
  `canLoadMore` is true.

For `src/app/(frontend)/globals.css`:

- Add a dedicated event-list border class instead of changing `.scribble-border`
  globally:

```css
.event-list-cell-border::after {
  inset: calc(var(--vintage-border-width, 15px) * -0.7);
}
```

For full-card Event Suite panels such as `FeaturedEvent` and `EventCalendar`, use a
stronger outward inset because their image/content fills the whole card. With `-0.7`,
part of the 15px border texture still sits inside the box, so the background image can
look like it runs outside the visible border line.

```css
.featured-event-card-border::after,
.event-calendar-card-border::after {
  inset: calc(var(--vintage-border-width, 15px) * -1);
}
```

The card components should combine `scribble-border` with those dedicated classes and
keep their outer container `overflow-visible`.

## Why This Works

The bordered cells and image cells now share the same physical grid edge. The text still
has intentional internal padding, but the decorative border is drawn outward from the
cell edge, so it visually aligns with the image. Scrollbars only appear when the list is
actually clipped to show a subset of events.

## 2026-05-15 Follow-Up

The event column lag was fixed without breaking the vintage borders by keeping scroll
optimizations lightweight:

- `overscroll-behavior: contain`
- `transform: translateZ(0)`
- `will-change: scroll-position`

Do not use `content-visibility: auto` on event rows or `contain: content` on
`.event-list-scroll` here. Those properties can interfere with the vintage border
pseudo-elements and make the right-side border look clipped or barely visible,
especially because the cards rely on `overflow-visible` and outward border insets.

When marking past events, do not apply opacity to the whole `<article>`. That also
dims the vintage border. Apply `opacity-70` only to inner content such as the date
text, copy column, image, and CTA.

The list should show all events, including past events, ordered by highest date first
(`sort: '-startsAt'`). Avoid adding a default `startsAt >= today` filter in
`buildEventWhere`; only date-filter when the user explicitly picks a date.

## Verification

Run:

```bash
pnpm exec prettier --check src/blocks/EventSuite/EventList/Component.client.tsx 'src/app/(frontend)/globals.css'
pnpm exec tsc --noEmit --pretty false
```
