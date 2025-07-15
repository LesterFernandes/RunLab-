import { UnauthorizedError } from "@errors";
import { FastifyReply, FastifyRequest } from "fastify";

export async function roleAdmin(req: FastifyRequest, reply: FastifyReply) {
  if (req.headers?.role != "admin") {
    throw UnauthorizedError();
  }
}
