# CLAUDE.md

Project notes for `solodiciannoveanniperunsi` — a personal wedding website for Sara & Raffaele (20 Giugno 2026, Sovicille SI). The slug means "only nineteen years for a yes".

## Stack

- **Framework**: SvelteKit 2 + Svelte 5 (runes: `$state`, `$props`, `$effect`, `$derived`)
- **Language**: TypeScript
- **Styling**: TailwindCSS 3 + scoped `<style>` blocks
- **Build**: Vite 6, `@sveltejs/adapter-static` (fully static site)
- **i18n**: typesafe-i18n (locales: `it`, `en`)
- **Package manager**: Yarn 3 (Berry, with workspaces)
- **Lint/format**: ESLint 9 + Prettier (with `prettier-plugin-svelte` and `prettier-plugin-tailwindcss`)
- **Pre-commit**: simple-git-hooks + lint-staged
- **Deploy**: GitHub Pages via GitHub Actions on push to `master`

## Monorepo layout

```
packages/
├── fe/               # Frontend SvelteKit app (the actual site)
├── ui/               # Shared UI helpers (only hooks at the moment)
└── tailwind-config/  # Shared Tailwind + PostCSS config
```

Workspaces declared in root `package.json` under `workspaces.packages: ["./packages/*"]`. The `fe` package depends on the others via `workspace:^`.

## Frontend structure (`packages/fe`)

```
src/
├── routes/
│   ├── +layout.server.ts       # Returns { locale } from locals
│   ├── +layout.ts              # prerender=true, ssr=false; loads locale async
│   ├── +layout.svelte          # Loader, desktop-only-message, HamburgerMenu, slot
│   ├── +page.svelte            # Home → renders <TimelineContainer />
│   ├── cerimonia/+page.svelte
│   ├── ricevimento/+page.svelte
│   ├── rsvp/+page.svelte
│   ├── regalo/+page.svelte     # "Il regalo più grande" — gift section + IBAN
│   └── workinprogress/+page.svelte
├── components/
│   ├── common/
│   │   ├── HamburgerMenu.svelte
│   │   └── popup/DatePopup.svelte
│   └── routes-component/home/timeline/
│       ├── TimelineContainer.svelte    # Renders timeline + all popups
│       ├── TimelineDateItem.svelte
│       ├── TimelineArrow.svelte
│       ├── WeddingDatePopup.svelte
│       └── HoneymoonPopup.svelte
└── lib/
    ├── data/milestones.ts              # MILESTONE_ORDER, _POSITIONS, _IMAGES, BREAKPOINTS
    ├── types/milestone.ts              # MilestoneType union + interfaces
    ├── i18n/{it,en}/index.ts           # Translation strings
    ├── i18n/i18n-svelte.ts             # `LL` store, `setLocale`
    └── hooks/useClickOutside, useInfiniteScroll, useLazyLoad, usePortal
```

### Path aliases (svelte.config.js)

- `$lib` → `./src/lib`
- `$components` → `./src/components`
- `$services` → `./src/services`
- `$project/ui` → `../ui/src/`
- `paths.base = ''` (empty — root deploy on GitHub Pages)

### Build modes

`vite build --mode {dev|stag|prod}` via `build:dev`, `build:stag`, `build:prod` scripts.

## Key domain concepts

### Milestones (timeline)

Six milestones in fixed order: `firstMeeting → engagement → movingTogether → proposal → wedding → honeymoon`.

- `wedding` is **special**: has nested `church` and `reception` (`WeddingLocation` shape with title/name/address/time/description and optional imageUrl/link/linkText).
- `honeymoon` is **special**: has gift fields (`giftMessage`, `giftDescription`, `ibanLabel`, `ibanValue`, `ibanNote`).
- All others are `StandardMilestone` (just date/title/location/description).
- The IBAN is `IT10X0329601601000066506415` intestato a Raffaele Nicodemo. It lives **only in i18n strings** — do not hardcode it elsewhere.

### Timeline rendering

`TimelineContainer.svelte` is the heart of the home page. It detects viewport (`isMobile < 768`, `isTablet 768–1199`, `isDesktop ≥ 1200`) and switches between three layouts:
- **Mobile**: vertical, alternating left/right with serpentine SVG road
- **Tablet**: two rows of 3
- **Desktop**: horizontal with alternating `offsetY` (`MILESTONE_POSITIONS`) and serpentine SVG road

Arrows are calculated as cubic-bezier paths but currently **disabled** (`const showArrows = false`). The serpentine road is enabled (`showRoad = true`).

Each milestone opens a popup on click:
- `wedding` → `WeddingDatePopup` (church + reception cards + RSVP CTA)
- `honeymoon` → `HoneymoonPopup` (description + gift section with IBAN copy button)
- everything else → generic `DatePopup` with description

### Layout / device gating

