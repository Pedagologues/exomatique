import createConnection from '$trpc/database';
import mongoose from 'mongoose';

const connection = createConnection();

const Exercise = connection.model(
	'exercise',
	new mongoose.Schema({
		title: {
			type: String,
			required: true
		},
		author: {
			type: mongoose.Schema.ObjectId,
			required: true
		},
		tags: {
			type: Array<string>,
			required: true
		},
		visibility: {
			type: String,
			enum: ['PUBLIC', 'PROTECTED', 'PRIVATE']
		},
		directory: {
			type: mongoose.Schema.ObjectId,
			required: false
		}
	})
);

Exercise.ensureIndexes();

export default Exercise;
