# API Rules

Version: 1.0

Status: Active

Depends On

- master-spec.md
- architecture.md
- database.md
- coding-rules.md

---

# Purpose

This document defines the API architecture for the entire project.

Every API endpoint, service, validation rule and response format must follow this document.

The goal is consistency, scalability and maintainability.

---

# API Philosophy

The API should be

• Predictable

• Consistent

• Type Safe

• Easy to Extend

• Easy to Debug

• Secure

Never create endpoints that behave differently without a good reason.

---

# API Style

Use REST API.

Follow standard HTTP methods.

GET

POST

PUT

PATCH

DELETE

Never use POST for reading data.

Never use GET for creating data.

---

# Route Structure

app/api/

auth/

blogs/

comments/

likes/

saved/

books/

products/

playlists/

celebrations/

users/

settings/

upload/

Every feature owns its own API routes.

---

# API Flow

Every request must follow this flow.

Client

↓

Validation

↓

Route Handler

↓

Service

↓

Data Access Layer

↓

Prisma

↓

Database

Never skip layers.

Never query Prisma directly inside Route Handlers.

---

# Validation

Every request must be validated.

Frontend

React Hook Form + Yup

Backend

Zod

Never trust frontend validation.

Always validate again.

---

# Authentication

Public APIs

No login required.

Private APIs

Require authenticated user.

Admin APIs

Require Admin role.

Every protected route must verify permissions.

---

# Authorization

Authentication identifies the user.

Authorization checks permissions.

Never confuse the two.

---

# Standard Response Format

Success

{
  "success": true,
  "message": "Blog fetched successfully.",
  "data": {},
  "meta": {}
}

Failure

{
  "success": false,
  "message": "Validation failed.",
  "errors": []
}

Always return the same response shape.

---

# HTTP Status Codes

200 OK

201 Created

204 No Content

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

409 Conflict

422 Validation Error

500 Internal Server Error

Use the correct status code.

---

# Pagination

Never return unlimited records.

Support

page

limit

Return

total

page

pages

limit

hasNext

hasPrevious

---

# Sorting

Support

Newest

Oldest

Most Popular

Most Viewed (future)

Title

Published Date

---

# Filtering

Support filtering by

Category

Tag

Status

Author

Date

Search

Never create separate endpoints for simple filters.

Use query parameters.

---

# Searching

Search should support

Title

Excerpt

Tags

Category

Future

Full Text Search

AI Search

---

# Slugs

Every public resource should use a slug.

Example

/blogs/building-a-personal-brand

Avoid numeric IDs in public URLs.

---

# Soft Delete

Never permanently delete

Blogs

Books

Products

Media

Comments

Use soft delete where appropriate.

---

# Uploads

All uploads go through one upload service.

Support

Images

Future

Videos

Documents

Compression

WebP

Folders

Cloudinary

---

# Error Handling

Never expose internal errors.

Bad

Prisma Error

Good

"Something went wrong. Please try again."

Log technical details internally.

---

# Rate Limiting

Future ready.

Support

Authentication

Comments

Likes

Search

Upload

Prevent abuse.

---

# Caching

Cache

Public Blogs

Books

Products

Playlists

Avoid caching

User Data

Admin Data

Comments (real-time future)

---

# Security

Validate every request.

Sanitize HTML.

Escape user content.

Verify ownership.

Never trust IDs from the client.

---

# Comments API

Support

Create

Edit

Delete

Reply

Moderation

Future

Reactions

Pinned Comments

---

# Like API

One user

↓

One like

Duplicate likes must be prevented.

---

# Save API

One user

↓

One saved post

Duplicate saves must be prevented.

---

# Admin APIs

Require

Admin Role

Audit Logging (future)

Validation

Authorization

---

# Logging

Log

Errors

Warnings

Uploads

Authentication

Admin Actions

Never log

Passwords

Tokens

Secrets

---

# Versioning

Current

v1

Future versions should be introduced without breaking existing clients.

---

# API Documentation

Every endpoint should define

Purpose

Request

Validation

Response

Errors

Authentication

Authorization

---

# AI Instructions

Before creating an endpoint

Check if a similar endpoint already exists.

Reuse services.

Reuse validation.

Reuse response format.

Never create duplicate APIs.

Every new API must follow this document exactly.