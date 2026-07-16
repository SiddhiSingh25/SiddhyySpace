# Database Design

Version: 1.0

Status: Active

Depends On

- master-spec.md
- architecture.md

---

# Philosophy

The database must be designed for long-term scalability.

The platform is a Content Management System (CMS).

Do not design it as a simple blog.

Everything should be modular.

Everything should be reusable.

Avoid storing unrelated information inside one table.

---

# Database

Use

PostgreSQL

ORM

Prisma

---

# Primary Entities

Authentication

• User

Content

• Blog

• ContentBlock

Organization

• Category

• Tag

Engagement

• Comment

• Reply

• Like

• SavedPost

Media

• Media

Recommendations

• Book

• Product

• Playlist

Marketing

• AffiliateLink

Website

• Hero

• About

• Celebration

SEO

• SEO

Administration

• Setting

---

# User

Represents every authenticated user.

Fields

- id
- name
- email
- image
- role
- provider
- createdAt
- updatedAt

Relationships

One User

↓

Many Comments

↓

Many Likes

↓

Many Saved Posts

---

# Blog

Represents one article.

Fields

- id
- slug
- title
- excerpt
- coverImage
- status
- publishedAt
- readingTime

Relationships

One Blog

↓

Many Content Blocks

↓

Many Tags

↓

One Category

↓

Many Comments

↓

Many Likes

↓

Many Saved Posts

↓

One SEO

---

# Content Block

Every blog is composed of blocks.

Supported Block Types

Heading

Paragraph

Image

Gallery

Quote

Divider

Video

Youtube

Spotify

Book

Affiliate

Product

Button

Callout

List

Table

Code

Future block types can be added without changing architecture.

---

# Category

Groups blogs.

Fields

- id
- name
- slug

---

# Tag

Used for search and recommendations.

Fields

- id
- name
- slug

One blog

↓

Many Tags

---

# Comment

Belongs to

One User

One Blog

Supports replies.

Soft delete.

Moderation.

---

# Reply

Belongs to

One Comment

One User

Supports nesting in future.

---

# Like

Represents user likes.

One User

↓

One Blog

Unique constraint

One user cannot like twice.

---

# Saved Post

Represents bookmarks.

One User

↓

One Blog

Unique constraint.

---

# Book

Reusable entity.

Fields

Title

Author

Cover

Summary

Video

Affiliate Link

Tags

Books can appear

Landing Page

Blog

Books Page

Future Homepage Widgets

---

# Product

Reusable.

Fields

Name

Brand

Image

Affiliate Link

Description

Category

Products can appear in multiple places.

---

# Playlist

Spotify Playlist.

Fields

Title

Embed

Description

Category

Image

---

# Celebration

Timeline items.

Examples

Website Launch

First Blog

First 1000 Views

First Revenue

Fields

Title

Description

Image

Date

Order

---

# Media

Central media library.

Supports

Images

Videos

Documents

Future

WebP generation

Compression

Folders

---

# Affiliate Link

Reusable.

Fields

Platform

URL

Campaign

Source

Products

Books

Blogs

Can reuse same link.

---

# Hero

Landing Page Hero.

Editable.

Supports

Heading

Subheading

CTA

Image

Background

---

# About

Landing Page About Section.

Editable.

Supports

Rich Text

Image

Social Links

---

# SEO

SEO metadata.

Supports

Title

Description

Keywords

OpenGraph

Twitter

Canonical

Structured Data

---

# Setting

Global Website Settings.

Site Name

Description

Theme

Logo

Favicon

Analytics

Verification Codes

Social Links

Footer

---

# Relationships

User

↓

Comment

Like

Saved

Blog

↓

Blocks

Comments

Likes

SEO

Category

Tags

Books

Products

Playlists

Affiliate Links

Everything should be relational.

---

# Soft Delete

Never permanently delete

Blogs

Comments

Media

Books

Products

Future recovery should be possible.

---

# Naming

Tables

Singular

PascalCase

Columns

camelCase

Primary Keys

id

Foreign Keys

userId

blogId

categoryId

---

# Indexes

Index

Slug

Email

Published Date

Category

Tags

Search Fields

Performance should remain good with thousands of records.

---

# AI Instructions

Never redesign the schema without updating this document.

Always extend.

Never duplicate tables.

Prefer reusable entities.

Think in reusable content blocks instead of page-specific data.