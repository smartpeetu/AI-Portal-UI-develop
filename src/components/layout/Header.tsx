import { UserNav } from "./UserNav";
import { Icon } from "@iconify/react";
import { Link } from "react-router";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import { use } from "react";
import { UserContext } from "@/context/user-context";

interface HeaderProps {
  isCollapsed: boolean;
  onToggleSidebar: () => void;
}

export function Header({ isCollapsed, onToggleSidebar }: HeaderProps) {
  const { persona, handlePersonaChange } = use(UserContext);
  return (
    <header className="flex h-14 items-center border-b bg-white px-6">
      {/* Sidebar Toggle Button */}
      <button
        onClick={onToggleSidebar}
        className="hover:bg-muted text-muted-foreground rounded-md p-2"
        aria-label={isCollapsed ? "Open sidebar" : "Close sidebar"}
      >
        <Icon
          icon="line-md:menu"
          className="h-5 w-5 transition-transform duration-300 ease-in-out"
        />
      </button>

      {/* Logo and Brand Name */}
      <Link to="/dashboard">
        <div className="ml-4 flex items-center gap-10">
          <div className="flex items-center gap-2">
            <img
              src={`/images/${import.meta.env.VITE_ORG_NAME.toLowerCase()}-logo.png`}
              alt={`${import.meta.env.VITE_ORG_NAME} Logo`}
              className="h-8"
              // className="h-14"
            />
            <span className="text-xl">
              AI <span className="text-primary">Portal</span>
            </span>
          </div>
        </div>
      </Link>

      {/* Right side navigation items */}
      <div className="ml-auto flex items-center gap-3">
        <Select value={persona} onValueChange={handlePersonaChange}>
          <SelectTrigger className="w-[180px]">
            {persona.charAt(0).toUpperCase() + persona.slice(1)}
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Persona</SelectLabel>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="developer">Developer</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {/* Notifications Button */}
        <button className="relative cursor-pointer rounded-lg p-2 text-gray-500 transition-all hover:bg-gray-50 hover:text-gray-600">
          <Icon icon="lucide:bell" className="h-4 w-4" />
        </button>
        {/* User Navigation Menu */}
        <UserNav />
      </div>
    </header>
  );
}
