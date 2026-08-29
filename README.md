<div align="center">

# foxai

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="data:image/svg+xml;utf8,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 width%3D%22220%22 height%3D%2260%22 viewBox%3D%220 0 220 60%22%3E%3Crect width%3D%2260%22 height%3D%2260%22 rx%3D%2214%22 fill%3D%22%23FF7A4D%22%2F%3E%3Cg fill%3D%22none%22 stroke%3D%22%23FFFFFF%22 stroke-width%3D%227.5%22 stroke-linecap%3D%22round%22 stroke-linejoin%3D%22round%22 transform%3D%22translate(0 0)%22%3E%3Cpath d%3D%22M23 55V22c0-7.2 5.8-13 13-13h2%22%2F%3E%3Cpath d%3D%22M12.5 31h21%22%2F%3E%3C%2Fg%3E%3Ccircle cx%3D%2249%22 cy%3D%229%22 r%3D%225.5%22 fill%3D%22%23FFFFFF%22%2F%3E%3Ctext x%3D%2278%22 y%3D%2242%22 font-family%3D%22system-ui%2C sans-serif%22 font-size%3D%2232%22 font-weight%3D%22600%22 letter-spacing%3D%22-0.5%22 fill%3D%22%23ffffff%22%3Efoxai%3C%2Ftext%3E%3C%2Fsvg%3E">
    <img src="data:image/svg+xml;utf8,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 width%3D%22220%22 height%3D%2260%22 viewBox%3D%220 0 220 60%22%3E%3Crect width%3D%2260%22 height%3D%2260%22 rx%3D%2214%22 fill%3D%22%23E2571F%22%2F%3E%3Cg fill%3D%22none%22 stroke%3D%22%23FFFFFF%22 stroke-width%3D%227.5%22 stroke-linecap%3D%22round%22 stroke-linejoin%3D%22round%22 transform%3D%22translate(0 0)%22%3E%3Cpath d%3D%22M23 55V22c0-7.2 5.8-13 13-13h2%22%2F%3E%3Cpath d%3D%22M12.5 31h21%22%2F%3E%3C%2Fg%3E%3Ccircle cx%3D%2249%22 cy%3D%229%22 r%3D%225.5%22 fill%3D%22%23FFFFFF%22%2F%3E%3Ctext x%3D%2278%22 y%3D%2242%22 font-family%3D%22system-ui%2C sans-serif%22 font-size%3D%2232%22 font-weight%3D%22600%22 letter-spacing%3D%22-0.5%22 fill%3D%22%231a1a1a%22%3Efoxai%3C%2Ftext%3E%3C%2Fsvg%3E" alt="foxai" height="60">
  </picture>
</p>

**One key. Every model.** A local-first OpenAI-compatible LLM router with an Ember accent.

