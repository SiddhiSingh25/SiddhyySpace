# Performance Rules

Version: 1.0

Status: Active

Depends On

- master-spec.md
- architecture.md
- coding-rules.md
- seo.md

---

# Purpose

Performance is a product feature.

Every decision should prioritize

• Speed

• Stability

• Accessibility

• SEO

• Low bandwidth usage

The website should feel instant.

---

# Performance Goals

Target

Lighthouse

95+

Core Web Vitals

Pass

Target

LCP < 2.5s

CLS < 0.1

INP < 200ms

TTFB < 800ms

---

# Rendering Strategy

Always prefer

Server Components

Use Client Components only when necessary.

Client Components

Forms

Comments

Like Button

Save Button

Search

Theme Switcher (Future)

Dropdown

Modal

Everything else should remain Server Components.

---

# Data Fetching

Prefer

Server-side fetching.

Avoid unnecessary client fetching.

Never fetch the same data twice.

---

# Caching

Use cache where appropriate.

Static Content

Cache aggressively.

Blogs

ISR / Revalidation.

Books

Cache.

Products

Cache.

Landing Page

Cache.

Admin

Never cache.

User Profile

No cache.

Comments

Dynamic.

---

# Revalidation

Landing

Revalidate periodically.

Blogs

Revalidate after publishing or updating.

Books

Revalidate after editing.

Products

Revalidate after editing.

Never rebuild the entire site for small content updates.

---

# Images

Always use

next/image

Rules

Responsive sizes

Lazy loading

Modern formats

Meaningful alt text

Blur placeholder

Logo shimmer fallback

Compress before upload.

---

# Fonts

Use

next/font

Self-host where possible.

Load only required font weights.

Avoid loading unused fonts.

Use font-display: swap.

---

# JavaScript

Ship as little JavaScript as possible.

Avoid large client bundles.

Avoid unnecessary dependencies.

Prefer native browser APIs.

---

# Dynamic Imports

Lazy load

Charts

Heavy editors

Video embeds

Admin-only components

Future AI features

---

# Code Splitting

Split by

Route

Feature

Heavy Component

Never send unused code.

---

# Bundle Size

Avoid large libraries.

Review dependency size before installing.

Remove unused packages.

---

# API Performance

Return only necessary fields.

Avoid over-fetching.

Use pagination.

Avoid N+1 queries.

---

# Database Performance

Index

Slug

Email

Category

Published Date

Tags

Avoid unnecessary joins.

Select only required columns.

---

# Media

Optimize before upload.

Store multiple image sizes.

Future

Automatic WebP

Automatic AVIF

---

# Animations

Animate only

transform

opacity

Avoid layout-triggering animations.

Respect reduced-motion settings.

---

# CSS

Use Tailwind utilities.

Avoid duplicate styles.

Keep global CSS minimal.

---

# Third-party Scripts

Load only when required.

Use lazy loading.

Avoid blocking rendering.

---

# SEO Performance

Maintain

Fast loading

Good Core Web Vitals

Minimal layout shift

Optimized metadata

Performance directly affects search rankings.

---

# Mobile Performance

Prioritize mobile.

Support slow networks.

Reduce data usage.

Optimize touch interactions.

---

# Error Boundaries

Prevent application crashes.

Gracefully recover.

Provide helpful fallback UI.

---

# Monitoring (Future)

Support

Web Vitals

Error Tracking

Analytics

Performance Monitoring

---

# AI Instructions

Before adding any package,

ask

"Can this be solved with existing tools?"

If yes,

do not install another dependency.

Before adding client-side logic,

ask

"Can this run on the server instead?"

Prefer Server Components.

Every feature should preserve performance.

Performance is a requirement,
not an enhancement.