import type { NextAuthConfig } from "next-auth";

/**
 * Edge-compatible Auth.js config (no Prisma / Node-only deps).
 * Used by middleware; keep this file free of database imports.
 * Providers are added in auth.ts (Node runtime).
 */
export const authConfig = {
  trustHost: true,
  providers: [],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role ?? "USER";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.id === "string" ? token.id : "";
        session.user.role =
          token.role === "ADMIN" || token.role === "USER"
            ? token.role
            : "USER";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
