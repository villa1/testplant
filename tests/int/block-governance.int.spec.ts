import fs from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

const blocksDir = path.join(process.cwd(), 'src', 'blocks')
const herosDir = path.join(process.cwd(), 'src', 'heros')

const collectFiles = (dir: string, fileName: string): string[] => {
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      return collectFiles(fullPath, fileName)
    }

    return entry.isFile() && entry.name === fileName ? [fullPath] : []
  })
}

describe('block governance', () => {
  it('requires explicit SectionShell spacing in every block component', () => {
    const componentFiles = collectFiles(blocksDir, 'Component.tsx')

    const missingSpacing = componentFiles.filter((filePath) => {
      const source = fs.readFileSync(filePath, 'utf8')
      return source.includes('<SectionShell') && !/spacing\s*=\s*"/.test(source)
    })

    expect(missingSpacing).toEqual([])
  })

  it('prevents the legacy repeated panel padding patterns from returning', () => {
    const componentFiles = collectFiles(blocksDir, 'Component.tsx')
    const legacyPatterns = [
      'rounded-xl border border-border bg-card p-8 md:p-10',
      'rounded-xl border border-border bg-card p-6',
      'rounded-xl border border-border bg-card p-5',
    ]

    const offenders = componentFiles.flatMap((filePath) => {
      const source = fs.readFileSync(filePath, 'utf8')

      return legacyPatterns
        .filter((pattern) => source.includes(pattern))
        .map((pattern) => `${filePath} :: ${pattern}`)
    })

    expect(offenders).toEqual([])
  })

  it('prevents route hero magic negative offsets from returning', () => {
    const heroFiles = collectFiles(herosDir, 'index.tsx')

    const offenders = heroFiles.filter((filePath) => {
      const source = fs.readFileSync(filePath, 'utf8')
      return source.includes('-mt-[')
    })

    expect(offenders).toEqual([])
  })
})
