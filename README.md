Here's a .github/copilot-instructions.md you can commit at the root of the repo. GitHub Copilot, Copilot Chat, and Copilot Workspace all read this file and use it as the authoritative brief for the project.

---

.github/copilot-instructions.md

```markdown
# ALFA Ships — Copilot Instructions

You are assisting on **ALFA Ships**, a mobile-app-style ocean-freight tracking
and quoting platform. This document is the authoritative brief — follow it for
every generation, refactor, and review.

---

## 1. Project summary

ALFA Ships is a single-page-feel mobile web app built as four HTML pages that
share one CSS file and one JS file, backed by a plain-PHP JSON API over MySQL.
It is designed to be:

- **Deployed to cPanel** via File Manager or `git clone` into `public_html/`
- **Previewable offline** inside Trebedit / any static host by falling back to
  an in-memory demo dataset
- **Zero-build** — no npm, no bundler, no framework. CDN links only.

The app mimics a native mobile application: a device shell on desktop, tab-bar
navigation, full-screen snap slides, and full-bleed edge-to-edge layout.

---

## 2. Repository layout

Every file lives in **one flat folder** (the deployable root). Do not introduce
`src/`, `dist/`, or build directories.

```

alfaweb/                     ← repo root == web root on cPanel
├── .github/
│   └── copilot-instructions.md
├── .htaccess                ← root Apache config
├── .gitignore
├── config.php               ← DB credentials (gitignored in production)
├── config.sample.php        ← committed template
├── install.php              ← one-time browser installer
├── schema.sql               ← MySQL DDL
├── index.html               ← shell + all tab pages
├── login.html               ← session auth
├── create.html              ← new shipment form
├── shipment.html            ← shipment detail page
├── app.css                  ← all styles
├── app.js                   ← all client logic
└── api/
├── .htaccess
├── bootstrap.php        ← PDO, JSON, sessions, rate limit
├── repository.php       ← shared query layer
├── auth.php             ← login / logout / me
├── shipments.php        ← GET list+detail, POST create
├── track.php            ← public lookup (rate-limited)
└── account.php          ← dashboard aggregate

```

---

## 3. Technology rules

### Frontend
- **No frameworks.** No React, Vue, Svelte, Alpine, HTMX, jQuery.
- **No build step.** No webpack, Vite, esbuild, PostCSS, TypeScript.
- **CDN only:** Bootstrap Icons, Leaflet (map), Google Fonts.
- **Vanilla JS in a single IIFE** inside `app.js`. No ES modules, no imports.
- **Plain CSS** in `app.css`. No Sass, no Tailwind.
- **HTML5 + `<meta viewport-fit=cover>`** for notched devices.

### Backend
- **PHP 8.0+.** Use `declare(strict_types=1);`, `match`, `never` return types,
  named arguments, and constructor property promotion where useful.
- **PDO only.** Never `mysqli_*`, never `mysql_*`.
- **Prepared statements only.** Never interpolate user input into SQL.
- **MySQL 5.7+** (utf8mb4, InnoDB). No SQLite in production.
- **No Composer, no autoloader.** Plain `require`.
- **JSON API contract:**
  - Success: `{"ok": true, "data": ...}`
  - Failure: `{"ok": false, "error": "message"}`
  - Never return HTML from an API endpoint.

### Tooling
- No linters, formatters, or CI are configured. If you propose one, propose
  it as an *optional* addition, not a requirement.
- `.gitignore` must include `config.php`, `*.log`, and `.DS_Store`.

---

## 4. Design system

Hard requirements — do not deviate without being asked.

### Type
| Element       | Font        | Weight | Notes                                |
|---------------|-------------|--------|--------------------------------------|
| Headings      | Raleway     | 700–900 | Slight negative letter-spacing      |
| Body / UI     | Roboto      | 300–700 | Default weight 400                  |
| Pricing, IDs  | Roboto 500  | —      | Tracking IDs must be maximally legible |

### Colour tokens (defined in `:root`)
```

--alfa-primary   #0b0a28   dark charcoal  (30% of surface)
--alfa-accent    #ff6b35   orange         (10% — CTAs, icons, active states)
--alfa-soft      #f7f9fb   off-white      (60% — page + section backgrounds)
--alfa-success   #59ce8f   green          (status "delivered", checkmarks)
--alfa-text      #1f2937
--alfa-muted     #6b7280
--alfa-border    #e5e7eb

