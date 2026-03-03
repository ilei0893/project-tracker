import { createContext, useContext } from "react";

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

export const UserContext = createContext<User | null>(null);
export const UserSetterContext = createContext<React.Dispatch<
  React.SetStateAction<User | null>
> | null>(null);
export const useUser = () => useContext(UserContext);
export const useSetUser = () => useContext(UserSetterContext);
