export const pageFrameFamilyClasses = {
  commerce: 'page-frame page-frame--commerce',
  editorial: 'page-frame page-frame--editorial',
  homepage: 'page-frame page-frame--homepage',
  marketing: 'page-frame page-frame--marketing',
  utility: 'page-frame page-frame--utility',
} as const

export type PageFrameFamily = keyof typeof pageFrameFamilyClasses

export const PAGE_FRAME_DEFAULT_FAMILY: PageFrameFamily = 'marketing'
export const pageFrameFamilies = Object.keys(pageFrameFamilyClasses) as PageFrameFamily[]

export type PageFrameFamilyTone = 'expressive' | 'minimal' | 'prose' | 'structured'

export const pageFrameFamilyMeta = {
  commerce: {
    expressive: false,
    tone: 'structured',
  },
  editorial: {
    expressive: false,
    tone: 'prose',
  },
  homepage: {
    expressive: true,
    tone: 'expressive',
  },
  marketing: {
    expressive: true,
    tone: 'expressive',
  },
  utility: {
    expressive: false,
    tone: 'minimal',
  },
} satisfies Record<
  PageFrameFamily,
  {
    expressive: boolean
    tone: PageFrameFamilyTone
  }
>

export const resolvePageFrameFamily = (family?: PageFrameFamily): PageFrameFamily =>
  family || PAGE_FRAME_DEFAULT_FAMILY

export const resolvePageFrameFamilyMeta = (family?: PageFrameFamily) =>
  pageFrameFamilyMeta[resolvePageFrameFamily(family)]

export const isExpressivePageFrameFamily = (family?: PageFrameFamily) =>
  resolvePageFrameFamilyMeta(family).expressive

export const isMinimalPageFrameFamily = (family?: PageFrameFamily) =>
  resolvePageFrameFamilyMeta(family).tone === 'minimal'

export const isProsePageFrameFamily = (family?: PageFrameFamily) =>
  resolvePageFrameFamilyMeta(family).tone === 'prose'

export const sectionShellContainmentClasses = {
  contained: 'section-shell__inner--contained',
  narrow: 'section-shell__inner--narrow',
  reading: 'section-shell__inner--reading',
  wide: 'section-shell__inner--wide',
  'full-bleed': '',
} as const

export type SectionShellContainment = keyof typeof sectionShellContainmentClasses
export const sectionShellContainments = Object.keys(
  sectionShellContainmentClasses,
) as SectionShellContainment[]

export const sectionShellSpacingClasses = {
  compact: 'section-shell--spacing-compact',
  default: 'section-shell--spacing-default',
  none: 'section-shell--spacing-none',
  relaxed: 'section-shell--spacing-relaxed',
} as const

export type SectionShellSpacing = keyof typeof sectionShellSpacingClasses
export const sectionShellSpacings = Object.keys(sectionShellSpacingClasses) as SectionShellSpacing[]

export const sectionShellVariantClasses = {
  hero: 'section-shell--variant-hero',
  'image-band': 'section-shell--variant-image-band',
  panel: 'section-shell--variant-panel',
  patterned: 'section-shell--variant-patterned',
  plain: 'section-shell--variant-plain',
  tinted: 'section-shell--variant-tinted',
} as const

export type SectionShellVariant = keyof typeof sectionShellVariantClasses
export const sectionShellVariants = Object.keys(sectionShellVariantClasses) as SectionShellVariant[]

export type SectionShellSurfaceRole =
  | 'atmosphere'
  | 'base'
  | 'hero'
  | 'panel'
  | 'surface-shift'

export const sectionShellVariantMeta = {
  hero: {
    decorative: true,
    role: 'hero',
    surfaceShift: true,
  },
  'image-band': {
    decorative: true,
    role: 'atmosphere',
    surfaceShift: true,
  },
  panel: {
    decorative: false,
    role: 'panel',
    surfaceShift: true,
  },
  patterned: {
    decorative: true,
    role: 'surface-shift',
    surfaceShift: true,
  },
  plain: {
    decorative: false,
    role: 'base',
    surfaceShift: false,
  },
  tinted: {
    decorative: false,
    role: 'surface-shift',
    surfaceShift: true,
  },
} satisfies Record<
  SectionShellVariant,
  {
    decorative: boolean
    role: SectionShellSurfaceRole
    surfaceShift: boolean
  }
>

export const SECTION_SHELL_DEFAULT_CONTAINMENT: SectionShellContainment = 'contained'
export const SECTION_SHELL_DEFAULT_SPACING: SectionShellSpacing = 'compact'
export const SECTION_SHELL_DEFAULT_VARIANT: SectionShellVariant = 'plain'

export const resolveSectionShellContainment = (
  containment?: SectionShellContainment,
): SectionShellContainment => containment || SECTION_SHELL_DEFAULT_CONTAINMENT

export const resolveSectionShellSpacing = (
  spacing?: SectionShellSpacing,
): SectionShellSpacing => spacing || SECTION_SHELL_DEFAULT_SPACING

export const resolveSectionShellVariant = (
  variant?: SectionShellVariant,
): SectionShellVariant => variant || SECTION_SHELL_DEFAULT_VARIANT

export const resolveSectionShellVariantMeta = (variant?: SectionShellVariant) =>
  sectionShellVariantMeta[resolveSectionShellVariant(variant)]

export const isDecorativeSectionShellVariant = (variant?: SectionShellVariant) =>
  resolveSectionShellVariantMeta(variant).decorative

export const isSurfaceShiftingSectionShellVariant = (variant?: SectionShellVariant) =>
  resolveSectionShellVariantMeta(variant).surfaceShift

export const isBaseSectionShellVariant = (variant?: SectionShellVariant) =>
  resolveSectionShellVariantMeta(variant).role === 'base'
