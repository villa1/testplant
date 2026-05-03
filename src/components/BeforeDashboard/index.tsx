import { Banner } from '@payloadcms/ui'
import React from 'react'

import './index.scss'

const baseClass = 'before-dashboard'

export const BeforeDashboard: React.FC = () => {
  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>BMJ dashboard is ready.</h4>
      </Banner>
      <Banner className={`${baseClass}__banner`} type="info">
        <strong>Note:</strong> the old Payload template seed has been removed from the admin UI to avoid
        mixing template demo data into BMJ content.
      </Banner>
      Recommended next steps:
      <ul className={`${baseClass}__instructions`}>
        <li>
          {'Use '}
          <code>pnpm run restore:legacy-bmj</code>.
          {' to re-import legacy BMJ pages, globals, and articles from the curated fixture set in '}
          <code>scripts/data/legacy-bmj</code>.
        </li>
        <li>
          {'Use '}
          <code>pnpm run seed:bmj-ecommerce-samples</code>
          {' when you need lightweight BMJ sample categories, attributes, use cases, and products for shop testing.'}
        </li>
        <li>
          {'Head to '}
          <a
            href="https://dashboard.stripe.com/test/apikeys"
            rel="noopener noreferrer"
            target="_blank"
          >
            Stripe to obtain your API Keys
          </a>
          {
            '. Create a new account if needed, then copy them into your environment variables and restart your server. See the '
          }
          <a
            href="https://github.com/payloadcms/payload/blob/3.x/templates/ecommerce/README.md#stripe"
            rel="noopener noreferrer"
            target="_blank"
          >
            Stripe setup reference
          </a>
          {' if you need test-mode payment keys for checkout flows.'}
        </li>
        <li>
          {'Keep schema changes in sync with '}
          <code>pnpm run generate:types</code>
          {' and use the project README for the current local setup and data import workflow.'}
        </li>
        <li>
          {'Review your '}
          <a
            href="https://payloadcms.com/docs/configuration/collections"
            rel="noopener noreferrer"
            target="_blank"
          >
            collections
          </a>
          {' and add more '}
          <a
            href="https://payloadcms.com/docs/fields/overview"
            rel="noopener noreferrer"
            target="_blank"
          >
            fields
          </a>
          {' as needed. If you are new to Payload, we also recommend you check out the '}
          <a
            href="https://payloadcms.com/docs/getting-started/what-is-payload"
            rel="noopener noreferrer"
            target="_blank"
          >
            Payload docs
          </a>
          {' if you need to extend collection or field behavior.'}
        </li>
      </ul>
      {'Pro Tip: This block is a '}
      <a
        href="https://payloadcms.com/docs/admin/components#base-component-overrides"
        rel="noopener noreferrer"
        target="_blank"
      >
        custom component
      </a>
      , so you can simplify or remove it any time from <strong>payload.config</strong>.
    </div>
  )
}
