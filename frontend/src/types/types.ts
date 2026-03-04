export type TaskData = {
  id: number;
  title: string;
  author: string;
  description: string;
  state: string;
  createdAt: string;
  updatedAt: string;
};

export type UserData = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
};

export type UserResponse = {
  refresh_token: string;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
};

export type TaskResponse = Omit<TaskData, "createdAt" | "updatedAt"> & {
  created_at: string;
  updated_at: string;
};

export type MyJwtPayload = {
  data: Pick<UserData, "id" | "email"> & {
    first_name: string;
    last_name: string;
  };
};
