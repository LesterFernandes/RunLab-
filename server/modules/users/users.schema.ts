import z from "zod";

export const ZSolution = z.object({
  solutionId: z.string().uuid().optional(),
  code: z.string(),
  problemId: z.string().uuid(),
  userId: z.string().uuid(),
  lang: z.enum(["py", "js", "ts", "go"]),
});

export type Solution = z.infer<typeof ZSolution>;
