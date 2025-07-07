import "dotenv/config";
import { ProblemsRoutes } from "@/problems/problems.routes";
import fastify from "fastify";
import { testConnection } from "@db/connect";

const server = fastify();

server.get("/ping", async (request, reply) => {
  return "pong\n";
});

server.register(ProblemsRoutes, { prefix: "/problems" });

server.listen({ port: Number(process.env.PORT) }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
