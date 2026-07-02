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

## Deploy (Vercel + Neon Postgres)

Production uses **migrations** (not dev push). Before the first deploy:

```bash
pnpm payload migrate:create initial   # generate migration from the schema
git add src/migrations && git commit -m "Add initial DB migration"
```

Then on Vercel:
1. Provision a Postgres database (Neon / Vercel Postgres) and copy its connection string.
2. Set env vars: `DATABASE_URL`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SITE_URL`, and
   optionally `SMTP_*`, `EMAIL_FROM`, `NEXT_PUBLIC_GA_ID`.
3. Deploy. `vercel.json` runs `payload migrate` before `next build`, so the schema
   is applied automatically.

> Dev uses `scripts/db-push.ts` (schema push); production uses migrations.

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
