export interface IExercise {
	id: string;
	title: string;
	author: string;
	visibility: 'PUBLIC' | 'PROTECTED' | 'PRIVATE';
	tags: string[];
	directory?: string;
}
