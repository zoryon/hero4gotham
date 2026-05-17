'use client'

type CookiePreferencesLinkProps = {
  className?: string
  label?: string | null
}

export function CookiePreferencesLink({ className, label }: CookiePreferencesLinkProps) {
  return (
    <button
      className={`${className || ''} site-footer__link--button`.trim()}
      onClick={() => {
        window.dispatchEvent(new Event('hero4gotham:open-cookie-preferences'))
      }}
      type="button"
    >
      {label || 'Preferenze cookie'}
    </button>
  )
}
