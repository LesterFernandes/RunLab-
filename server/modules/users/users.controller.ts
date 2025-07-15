import { db } from "@db/connect";
import { usersSchema, solutionsSchema } from "@db/schema";
import { eq } from "drizzle-orm";
import { FastifyReply, FastifyRequest } from "fastify";
import { Solution } from "./users.schema";

export const createUser = async (req: FastifyRequest, reply: FastifyReply) => {
  const userName = (req.body as { userName: string }).userName;
  await db.insert(usersSchema).values({ userName });
  reply.send("user created successfully");
};

export const deleteUser = async (req: FastifyRequest, reply: FastifyReply) => {
  const userName = (req.body as { userName: string }).userName;
  await db.delete(usersSchema).where(eq(usersSchema.userName, userName));
  reply.send("user deleted successfully");
};

export const getUserSubmissions = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const userName = (req.params as { userName: string }).userName;
  const user = await db
    .select()
    .from(usersSchema)
    .where(eq(usersSchema.userName, userName));
  const sols = await db
    .select()
    .from(solutionsSchema)
    .where(eq(solutionsSchema.userId, user[0].userId));
  reply.send(sols);
};

export const submitSolution = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const sol = req.body as Solution;
  await db.insert(solutionsSchema).values(sol);
  reply.send("solution submitted successfully");
};
