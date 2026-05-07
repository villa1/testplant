import { Attributes } from '@/components/layout/search/Attributes'
import { Categories } from '@/components/layout/search/Categories'
import { PageFrame } from '@/components/layout/PageFrame'
import { SectionShell } from '@/components/layout/SectionShell'
import { FilterList } from '@/components/layout/search/filter'
import { UseCases } from '@/components/layout/search/UseCases'
import { sorting } from '@/lib/constants'
import { Search } from '@/components/Search'
import React, { Suspense } from 'react'

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <PageFrame family="commerce">
        <SectionShell containment="contained" spacing="compact" variant="plain">
          <div className="flex flex-col gap-6 pb-4 md:gap-8">
            <section className="catalog-shell">
              <div className="catalog-shell__inner">
                <p className="catalog-shell__eyebrow">Explore Collection</p>
                <h1 className="catalog-shell__title">Tanaman pilihan untuk proyek, retail, dan lanskap.</h1>
                <p className="catalog-shell__body">
                  Jelajahi katalog BMJ dengan ritme storefront yang lebih terarah. Gunakan pencarian dan filter
                  di bawah untuk menemukan kategori, atribut, dan use case yang paling relevan.
                </p>
                <Search />
              </div>
            </section>

            <div className="grid items-start gap-6 lg:grid-cols-[18rem_minmax(0,1fr)] xl:grid-cols-[19rem_minmax(0,1fr)]">
              <aside className="shop-sidebar">
                <div className="shop-sidebar__header">
                  <p className="shop-sidebar__eyebrow">Filter BMJ</p>
                  <p className="shop-sidebar__body">
                    Pilih kategori dan karakter tanaman untuk mempersempit katalog tanpa keluar dari alur belanja.
                  </p>
                </div>

                <Categories />
                <Attributes />
                <UseCases />
                <FilterList list={sorting} title="Urutkan" />
              </aside>
              <div className="min-h-screen w-full">{children}</div>
            </div>
          </div>
        </SectionShell>
      </PageFrame>
    </Suspense>
  )
}
