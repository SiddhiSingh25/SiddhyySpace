export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "Siddhyy",
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ??
    "A calm space for thoughtful writing, books, and recommendations.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  links: {
    twitter: "#",
    github: "#",
    linkedin: "#",
    instagram: "#",
  },
} as const;
