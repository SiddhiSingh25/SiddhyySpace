# Siddhyy

Personal brand platform built with Next.js App Router, Prisma, Auth.js, TipTap, and Tailwind CSS v4.

## Setup

1. Copy env file:

```bash
cp .env.example .env
```

2. Fill in `DATABASE_URL`, `AUTH_SECRET`, Google OAuth keys, and `ADMIN_EMAIL`.

3. Install and prepare the database:

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

## Stack notes

- Source lives under `src/`
- Specs live under `.ai/`
- Brand colors: primary `#D3DEFA`, text `#1B1C1B`, background `#FFFFFF`, links `#4A62B0`
- First Google sign-in matching `ADMIN_EMAIL` becomes admin (seed also promotes that email)

## Useful scripts

- `npm run dev` — local server
- `npm run db:studio` — Prisma Studio
- `npm run db:seed` — seed hero/about + admin email
