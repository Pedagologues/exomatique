import * as trpcExpress from "@trpc/server/adapters/express";

import { router as DocumentRouter } from "@backend/document/router";
import { publicProcedure, router } from "@backend/trpc";
import { router as UserRouter } from "@backend/user/router";
import cors from "cors";
import express from "express";

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({});

const appRouter = router({
  ping: publicProcedure.query(() => "Pong"),
  user: UserRouter,
  document: DocumentRouter,
});

const app = express();
app.use(express.json());
app.use(cors());

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.listen(4000);

export type AppRouter = typeof appRouter;
