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
│   ├── foto/+page.svelte       # "Share the love" — photo gallery (date-gated)
│   └── workinprogress/+page.svelte
├── components/
│   ├── common/
│   │   ├── HamburgerMenu.svelte
│   │   └── popup/DatePopup.svelte
│   └── routes-component/
│       ├── home/timeline/
│       │   ├── TimelineContainer.svelte    # Renders timeline + all popups
│       │   ├── TimelineDateItem.svelte
│       │   ├── TimelineArrow.svelte
│       │   ├── WeddingDatePopup.svelte
│       │   └── HoneymoonPopup.svelte
│       └── foto/
│           ├── PhotoUploader.svelte        # Camera capture + multi-file upload
│           ├── PhotoGrid.svelte            # Thumbnail grid
│           └── PhotoLightbox.svelte        # Full-screen viewer with swipe
├── static/
│   └── robots.txt              # Disallows /foto for crawlers
└── lib/
    ├── api/cloudinary.ts               # uploadPhoto, listPhotos, thumbnailUrl, fullUrl
    ├── config/cloudinary.ts            # cloud_name, preset, tag, compression params
    ├── data/milestones.ts              # MILESTONE_ORDER, _POSITIONS, _IMAGES, BREAKPOINTS
    ├── types/milestone.ts              # MilestoneType union + interfaces
    ├── utils/photosGate.ts             # PHOTOS_RELEASE_DATE + photosAvailable()
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

### Photo gallery (`/foto`)

"Share the love" gallery where guests upload wedding-day photos directly from their phone. Storage on **Cloudinary** (free tier), no backend needed.

**Cloudinary setup** (live in `lib/config/cloudinary.ts`):

- `cloud_name`: `dmedqihzn`
- Unsigned upload preset: `wedding_unsigned` (folder + tag locked to `wedding-2026`, max 15 MB, image-only formats whitelist)
- Public list endpoint: `https://res.cloudinary.com/dmedqihzn/image/list/wedding-2026.json` (requires "Resource list" enabled in Cloudinary Settings → Security)

**Date gate** (`lib/utils/photosGate.ts`): `PHOTOS_RELEASE_DATE = 2026-06-20T08:00:00+02:00` (Europe/Rome). Before that timestamp:

- The "Share the love" menu entry is hidden
- Visiting `/foto` directly shows a "A presto!" placeholder card instead of the upload UI

**Preview flag**: append `?preview=1` to any URL to bypass the date gate (works in dev and prod). Used for testing the unlocked state. Not a real security gate — the actual security is the Cloudinary preset being active or not.

**Upload pipeline** (`lib/api/cloudinary.ts`):

- Client-side compression to max 2000px / JPEG q=0.85 via `<canvas>` + `createImageBitmap({ imageOrientation: 'from-image' })` (handles EXIF)
- HEIC/HEIF files are passed through uncompressed (canvas can't decode them; Cloudinary serves browser-friendly format via `f_auto`)
- Upload via `XMLHttpRequest` for per-file progress events (fetch can't track upload progress)
- Sequential queue for multi-file uploads (one at a time, robust on slow rural connections)

**Optimistic UI**: Cloudinary's list endpoint is CDN-cached (~1 min TTL), so a freshly uploaded photo may not appear in the list immediately. The page handles this by prepending the uploaded photo to the local `photos` array directly from the upload response — no need to refetch.

**Crawler protection**: `/foto` is disallowed in `static/robots.txt` and the page itself has `<meta name="robots" content="noindex,nofollow">`. Belt-and-suspenders against well-behaved crawlers; the date gate handles unknown agents (nothing to scrape before the wedding).

### i18n

Translations live in `src/lib/i18n/{it,en}/index.ts` with `it` as the `BaseTranslation` source. Access in Svelte via `$LL.path.to.key()` — every leaf is a function call. New translation keys must be added to **both** locales or `typesafe-i18n` will fail type-checking. Run `yarn workspace @project/fe typesafe-i18n` to regenerate types after editing.

## Style conventions

The site has a recurring color/typography palette — reuse these instead of inventing new ones:

| Token                                              | Value                             | Use                                                              |
| -------------------------------------------------- | --------------------------------- | ---------------------------------------------------------------- |
| `--champagne` (CSS var-style, but used as literal) | `#c17557`                         | Borders, accents (class `.border-champagne`, `.color-champagne`) |
| Sage green                                         | `#7a8b7f` / `#8b9f8c` / `#5a6b5f` | Primary text, buttons, decoration                                |
| Cream backgrounds                                  | `#fafaf8` → `#f5f1ed` (gradient)  | Page/loader backgrounds                                          |
| Border light                                       | `#d5cec5`                         | Soft borders                                                     |

Fonts (loaded externally — assume available globally):

- `'Pinyon Script', cursive` — script titles ("Sara e Raffaele", "Menu", "Conferma la tua presenza")
- `'Cormorant Garamond', serif` — body text (class `.font-cormorand` is a common reusable rule with `color: #5a6b5f; line-height: 1.8`)

Page pattern (see `cerimonia/+page.svelte`, `ricevimento/+page.svelte`, `regalo/+page.svelte`): wrap content in

```html
<div class="overflow-hidden">
	<div class="mx-auto px-4">
		<div class="font-cormorand border-champagne rounded-xl border-2 p-6 font-medium">...content...</div>
	</div>
</div>
```

and define `.font-cormorand`, `.border-champagne`, `.color-champagne` in the `<style>` block.

Gift section special styling: amber gradient card (`bg-gradient-to-br from-amber-50 to-orange-50`, `border-amber-200`, `text-amber-600`) — distinct from the rest of the site to draw attention.

## Menu

`HamburgerMenu.svelte` (rendered only inside `.mobile-content`). Items list at lines ~15–21 — to add a route, append to `menuItems` array. `isActive(href)` highlights the current page; uses `$page.url.pathname` and `base` from `$app/paths`.

Current menu order: Home, Cerimonia, Ricevimento, RSVP, Il regalo più grande, **Share the love** (only visible after `PHOTOS_RELEASE_DATE` or with `?preview=1`).

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
- **Cloudinary list returns 404 when tag is empty** — `listPhotos()` traps the 404 and returns `[]`. Don't replace this with a generic error; an empty wedding tag is a valid state (especially before the first upload).
- **Cloudinary list endpoint is CDN-cached ~1 min** — never poll it after an upload expecting immediate updates. Use the optimistic UI pattern (prepend the upload response to local state).
- **HEIC/HEIF files skip client-side compression** — the canvas decode path can't read them. They upload at original size (typically 2-3 MB on iPhone, well under the 15 MB cap). Cloudinary's `f_auto` delivers a browser-compatible format on the read side.
- **WSL2 + `/mnt/c` is slow** — running this repo from a Windows-mounted directory in WSL hits noticeable I/O latency. `yarn check` (which runs `svelte-kit sync`) can hang for hours on rebuild steps. If you're debugging hanging tooling, try the same command from PowerShell or move the repo to a native Linux path. The `@rollup/rollup-linux-x64-gnu` optional dep was added explicitly for WSL devs.
