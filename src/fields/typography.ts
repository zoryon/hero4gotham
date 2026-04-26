export const typographyFontSizeOptions = [
  {
    label: 'Compact',
    value: 'compact',
  },
  {
    label: 'Medium',
    value: 'medium',
  },
  {
    label: 'Large',
    value: 'large',
  },
  {
    label: 'Hero',
    value: 'hero',
  },
  {
    label: 'Massive',
    value: 'massive',
  },
] as const

export const typographySubtitleFontSizeOptions = [
  {
    label: 'Small',
    value: 'small',
  },
  {
    label: 'Normal',
    value: 'base',
  },
  {
    label: 'Large',
    value: 'large',
  },
  {
    label: 'Lead',
    value: 'lead',
  },
] as const

export const typographyFontWeightOptions = [
  {
    label: 'Regular',
    value: 'regular',
  },
  {
    label: 'Medium',
    value: 'medium',
  },
  {
    label: 'Semibold',
    value: 'semibold',
  },
  {
    label: 'Bold',
    value: 'bold',
  },
  {
    label: 'Black',
    value: 'black',
  },
] as const

export const typographyFontFamilyOptions = [
  {
    label: 'Rye Western',
    value: 'rye',
  },
  {
    label: 'Cinzel',
    value: 'cinzel',
  },
  {
    label: 'Geist Sans',
    value: 'geistSans',
  },
  {
    label: 'Geist Mono',
    value: 'geistMono',
  },
  {
    label: 'Classic serif',
    value: 'serif',
  },
  {
    label: 'Classic sans',
    value: 'sans',
  },
] as const

export const typographyVerticalScaleOptions = [
  {
    label: 'Normal',
    value: 'normal',
  },
  {
    label: 'High',
    value: 'tall',
  },
  {
    label: 'Poster',
    value: 'poster',
  },
  {
    label: 'Extreme',
    value: 'extreme',
  },
] as const

export const typographyDistressOptions = [
  {
    label: 'None',
    value: 'none',
  },
  {
    label: 'Light distress',
    value: 'light',
  },
  {
    label: 'Worn',
    value: 'worn',
  },
  {
    label: 'Destroyed',
    value: 'destroyed',
  },
] as const

export const typographyLetterSpacingOptions = [
  {
    label: 'Compact',
    value: 'tight',
  },
  {
    label: 'Normal',
    value: 'normal',
  },
  {
    label: 'Open',
    value: 'wide',
  },
  {
    label: 'Very open',
    value: 'wider',
  },
  {
    label: 'Poster',
    value: 'poster',
  },
] as const

export type TypographyFontSize = (typeof typographyFontSizeOptions)[number]['value']
export type TypographySubtitleFontSize = (typeof typographySubtitleFontSizeOptions)[number]['value']
export type TypographyFontWeight = (typeof typographyFontWeightOptions)[number]['value']
export type TypographyFontFamily = (typeof typographyFontFamilyOptions)[number]['value']
export type TypographyVerticalScale = (typeof typographyVerticalScaleOptions)[number]['value']
export type TypographyDistress = (typeof typographyDistressOptions)[number]['value']
export type TypographyLetterSpacing = (typeof typographyLetterSpacingOptions)[number]['value']

export const typographyFontSizeClasses = {
  compact: 'text-3xl md:text-5xl',
  medium: 'text-4xl md:text-6xl',
  large: 'text-5xl md:text-6xl',
  hero: 'text-5xl md:text-7xl',
  massive: 'text-6xl md:text-8xl',
} satisfies Record<TypographyFontSize, string>

export const typographySubtitleFontSizeClasses = {
  small: 'text-xs md:text-sm',
  base: 'text-base md:text-lg',
  large: 'text-lg md:text-xl',
  lead: 'text-xl md:text-2xl',
} satisfies Record<TypographySubtitleFontSize, string>

export const typographyFontWeightClasses = {
  regular: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  black: 'font-black',
} satisfies Record<TypographyFontWeight, string>

export const typographyLetterSpacingClasses = {
  tight: 'tracking-[0.04em]',
  normal: 'tracking-[0.1em]',
  wide: 'tracking-[0.22em]',
  wider: 'tracking-[0.32em]',
  poster: 'tracking-[0.45em]',
} satisfies Record<TypographyLetterSpacing, string>

export const typographyFontFamilyStyles = {
  rye: "var(--font-rye), 'Times New Roman', serif",
  cinzel: "'Cinzel', 'Times New Roman', serif",
  geistSans: "var(--font-geist-sans), Arial, sans-serif",
  geistMono: "var(--font-geist-mono), 'Courier New', monospace",
  serif: "Georgia, 'Times New Roman', serif",
  sans: "Arial, Helvetica, sans-serif",
} satisfies Record<TypographyFontFamily, string>

export const typographyVerticalScaleValues = {
  normal: '1',
  tall: '1.12',
  poster: '1.25',
  extreme: '1.4',
} satisfies Record<TypographyVerticalScale, string>

export const typographyDistressStyles = {
  none: {},
  light: {
    WebkitMaskImage:
      'repeating-linear-gradient(105deg, #000 0 9px, rgb(0 0 0 / 0.82) 9px 10px, #000 10px 18px)',
    maskImage:
      'repeating-linear-gradient(105deg, #000 0 9px, rgb(0 0 0 / 0.82) 9px 10px, #000 10px 18px)',
  },
  worn: {
    WebkitMaskImage:
      'radial-gradient(circle at 14% 28%, transparent 0 2px, #000 2.4px), radial-gradient(circle at 68% 62%, transparent 0 1.8px, #000 2.2px), repeating-linear-gradient(96deg, #000 0 7px, transparent 7px 8px, #000 8px 15px)',
    WebkitMaskComposite: 'source-in',
    maskImage:
      'radial-gradient(circle at 14% 28%, transparent 0 2px, #000 2.4px), radial-gradient(circle at 68% 62%, transparent 0 1.8px, #000 2.2px), repeating-linear-gradient(96deg, #000 0 7px, transparent 7px 8px, #000 8px 15px)',
    maskComposite: 'intersect',
  },
  destroyed: {
    WebkitMaskImage:
      'radial-gradient(circle at 16% 22%, transparent 0 3px, #000 3.5px), radial-gradient(circle at 58% 48%, transparent 0 2.8px, #000 3.2px), radial-gradient(circle at 82% 70%, transparent 0 2.4px, #000 2.9px), repeating-linear-gradient(100deg, #000 0 5px, transparent 5px 7px, #000 7px 13px)',
    WebkitMaskComposite: 'source-in',
    maskImage:
      'radial-gradient(circle at 16% 22%, transparent 0 3px, #000 3.5px), radial-gradient(circle at 58% 48%, transparent 0 2.8px, #000 3.2px), radial-gradient(circle at 82% 70%, transparent 0 2.4px, #000 2.9px), repeating-linear-gradient(100deg, #000 0 5px, transparent 5px 7px, #000 7px 13px)',
    maskComposite: 'intersect',
  },
} satisfies Record<TypographyDistress, Record<string, string>>
