import { initTRPC } from "@trpc/server";

const t = initTRPC.create({
  // Hide stack trace if in production mode
  errorFormatter({ shape }) {
    if (process.env?.NODE_ENV !== "production") return shape;
    shape.data.stack = undefined;
    return shape;
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;
