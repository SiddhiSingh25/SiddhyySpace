# Folder Structure

Version: 1.0

Status: Active

Depends On

- master-spec.md
- architecture.md
- database.md

---

# Philosophy

The folder structure should remain clean for years.

Every folder must have a clear purpose.

If a file does not clearly belong in one folder,
the architecture is wrong.

Avoid deep nesting.

Avoid dumping files into generic folders.

Avoid duplicate utilities.

---

# Root Structure

src/

app/
components/
features/
hooks/
lib/
providers/
services/
config/
constants/
types/
utils/
styles/
assets/

middleware.ts

---

# app/

Responsibilities

• Routing
• Layouts
• Metadata
• Server Components
• Route Groups
• API Routes

Never place business logic inside app/.

---

Example

app/

(layouts)

(auth)

(admin)

(blog)

(api)

globals.css

layout.tsx

page.tsx

---

# components/

Only globally reusable UI.

Example

components/

ui/

layout/

feedback/

forms/

navigation/

typography/

animations/

loading/

Never place feature-specific UI here.

Example

❌ BlogComment.tsx

belongs inside

features/blog/components

---

# components/ui

Contains

Button

Input

Textarea

Checkbox

Switch

Modal

Dialog

Drawer

Badge

Avatar

Card

Tooltip

Popover

Accordion

Tabs

Pagination

Breadcrumb

Spinner

Skeleton

LogoShimmer

Toast

All must be reusable.

---

# components/layout

Container

Section

Grid

Stack

Sidebar

Header

Footer

Navbar

PageWrapper

ContentWrapper

---

# components/forms

Reusable form elements.

Input

Textarea

Select

Radio

Checkbox

DatePicker

Uploader

Password

OTP

Search

---

# components/feedback

EmptyState

ErrorState

LoadingState

NoData

Offline

---

# components/typography

Heading

Text

Caption

Display

SectionTitle

Paragraph

Quote

---

# components/navigation

Navbar

Sidebar

Menu

Pagination

Breadcrumb

---

# components/loading

Skeletons

Shimmer

Placeholder

Logo Placeholder

---

# features/

Every business feature owns itself.

Example

features/

auth/

blog/

books/

products/

spotify/

celebration/

comments/

likes/

saved/

hero/

about/

search/

profile/

settings/

admin/

seo/

newsletter/

---

# Feature Structure

Each feature follows exactly the same structure.

Example

blog/

components/

hooks/

api/

services/

schemas/

types/

constants/

utils/

actions/

queries/

mutations/

index.ts

Never skip folders randomly.

---

# Feature Components

Contains only components used by that feature.

Example

BlogCard

BlogHero

BlogSidebar

CommentList

CommentForm

LikeButton

ReadingProgress

RelatedBlogs

These components should never leak into global components.

---

# hooks/

Only global reusable hooks.

Allowed

useDebounce

useMediaQuery

useIntersection

useInfiniteScroll

useLocalStorage

Not Allowed

useBlog

useComments

useBooks

Those belong inside their feature.

---

# services/

Global services only.

Cloudinary

Logger

Analytics

Storage

Email

Monitoring

Never place feature logic here.

---

# lib/

Third-party integrations.

Prisma

Axios

Auth

Cloudinary

Logger

Date

---

# providers/

ThemeProvider

SessionProvider

ToastProvider

QueryProvider

Application Providers only.

---

# config/

Routes

Navigation

Metadata

Environment

Site Config

Theme Config

---

# constants/

Global constants only.

Roles

Routes

Regex

Breakpoints

---

# types/

Global shared types.

Feature types belong inside features.

---

# utils/

Pure utility functions.

Never place business logic here.

---

# styles/

Global CSS

Tailwind

Animations

Typography

Utilities

---

# assets/

Fonts

Icons

Images

Logos

Illustrations

SVG

---

# Public Folder

public/

icons/

images/

fonts/

robots.txt

favicon.ico

manifest.json

---

# Import Rules

Allowed

Feature

↓

Shared Components

↓

Lib

↓

Utils

Not Allowed

Feature A

↓

Feature B internal files

Always expose public APIs.

---

# Barrel Files

Every feature should expose

index.ts

Example

features/blog/index.ts

Export only public modules.

Hide internal implementation.

---

# Aliases

Always use path aliases.

Example

@/components

@/features

@/hooks

@/lib

@/utils

Avoid long relative imports.

Never use

../../../../

---

# File Naming

Components

PascalCase

Hooks

camelCase

Utilities

camelCase

Constants

UPPER_CASE

Folders

kebab-case

---

# File Size

Component

Target

Less than 200 lines.

Hook

Less than 150 lines.

Utility

Small and focused.

Large files should be split.

---

# One Component One Responsibility

Bad

BlogPage.tsx

contains

Hero

Comments

Sidebar

Books

Products

Related

Everything

Good

Compose multiple smaller components.

---

# Co-location

Keep related files together.

Example

blog/

BlogCard.tsx

BlogCard.test.tsx

BlogCard.types.ts

BlogCard.styles.ts

---

# Testing Ready

Architecture should allow future

Unit Tests

Integration Tests

E2E Tests

Without restructuring.

---

# AI Instructions

Before creating a file

Ask

"Does this already exist?"

If yes

Reuse.

Never duplicate.

Never create similar components with different names.

Consistency is mandatory.