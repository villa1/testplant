import clsx from 'clsx'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React, { Suspense } from 'react'

import { AttributeItem } from './Attributes.client'

async function AttributeList() {
  const payload = await getPayload({ config: configPromise })

  const attributes = await payload.find({
    collection: 'productAttributes',
    sort: 'title',
  })

  if (!attributes.docs.length) return null

  return (
    <div>
      <h3 className="text-xs mb-2 text-neutral-500 dark:text-neutral-400">Attribute</h3>

      <ul>
        {attributes.docs.map((attribute) => {
          return (
            <li key={attribute.id}>
              <AttributeItem attribute={attribute} />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

const skeleton = 'mb-3 h-4 w-5/6 animate-pulse rounded'
const activeAndTitles = 'bg-neutral-800 dark:bg-neutral-300'
const items = 'bg-neutral-400 dark:bg-neutral-700'

export function Attributes() {
  return (
    <Suspense
      fallback={
        <div className="col-span-2 hidden h-[400px] w-full flex-none py-4 lg:block">
          <div className={clsx(skeleton, activeAndTitles)} />
          <div className={clsx(skeleton, activeAndTitles)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
        </div>
      }
    >
      <AttributeList />
    </Suspense>
  )
}
