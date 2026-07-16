import { auth } from "@/lib/auth";
import { errorResponse } from "@/lib/api-response";
import { NextResponse } from "next/server";

export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      session: null,
      error: NextResponse.json(errorResponse("Authentication required."), {
        status: 401,
      }),
    };
  }
  return { session, error: null };
}

export async function requireAdmin() {
  const result = await requireUser();
  if (result.error) return result;

  if (result.session?.user.role !== "ADMIN") {
    return {
      session: result.session,
      error: NextResponse.json(errorResponse("Admin access required."), {
        status: 403,
      }),
    };
  }

  return { session: result.session, error: null };
}
