export type TaskData = {
  id: number;
  title: string;
  author: string;
  description: string;
  state: string;
  createdAt: string;
  updatedAt: string;
};

export type TaskResponse = Omit<TaskData, "createdAt" | "updatedAt"> & {
  created_at: string;
  updated_at: string;
};
