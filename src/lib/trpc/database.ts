import mongoose from 'mongoose';

import { DATABASE_URI, DATABASE } from '$env/static/private';

const uri = DATABASE_URI || '';
const options = JSON.parse(DATABASE || '{}');

export default function createConnection() {
	return mongoose.createConnection(uri, options);
}
