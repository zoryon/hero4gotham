export const SITE_NAME = 'Hero 4 Gotham'

export const DEFAULT_META_DESCRIPTION =
  'Hero 4 Gotham, associazione culturale dedicata ad arte, creatività, eventi e partecipazione.'

const LEGACY_TEMPLATE_TITLE_SUFFIX = /(?:^|\s*\|\s*)Payload Website Template\s*$/i

export const getSiteTitle = (title?: null | string) =>
  title?.replace(LEGACY_TEMPLATE_TITLE_SUFFIX, '').trim() || SITE_NAME
