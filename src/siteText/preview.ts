export const normalizePreviewText = (value: string) =>
  value
    .replace(/[\u00AD\u200B-\u200D\uFEFF]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLocaleLowerCase('it-IT')
