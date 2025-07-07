import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export async function ProblemsRoutes(app: FastifyInstance) {
  app.get("/", (req: FastifyRequest, reply: FastifyReply) => {
    reply.code(200).send("problems list");
  });
}
