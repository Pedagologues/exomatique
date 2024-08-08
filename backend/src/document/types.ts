export type Document = {
  author: string;
  bytes: number[];
  is_private: boolean;
  children: Map<string, string>;
  metadata: any;
};
