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

## Features

**Content & editorial**
- Articles, Categories, Tags — all field-level bilingual (ml/en)
- Editorial homepage curation (Homepage global: lead + featured, auto-fills from latest)
- Breaking-news banner (per-article flag), dismissible, site-wide
- Author profiles + pages (`/author/[slug]`) with linked bylines
- Tag/topic pages (`/tag/[slug]`) + related-articles module
- Drafts, autosave, scheduled publishing
- Newsletter subscribers + signup form; nodemailer email adapter (SMTP)

**Reader experience**
- On-site search (`/search`)
- Social share (WhatsApp / Facebook / X / copy link)
- Rich embeds in articles (YouTube / Vimeo) via a Lexical block
- Most-read / trending widget (atomic view counter)
- Web push breaking-news alerts (opt-in; VAPID)
- On-publish revalidation — published edits appear immediately

**Editorial & ops**
- Roles (admin / editor / author) with role-based access; authors submit, editors publish
- Redirects manager (preserves links/SEO on slug changes)
- Ad slots (AdSense) — consent-gated

**Setup notes for optional integrations**
- Web push: `npx web-push generate-vapid-keys`, then set `VAPID_PUBLIC_KEY`,
  `VAPID_PRIVATE_KEY`, and `NEXT_PUBLIC_VAPID_PUBLIC_KEY`.
- Ads: set `NEXT_PUBLIC_ADSENSE_CLIENT`. Analytics: `NEXT_PUBLIC_GA_ID`.

**SEO / distribution**
- Per-locale `<html lang>` (separate root layouts per locale)
- Canonical + `hreflang` alternates (`ml`, `en`, `x-default`) using each locale's own slug
- `NewsArticle` JSON-LD with `inLanguage`
- `robots.txt`, multi-locale `sitemap.xml`, **Google News** `news-sitemap.xml` (last 48h)
- Per-locale RSS feeds (`/rss.xml`, `/en/rss.xml`)
- Branded default OpenGraph image (`/og`); articles use their hero image
- Analytics: cookieless Vercel Analytics + Speed Insights; GA4 gated behind consent

## Deploy to Vercel (Neon Postgres + Blob)

The repo is deploy-ready. `vercel.json` runs `payload migrate && next build`, so the
DB schema is applied automatically at build (the initial migration is committed in
`src/migrations`). **Build runs on Node 22** (pinned via `engines` / `.nvmrc`).

1. **Provision Postgres — Neon.** In the Vercel dashboard → Storage → add **Neon**
   (Postgres). Use its **pooled** connection string (host contains `-pooler`) as
   `DATABASE_URL` — required so serverless functions don't exhaust connections.
2. **Provision media storage — Vercel Blob.** Storage → add **Blob**; it sets
   `BLOB_READ_WRITE_TOKEN`. Without it, uploads would be lost (serverless FS is
   ephemeral); with it, media persists to Blob automatically.
3. **Set env vars** (Project → Settings → Environment Variables):
   - Required: `DATABASE_URL` (pooled), `PAYLOAD_SECRET` (`openssl rand -hex 32`),
     `NEXT_PUBLIC_SITE_URL` (your domain), `BLOB_READ_WRITE_TOKEN`.
   - Optional: `SMTP_*` + `EMAIL_FROM`, `NEXT_PUBLIC_GA_ID`,
     `NEXT_PUBLIC_ADSENSE_CLIENT` + slot ids, `VAPID_*` +
     `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `SENTRY_DSN` + `NEXT_PUBLIC_SENTRY_DSN`.
4. **Connect the repo** and deploy. First build applies the migration to an empty
   DB and prerenders empty listings; open `/admin` to create the first user and add
   content (published edits appear via on-publish revalidation).

### Schema changes later

Dev uses schema push (`scripts/db-push.ts`); production uses migrations. After
changing collections, generate a migration and commit it (**on Node 22** — the
`migrate:create` generator currently breaks on Node 24):

```bash
nvm use            # Node 22 (from .nvmrc)
pnpm payload migrate:create <name>
git add src/migrations && git commit -m "Migration: <name>"
```

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
