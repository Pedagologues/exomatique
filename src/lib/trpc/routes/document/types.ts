export type IDocument = {
	author: string;
	bytes: number[];
	is_private: boolean;
	children: Map<string, string>;
	metadata: unknown;
};
