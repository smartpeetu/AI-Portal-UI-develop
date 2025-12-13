import { useEffect, useState } from "react";
import UserSessionManager from "@/modules/UserSessionManager";
import { UserContext, type UserContextType } from "@/context/user-context";

type Props = { children: React.ReactNode };

const userSessionManager = new UserSessionManager();

export function UserProvider({ children }: Props) {
  const [isCollapsed, setIsCollapsed] = useState(
    userSessionManager?.isSideBarCollapsed || false,
  );

  const [persona, setPersona] = useState<string>("developer");

  useEffect(() => {
    userSessionManager.isSideBarCollapsed = isCollapsed;
    const storedPersona = localStorage.getItem("persona");
    if (storedPersona) setPersona(JSON.parse(storedPersona));
  }, [isCollapsed]);

  const handlePersonaChange = (newPersona: string) => {
    setPersona(newPersona);
    localStorage.setItem("persona", JSON.stringify(newPersona));
  };

  const value: UserContextType = {
    isCollapsed,
    setIsCollapsed,
    persona,
    handlePersonaChange,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