This is a fork of [FreeLLMAPI](https://github.com/tashfeenahmed/freellmapi) focused on running
the dashboard on your own machine. The router, the 34 free providers, the model catalog, the
unified `/v1` endpoint — everything upstream — is intact. What this fork adds is a calmer
visual identity, a brand layer that stays out of the way of upstream CSS, and a small set of
interaction polish around the Playground, the toasts, and the loading skeletons.

The feature catalogue, the desktop builds, and the Docker setup all live in
[docs/upstream.md](docs/upstream.md). This README documents only what changed in the foxai
variant.

</div>

---

## Contents

- [Why a fork](#why-a-fork)
- [What changed](#what-changed)
- [Design trade-offs](#design-trade-offs)
- [The brand layer](#the-brand-layer)
- [Local startup](#local-startup)
- [Files that changed](#files-that-changed)
- [Files that did not](#files-that-did-not)
- [Rebasing against upstream](#rebasing-against-upstream)
- [LOGO spec](#logo-spec)

---

## Why a fork

FreeLLMAPI is a great router — it aggregates 34 free LLM providers behind one OpenAI-compatible
endpoint, handles the rate-limit dance, encrypts keys, and ships a polished web dashboard. Two
things pushed me toward a fork instead of a fork-internal config:

1. **Vercel is the wrong destination.** The router needs local SQLite for key storage and
   per-key usage tracking, streams completions straight from upstream, and assumes the box
   running the process is the box holding the secrets. None of that survives a serverless
   deployment cleanly. So this fork's only supported install path is **local**.

2. **A personal visual identity.** The upstream neutrals are deliberately generic — anyone
   who self-hosts reads "your router" before they read "your product." A fork can land a
   single accent (Ember, `#E2571F`) without violating upstream's design grammar, because the
   brand layer is **additive**: every neutral is left alone.

The trade-off accepted up front: this fork tracks upstream manually. Rebases are not free.

---

## What changed

The full file list is in [Files that changed](#files-that-changed). At a glance:

- **Brand layer** — a single Ember accent (`--brand`) plumbed through focus rings, active
  nav state, the success toast, the loading skeleton shimmer, the chart palette, and the
  logo. See [The brand layer](#the-brand-layer) for how it stays additive.
- **LOGO system** — the foxai mark ("Trace"), the tile variant, and the lockup with the
  wordmark. Strokes wear `--brand`; the tile reverses it for sub-24-px surfaces.
- **Toast** — success now wears the brand (orange check + 2 px brand rail on the leading
  edge); error stays destructive red. The two were emerald/red before and that read as
  "this system has an event," not "this product confirmed your action."
- **Loading skeleton** — a brand-tinted shimmer replaces the bare `animate-pulse bg-muted`.
  A 6% `--brand` wash with an 18% highlight stripe sweeping across every 2.4 s, respecting
  `prefers-reduced-motion`.
- **Playground settings panel** — brand-coloured track fill on the range sliders (the
  native `accent-color` was painted on the thumb only; this paints the fill up to the
  thumb), a per-row reset button (appears only when the dialled-in value differs from the
  default), and a clear-button for the system prompt.
- **Agent catalog** — four new cards (Plandex, Windsurf, Sourcegraph Cody, PearAI), each with a
  one-line description mirrored to all 60 locales so no card falls back to the bare protocol
  line.

Everything else — the router, the SQLite schema, the 34 provider adapters, the i18n parity
check, the 60-locale JSON, the Electron desktop, the signed catalog feed — is unchanged
upstream code.

---

## Design trade-offs

A few decisions that were tempting and got turned down, written down so the next pass does
not relitigate them.

| Decision | Verdict | Why |
| --- | --- | --- |
| Replace upstream neutrals | **No** | `git pull upstream main` would conflict on every merge. The brand layer is additive so rebase is a no-op for any line in `index.css`. |
| Recolour `--primary` | **No** | `--primary` is the button colour, and buttons should stay neutral so they read as actions, not as "the brand button." The brand sits in `--ring`, `--chart-1`, and the new `--brand` slot. |
| Brand-coloured primary buttons | **No** | Vercel-style neutral buttons stay neutral. Brand shows up on focus rings and the success state instead. |
| Multiple accent hues | **No** | One accent stays meaningful. Two accents split attention. |
| Replace the favicon | **Yes** | The favicon tile is the only place the brand must be opaque. Strokes would dissolve below 24 px. |
| Inverted dark variant of the brand | **Yes** | The dark `--brand` is `#FF7A4D` (lifted lightness, same hue ≈ 39°), chosen in OKLCH so the perceived contrast stays in the same class. |
| Replace the i18n source language file | **No** | All 60 locale files mirror `en.json` key-for-key. The foxai additions (`resetSampling`, `clearSystemPrompt`) are mirrored with English placeholders so translators can fill them in their own PRs. |

---

## The brand layer

The whole accent system is a single file: `client/src/brand/brand.css`. It is imported
*before* `index.css` so the upstream `--chart-*`, `--ring`, and other tokens win where the
fork did not touch them, and the fork's tokens win where it did.

```css
:root:root {
  --brand: oklch(0.633 0.185 39.6);                /* Ember light */
  --brand-foreground: oklch(0.99 0 0);
  --brand-muted: oklch(0.633 0.185 39.6 / 12%);
  --ring: oklch(0.633 0.185 39.6);
  --chart-1: oklch(0.633 0.185 39.6);
  /* chart-2..5 are a five-step categorical palette
     (blue · teal · violet · slate) so two series on one
     axis are still distinguishable. */
}
:root.dark {
  --brand: oklch(0.727 0.173 39);                  /* Ember dark */
  --brand-foreground: oklch(0.16 0 0);
  --brand-muted: oklch(0.727 0.173 39 / 16%);
}
```

The doubled `:root:root` selector is deliberate. CSS requires `@import` to precede other
rules, so `brand.css` loads **above** `index.css`'s own `:root` block. The extra specificity
is what makes the fork's tokens win regardless of source order.

Brand utilities (`text-brand`, `bg-brand`, `bg-brand-foreground`, `bg-[var(--brand-muted)]`)
are exposed via Tailwind v4's `@theme inline { --color-brand: var(--brand); ... }`.

Where the brand appears:

- The foxai mark (strokes and endpoint dot, see [LOGO spec](#logo-spec)).
- The favicon tile (Ember background, reversed white mark).
- The success toast (Ember check + 2 px leading rail). Errors stay destructive red.
- Loading skeletons (Ember wash + brand sweep). Errors stay destructive red.
- The active nav underline (1 px `--brand` hairline under the active item).
- The active command-palette row (soft `--brand-muted`).
- The active dropdown item (soft `--brand-muted`).
- The "done" state of the first-run checklist (`bg-brand text-brand-foreground`).
- The chart-1 series, the focus ring, the chart palette's categorical colours.
- The Playground range-track fill (gradient from `--brand` to `--input` at the thumb).
- The reset/clear button hover (`bg-[var(--brand-muted)]`).

Where it deliberately does **not** appear:

- Primary buttons (`--primary` stays neutral).
- Body copy, headings, or any "this is the brand speaking" surface larger than the wordmark.
- Modals, popovers, or destructive confirmations.

---

## Local startup

The router runs on Node 20+, talks to a local SQLite database, and exposes an OpenAI-compatible
endpoint on `http://localhost:3001/v1` (the Vite dev server on :5173 proxies `/v1` there). It is
one shell command to start, and one to seed.

### Prerequisites

- macOS or Linux (Windows works but the desktop build is unsigned).
- Node 20 LTS (`nvm install 20 && nvm use 20`).
- A POSIX shell.

### First-time setup

```bash
git clone https://github.com/LisaPullman/freellmapi
cd freellmapi

# 1. Install dependencies (one-time, ~30 s)
npm install

# 2. Create .env with a random ENCRYPTION_KEY
bash scripts/dev-bootstrap.sh

# 3. Initialise SQLite + seed the 25 default models
npm run db:migration:up

# 4. Start the dev server (server on :3001, client on :5173)
npm run dev
```

Open <http://localhost:5173> in your browser. The first-run checklist on the Models page walks
you through adding a provider key, sending a test request, and copying the unified `/v1` key
into the CLI you usually drive.

### Day-to-day

```bash
npm run dev          # server + client, both with hot reload
npm run build        # production client build into client/dist
npm run start        # production server only, after build
```

### Adding a provider key

The Keys page accepts any provider from the live catalog. Free providers require the same key
they hand out on their own dashboard; the router never contacts a paid endpoint.

### Where state lives

- `.env` — `ENCRYPTION_KEY`, `PORT`, `DATABASE_URL`. Never commit it.
- `data/freellmapi.db` — SQLite, auto-created on first migration. Add `data/` to `.gitignore`
  if it is not already (it is).
- `localStorage` in your browser — Playground sampling settings, conversation sessions,
  command-palette state, theme preference.

---

## Files that changed

| File | What changed |
| --- | --- |
| `client/src/brand/brand.css` | The whole brand layer (new). |
| `client/src/brand/logo.tsx` | `Mark`, `Tile`, `Lockup` components (new). |
| `client/src/brand/config.ts` | `BRAND.name`, `BRAND.tagline`, `BRAND.display` (new). |
| `client/src/main.tsx` | Imports `./brand/brand.css` *before* `./index.css`. |
| `client/src/App.tsx` | Brand lockup in the navbar; brand-tinted active nav underline; soft brand background on the active mobile-nav item. |
| `client/src/components/auth-gate.tsx` | Brand lockup replaces the dot + wordmark on the sign-in and forgot-password cards. |
| `client/src/components/empty-state.tsx` | Icon now sits in a brand halo (rounded `bg-[var(--brand-muted)] text-brand`). |
| `client/src/components/command-palette.tsx` | Active row wears `bg-[var(--brand-muted)]`. |
| `client/src/components/getting-started.tsx` | "Done" step wears `bg-brand text-brand-foreground`. |
| `client/src/components/not-found-page.tsx` | Compass icon in a brand halo (matches EmptyState). |
| `client/src/components/toaster.tsx` | Success = `text-brand` + 2 px `border-l-brand` rail. Errors stay destructive. |
| `client/src/components/ui/skeleton.tsx` | Bare `animate-pulse bg-muted` removed; brand-tinted shimmer now lives in `brand.css`. |
| `client/src/components/settings-dialog.tsx` | "FreeLLMAPI" → "foxai" in the app metadata label. |
| `client/src/components/playground/settings-rail.tsx` | Brand-coloured range track fill, per-row reset button, system-prompt clear button. |
| `client/src/data/agent-tools.json` | Four new agent cards: Plandex, Windsurf, Sourcegraph Cody, PearAI — all guide-type, since none exposes a config file an external tool could patch. |
| `cli/src/tools.ts` + `cli/tools.json` | The same four tools on the CLI side (guide generators with base-URL/key/model notes), keeping the three-way catalog parity test green. |
| `client/src/pages/AnalyticsPage.tsx` | Removed the scoped hex palette; uses `--chart-1..5`. |
| `client/public/favicon.svg` | New Ember tile with reversed white mark. |
| `client/index.html` | Title: `foxai · Unified LLM Router`. |
| `LOGO.html` | Self-contained AI-readable spec for the mark (new). |
| `client/dev/brand-preview.html` | Brand direction preview page, moved out of the repo root (sits next to `mockApi.ts`). |
| `README.md` / `docs/upstream.md` | This file replaces the root README; the upstream FreeLLMAPI README is preserved verbatim at `docs/upstream.md`. |
| `docs/README.md` | Points the docs index at the fork README and the preserved upstream overview. |
| `client/src/i18n/locales/*.json` | Added `playground.resetSampling`, `playground.clearSystemPrompt`, and `agents.descriptions.*` for the four new agents to all 60 locales. |
| `scripts/add-playground-keys.mjs` | One-off helper that mirrors new i18n keys to all locales (new). |
| `scripts/add-agent-descriptions.mjs` | Same idea for new agent-card descriptions (new). |

---

## Files that did not

These are upstream files that look like they should be brand-aware but were deliberately left
alone:

- `client/src/index.css` — every neutral token, the chart palette boot, the dark-mode
  mapping. The brand layer overrides only what it must, by `:root:root` specificity.
- `client/src/components/ui/button.tsx` — `--primary` stays neutral.
- `client/src/components/ui/card.tsx`, `popover.tsx`, `dialog.tsx`, `dropdown-menu.tsx` —
  shells stay neutral; brand appears only on active/selected children.
- The 60 locale JSON files — content is unchanged; new keys mirror in via the helper script.

---

## Rebasing against upstream

```bash
git fetch upstream
git rebase upstream/main
```

What you will hit:

1. **`.github/workflows`** — upstream CI adds new jobs. Run `git rebase --continue` after
   accepting the upstream versions; the foxai variant does not depend on anything custom.
2. **`client/src/i18n/locales/*.json`** — upstream adds keys to `en.json` and mirrors them
   to all 60 locales. Accept theirs; the fork's `playground.*` additions are scoped to
   `playground.*` and will not collide.
3. **`client/src/components/ui/*`** — upstream updates shadcn components occasionally.
   Accept theirs; the fork only overrides at the call-site level (empty-state, not-found,
   toaster).
4. **`client/src/pages/AnalyticsPage.tsx`** — re-apply the brand palette override on top of
   any upstream refactor.
5. **`client/src/components/playground/settings-rail.tsx`** — re-apply the brand track +
   reset + clear on top of any upstream refactor.

After rebase, `npm run check:i18n` and `npm run build` should both pass without changes.

---

## LOGO spec

See [`LOGO.html`](./LOGO.html). It is a self-contained, AI-readable spec for the foxai mark:
path data, colour tokens, three variants (Mark / Tile / Lockup), copy-paste recipes for raw
SVG, React, CSS variables, and Tailwind v4 tokens, plus the design rationale. Open it in a
browser to preview every variant, or read it as a Markdown-style reference when reimplementing
the mark in another project.

---

## Disclaimer

This fork is for local, personal use. The router is upstream's work; the brand layer, the
interaction polish, and the LOGO system are mine. See [LICENSE](./LICENSE) for the upstream
MIT terms.