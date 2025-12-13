import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import { Link } from "react-router";
import { UserNav } from "./layout/UserNav";

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="bg-background sticky top-0 z-50 flex h-14 w-full items-center border-b px-2">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <Button
          className="h-8 w-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <Icon
            icon="line-md:menu"
            className="h-8 w-8 transition-transform duration-300 ease-in-out"
          />
        </Button>
        <Separator orientation="vertical" className="h-4" />
        {/* Logo and Brand Name */}
        <Link to="/dashboard">
          <div className="ml-4 flex items-center gap-10">
            <div className="flex items-center gap-2">
              <img
                src={`/images/${import.meta.env.VITE_ORG_NAME.toLowerCase()}-logo.png`}
                alt={`${import.meta.env.VITE_ORG_NAME} Logo`}
                className="h-14"
              />
              <span className="text-xl">
                AI <span className="text-primary">Portal</span>
              </span>
            </div>
          </div>
        </Link>
        <div className="ml-auto flex items-center gap-3">
          {/* Notifications Button */}
          <button className="relative cursor-pointer rounded-lg p-2 text-gray-500 transition-all hover:bg-gray-50 hover:text-gray-600">
            <Icon icon="lucide:bell" className="h-4 w-4" />
          </button>
          {/* User Navigation Menu */}
          <UserNav />
        </div>
      </div>
    </header>
  );
}
