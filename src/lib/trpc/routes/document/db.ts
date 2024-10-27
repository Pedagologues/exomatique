import createConnection from '$trpc/database';
import mongoose from 'mongoose';

const connection = createConnection();

const Document = connection.model(
	'document',
	new mongoose.Schema({
		author: {
			type: mongoose.Schema.ObjectId,
			required: true
		},
		bytes: {
			type: Buffer,
			required: false
		},
		is_private: {
			type: Boolean,
			required: true
		},
		metadata: {
			type: String,
			required: true
		},
		parents: {
			type: [String],
			required: true
		},
		children: {
			type: Map,
			of: mongoose.Schema.ObjectId,
			required: true
		},
		created: {
			type: Date,
			required: true
		},
		updated: {
			type: Date,
			required: true
		}
	})
);

Document.ensureIndexes();

export default Document;
