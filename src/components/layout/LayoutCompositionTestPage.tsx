import React from 'react'

import { SectionHeader } from '@/components/SectionHeader'
import { HeroShell } from '@/heros/HeroShell'

import { PageFrame } from './PageFrame'
import { SectionShell } from './SectionShell'
import { Surface } from './Surface'

const plainPoints = [
  'PageFrame membuka dan menutup halaman secara konsisten.',
  'SectionShell mengontrol rhythm antar chapter, bukan block individual.',
  'Surface memegang hukum panel sehingga card tidak membawa skeleton sendiri.',
] as const

const panelMetrics = [
  { label: 'Variants under test', value: '6' },
  { label: 'Families under test', value: '1' },
  { label: 'Closing CTA present', value: 'Yes' },
] as const

const tintedChecks = [
  'Section spacing eksplisit di setiap block.',
  'Heading rhythm datang dari governance layer.',
  'Panel padding tidak lagi disalin manual.',
] as const

const patternedGallery = [
  '/media/IMG-20250703-WA0018.jpg',
  '/media/IMG-20250703-WA0023.jpg',
  '/media/IMG-20250703-WA0030.jpg',
  '/media/IMG-20250703-WA0042.jpg',
] as const

const trustSignals = [
  'Legalitas usaha dan komunikasi buyer dipisahkan jelas.',
  'Section dekoratif tetap memakai shell yang sama dengan section lain.',
  'CTA penutup hadir setelah trust layer selesai, bukan menabrak seam.',
] as const

const decorativeImage = (url: string, opacityClassName: string) => (
  <div
    className={`absolute inset-0 bg-cover bg-center ${opacityClassName}`}
    style={{ backgroundImage: `url('${url}')` }}
  />
)

