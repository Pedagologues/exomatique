import mongoose from 'mongoose';
import { create as createDocument } from '../document/internal';
import { loginFromToken } from '../user/internal';
import Exercise from './db';
import { ExerciseNotFound, MissingPermission } from './error';
import type { IExercise } from './types';

export async function create(token: string): Promise<IExercise> {
	const author = await loginFromToken(token).then((v) => v._id);

	const exercise = await Exercise.create({
		title: 'Example',
		author,
		tags: [],
		visibility: 'PRIVATE',
		directory: undefined
	});

	const document = await createDocument(
		token,
		'EXERCISE_' + exercise._id.toString(),
		true,
		undefined,
		undefined
	);

	exercise.directory = new mongoose.Types.ObjectId(document);
	await exercise.save();

	return {
		id: exercise.id,
		title: exercise.title,
		author: exercise.author.toString(),
		visibility: (exercise.visibility as 'PUBLIC' | 'PROTECTED' | 'PRIVATE') || 'PRIVATE',
		tags: (exercise.tags.prototype || []).map((v) => String(v)),
		directory: exercise.directory?.toString()
	};
}

export async function edit(
	id: string,
	token: string,
	data: {
		title?: string;
		tags?: string[];
		visibility?: 'PUBLIC' | 'PROTECTED' | 'PRIVATE';
	}
): Promise<IExercise> {
	const exercise = await Exercise.findById(id);

	if (exercise == null) throw new ExerciseNotFound(id);

	const current_user = await loginFromToken(token).then((v) => v._id);
	if (current_user != exercise.author.toString()) throw new MissingPermission(id, 'WRITE');
	exercise.set(data);
	await exercise.save();

	return {
		id: exercise.id,
		title: exercise.title,
		author: exercise.author.toString(),
		directory: exercise.directory?.toString(),
		visibility: (exercise.visibility as 'PUBLIC' | 'PROTECTED' | 'PRIVATE') || 'PRIVATE',
		tags: (exercise.tags.prototype || []).map((v) => String(v))
	};
}

export async function get(id: string, token?: string): Promise<IExercise> {
	const exercise = await Exercise.findById(id);

	if (exercise == null) throw new ExerciseNotFound(id);

	if (exercise.visibility == 'PRIVATTE') {
		if (!token) throw new MissingPermission(id, 'READ');
		const current_user = await loginFromToken(token).then((v) => v._id);
		if (current_user != exercise.author.toString()) throw new MissingPermission(id, 'READ');
	}

	return {
		id: exercise.id,
		title: exercise.title,
		author: exercise.author.toString(),
		visibility: (exercise.visibility as 'PUBLIC' | 'PROTECTED' | 'PRIVATE') || 'PRIVATE',
		tags: exercise.tags.prototype.map((v) => v.toString()),
		directory: exercise.directory?.toString()
	};
}

export async function get_tags(): Promise<string[]> {
	const tags: string[] = (await Exercise.find())
		.map((v) => v.tags as unknown as string[])
		.reduce((v, v1) => v.concat(v1), []);
	return [...new Set(tags)];
}

// function escapeRegExp(text: string) {
// 	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
// }

export async function get_exercises(
	begin: number,
	end: number,
	filter: {
		title: string;
		tags: string[];
	},
	token?: string
): Promise<IExercise[]> {
	const viewer = token ? await loginFromToken(token) : undefined;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const filter_object: any = {};

	// filter_object.title = { $regex: new RegExp('' + escapeRegExp(title) + '', '') };
	// filter_object.tags = { $all: tags };

	if (viewer) {
		filter_object.author = viewer;
	} else {
		filter_object.visible = true;
		// filter_object.markForRemoval = undefined;
	}

	const query = await Exercise.find(filter_object).sort({ _id: 1 }).limit(end).skip(begin);
	return query.map((v) => {
		return {
			id: v.id,
			title: v.title,
			author: v.author.toString(),
			visibility: (v.visibility as 'PUBLIC' | 'PROTECTED' | 'PRIVATE') || 'PRIVATE',
			tags: (v.tags.prototype || []).map((e) => e.toString()),
			directory: v.directory?.toString()
		};
	});
}
