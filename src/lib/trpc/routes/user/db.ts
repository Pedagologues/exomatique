import createConnection from '$trpc/database';
import mongoose from 'mongoose';

const connection = createConnection();

const Accounts = connection.model(
	'accounts',
	new mongoose.Schema({
		username: {
			type: String,
			required: true
		},
		password: {
			type: String,
			required: true
		},
		auth_token: {
			type: String,
			required: false
		},
		auth_expire: {
			type: Number,
			required: false
		}
	})
);

Accounts.ensureIndexes();

export default Accounts;