export const LayoutCompositionTestPage: React.FC = () => {
  return (
    <PageFrame as="article" className="layout-composition-test-page" family="homepage" hasHero>
      <HeroShell
        background={
          <>
            {decorativeImage('/media/image-hero1.webp', 'opacity-45')}
            <div className="layout-composition-test-page__hero-overlay absolute inset-0" />
            <div className="layout-composition-test-page__hero-glow absolute inset-0" />
          </>
        }
        className="hero-shell--high-impact layout-composition-test-page__hero"
        id="layout-composition-hero"
      >
        <div className="hero-shell__body">
          <div className="hero-shell__stack">
            <div className="hero-shell__content hero-shell__content--centered">
              <p className="type-eyebrow layout-composition-test-page__hero-eyebrow">
                Phase 11 Composition Test
              </p>
              <div className="hero-shell__prose space-y-6">
                <h1>BMJ Layout Composition Proof Page</h1>
                <p className="layout-composition-test-page__hero-intro">
                  Halaman ini sengaja tidak bergantung pada Payload blocks. Ia hanya
                  membuktikan bahwa grammar layout yang sudah dibekukan dapat
                  menyusun hero, section variants, panel surfaces, dan closing CTA
                  dalam satu alur halaman yang deterministik.
                </p>
              </div>
              <div className="hero-shell__actions">
                <a
                  className="polish-action polish-action--light"
                  href="#layout-composition-plain"
                >
                  Inspect plain section
                </a>
                <a
                  className="polish-action polish-action--ghost-light"
                  href="#layout-composition-close"
                >
                  Jump to closing CTA
                </a>
              </div>

              <div className="layout-composition-test-page__hero-proof-grid">
                <Surface className="layout-composition-test-page__hero-proof-card" variant="dark">
                  <p className="type-eyebrow text-white/65">Proof</p>
                  <p className="text-sm leading-relaxed text-white/88">
                    Hero masuk ke grammar yang sama tanpa offset magic number.
                  </p>
                </Surface>
                <Surface className="layout-composition-test-page__hero-proof-card" variant="dark">
                  <p className="type-eyebrow text-white/65">Rhythm</p>
                  <p className="text-sm leading-relaxed text-white/88">
                    Section variants bisa disusun berurutan tanpa gap ganda.
                  </p>
                </Surface>
                <Surface className="layout-composition-test-page__hero-proof-card" variant="dark">
                  <p className="type-eyebrow text-white/65">Surface</p>
                  <p className="text-sm leading-relaxed text-white/88">
                    Panel dan CTA terakhir memakai slab canonical yang sama.
                  </p>
                </Surface>
              </div>
            </div>
          </div>
        </div>
      </HeroShell>

      <SectionShell
        id="layout-composition-plain"
        spacing="compact"
        variant="plain"
      >
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
          <SectionHeader
            eyebrow="Plain"
            intro="Plain section menjadi baseline chapter. Ia tidak membawa decorative canvas tambahan dan hanya menguji container, heading, dan inner content density."
            title="Baseline chapter harus rapi tanpa bantuan dekorasi"
          />

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {plainPoints.map((point) => (
              <Surface className="space-y-3" key={point} variant="outlined">
                <p className="type-eyebrow">Rule</p>
                <p className="text-sm leading-relaxed text-secondary">{point}</p>
              </Surface>
            ))}
          </div>
        </div>
      </SectionShell>

      <SectionShell spacing="compact" variant="panel">
        <Surface className="space-y-8" variant="elevated">
          <SectionHeader
            eyebrow="Panel"
            intro="Panel section membuktikan bahwa emphasis datang dari surface canonical, bukan dari wrapper custom yang menambah empty space sendiri."
            title="Canonical panel law sekarang diuji sebagai satu slab"
          />

          <div className="grid gap-4 md:grid-cols-3">
            {panelMetrics.map((metric) => (
              <Surface className="space-y-2" key={metric.label} variant="flat">
                <p className="type-eyebrow">{metric.label}</p>
                <p className="type-card-title">{metric.value}</p>
              </Surface>
            ))}
          </div>
        </Surface>
      </SectionShell>

      <SectionShell spacing="compact" variant="tinted">
        <div className="space-y-8">
          <SectionHeader
            eyebrow="Tinted"
            headingSize="sm"
            intro="Tinted section menguji surface shift yang halus. Ia boleh memberi chapter change, tetapi tidak boleh menjadi owner baru untuk spacing halaman."
            title="Soft chapter shift tetap tunduk pada rhythm yang sama"
          />

          <div className="grid gap-4 md:grid-cols-3">
            {tintedChecks.map((check) => (
              <Surface className="space-y-3" key={check}>
                <p className="type-eyebrow">Checklist</p>
                <p className="text-sm leading-relaxed text-secondary">{check}</p>
              </Surface>
            ))}
          </div>
        </div>
      </SectionShell>

      <SectionShell
        background={
          <>
            <div className="absolute inset-0 bg-[#eef3ea]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.34),transparent_42%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(127,154,120,0.12),transparent_48%)]" />
          </>
        }
        spacing="compact"
        variant="patterned"
      >
        <div className="space-y-8">
          <SectionHeader
            eyebrow="Patterned"
            headingSize="sm"
            intro="Patterned section memakai decorative canvas penuh, tetapi kontennya tetap ditampung oleh surface canonical sehingga chapter ini tidak berubah menjadi wrapper liar."
            title="Decorative shell diuji tanpa kembali ke local patching"
          />

          <Surface className="space-y-6" variant="elevated">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {patternedGallery.map((src, index) => (
                <div className="layout-composition-test-page__gallery-item" key={src}>
                  <div
                    className="layout-composition-test-page__gallery-image"
                    style={{ backgroundImage: `url('${src}')` }}
                  />
                  <p className="text-sm leading-relaxed text-secondary">
                    Gallery proof panel {index + 1} untuk memeriksa density, seam,
                    dan hubungan patterned shell ke surface di dalamnya.
                  </p>
                </div>
              ))}
            </div>
          </Surface>
        </div>
      </SectionShell>

      <SectionShell
        background={
          <>
            <div className="absolute inset-0 bg-[#f7f8f1]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,248,241,0.92),rgba(247,248,241,0.84))]" />
          </>
        }
        spacing="compact"
        variant="image-band"
      >
        <div className="space-y-8">
          <SectionHeader
            align="center"
            eyebrow="Image Band"
            headingSize="sm"
            intro="Image-band chapter menguji decorative handoff setelah patterned shell. Fokusnya bukan visual polish, melainkan memastikan decorative section tetap bisa hidup dalam grammar layout yang sama."
            title="Trust layer harus masuk sebagai chapter, bukan exception"
          />

          <div className="grid gap-4 md:grid-cols-3">
            {trustSignals.map((signal) => (
              <Surface className="space-y-3" key={signal} variant="elevated">
                <p className="type-eyebrow">Trust signal</p>
                <p className="text-sm leading-relaxed text-secondary">{signal}</p>
              </Surface>
            ))}
          </div>
        </div>
      </SectionShell>

      <SectionShell
        id="layout-composition-close"
        spacing="compact"
        variant="plain"
      >
        <Surface className="space-y-6 text-center" variant="accent">
          <SectionHeader
            align="center"
            eyebrow="CTA Close"
            headingSize="lg"
            intro="Closing CTA hadir terakhir untuk memeriksa page close rhythm dan memastikan chapter penutup tidak membutuhkan rule lokal di luar sistem."
            title="Jika halaman ini terasa rapi, hukum layout bekerja"
          />

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              className="polish-action polish-action--dark"
              href="/home"
            >
              Compare with homepage
            </a>
            <a
              className="polish-action polish-action--soft"
              href="#layout-composition-hero"
            >
              Back to hero
            </a>
          </div>
        </Surface>
      </SectionShell>
    </PageFrame>
  )
}
