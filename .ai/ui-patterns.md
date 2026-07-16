# UI Patterns

Version: 1.0

Status: Active

Depends On

- master-spec.md
- design-system.md
- components.md

---

# Purpose

This document defines reusable UI composition patterns.

Components define WHAT to build.

UI Patterns define HOW to combine those components.

Never design pages from scratch if an existing pattern already solves the problem.

---

# Design Philosophy

Every page should feel like it belongs to the same product.

Maintain

• Consistent spacing

• Consistent typography

• Consistent rhythm

• Consistent interactions

Users should instantly recognize the website's visual language.

---

# Page Structure

Every page should follow this order

Page

↓

Container

↓

Section

↓

Section Header

↓

Content

↓

CTA (Optional)

↓

Footer

Never skip the Container.

Never manually manage page spacing.

---

# Section Pattern

Every section should contain

Section

↓

Section Header

↓

Content

↓

Optional CTA

↓

Bottom Spacing

Never place content directly on the page without a Section wrapper.

---

# Section Header Pattern

Supports

Eyebrow

Title

Subtitle

Description

Optional Action Button

Optional Badge

The spacing between these elements must remain consistent.

---

# Hero Pattern

Order

Announcement (Optional)

↓

Title

↓

Description

↓

Primary CTA

↓

Secondary CTA

↓

Stats (Optional)

↓

Hero Image

Never overload the hero with too much information.

---

# Blog Listing Pattern

Page Header

↓

Search (Future)

↓

Filters (Future)

↓

Featured Blog

↓

Blog Grid

↓

Pagination

↓

Newsletter CTA

Always highlight the latest or featured article first.

---

# Blog Detail Pattern

Breadcrumb

↓

Category

↓

Title

↓

Author Information

↓

Published Date

↓

Reading Time

↓

Cover Image

↓

Blog Content

↓

Recommended Books (Optional)

↓

Recommended Products (Optional)

↓

Related Articles

↓

Comments

↓

Newsletter CTA

---

# Card Grid Pattern

Use responsive grids.

Maintain equal spacing.

Cards should align consistently.

Avoid uneven layouts.

---

# Sidebar Pattern

Desktop

Content + Sidebar

Mobile

Content only

Sidebar content moves below the main content.

---

# Empty State Pattern

Illustration

↓

Title

↓

Description

↓

Action Button

Never show an empty page without guidance.

---

# Error Pattern

Error Illustration

↓

Title

↓

Description

↓

Retry Button

Always provide a recovery path.

---

# Loading Pattern

Skeletons should resemble the final UI.

Never use generic spinners for large page loads.

---

# Form Pattern

Title

↓

Description

↓

Fields

↓

Validation Messages

↓

Primary Action

↓

Secondary Action

Keep forms visually simple.

---

# Modal Pattern

Title

↓

Description

↓

Content

↓

Actions

Primary action should always be visually dominant.

---

# Dashboard Pattern

Header

↓

Quick Stats

↓

Charts (Future)

↓

Recent Activity

↓

Tables

↓

Quick Actions

---

# Timeline Pattern

Celebration Date

↓

Milestone Card

↓

Connector Line

↓

Next Milestone

Maintain visual rhythm.

---

# Recommendation Pattern

Section Header

↓

Horizontal Scroll (Mobile)

↓

Grid (Desktop)

Supports

Books

Products

Playlists

Blogs

---

# CTA Pattern

Heading

↓

Description

↓

Primary Button

↓

Secondary Button (Optional)

One primary action only.

---

# Mobile Rules

Prioritize vertical layouts.

Avoid side-by-side content unless necessary.

Touch targets must be at least 44px.

---

# AI Instructions

Before creating a page,

check if a UI pattern already exists.

If yes,

reuse it.

Never invent a new layout without a strong reason.

Consistency creates a premium user experience.