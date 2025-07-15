import { createError } from "@fastify/error";

export const UnauthorizedError = createError(
  "UNAUTHORIZED",
  "Unauthorized",
  401,
);
