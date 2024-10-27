import Exercise from './db';
import { loginFromToken } from '../user/internal';
import { create as createDocument } from '../document/internal';
import { ExerciseNotFound, MissingPermission } from './error';
import mongoose from 'mongoose';
import type { QueryWithHelpers } from 'mongoose';
import type { IExercise } from './types';

export async function create(token: string) {
	let author = await loginFromToken(token).then((v) => v._id);

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
	return exercise._id;
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

	let current_user = await loginFromToken(token).then((v) => v._id);
	if (current_user != exercise.author.toString()) throw new MissingPermission(id, 'WRITE');
	exercise.set(data);
	await exercise.save();

	return {
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
		let current_user = await loginFromToken(token).then((v) => v._id);
		if (current_user != exercise.author.toString()) throw new MissingPermission(id, 'READ');
	}

	return {
		title: exercise.title,
		author: exercise.author.toString(),
		visibility: (exercise.visibility as 'PUBLIC' | 'PROTECTED' | 'PRIVATE') || 'PRIVATE',
		tags: exercise.tags.prototype.map((v) => v.toString()),
		directory: exercise.directory?.toString()
	};
}

export async function get_tags(): Promise<String[]> {
	let tags: String[] = (await Exercise.find())
		.map((v) => v.tags as any)
		.map((v) => v.map(String))
		.reduce((v, v1) => v.concat(v1), []);
	return [...new Set(tags)];
}

function escapeRegExp(text: string) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

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

	const { title, tags } = filter;

	let filter_object: any = {};

	// filter_object.title = { $regex: new RegExp('' + escapeRegExp(title) + '', '') };
	// filter_object.tags = { $all: tags };

	if (viewer) {
		filter_object.author = viewer;
	} else {
		filter_object.visible = true;
		// filter_object.markForRemoval = undefined;
	}

	console.log(filter_object);

	const query = await Exercise.find(filter_object).sort({ _id: 1 }).limit(end).skip(begin);
	console.log(query);
	return query.map((v) => {
		return {
			title: v.title,
			author: v.author.toString(),
			visibility: (v.visibility as 'PUBLIC' | 'PROTECTED' | 'PRIVATE') || 'PRIVATE',
			tags: (v.tags.prototype || []).map((e) => e.toString()),
			directory: v.directory?.toString()
		};
	});	
}
