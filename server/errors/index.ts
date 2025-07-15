import { FastifyError, FastifyReply, FastifyRequest } from "fastify";

const drizzleErrors = ["DrizzleQueryError", "DrizzleError", "QueryError"];

export * from "./custom-errors";

export default function globalErrorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  if (drizzleErrors.includes(error?.constructor?.name)) {
    const cause = error.cause as any;
    switch (cause?.code) {
      case "23505": // unique_violation
        reply.status(409).send({ error: "Resource already exists" });
        break;
      case "23503": // foreign_key_violation
        reply.status(400).send({ error: "Referenced resource not found" });
        break;
      case "23502": // not_null_violation
        reply.status(400).send({ error: "Required field missing" });
        break;
      case "42P01": // undefined_table
        reply.status(500).send({ error: "Database schema error" });
        break;
      case "40P01": // deadlock_detected
        reply.status(503).send({ error: "Please try again" });
        break;
      case "53300": // too_many_connections
        reply.status(503).send({ error: "Service temporarily unavailable" });
        break;
      default:
        reply.status(500).send({ error: "Database error" });
    }
  } else if (error.statusCode) {
    reply.status(error.statusCode).send({
      error: error.message,
    });
  } else {
    reply.status(500).send({
      error: "Internal server error",
    });
  }
}
