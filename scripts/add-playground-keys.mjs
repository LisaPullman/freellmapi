#!/usr/bin/env node
// Adds two new playground.* keys to every locale file, using the English
// value as a placeholder. Translations will follow in their own commits;
// this keeps the i18n validator green so the brand-layer changes can land
// without dragging in 60 translation PRs.
//
// Run from the repo root: node scripts/add-playground-keys.mjs

import { readFile, writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const localeDir = join(__dirname, '..', 'client', 'src', 'i18n', 'locales')

const NEW_KEYS = {
  resetSampling: 'Reset {label} to default',
  clearSystemPrompt: 'Clear system prompt',
}

async function main() {
  const en = JSON.parse(await readFile(join(localeDir, 'en.json'), 'utf8'))
  const playground = en.playground ?? (en.playground = {})
  for (const [k, v] of Object.entries(NEW_KEYS)) {
    if (playground[k] === undefined) playground[k] = v
  }
  await writeFile(join(localeDir, 'en.json'), JSON.stringify(en, null, 2) + '\n')

  const fs = await import('node:fs/promises')
  const files = await fs.readdir(localeDir)
  for (const file of files) {
    if (!file.endsWith('.json') || file === 'en.json') continue
    const path = join(localeDir, file)
    const data = JSON.parse(await readFile(path, 'utf8'))
    const pg = data.playground ?? (data.playground = {})
    let touched = false
    for (const [k, v] of Object.entries(NEW_KEYS)) {
      if (pg[k] === undefined) { pg[k] = v; touched = true }
    }
    if (touched) await writeFile(path, JSON.stringify(data, null, 2) + '\n')
  }
  console.log('Done. Added', Object.keys(NEW_KEYS).length, 'keys to all locales.')
}

main().catch(err => { console.error(err); process.exit(1) })