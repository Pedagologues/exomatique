import { z } from 'zod';
import { globalRouter, publicProcedure } from '$trpc/router';
import { compile_latex } from './internal';

export const router = globalRouter({
	latex_compile: publicProcedure
		.input(
			z.object({
				document_id: z.string(),
				token: z.string(),
				encoding: z.optional(z.string()).default('binary'),
				resource_name: z.string()
			})
		)
		.query(async (req) => {
			const { document_id, token, encoding, resource_name: resource_name } = req.input;
			return await compile_latex(document_id, token, encoding as BufferEncoding, resource_name);
		})
});
