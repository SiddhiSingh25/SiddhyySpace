import { z } from "zod";

export type ApiSuccess<T> = {
  success: true;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
};

export type ApiFailure = {
  success: false;
  message: string;
  errors?: unknown[];
};

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export function successResponse<T>(
  data: T,
  message = "Success",
  meta?: Record<string, unknown>,
): ApiSuccess<T> {
  return { success: true, message, data, meta };
}

export function errorResponse(
  message: string,
  errors: unknown[] = [],
): ApiFailure {
  return { success: false, message, errors };
}

export function parseBody<T>(schema: z.ZodType<T>, body: unknown): T {
  return schema.parse(body);
}
