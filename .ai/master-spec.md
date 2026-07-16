# Personal Brand Platform - Master Specification

Version: 1.0

Status: Active

Priority: Highest

---

# Project Vision

This project is not a simple blog website.

It is a long-term Personal Brand Platform designed to help the owner share knowledge, document their journey, build trust with readers, recommend products and books, grow an audience, and create multiple monetization channels.

The platform should feel premium, calm, elegant, modern, and trustworthy.

Every design decision, engineering decision, and architectural decision should support long-term scalability.

The project should be maintainable for many years without requiring large-scale rewrites.

---

# Product Goals

Primary Goals

• Build a memorable personal brand.
• Publish high-quality blogs.
• Build trust with readers.
• Improve SEO.
• Support affiliate marketing.
• Create a beautiful reading experience.
• Build an engaged community.
• Keep the website extremely fast.
• Make all content manageable through an Admin Dashboard.

Secondary Goals

• Newsletter
• Analytics
• Search
• AI Features
• Mobile App
• Multiple Authors
• Courses
• Digital Products

The initial architecture must allow these future features without major refactoring.

---

# Product Philosophy

The website should never feel like a template.

The website should feel handcrafted.

Every page should feel intentional.

Less is better.

Whitespace is a design element.

Typography is a design element.

Motion should guide attention rather than distract users.

The reading experience is more important than visual effects.

---

# User Types

## Guest

Can

- Browse pages
- Read blogs
- View books
- View products
- View playlists
- View celebrations
- Search content

Cannot

- Like
- Save
- Comment

---

## User

Authenticated using Google.

Can

- Like blogs
- Save blogs
- Comment
- Reply
- Manage profile

Future

- Reading history
- Notifications
- Follow topics
- Newsletter

---

## Administrator

Complete control over the platform.

Can manage

- Blogs
- Categories
- Tags
- Books
- Products
- Spotify playlists
- Hero section
- About section
- Celebrations
- Users
- Comments
- Media
- SEO
- Website settings

Nothing should require editing source code.

Everything should be manageable from the Admin Dashboard.

---

# Technical Philosophy

Prefer maintainability over shortcuts.

Prefer readability over cleverness.

Prefer reusable components over duplicated code.

Prefer composition over inheritance.

Prefer Server Components whenever possible.

Client Components should only exist where interactivity is required.

Business logic must never exist inside UI components.

---

# Code Quality Standards

Every file should have a single responsibility.

Every function should have a single responsibility.

Avoid large components.

Avoid large files.

Extract reusable logic into hooks, services, or utilities.

Never duplicate logic.

Never duplicate styles.

Never duplicate validation.

Never duplicate API code.

---

# Technology Stack

Frontend

- Next.js (App Router)
- TypeScript
- Tailwind CSS v4
- Framer Motion
- React Hook Form
- Axios
- React Icons

Backend

- Next.js Route Handlers
- PostgreSQL
- Prisma ORM
- Auth.js

Validation

Frontend

- Yup

Backend

- Zod

Media

- Cloudinary

Deployment

- Vercel

---

# Design Principles

The platform should feel

- Warm
- Minimal
- Elegant
- Calm
- Modern
- Comfortable
- Premium
- Human

Avoid

- Flashy gradients
- Heavy shadows
- Busy layouts
- Tiny text
- Tight spacing
- Over-animation

---

# Responsive Philosophy

Always design Mobile First.

The phone experience is the highest priority.

Every page must work perfectly on

320px

360px

375px

390px

414px

640px

768px

1024px

1280px

1536px

No horizontal scrolling.

No layout shifts.

No overflowing components.

---

# Performance Philosophy

Performance is a feature.

Every feature should be implemented with performance in mind.

Always

- Lazy load
- Code split
- Optimize images
- Optimize fonts
- Cache appropriately
- Avoid unnecessary re-renders
- Avoid unnecessary Client Components

Target

Lighthouse

95+

---

# Accessibility

Accessibility is mandatory.

Always use

- Semantic HTML
- Keyboard navigation
- Visible focus states
- ARIA labels
- Proper heading hierarchy
- Accessible forms

Never sacrifice accessibility for aesthetics.

---

# SEO Philosophy

Every page should be discoverable.

Every blog should support

- Meta Title
- Meta Description
- OpenGraph
- Twitter Card
- Structured Data
- Canonical URL
- Reading Time
- Slug
- Sitemap
- Robots
- Breadcrumbs

SEO should never be an afterthought.

---

# Security

Validate every request.

Never trust client data.

Protect Admin Routes.

Protect APIs.

Escape unsafe content.

Follow least privilege.

---

# AI Coding Rules

Whenever an AI agent modifies the project, it must

1. Read every file inside `.ai/`.

2. Never violate previous architectural decisions.

3. Prefer extending existing modules instead of creating duplicates.

4. Keep the project consistent.

5. Update documentation if architecture changes.

6. Never introduce technical debt for short-term convenience.

7. Always think about future scalability before implementation.

---

# Future Vision

This project should eventually support

- AI Search
- AI Content Recommendations
- Newsletter
- Reading Progress
- Continue Reading
- Trending Articles
- Search
- Drafts
- Scheduled Publishing
- Version History
- Analytics Dashboard
- Media Library
- Resource Library
- Digital Products
- Courses
- Multiple Authors
- Mobile Application

The architecture should be designed today so these features can be added tomorrow with minimal effort.

---

# Definition of Success

Success is not measured by how quickly code is written.

Success is measured by

- Maintainability
- Scalability
- Readability
- Performance
- Accessibility
- SEO
- User Experience
- Developer Experience

Every implementation should move the project closer to these goals.