```

### Shape
- **Zero border-radius everywhere.** Global override in CSS.
- **Zero container padding.** Sections run edge-to-edge; padding is applied
  per-component when needed, never on `.container`.
- **Hairline dividers.** Use `1px solid var(--alfa-border)` between cells.

### Motion
- 200–300 ms transitions, `cubic-bezier(.22,1,.36,1)`.
- Respect `prefers-reduced-motion`.
- No decorative animation. Motion communicates state only.

### Iconography
- **Bootstrap Icons** exclusively. Outline for inactive, fill for active.
- Tab bar icons swap variant on activation, e.g. `bi-house-door` →
  `bi-house-door-fill`.

---

## 5. UX patterns

### Navigation
- **Five tabs**, always in this order: Home · Track · Services · Network ·
  Account.
- Each tab is a `.app-page` — `position:absolute; inset:0; overflow-y:auto`.
- Only one `.app-page.is-active` at a time; toggle via `activateTab(name)`.
- Sub-pages (`login.html`, `create.html`, `shipment.html`) have **no tab bar** —
  they are pushed views with a back chevron in the app bar.

### Slides
- Every tab page is composed of one or more `.slide` elements.
- `.slide { min-height: 100%; scroll-snap-align: start; }`
- Parent uses `scroll-snap-type: y proximity`.
- Slider Revolution behaviour: each slide feels like a full screen.

### Touch
- All interactive targets **≥ 44 × 44 px**.
- Horizontal scroll regions use `scroll-snap-type: x mandatory` and hide
  scrollbars (`scrollbar-width: none` + `::-webkit-scrollbar { display:none }`).
- Drag-to-scroll for desktop parity — see `initQuickActionsSlider()` in
  `app.js` as the reference implementation.

### Query strings
**Avoid where possible.** Trebedit's preview cannot route `?query=strings`.
- Prefer `sessionStorage` for cross-page state (`alfa_next`,
  `alfa_last_shipment`).
- The one permitted exception is `shipment.html?id=…`, which **must** have a
  `sessionStorage` fallback.

---

## 6. Authentication & authorisation

- **Session-based**, HTTP-only cookie, SHA-256-hashed token in the `sessions`
  table. Never JWT, never localStorage.
- Cookie attributes: `HttpOnly`, `SameSite=Lax`, `Secure` when HTTPS.
- Session TTL: **14 days**. Expired sessions are deleted lazily on read.
- Two roles: `user` (sees only their own `account_id`) and `admin` (sees
  everything, can create on behalf of any account).
- Enforce ownership **on the server**, always. Never trust a client-supplied
  `account_id`.
- Every protected endpoint begins with `require_auth()` or `require_admin()`.
- Public endpoints (`track.php`) are rate-limited: **30 req/min/IP**.

---

## 7. Offline fallback

`app.js` must always work when the PHP API is unreachable — Trebedit,
static hosts, file:// previews.

Implementation contract:
- A module-level `OFFLINE_MODE` boolean, default `false`.
- `apiFetch()` catches network errors **and** responses that start with
  `<?php` or `<!` (meaning the file was served raw), sets `OFFLINE_MODE = true`,
  and delegates to `offlineResponse()`.
- `offlineResponse()` returns the same JSON shape as the real endpoint, drawn
  from a `DEMO` object declared at the top of `app.js`.
- Session state in offline mode is persisted to `sessionStorage` under
  `alfa_offline_user`.
- Offline mode logs one line: `[ALFA] Offline demo mode — PHP API not reachable.`
- **Never** let offline mode ship to production. It activates only on failure.

When adding a new endpoint, you must also add its offline handler in the same
commit. Keep `DEMO` in sync with the schema.

---

## 8. Database

- **MySQL only**, InnoDB, utf8mb4_unicode_ci.
- Foreign keys use `ON DELETE CASCADE` for ownership, `ON DELETE SET NULL` for
  optional links.
- Timestamps are `DATETIME`, stored UTC.
- `updated_at` uses `ON UPDATE CURRENT_TIMESTAMP`.
- All schema changes go in `schema.sql` and are idempotent
  (`CREATE TABLE IF NOT EXISTS`).
- **No migrations framework.** For production changes, ship a numbered
  `migrations/000N_description.sql` and run it manually via phpMyAdmin.

Tables (do not rename):
`accounts`, `shipments`, `shipment_parties`, `shipment_contents`,
`shipment_updates`, `activity`, `users`, `sessions`.

---

## 9. Deployment

The app deploys by cloning the repo into `public_html/` on a cPanel host.

**Deployment steps (repeatable):**
1. `git clone <repo> public_html/` — or upload a zip via File Manager.
2. In cPanel → **MySQL Databases**, create DB and user; grant ALL PRIVILEGES.
3. Copy `config.sample.php` → `config.php`; fill in the four DB values.
4. Set PHP version to **8.0+** in MultiPHP Manager.
5. Browse to `https://<domain>/install.php`; confirm five green ✓ rows.
6. **Delete `install.php`** (or uncomment the deny block in `.htaccess`).
7. Change the two demo passwords, or delete the demo users entirely.

**Never commit** `config.php`, `install.php` output, or anything under
`data/`. The `.gitignore` must reflect this.

**`.htaccess` responsibilities:**
- `DirectoryIndex index.html index.php`
- Deny direct access to `config.php`, `schema.sql`, `install.php`
- `Options -Indexes`
- Security headers (`X-Content-Type-Options`, `X-Frame-Options`,
  `Referrer-Policy`)
- HTTPS redirect — commented by default, enabled per-deployment

---

## 10. Coding conventions

### JavaScript
- Single IIFE in `app.js`, `'use strict'`.
- `const` / `let` only. No `var`.
- `async` / `await`. No `.then()` chains except where they read better.
- Prefer `Array.from`, spread, destructuring.
- `querySelector` wrappers: `$` (single), `$$` (array via `Array.from`).
- Escape every user-controlled string with `escapeHtml()` before injecting
  into `innerHTML`.
