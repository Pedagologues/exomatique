import type { Types } from 'mongoose';

export interface IExercise {
	title: string;
	author: string;
	visibility: 'PUBLIC' | 'PROTECTED' | 'PRIVATE';
	tags: string[];
	directory?: string;
}
