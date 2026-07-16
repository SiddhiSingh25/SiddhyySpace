# Components

Version: 1.0

Status: Active

Depends On

- master-spec.md
- design-system.md
- coding-rules.md

---

# Purpose

This document defines every reusable component used throughout the project.

The goal is consistency.

Never create duplicate components.

Always check this document before creating a new component.

---

# Component Philosophy

Components should be

• Small

• Reusable

• Accessible

• Typed

• Responsive

• Independent

Every component should solve one problem only.

---

# Component Categories

Global UI

Layout

Typography

Navigation

Forms

Feedback

Data Display

Cards

Media

Overlays

Admin

Feature Components

---

# Layout Components

## Container

Purpose

Controls horizontal spacing for the entire website.

Responsibilities

• Max Width

• Horizontal Padding

• Responsive Padding

• Center Alignment

Rules

Every page must use Container.

Never hardcode page padding.

---

## Section

Purpose

Controls vertical spacing.

Responsibilities

• Top Padding

• Bottom Padding

• Section Gap

Every page section uses Section.

Never manually manage section spacing.

---

## Stack

Reusable vertical layout component.

Supports

Gap

Alignment

Responsive spacing

---

## Grid

Reusable responsive grid.

Supports

Columns

Gap

Responsive layout

Never manually recreate grids.

---

# Typography

## Display

Hero text.

Only one per page.

---

## Heading

Primary headings.

Supports

H1

H2

H3

H4

---

## Text

Default paragraph.

Supports

Small

Medium

Large

Muted

Lead

---

## Caption

Small helper text.

---

## Quote

Reusable quote component.

Supports

Author

Source

Highlight

---

# Buttons

Reusable variants

Primary

Secondary

Outline

Ghost

Danger

Icon

Loading

Link

Rules

Buttons always support

Loading

Disabled

Full Width

Icon Left

Icon Right

Hover

Focus

Active

---

# Cards

## Base Card

Foundation for every card.

Supports

Border

Radius

Shadow

Padding

Hover

---

## Blog Card

Displays

Image

Category

Title

Reading Time

Date

Excerpt

Author

Supports

Horizontal

Vertical

Featured

Compact

---

## Book Card

Displays

Cover

Title

Author

Rating

Summary

Affiliate Button

---

## Product Card

Displays

Image

Brand

Price

Affiliate Button

Description

---

## Playlist Card

Displays

Cover

Spotify Embed

Description

---

## Celebration Card

Displays

Date

Image

Title

Description

Timeline Position

---

# Navigation

Navbar

Sidebar

Breadcrumb

Pagination

Mobile Menu

Search Bar

Profile Menu

Every navigation component must support keyboard navigation.

---

# Forms

Input

Textarea

Search

Select

Checkbox

Radio

Switch

Password

Uploader

OTP

Every form component supports

Label

Description

Error

Required

Disabled

Loading

Validation

---

# Feedback

Toast

Modal

Dialog

Drawer

Tooltip

Popover

Alert

Confirmation Dialog

Never use browser alerts.

---

# Loading Components

Skeleton

Card Skeleton

Blog Skeleton

Book Skeleton

Hero Skeleton

Page Loader

Logo Shimmer

Loading components should closely match the final UI.

---

# Empty States

Reusable EmptyState component.

Supports

Title

Description

Action Button

Illustration

Never leave blank pages.

---

# Error States

Reusable ErrorState component.

Supports

Retry Button

Description

Technical Logging

---

# Media

Image

Video

Youtube Embed

Spotify Embed

Gallery

Carousel

Lazy loading required.

---

# Blog Components

Blog Hero

Blog Content

Blog TOC

Blog Tags

Related Blogs

Reading Progress

Comment List

Comment Form

Like Button

Save Button

Share Buttons

Author Box

Newsletter

---

# Book Components

Book Summary

Video Summary

Affiliate Card

Related Books

Book Details

---

# Product Components

Affiliate Box

Product Details

Recommendation List

Related Products

---

# Hero Components

Hero Section

CTA

Stats

Background Illustration

Scroll Indicator

---

# About Components

Profile Card

Journey Timeline

Skills

Achievements

Social Links

---

# Celebration Components

Timeline

Milestone Card

Achievement Counter

---

# Admin Components

Dashboard Card

Analytics Card

Stat Card

Data Table

Editor Toolbar

Media Picker

Rich Text Editor

Sidebar

Header

Quick Actions

Confirmation Modal

Status Badge

Filters

Search

Pagination

---

# Animation Rules

Every component supports

Hover

Focus

Loading

Entrance

Exit

Never over-animate.

Animation should enhance usability.

---

# Accessibility

Every component must support

Keyboard Navigation

ARIA Labels

Screen Readers

Focus States

Color Contrast

Semantic HTML

---

# Performance

Lazy load heavy components.

Avoid unnecessary Client Components.

Memoize expensive components only when needed.

Optimize images.

---

# Reusability Rules

Before creating any new component

Ask

Can an existing component solve this problem?

If yes

Reuse it.

If no

Extend it.

Create a new component only as the last option.

---

# AI Instructions

Every component must

Be reusable.

Be typed.

Be responsive.

Support loading.

Support error states where appropriate.

Follow the design system.

Never create duplicate UI.

Consistency is mandatory.