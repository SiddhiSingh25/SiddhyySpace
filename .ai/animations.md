# Animation Rules

Version: 1.0

Status: Active

Depends On

- master-spec.md
- design-system.md
- components.md

---

# Purpose

Animations should improve usability.

Animations should guide attention.

Animations should never exist only because they look cool.

The user should notice the content first,
not the animation.

---

# Technology

Animation Library

Framer Motion

Never mix animation libraries.

Do not use GSAP.

Do not use CSS animation when the same interaction is already standardized in Framer Motion, except for simple loading shimmers.

---

# Animation Philosophy

The animation language should feel

• Soft

• Calm

• Elegant

• Premium

• Responsive

• Fast

Avoid

Flashy

Bouncy

Elastic

Spinning

Overly playful

Excessive motion

---

# Motion Principles

Motion should communicate

Hierarchy

Navigation

Feedback

State Change

Loading

Never animate everything.

Only animate what benefits the user.

---

# Default Timing

Micro Interaction

150–200ms

Hover

180ms

Button Press

120ms

Cards

250ms

Page Transition

300–400ms

Modal

250ms

Drawer

300ms

Toast

250ms

---

# Default Easing

Prefer natural easing.

Avoid exaggerated bounce.

Use consistent easing across the application.

Never invent new easing values for individual components.

---

# Page Transitions

Every page transition should

Fade

Slight upward movement

Preserve layout stability

Avoid large zoom animations.

---

# Hero Animation

Animate once.

Heading

↓

Subheading

↓

CTA

↓

Image

Use stagger animation.

Never loop hero animations.

---

# Scroll Reveal

Use scroll reveal sparingly.

Reveal

Cards

Sections

Images

Timeline

Do not animate every paragraph.

Content should remain readable.

---

# Card Hover

Cards should

Slightly elevate

Increase shadow subtly

Optional small upward movement

Never rotate cards.

Never overscale.

---

# Button Animation

Support

Hover

Press

Loading

Disabled

Focus

Buttons should feel responsive.

---

# Input Animation

Focus

Border transition

Label animation (if applicable)

Error appearance

Never shake aggressively.

---

# Modal Animation

Fade

Scale slightly

Overlay fade

Fast open

Fast close

---

# Drawer Animation

Slide naturally.

Overlay fades.

Prevent background scrolling.

---

# Toast Animation

Slide in gently.

Fade in.

Auto dismiss.

Pause on hover.

Support

Success

Error

Warning

Info

Loading

---

# Skeleton Loading

Use shimmer animation.

Slow.

Soft.

Never use flashing placeholders.

Logo shimmer should be used for brand-related placeholders.

---

# Lists

Use stagger only for

Cards

Timeline

Gallery

Never stagger very long lists.

---

# Blog Page

Animate

Hero

Cover Image

Related Articles

Comments

Do not animate every paragraph.

Reading should remain uninterrupted.

---

# Comment System

Animate

New Comment

Reply

Delete

Collapse

Keep interactions subtle.

---

# Admin Dashboard

Animations should prioritize speed.

Avoid decorative motion.

Only animate

Navigation

Tables

Modals

Notifications

Dropdowns

Loading

---

# Mobile

Reduce animation distance.

Avoid heavy transforms.

Keep interactions fast.

Battery efficiency is important.

---

# Accessibility

Respect

prefers-reduced-motion

Provide non-animated alternatives.

Never force animations.

---

# Performance

Animate

transform

opacity

Avoid animating

width

height

top

left

box-shadow continuously

Use GPU-friendly properties.

---

# Image Loading

Fade image in after loading.

Show shimmer until loaded.

Fallback to branded placeholder if loading fails.

---

# Navigation

Navbar should

Appear naturally

Never jump

Sticky transitions should be subtle.

---

# Hover Rules

Desktop

Hover supported.

Mobile

No hover dependency.

Touch interactions must work independently.

---

# Future

Support

Theme transitions

Dark mode transitions

View transitions

Shared element transitions

Without rewriting existing animations.

---

# AI Instructions

Before adding any animation

Ask

"Does this animation improve usability?"

If the answer is no,

do not add it.

Every animation must

Improve clarity

Maintain performance

Respect accessibility

Follow this document.

Consistency is more important than creativity.