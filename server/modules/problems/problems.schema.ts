import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

export const ZProblem = z.object({
  problemId: z.string().uuid(),
  title: z.string(),
  desc: z.string(),
  slug: z.string(),
});

export type Problem = z.infer<typeof ZProblem>;

export const AddProblemReq = zodToJsonSchema(
  z.object({
    title: z.string(),
    desc: z.string(),
  }),
);

export const ProblemDetailsReq = zodToJsonSchema(
  z.object({
    slug: z.string(),
  }),
);

export const SingleTestCaseReq = z.object({
  problemId: z.string().uuid(),
  input: z.unknown(),
  expectedOutput: z.unknown(),
  isHidden: z.boolean().optional(),
  isExample: z.boolean().optional(),
});

export const AddTestCasesReq = zodToJsonSchema(
  z.union([SingleTestCaseReq, z.array(SingleTestCaseReq)]),
);

export type TestCase = z.infer<typeof SingleTestCaseReq>;