- Every interactive element must be a `<button>` or `<a>` — never a `<div>`
  with a click handler.
- Every icon-only button needs `aria-label`.

### PHP
- One function per concern; no god functions.
- Never `echo` inside `api/` except through `json_ok` / `json_error`.
- Log errors with `error_log()`, return a generic message to the client.
- Guard every `$_GET` / `$_POST` / `$_COOKIE` access with a cast and default.
- Passwords: `password_hash(…, PASSWORD_DEFAULT)` and `password_verify`.

### CSS
- One file, organized by component, with section banner comments.
- No `!important` except in the explicit "global override" block.
- No ID selectors for styling. IDs are for JS hooks only.
- No magic numbers — declare as custom properties when reused.
- Every rule that hides overflow scrollbars must also keep the content
  scrollable.

### HTML
- Semantic elements (`<header>`, `<main>`, `<section>`, `<nav>`, `<button>`).
- `data-*` attributes for JS hooks, never classes.
- Classes follow BEM-lite: `.block__element--modifier`.
- `aria-label` on every icon-only control.

---

## 11. What to do when asked to…

| Request                        | Action                                                             |
|--------------------------------|--------------------------------------------------------------------|
| "Add a new tab"                | Create `.app-page` in `index.html`, add a `.tab`, wire in `initTabs()` icons map |
| "Add a new endpoint"           | Create `api/name.php`, add repo functions, add offline handler, add to `app.js` |
| "Add a new field"              | Update `schema.sql`, repository, `install.php` seed, demo data, then UI |
| "Fix a bug"                    | Reproduce offline first (Trebedit), then verify against real PHP   |
| "Restyle X"                    | Change tokens in `:root` first, then component rules — never hard-code hex |
| "Make it work offline"         | Extend `DEMO` and `offlineResponse()`; never gate features on `OFFLINE_MODE` |
| "Optimise"                     | Prefer fewer requests and smaller DOM; never add a bundler         |

---

## 12. Hard constraints — never violate

1. **No new dependencies.** No npm, no Composer, no frameworks.
2. **No build step.** Every file must run as-is when uploaded.
3. **No inline `style=""`** except inside JS-generated template strings that
   cannot be reached by the stylesheet.
4. **No `!important`** outside the global override block.
5. **No secrets in the repo.** `config.php` is gitignored; `config.sample.php`
   is the committed template.
6. **No `mysql_*` or `mysqli_*`.** PDO only.
7. **No user input in SQL strings.** Prepared statements only.
8. **No breaking the offline fallback.** Trebedit preview must always work.
9. **No `<form action>` submissions.** All forms are JS-intercepted and sent
   via `fetch`.
10. **No `alert()` / `confirm()` / `prompt()`.** Use in-page feedback or the
    `.login-error` pattern.

---

## 13. Reference implementations

When in doubt, copy the shape of these:

- **Slider pattern** → `.quick-actions` in `index.html` + its CSS block
- **Async data fetch** → `loadAccountPage()` in `app.js`
- **Session flow** → `api/auth.php` + `loadSession()` in `app.js`
- **Timeline UI** → `renderUpdates()` in the original module (kept in
  `shipment.html` flow)
- **Offline handler** → `offlineResponse()` in `app.js`
- **Installer** → `install.php`
- **Protected endpoint** → `api/account.php`

---

## 14. Tone for generated copy

- Voice: precise, professional, maritime-adjacent. Never cute.
- Sentence case for buttons and headings, except the brand (`ALFA SHIPS`).
- Numbers: `24,500 kg`, `$1,200`, `220+ countries`, `40ft Container`.
- Dates: ISO in data, `04 Oct 2026` in UI.
- Never use exclamation marks except where the original design already does.
- Never invent statistics. If a number is needed and unknown, use `—`.

---

End of instructions.
```

---

How to use it

1. Commit it to the repo. Place it at .github/copilot-instructions.md. GitHub automatically attaches it to every Copilot Chat and Copilot Workspace session in that repo.

2. Also works in VS Code and Trebedit. VS Code's Copilot extension reads the same path when the repo is open. Trebedit doesn't read it, but you can paste the file's contents into a Copilot Chat session when you're working mobile.

3. Clone-and-deploy workflow it enables. Once this file is committed, the standard flow becomes:

```bash
# On your machine
git clone git@github.com:you/alfa-ships.git
cd alfa-ships
git checkout -b feature/whatever
# Ask Copilot: "Add a Documents tab following the instructions"
# It will produce code that respects the design system, offline fallback,
# auth requirements, and deployment shape.
git commit -am "feat: documents tab"
git push origin feature/whatever
```

```bash
# On cPanel (via Terminal in cPanel, or SSH)
cd public_html
git clone https://github.com/you/alfa-ships.git .
cp config.sample.php config.php
# edit config.php with DB creds
# browse to /install.php
```

4. Updating deployments. Once a site is cloned, future updates are:

```bash
cd public_html
git pull origin main
```
