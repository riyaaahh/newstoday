# NewsToday

Malayalam-first news portal built on **Payload 3 + Next.js (App Router)**, with an English edition.

- **Primary locale:** Malayalam (`ml`) — served at the root with no URL prefix (`/`).
- **Second locale:** English (`en`) — served under `/en`.
- Content is authored once and **translated per field** (same story, two languages), linked for `hreflang`.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router), ISR (`revalidate = 60`) |
| CMS | Payload 3 (self-hosted, admin at `/admin`) |
| Database | PostgreSQL (`@payloadcms/db-postgres`) |
| Editor | Lexical rich text |
| Fonts | Noto Sans Malayalam + Inter via `next/font` |

## SEO features

- Per-locale `<html lang>` (separate root layouts per locale).
- Canonical + `hreflang` alternates (`ml`, `en`, `x-default`) using each locale's own slug.
- `NewsArticle` JSON-LD with `inLanguage`.
- `robots.txt` and a multi-locale `sitemap.xml`.

## Requirements

- Node `24` (see `.nvmrc`), pnpm `9`/`10` (via corepack).
- A running PostgreSQL instance.

## Setup

```bash
nvm use                 # Node 24
corepack enable         # pnpm
pnpm install
cp .env.example .env    # then set DATABASE_URL + PAYLOAD_SECRET
createdb malayalam_news # if using a fresh local Postgres
pnpm dev                # http://localhost:3000
```

Open `/admin` to create the first user, then add Categories and Articles. Use the
locale switcher in the admin top bar to fill in each language.

### Seed sample data (optional)

```bash
pnpm exec tsx scripts/seed.ts
```

Creates an editor (`editor@newstoday.test` / `password123`), a bilingual
category, and a translated article.

## Project layout

```
src/
  app/
    (ml)/...            # Malayalam routes at root: /, /[category], /[category]/[slug]
    (en)/en/...         # English routes under /en
    (payload)/...       # Payload admin + API
    robots.ts, sitemap.ts
  collections/          # Articles, Categories, Media, Users
  fields/slugField.ts   # auto-slug from title (localized)
  components/           # SiteHeader, ArticleCard, ArticleBody, JSON-LD, MediaImage
  views/                # HomeView, CategoryView, ArticleView (shared by both locales)
  lib/                  # locale, i18n, queries, seo, metadata helpers
```
