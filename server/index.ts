import "dotenv/config";
import fastify from "fastify";
import { ProblemsRoutes } from "@/problems/problems.routes";
import { UsersRoutes } from "@/users/users.routes";
import globalErrorHandler from "@errors";

const server = fastify({
  logger: {
    level: process.env.PINO_LOG_LEVEL,
  },
});

server.get("/ping", async (request, reply) => {
  return "pong\n";
});

server.register(ProblemsRoutes, { prefix: "/problems" });
server.register(UsersRoutes, { prefix: "/users" });

server.setErrorHandler(globalErrorHandler);

server.listen({ port: Number(process.env.PORT) }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
