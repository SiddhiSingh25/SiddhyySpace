# Design System

Version: 1.0

Status: Active

Depends On:
- master-spec.md
- architecture.md

---

# Purpose

This document defines the complete visual language of the project.

Every page, section, component, animation, spacing, typography and interaction must follow these rules.

The goal is to create one consistent design system instead of designing every page independently.

---

# Design Philosophy

The website should feel

• Warm
• Elegant
• Calm
• Premium
• Comfortable
• Human
• Clean
• Modern
• Minimal

The design should encourage users to keep reading.

Content should always be the main focus.

---

# Inspirations

Visual Inspiration

• Apple
• Notion
• Linear
• Pinterest
• Medium

Do NOT copy these designs.

Only use them as inspiration for quality.

---

# Design Priorities

Priority 1

Readability

Priority 2

Whitespace

Priority 3

Consistency

Priority 4

Performance

Priority 5

Animation

Never sacrifice readability for decoration.

---

# Mobile First

Always design for phones first.

Desktop layouts should evolve naturally from mobile.

Never design desktop first.

---

# Layout Philosophy

The layout should breathe.

Avoid cramped sections.

Avoid unnecessary containers.

Every section should have a clear visual hierarchy.

---

# Container Rules

Create one reusable Container component.

Every page must use it.

Never hardcode horizontal padding.

Container should manage

• Width
• Padding
• Responsive spacing
• Center alignment

Changing the Container should update the entire website.

---

# Section Rules

Create a reusable Section component.

Every section uses

• Consistent vertical spacing
• Consistent internal spacing
• Responsive spacing

Never manually add random margins between sections.

---

# Typography Philosophy

Typography is more important than decoration.

Large readable headings.

Comfortable paragraph width.

Generous line height.

Readable letter spacing.

Never use tiny fonts.

Never use extremely bold text everywhere.

Use font weight intentionally.

---

# Typography Scale

Create reusable typography components.

Display

Heading

SubHeading

Title

Body

Caption

Small

Never hardcode text sizes.

Typography must scale responsively.

---

# Reading Experience

Blogs should feel like reading a book.

Rules

• Comfortable line length
• Large line height
• Clear heading hierarchy
• Images should never interrupt reading flow
• Paragraph spacing should be generous

Reading should feel effortless.

---

# Spacing System

Never use random spacing.

Create spacing tokens.

Example

XS

SM

MD

LG

XL

2XL

3XL

Use the same spacing scale throughout the project.

Whitespace creates elegance.

---

# Grid System

Prefer CSS Grid.

Use Flex where appropriate.

Avoid deeply nested layouts.

Use consistent gaps.

---

# Card System

Cards should feel soft.

Rules

• Rounded corners
• Soft borders
• Minimal shadows
• Comfortable padding
• Smooth hover transitions

Never create heavy cards.

---

# Button System

Create reusable button variants.

Primary

Secondary

Ghost

Outline

Danger

Loading

Icon Button

Buttons should have

Hover

Active

Focus

Disabled

Loading

States.

---

# Input System

Create reusable inputs.

Input

Textarea

Search

Select

Checkbox

Switch

Radio

Password

OTP

Every input should support

Label

Error

Description

Loading

Disabled

Validation

Required

---

# Icon System

Use React Icons consistently.

Do not mix multiple icon libraries.

Icons should have consistent sizing.

---

# Color Philosophy

Colors should support the content.

Never overpower it.

Use soft colors.

Avoid neon colors.

Avoid extremely saturated colors.

Primary colors should be used sparingly.

Whitespace should dominate.

---

# Border Radius

Use one radius scale.

Avoid random rounding.

Buttons

Cards

Inputs

Images

Dialogs

Should feel related.

---

# Shadow System

Use subtle shadows.

Never create floating cards everywhere.

Shadows should communicate elevation.

Not decoration.

---

# Image Rules

Use Next Image.

Always optimize.

Always lazy load.

Always preserve aspect ratio.

Show shimmer while loading.

If image fails

Display branded placeholder.

---

# Logo Placeholder

Create a custom shimmer using the project logo.

Never show broken images.

---

# Loading System

Every asynchronous component should support

Loading

Skeleton

Empty

Error

Success

Loading should feel intentional.

---

# Empty States

Every empty state should

Explain what happened.

Guide users.

Provide an action.

Never leave blank screens.

---

# Animation Philosophy

Motion should guide attention.

Never distract.

Animation should feel invisible.

Soft fade.

Soft scale.

Soft slide.

Subtle stagger.

Avoid exaggerated effects.

---

# Scroll Experience

Scrolling should feel smooth.

Content should reveal naturally.

Avoid unnecessary parallax.

Avoid excessive motion.

---

# Hover Experience

Hover should provide feedback.

Never rely on hover alone.

Mobile users must have equivalent interactions.

---

# Accessibility

Maintain proper contrast.

Large touch targets.

Keyboard navigation.

Visible focus.

Semantic HTML.

Accessibility is part of good design.

---

# Responsive Rules

Every component should define behavior for

Mobile

Tablet

Laptop

Desktop

Large Desktop

Never rely on one breakpoint.

---

# Performance Rules

Avoid unnecessary animations.

Avoid layout shifts.

Optimize images.

Optimize fonts.

Reduce CLS.

Reduce LCP.

Reduce unnecessary JavaScript.

---

# Consistency Rules

Every new component must follow

Typography

Spacing

Radius

Shadow

Animation

Color

Container

Section

Rules defined in this document.

No exceptions.

---

# Future Ready

The design system must support

Dark Mode

Themes

Seasonal Themes

Multiple Brands

Without redesigning the entire application.

---

# AI Instructions

Before creating any page

Read this file.

Never invent new spacing.

Never invent new typography.

Never invent new button styles.

Never invent new shadows.

Never invent new animations.

Everything must come from this design system.

Consistency creates premium design.