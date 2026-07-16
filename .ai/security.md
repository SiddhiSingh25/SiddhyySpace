# Security Rules

Version: 1.0

Status: Active

Depends On

- master-spec.md
- api-rules.md
- coding-rules.md

---

# Purpose

Security is mandatory.

Never sacrifice security for convenience.

Every endpoint, page, action, upload and database operation must follow these rules.

---

# Security Philosophy

Never trust

• User Input

• Browser

• Query Parameters

• Cookies

• Headers

Everything must be validated.

---

# Authentication

Use

Auth.js

Google OAuth

Session Strategy

JWT

Secure Cookies

Never create custom authentication.

---

# Authorization

Authentication

↓

Who is the user?

Authorization

↓

Can the user perform this action?

Never confuse them.

---

# Roles

Current

Admin

User

Future

Editor

Author

Moderator

Reader

Every protected action must check permissions.

---

# Route Protection

Protect

/admin

/api/admin

/settings

/profile

Saved Blogs

Comment Editing

Like API

Save API

Never expose private routes.

---

# API Protection

Every protected API

Must verify

Session

Role

Ownership

Validation

Before database access.

---

# Validation

Frontend

React Hook Form

Yup

Backend

Zod

Never skip backend validation.

---

# SQL Injection

Use Prisma.

Never concatenate SQL strings.

Always use parameterized queries.

---

# XSS

Escape user-generated content.

Sanitize rich text.

Whitelist allowed HTML.

Never render raw HTML directly.

---

# CSRF

Use secure session handling.

Protect state-changing requests.

---

# File Uploads

Only allow

Images

Future

Videos

PDF

Validate

File Type

File Size

Dimensions

Reject executable files.

---

# Rate Limiting

Support limits for

Login

Comments

Likes

Search

Uploads

Password reset (future)

Prevent abuse.

---

# Secrets

Never commit

API Keys

Database URLs

Cloudinary Secrets

OAuth Secrets

JWT Secrets

Store secrets in environment variables.

---

# Environment Variables

Keep

Development

Staging

Production

Separate.

Never expose server secrets to the client.

---

# Logging

Log

Authentication failures

Admin actions

Server errors

Uploads

Never log

Passwords

Tokens

Secrets

Personal information

---

# Session Management

Expire inactive sessions.

Rotate tokens where appropriate.

Logout should invalidate sessions.

---

# Ownership

Users can edit

Their own comments.

Their own profile.

Never allow users to modify another user's data.

---

# Admin Protection

Every admin action

Requires

Admin Role

Server Validation

Audit Log (future)

---

# Error Messages

Never expose

Database errors

Stack traces

Internal implementation

Return friendly messages only.

---

# Dependency Security

Install only trusted packages.

Review package size and maintenance.

Remove unused dependencies.

---

# HTTPS

Production must use HTTPS.

Secure cookies only.

---

# Headers

Support

Content Security Policy

X-Frame-Options

X-Content-Type-Options

Referrer Policy

Permissions Policy

---

# Future

Support

2FA

Email Verification

Device Sessions

Login Alerts

Suspicious Activity Detection

---

# AI Instructions

Before creating any API

Ask

"Can this endpoint be abused?"

Before exposing any page

Ask

"Should this be public?"

Before accepting any input

Validate it.

Before writing to the database

Verify permissions.

Security is never optional.