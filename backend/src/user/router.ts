import { z } from "zod";

import { router as global_router, publicProcedure } from "../trpc";

import { User } from "./types";

const users: User[] = [];

export const router = global_router({
  ping: publicProcedure.query(() => "Pong"),
});
