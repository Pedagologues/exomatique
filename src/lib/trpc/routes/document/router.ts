import { globalRouter, publicProcedure } from '$trpc/router';
import { z } from 'zod';
import {
	add_child,
	create,
	get,
	get_children,
	link,
	remove_child_from_id,
	remove_child_from_name,
	set,
	unlink
} from './internal';

const bytes_validation_zod = z
	.any()
	.refine((val: unknown) => val !== undefined /* or some other check to ensure proper format */, {
		message: 'bytes must be defined'
	});

const metadata_validation_zod = z
	.any()
	.refine((val: unknown) => val !== undefined && typeof val === 'object', {
		message: 'Metadata should be a valid json object'
	});

export const router = globalRouter({
	create: publicProcedure
		.input(
			z.object({
				token: z.string(),
				is_private: z.boolean(),
				parent: z.string(),
				bytes: z.optional(bytes_validation_zod),
				metadata: z.optional(metadata_validation_zod)
			})
		)
		.mutation((req) => {
			const input = req.input;
			return create(
				input.token,
				input.parent,
				input.is_private,
				input.bytes as Buffer,
				input.metadata
			);
		}),

	link: publicProcedure
		.input(
			z.object({
				document_id: z.string(),
				parent: z.string(),
				token: z.string()
			})
		)
		.mutation(async (req) => {
			const input = req.input;
			return await link(input.document_id, input.parent, input.token);
		}),
	get: publicProcedure
		.input(
			z.object({
				document_id: z.string(),
				token: z.optional(z.string())
			})
		)
		.query(async (req) => {
			const input = req.input;
			return await get(input.document_id, input.token);
		}),

	set: publicProcedure
		.input(
			z.object({
				document_id: z.string(),
				token: z.string(),
				bytes: z.optional(bytes_validation_zod),
				metadata: z.optional(metadata_validation_zod)
			})
		)
		.mutation(async (req) => {
			const input = req.input;
			if (input.bytes == null && input.metadata == null) return;
			return await set(input.document_id, input.token, input.bytes as Buffer, input.metadata);
		}),

	unlink: publicProcedure
		.input(
			z.object({
				document_id: z.string(),
				parent: z.string(),
				token: z.string()
			})
		)
		.mutation(async (req) => {
			const input = req.input;
			return await unlink(input.document_id, input.parent, input.token);
		}),

	add_child: publicProcedure
		.input(
			z.object({
				document_id: z.string(),
				token: z.string(),
				name: z.string(),
				child_id: z.string()
			})
		)
		.mutation(async (req) => {
			const { document_id, token, name, child_id } = req.input;
			return await add_child(document_id, token, name, child_id);
		}),

	remove_child: publicProcedure
		.input(
			z.union([
				z.object({
					document_id: z.string(),
					token: z.string(),
					name: z.string()
				}),
				z.object({
					document_id: z.string(),
					token: z.string(),
					child_id: z.string()
				})
			])
		)
		.mutation(async (req) => {
			const { document_id, token } = req.input;

			const name = 'name' in req.input ? req.input.name : undefined;
			const child_id = 'child_id' in req.input ? req.input.child_id : undefined;

			if (name) {
				return await remove_child_from_name(document_id, token, name);
			} else if (child_id) {
				return await remove_child_from_id(document_id, token, child_id);
			} else {
				throw new Error();
			}
		}),

	get_children: publicProcedure
		.input(
			z.object({
				document_id: z.string(),
				token: z.string()
			})
		)
		.mutation(async (req) => {
			const { document_id, token } = req.input;
			return await get_children(document_id, token);
		})
});
