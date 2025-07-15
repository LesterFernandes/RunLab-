import z from "zod";
import { FastifyInstance } from "fastify";
import {
  createUser,
  deleteUser,
  getUserSubmissions,
  submitSolution,
} from "./users.controller";
import zodToJsonSchema from "zod-to-json-schema";
import { ZSolution } from "./users.schema";

export async function UsersRoutes(app: FastifyInstance) {
  app.post(
    "/create",
    {
      schema: { body: zodToJsonSchema(z.object({ userName: z.string() })) },
    },
    createUser,
  );

  app.post(
    "/delete",
    { schema: { body: zodToJsonSchema(z.object({ userName: z.string() })) } },
    deleteUser,
  );

  app.get(
    "/submissions/:userName",
    {
      schema: {
        params: zodToJsonSchema(z.object({ userName: z.string() })),
      },
    },
    getUserSubmissions,
  );

  app.post(
    "/submit",
    { schema: { body: zodToJsonSchema(ZSolution) } },
    submitSolution,
  );
}
