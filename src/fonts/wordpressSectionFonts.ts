import { Heebo, Plus_Jakarta_Sans } from 'next/font/google'

export const wordpressSectionSans = Plus_Jakarta_Sans({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-wordpress-section-sans',
  weight: ['400', '500', '600'],
})

export const wordpressSectionNumber = Heebo({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-wordpress-section-number',
  weight: ['400'],
})
