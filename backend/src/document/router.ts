import { z } from "zod";
import { router as global_router, publicProcedure } from "../trpc";
import { create, get, link, set, unlink } from "./internal";

const bytes_validation_zod = z
  .any()
  .refine(
    (val: any) =>
      val !== undefined /* or some other check to ensure proper format */,
    { message: "bytes must be defined" }
  );

const metadata_validation_zod = z
  .any()
  .refine((val: any) => val !== undefined && typeof val === "object", {
    message: "Metadata should be a valid json object",
  });

export const router = global_router({
  create: publicProcedure
    .input(
      z.object({
        token: z.string(),
        is_private: z.boolean(),
        parent: z.string(),
        bytes: z.optional(bytes_validation_zod),
        metadata: z.optional(metadata_validation_zod),
      })
    )
    .mutation((req) => {
      const input = req.input;
      return create(
        input.token,
        input.parent,
        input.is_private,
        input.bytes,
        input.metadata
      );
    }),

  link: publicProcedure
    .input(
      z.object({
        document_id: z.string(),
        parent: z.string(),
        token: z.string(),
      })
    )
    .mutation((req) => {
      const input = req.input;
      return link(input.document_id, input.parent, input.token);
    }),
  get: publicProcedure
    .input(
      z.object({
        document_id: z.string(),
        token: z.optional(z.string()),
      })
    )
    .query((req) => {
      const input = req.input;
      return get(input.document_id, input.token);
    }),

  set: publicProcedure
    .input(
      z.object({
        document_id: z.string(),
        token: z.string(),
        bytes: z.optional(bytes_validation_zod),
        metadata: z.optional(metadata_validation_zod),
      })
    )
    .mutation((req) => {
      const input = req.input;
      if (input.bytes == null && input.metadata == null) return;
      set(input.document_id, input.token, input.bytes, input.metadata);
    }),

  unlink: publicProcedure
    .input(
      z.object({
        document_id: z.string(),
        parent: z.string(),
        token: z.string(),
      })
    )
    .mutation((req) => {
      const input = req.input;
      unlink(input.document_id, input.parent, input.token);
    }),
});
