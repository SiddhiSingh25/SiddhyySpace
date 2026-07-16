# Admin System

Version: 1.0

Status: Active

Depends On

- master-spec.md
- architecture.md
- database.md
- components.md
- design-system.md

---

# Purpose

The Admin Dashboard is the central content management system (CMS) for the entire platform.

Nothing should require editing source code.

Every piece of content should be manageable from the Admin Dashboard.

The dashboard must remain scalable as the platform grows.

---

# Design Philosophy

The admin should feel

• Fast

• Clean

• Minimal

• Professional

• Easy to Learn

• Keyboard Friendly

• Mobile Friendly

Avoid clutter.

Avoid overwhelming the user.

Focus on productivity.

---

# Layout

Persistent Sidebar

↓

Top Navigation

↓

Page Header

↓

Page Content

↓

Drawer / Modal

The layout should remain consistent across every admin page.

---

# Sidebar

The sidebar should support

• Collapse

• Expand

• Search

• Active Route

• Icons

• Nested Navigation (future)

Menu

Dashboard

Content

Blogs

Books

Products

Spotify

Celebrations

Media

Users

Comments

SEO

Settings

---

# Dashboard

The dashboard should immediately answer

What is happening today?

Widgets

Total Blogs

Total Views

Total Users

Total Comments

Total Likes

Recent Blogs

Recent Comments

Recent Activity

Draft Count

Published Count

Future

Analytics

Traffic

Conversions

Newsletter

---

# Blog Management

Features

Create Blog

Edit Blog

Delete Blog (Soft Delete)

Publish

Unpublish

Schedule

Preview

Duplicate

Search

Filter

Sort

Bulk Actions

---

# Blog Editor

The editor must be Block Based.

Supported Blocks

Heading

Paragraph

Image

Gallery

Quote

Divider

Code

Table

Button

Callout

YouTube

Spotify

Book

Affiliate Product

Product

Checklist

List

Future

Tweet

Instagram

Charts

Custom Blocks

---

# Block Editor

Users should be able to

Add Block

Delete Block

Duplicate Block

Reorder Block

Collapse Block

Expand Block

Drag and Drop

The editor should not rely on one large textarea.

---

# Blog Metadata

Editable

Title

Slug

Excerpt

Cover Image

Category

Tags

Reading Time

Publish Date

SEO

Featured

Draft

Status

---

# Media Library

Centralized media management.

Supports

Upload

Search

Folders (future)

Rename

Delete

Preview

Copy URL

Compression

WebP

Cloudinary

---

# Book Management

CRUD

Book Summary

Author

Cover

Video Summary

Affiliate Link

Tags

Featured

Visibility

Books should be reusable across blogs and landing pages.

---

# Product Management

CRUD

Affiliate Link

Brand

Image

Description

Category

Price (optional)

Visibility

Reusable everywhere.

---

# Spotify Management

Manage playlists.

Fields

Title

Description

Embed URL

Image

Category

Visibility

---

# Celebration Management

Timeline management.

Fields

Title

Description

Date

Image

Order

Visibility

---

# Hero Management

Editable without code.

Fields

Headline

Subheading

CTA

Buttons

Background

Image

Statistics

---

# About Management

Editable

Biography

Journey

Skills

Experience

Images

Social Links

---

# Comments

Approve

Reject

Delete

Reply

Pin

Search

Filter

Future

Spam Detection

---

# Users

View

Search

Filter

Role

Status

Profile

Future

Ban

Permissions

Activity

---

# SEO

Manage

Meta Title

Description

Keywords

Canonical

Open Graph

Twitter Card

Structured Data

Indexing

---

# Settings

Site Name

Logo

Favicon

Footer

Social Links

Analytics

Verification Codes

Theme

Future

Email Settings

API Keys

---

# Search

Global Admin Search

Should search

Blogs

Books

Products

Users

Comments

Media

Settings

Everything searchable.

---

# Tables

Reusable Data Table.

Supports

Sorting

Filtering

Pagination

Bulk Actions

Column Visibility

Search

Export (future)

---

# Forms

Every form uses

React Hook Form

Yup

Reusable Components

Autosave (future)

---

# Notifications

Custom Toast

Success

Error

Warning

Information

Loading

Never use browser alerts.

---

# Confirmations

Delete

Publish

Bulk Actions

Must use Confirmation Dialog.

Never perform destructive actions immediately.

---

# Permissions

Admin Only

Current

Single Admin

Future

Editor

Author

Moderator

Viewer

Architecture must support multiple roles.

---

# Mobile Experience

The admin must remain usable on tablets.

Basic support on mobile.

Primary editing experience targets desktop.

---

# Performance

Load only necessary data.

Use pagination.

Use lazy loading.

Avoid unnecessary API requests.

Optimize images.

---

# Accessibility

Keyboard Navigation

Screen Readers

ARIA Labels

Visible Focus

Semantic HTML

---

# Audit Trail (Future)

Track

Publish

Delete

Edit

Login

Role Changes

Media Changes

History should be expandable.

---

# AI Instructions

The Admin Dashboard is the heart of the project.

Every new content type should become manageable through the admin.

Never hardcode content into the frontend.

Everything should be CMS-driven.

When adding a new feature, first ask:

"Should this be manageable from the Admin Dashboard?"

If yes,

add the required admin functionality before implementing the frontend.