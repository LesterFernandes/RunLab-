import { FastifyInstance } from "fastify";
import {
  AddProblemReq,
  AddTestCasesReq,
  ProblemDetailsReq,
} from "./problems.schema";
import {
  addProblem,
  getProblemsFlatList,
  getProblemDetails,
  addTestCases,
} from "./problems.controller";
import { roleAdmin } from "@middlewares";

export async function ProblemsRoutes(app: FastifyInstance) {
  app.get("/", getProblemsFlatList);

  app.get(
    "/:slug",
    {
      schema: {
        params: ProblemDetailsReq,
      },
    },
    getProblemDetails,
  );

  app.post(
    "/add",
    {
      schema: {
        body: AddProblemReq,
      },
      preHandler: [roleAdmin],
    },
    addProblem,
  );

  app.post(
    "/add-tc",
    {
      schema: { body: AddTestCasesReq },
      preHandler: [roleAdmin],
    },
    addTestCases,
  );
}
