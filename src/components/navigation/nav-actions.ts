"use server";

import { signIn, signOut } from "@/lib/auth";

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

export async function signInAction() {
  await signIn("google", { redirectTo: "/" });
}
