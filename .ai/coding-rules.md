# Coding Rules

Version: 1.0

Status: Active

Depends On

- master-spec.md
- architecture.md
- folder-structure.md

---

# Purpose

This document defines the coding standards for the entire project.

Every AI agent and every developer must follow these rules.

Code consistency is more important than personal preference.

---

# General Principles

Always write code that is

• Readable

• Predictable

• Reusable

• Scalable

• Type Safe

• Testable

Never optimize for writing fewer lines of code.

Optimize for long-term maintainability.

---

# Single Responsibility Principle

Every file should have one responsibility.

Every function should have one responsibility.

Every component should have one responsibility.

Avoid large files that try to do everything.

---

# TypeScript

Strict Mode must always be enabled.

Never use

any

Avoid

unknown

unless absolutely necessary.

Prefer

type

for simple object shapes.

Use

interface

when extension is required.

Always type

Props

API Responses

Hooks

Utilities

Database Models

Context Values

---

# Naming Rules

Components

PascalCase

Example

BlogCard.tsx

Hooks

camelCase

Example

useComments.ts

Utilities

camelCase

Example

formatDate.ts

Types

PascalCase

Example

Blog.ts

Constants

UPPER_CASE

Example

MAX_FILE_SIZE

Folders

kebab-case

Example

blog-detail

---

# React Rules

Prefer functional components.

Never use class components.

Never create components larger than necessary.

Extract reusable UI.

Extract repeated logic into hooks.

---

# Server Components

Default to Server Components.

Use Client Components only when needed.

Examples

Client Components

Forms

Buttons

Dropdowns

Search

Comments

Animations

Like Button

Save Button

Everything else should remain Server Components.

---

# Props

Never pass unnecessary props.

Avoid prop drilling.

If prop depth becomes excessive,

consider Context.

Keep APIs simple.

---

# State Management

Priority

1. Server Components

2. Local State

3. URL State

4. Context

Do not introduce global state unless there is a real need.

---

# Hooks

Rules

Hooks should only contain logic.

Hooks should never return JSX.

Hooks should be reusable.

Avoid giant hooks.

Feature hooks stay inside their feature.

Global hooks stay inside hooks/.

---

# API Calls

Never call APIs directly inside components.

Components

↓

Hook

↓

API

↓

Service

↓

Data Access

↓

Database

Every request should be reusable.

---

# Validation

Frontend

React Hook Form

Yup

Backend

Zod

Never trust client validation.

Always validate again on the server.

---

# Error Handling

Never ignore errors.

Every async function should handle failure.

Always return predictable API responses.

Never expose internal errors to users.

Log technical details.

Show friendly messages.

---

# Async Code

Always use

async/await

Avoid nested promises.

Handle loading states.

Handle error states.

Handle empty states.

---

# Logging

Development

Readable logs.

Production

Structured logging.

Never log

Passwords

Secrets

Tokens

Private Keys

---

# Comments

Write self-documenting code.

Only add comments when explaining

Business Logic

Complex Algorithms

Architecture Decisions

Never comment obvious code.

---

# Imports

Always use path aliases.

Good

@/components/ui/Button

Bad

../../../../../Button

Group imports

1. React / Next

2. External Libraries

3. Internal Modules

4. Relative Imports

---

# Constants

Never hardcode values repeatedly.

Extract

Routes

Breakpoints

Regex

Limits

Status Values

Roles

Configuration

---

# Utilities

Utility functions must be

Pure

Reusable

Independent

Never access React inside utilities.

---

# Components

Keep components focused.

Split when necessary.

Avoid files larger than approximately 200 lines.

Compose small components.

---

# Styling

Use Tailwind CSS only.

Avoid inline styles.

Avoid duplicate utility combinations.

Prefer reusable UI components.

---

# Accessibility

Always use semantic HTML.

Buttons must be buttons.

Links must be links.

Forms need labels.

Inputs need IDs.

Images need alt text.

Keyboard navigation must work.

---

# Images

Always use Next Image.

Optimize images.

Lazy load by default.

Show skeleton while loading.

Fallback to branded placeholder if loading fails.

---

# Performance

Avoid unnecessary Client Components.

Avoid unnecessary state.

Memoize only when beneficial.

Use dynamic imports when appropriate.

Prefer Server Components.

Optimize bundle size.

---

# API Response Format

Every API should return a consistent shape.

Success

{
  success: true,
  message: "...",
  data: {}
}

Failure

{
  success: false,
  message: "...",
  errors: []
}

Never return inconsistent response structures.

---

# Security

Validate every input.

Sanitize rich content.

Protect Admin APIs.

Protect routes.

Never trust the client.

---

# Git Rules

Meaningful commit messages.

One logical change per commit.

Avoid committing broken code.

Keep commits focused.

---

# AI Rules

Before creating any new file,

check whether a similar file already exists.

Before creating a new component,

check whether an existing component can be reused.

Before writing logic,

check whether an existing hook or service already solves the problem.

Never duplicate functionality.

If architecture changes,

update the relevant `.ai` documentation first.

---

# Definition of Good Code

Good code is

Easy to understand.

Easy to extend.

Easy to test.

Easy to debug.

Easy to maintain.

The best code is the code that another developer can understand without asking questions.