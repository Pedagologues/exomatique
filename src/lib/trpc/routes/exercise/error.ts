import { TRPCError } from '@trpc/server';

export class ExerciseNotFound extends TRPCError {
	constructor(public exercise_id: string) {
		super({
			code: 'NOT_FOUND',
			message: `Exercise ${exercise_id} could not be found`
		});
	}
}

export type EXERCISE_PERMISSION = 'READ' | 'WRITE';

export class MissingPermission extends TRPCError {
	constructor(
		public exercise_id: string,
		public permission: EXERCISE_PERMISSION
	) {
		super({
			code: 'UNAUTHORIZED',
			message: `Missing ${permission} permission on exercise ${exercise_id}`
		});
	}
}
