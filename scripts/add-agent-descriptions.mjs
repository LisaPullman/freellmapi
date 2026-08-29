#!/usr/bin/env node
// Adds a `agents.descriptions.<id>` entry to every locale file for each new
// tool id. The English description is the placeholder; translators fill in
// their own locale in a follow-up commit. Same idea as
// scripts/add-playground-keys.mjs — keeps the i18n validator green so the
// brand-layer changes can land without dragging in 60 translation PRs.
//
// Run from the repo root: node scripts/add-agent-descriptions.mjs

import { readFile, writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const localeDir = join(__dirname, '..', 'client', 'src', 'i18n', 'locales')

const NEW_DESCRIPTIONS = {
  plandex: 'AI coding agent for large, multi-step tasks across many files. Uses the OpenAI Chat protocol.',
  windsurf: 'AI-powered IDE with Cascade, a built-in coding agent. Configurable to any OpenAI-compatible endpoint.',
  cody: 'Sourcegraph\'s AI coding assistant. Connects to any OpenAI-compatible provider.',
  pearai: 'Open-source AI code editor forked from VS Code. Uses the OpenAI Chat protocol.',
}

async function main() {
  const en = JSON.parse(await readFile(join(localeDir, 'en.json'), 'utf8'))
  const agents = en.agents ?? (en.agents = {})
  const descs = agents.descriptions ?? (agents.descriptions = {})
  for (const [k, v] of Object.entries(NEW_DESCRIPTIONS)) {
    if (descs[k] === undefined) descs[k] = v
  }
  await writeFile(join(localeDir, 'en.json'), JSON.stringify(en, null, 2) + '\n')

  const fs = await import('node:fs/promises')
  const files = await fs.readdir(localeDir)
  for (const file of files) {
    if (!file.endsWith('.json') || file === 'en.json') continue
    const path = join(localeDir, file)
    const data = JSON.parse(await readFile(path, 'utf8'))
    const ag = data.agents ?? (data.agents = {})
    const d = ag.descriptions ?? (ag.descriptions = {})
    let touched = false
    for (const [k, v] of Object.entries(NEW_DESCRIPTIONS)) {
      if (d[k] === undefined) { d[k] = v; touched = true }
    }
    if (touched) await writeFile(path, JSON.stringify(data, null, 2) + '\n')
  }
  console.log('Done. Added', Object.keys(NEW_DESCRIPTIONS).length, 'agent descriptions to all locales.')
}

main().catch(err => { console.error(err); process.exit(1) })