`+layout.svelte` shows a "open me on your phone" desktop-only message at `min-width: 768px`. **The site is intentionally mobile-only** — desktop and tablet (≥768px) see the redirect message, not the actual content. Keep this in mind when testing visually.

`WORK_IN_PROGRESS` constant in `+layout.svelte` (currently `false`) redirects everything to `/workinprogress` when true.

### Loader

`+layout.svelte` shows a heart-shaped SVG loader for at least 1500ms on initial load and during `$navigating` transitions.

### i18n

Translations live in `src/lib/i18n/{it,en}/index.ts` with `it` as the `BaseTranslation` source. Access in Svelte via `$LL.path.to.key()` — every leaf is a function call. New translation keys must be added to **both** locales or `typesafe-i18n` will fail type-checking. Run `yarn workspace @project/fe typesafe-i18n` to regenerate types after editing.

## Style conventions

The site has a recurring color/typography palette — reuse these instead of inventing new ones:

| Token | Value | Use |
|---|---|---|
| `--champagne` (CSS var-style, but used as literal) | `#c17557` | Borders, accents (class `.border-champagne`, `.color-champagne`) |
| Sage green | `#7a8b7f` / `#8b9f8c` / `#5a6b5f` | Primary text, buttons, decoration |
| Cream backgrounds | `#fafaf8` → `#f5f1ed` (gradient) | Page/loader backgrounds |
| Border light | `#d5cec5` | Soft borders |

Fonts (loaded externally — assume available globally):
- `'Pinyon Script', cursive` — script titles ("Sara e Raffaele", "Menu", "Conferma la tua presenza")
- `'Cormorant Garamond', serif` — body text (class `.font-cormorand` is a common reusable rule with `color: #5a6b5f; line-height: 1.8`)

Page pattern (see `cerimonia/+page.svelte`, `ricevimento/+page.svelte`, `regalo/+page.svelte`): wrap content in
```html
<div class="overflow-hidden">
  <div class="mx-auto px-4">
    <div class="font-cormorand border-champagne rounded-xl border-2 p-6 font-medium">
      ...content...
    </div>
  </div>
</div>
```
and define `.font-cormorand`, `.border-champagne`, `.color-champagne` in the `<style>` block.

Gift section special styling: amber gradient card (`bg-gradient-to-br from-amber-50 to-orange-50`, `border-amber-200`, `text-amber-600`) — distinct from the rest of the site to draw attention.

## Menu

`HamburgerMenu.svelte` (rendered only inside `.mobile-content`). Items list at lines ~15–21 — to add a route, append to `menuItems` array. `isActive(href)` highlights the current page; uses `$page.url.pathname` and `base` from `$app/paths`.

Current menu order: Home, Cerimonia, Ricevimento, RSVP, Il regalo più grande.

## Useful commands

```bash
# From repo root
yarn install                              # install (uses yarn 3)

# From packages/fe (or via `yarn workspace @project/fe <script>`)
yarn dev           # vite dev + typesafe-i18n watcher in parallel
yarn build:prod    # production build → packages/fe/build/
yarn check         # svelte-kit sync + svelte-check
yarn typesafe-i18n # regenerate i18n types after editing translations
```

```bash
# From repo root
yarn lint          # eslint
yarn lint:fix      # eslint --fix
yarn format        # prettier write
```

## Deploy

`.github/workflows/*.yml` — single workflow, on push to `master`:
1. `yarn install --immutable` (needs `EFEBIA_COM_NPM_TOKEN` secret for `@efebia-com/fetcher`)
2. `yarn workspace @project/fe build:prod`
3. Upload `./packages/fe/build` to GitHub Pages

Don't push to master without testing locally — there is no staging deploy.

## Gotchas / non-obvious things

- **Test on mobile viewport**. Resizing to ≥768px hides the actual site behind the desktop-only message — easy to think the site is broken when it's just the gating.
- **Adding new translation strings**: must be added to **both** `it/index.ts` and `en/index.ts`, and the i18n types regenerated, or build fails.
- **`paths.base = ''`** — when building hrefs, prefer `${base}/route` (imported from `$app/paths`) so it stays portable if base ever changes.
- **`prerender = true; ssr = false`** in `+layout.ts` — pure SPA + static prerender. No server-side runtime; don't add `+page.server.ts` files expecting Node at runtime.
- **Honeymoon IBAN data lives in i18n** — the `/regalo` page and the `HoneymoonPopup` both pull from `$LL.milestones.honeymoon.iban*`. Don't duplicate the IBAN string.
- **Adding a new route**: create `src/routes/<name>/+page.svelte`, then add an entry to `menuItems` in `HamburgerMenu.svelte`. No router config needed (SvelteKit FS routing).
- **Yarn berry**: `.yarn/releases` is checked in. Use `corepack enable` or rely on `packageManager: yarn@3.4.1` in package.json.
