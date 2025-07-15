import { FastifyReply, FastifyRequest } from "fastify";
import slugify from "slugify";
import { eq } from "drizzle-orm";
import { db } from "@db/connect";
import { problemsSchema, usersSchema, testCasesSchema } from "@db/schema";
import { slugExists } from "@utils";
import { Problem, TestCase } from "./problems.schema";

export const addProblem = async (req: FastifyRequest, reply: FastifyReply) => {
  const body = req.body as Omit<Problem, "problemId" | "slug">;
  const baseSlugVal = slugify(body.title, {
    strict: true,
    lower: true,
  });
  let slugVal = baseSlugVal;
  let counter = 2;

  while (await slugExists(problemsSchema, slugVal)) {
    slugVal = `${baseSlugVal}-${counter}`;
    counter++;
  }

  const result = await db.insert(problemsSchema).values({
    slug: slugVal,
    title: body.title,
    desc: body.desc,
  });

  reply.send(result);
};

export const getProblemsFlatList = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const flatList = await db
    .select({
      slug: problemsSchema.slug,
      title: problemsSchema.title,
      desc: problemsSchema.desc,
    })
    .from(problemsSchema);

  reply.send(flatList);
};

export const getProblemDetails = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const slug = (req.params as { slug: string }).slug;
  const problem = await db
    .select()
    .from(problemsSchema)
    .where(eq(problemsSchema.slug, slug));
  return problem;
};

export const addTestCases = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const tc = req.body as TestCase | TestCase[];
  await db.insert(testCasesSchema).values(tc);
  reply.send("test cases added successfully");
};
