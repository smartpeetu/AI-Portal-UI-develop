import { createContext } from "react";

export type UserContextType = {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  persona: string;
  handlePersonaChange: (persona: string) => void;
};

export const initialUserContext: UserContextType = {
  isCollapsed: false,
  setIsCollapsed: () => null,
  persona: "developer",
  handlePersonaChange: () => {},
};

export const UserContext = createContext<UserContextType>(initialUserContext);
