# AI Project Instructions

Version: 1.1

Status: Highest Priority

---

# Purpose

This repository is AI-first.

Before writing, modifying, or deleting any code, read every document in the `.ai` directory.

Do not make assumptions.

When requirements conflict, follow the priority order below.

---

# Locked MVP Decisions

- Folder: `.ai/` (not `ai/`)
- App code lives under `src/`
- Validation: React Hook Form + Zod only (no Yup)
- Auth: Auth.js + Google + JWT; first admin seeded from `ADMIN_EMAIL`
- Blog body: TipTap JSON column; TipTap editor with block tooling
- Comments: self-referential `parentId` (no Reply model)
- SEO: reusable `Seo` model for blogs, books, products, pages
- Reads: Server Components; TanStack Query only for interactive client features
- Data access: `features/*/services` + `lib/db` (no separate repository layer)
- API: `app/api` = route handlers; `features/*/api` = client helpers
- State priority: Server State → URL State → Local State
- MVP statuses: Draft + Published only (no scheduled publishing)
- Public search: Phase 2; admin search only in MVP
- Views/analytics: Phase 2

---

# Priority Order

1. master-spec.md
2. roadmap.md
3. architecture.md
4. database.md
5. folder-structure.md
6. coding-rules.md
7. api-rules.md
8. security.md
9. design-system.md
10. components.md
11. ui-patterns.md
12. admin.md
13. seo.md
14. content-guidelines.md
15. animations.md
16. performance-rules.md

Lower-priority files must never override higher-priority files.

---

# Brand Colors (current)

- Primary / Accent surface: `#D3DEFA`
- Background: `#FFFFFF`
- Text: `#1B1C1B`
- Link (a11y-adjusted): `#4A62B0`

---

# Final Principle

Build a small, polished, maintainable product.

Do not optimize for every future possibility.

Optimize for today's requirements while keeping the architecture ready to grow.
