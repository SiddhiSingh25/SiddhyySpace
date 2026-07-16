# Architecture

Version: 1.0

Status: Active

Depends On:
- master-spec.md

---

# Purpose

This document defines the architecture of the Personal Brand Platform.

Every AI agent must follow this architecture.

Do not introduce new architectural patterns unless absolutely necessary.

Consistency is more important than personal preference.

---

# Architectural Style

Use Feature First Architecture.

Avoid Layer First Architecture.

Avoid dumping everything into components, hooks, utils, or services.

Every feature should own its own files.

---

# High Level Architecture

Presentation Layer

↓

Feature Layer

↓

Business Layer

↓

Data Layer

↓

Database

Each layer has a single responsibility.

---

# Feature Modules

Each major feature is isolated.

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

search/

hero/

about/

profile/

admin/

seo/

Every feature owns

• Components

• Hooks

• API

• Types

• Validation

• Utils

• Constants

Never place feature code inside another feature.

---

# Project Structure

src/

app/

components/

features/

hooks/

services/

providers/

lib/

config/

schemas/

types/

constants/

store/

styles/

utils/

assets/

middleware.ts

Every folder has a specific purpose.

Never create random folders.

---

# Responsibilities

## app/

Routing only.

Layouts.

Pages.

Server Components.

Metadata.

No business logic.

---

## components/

Global reusable UI.

Button

Input

Card

Modal

Toast

Avatar

Container

Section

Heading

Text

Skeleton

Badge

Pagination

Breadcrumb

Loading

Do not place feature-specific UI here.

---

## features/

Contains every business feature.

Each feature should be completely isolated.

---

## hooks/

Only globally reusable hooks.

Example

useDebounce

useInfiniteScroll

useMediaQuery

Do not place feature hooks here.

Feature hooks belong inside their feature.

---

## services/

Reusable services.

Cloudinary

Authentication helpers

Logger

Email

Storage

Analytics

Never place feature logic here.

---

## lib/

Third-party configuration.

Prisma

Auth

Axios

Cloudinary

Logger

---

## providers/

Theme

Session

Toast

Query

Application Providers

---

## config/

Application configuration.

Navigation

Site Metadata

Routes

Environment Variables

Constants

---

## schemas/

Global validation.

Feature validation belongs inside features.

---

## types/

Global shared types only.

---

## constants/

Global constants.

---

## utils/

Pure utility functions.

Never place business logic here.

---

# Feature Structure

Every feature follows the same structure.

Example

features/

blog/

components/

hooks/

api/

schemas/

types/

utils/

constants/

services/

index.ts

Maintain this consistency.

---

# Data Flow

UI

↓

Hook

↓

API

↓

Service

↓

Repository

↓

Database

Never allow

UI

↓

Database

Never bypass layers.

---

# Server Components

Default to Server Components.

Use Client Components only for

Forms

Buttons

Animations

Interactive UI

Modals

Dropdowns

Comment input

Like button

Save button

Search

Never convert entire pages to Client Components unnecessarily.

---

# API Design

Each feature owns its own API.

Example

blog/api/

comments/api/

products/api/

Never create a massive api folder.

---

# State Management

Prefer local state.

Then URL state.

Then Server Components.

Then Context.

Introduce global state only when truly necessary.

Avoid unnecessary complexity.

---

# Database Access

Never query Prisma directly inside components.

Only repositories may communicate with Prisma.

---

# Dependency Rules

Allowed

Feature

↓

Shared Components

↓

Services

↓

Lib

Not Allowed

Feature A

↓

Feature B internals

Use public APIs instead.

---

# Reusable Components

Reusable components must be generic.

Bad

BlogButton

Good

Button

Bad

BookCardButton

Good

Card

Specialization belongs inside features.

---

# Error Handling

Every layer handles only its own responsibility.

UI

Displays friendly messages.

API

Returns structured responses.

Repository

Handles database failures.

---

# Folder Boundaries

Never

Mix UI with business logic.

Mix validation with UI.

Mix database code with React.

Mix feature code with global code.

---

# Future Scalability

Architecture must support

Notifications

Bookmarks

Drafts

Scheduled Publishing

AI Search

Analytics

Media Library

Courses

Digital Products

Multiple Authors

Without major refactoring.

---

# AI Instructions

Whenever implementing a new feature

1. Check if a feature already exists.

2. Extend existing modules before creating new ones.

3. Do not duplicate components.

4. Follow folder boundaries.

5. Keep architecture consistent.

6. Never sacrifice maintainability for speed.

Architecture consistency is more important than generating code quickly.