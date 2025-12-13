import { Icon } from "@iconify/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  // DropdownMenuSub,
  // DropdownMenuSubContent,
  // DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { useTheme } from "@/hooks/use-theme";
import { useNavigate } from "react-router";
// import { deleteCookie } from "@/lib/utils";
import UserSessionManager from "@/modules/UserSessionManager";
import { getInitials } from "@/lib/utils";
import { useState } from "react";
import { DeveloperAccessDialog } from "../upgrade-to-dev-form";

// const AUTH_COOKIE_NAME = "AWSELBAuthSessionCookie-0";

/**
 * UserNav component displays the user navigation dropdown menu.
 * It shows the user avatar and provides access to profile settings, theme toggle, and logout.
 */
export function UserNav() {
  const session = new UserSessionManager();
  // const { setTheme } = useTheme();

  const navigate = useNavigate();
  const [isDialogOpen, setDialogOpen] = useState(false);

  const persona = JSON.parse(localStorage.getItem("persona") as string);

  /**
   * Handles user logout by removing authentication state and redirecting to login page
   */
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    session.clearLocal();
    window.location.replace("/login");
  };

  const handleUpgrade = () => {
    setDialogOpen(true);
  };

  // const closeDialog = () => {
  //   setDialogOpen(false);
  // };

  return (
    <>
      <DropdownMenu>
        {/* Dropdown trigger button with user avatar and details */}
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-auto px-2">
            <div className="flex items-center gap-3">
              {/* User avatar with fallback */}
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={session?.user?.avatar || "/images/hardik.soni.jpg"}
                  alt="User Avatar"
                />
                <AvatarFallback>
                  {getInitials(session?.user?.username || "Hardik Soni")}
                </AvatarFallback>
              </Avatar>
              {/* User name and role - hidden on mobile */}
              <div className="hidden flex-col items-start text-xs md:flex">
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {session?.user?.username || "Hardik Soni"}
                </span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400">
                  {persona.charAt(0).toUpperCase() + persona.slice(1)}
                </span>
              </div>
              {/* Down arrow icon - hidden on mobile */}
              <Icon
                icon="lucide:chevron-down"
                className="hidden h-4 w-4 text-gray-500 md:block dark:text-gray-400"
              />
            </div>
          </Button>
        </DropdownMenuTrigger>
        {/* Dropdown menu content */}
        <DropdownMenuContent className="w-56" align="end" forceMount>
          {/* User information header */}
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm leading-none font-medium">
                {session?.user?.username || "Jane Doe"}
              </p>
              <p className="text-muted-foreground text-xs leading-none">
                {session?.user?.email ||
                  `jane.doe@${import.meta.env.VITE_ORG_NAME.toLowerCase()}.com`}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {/* Primary menu items group */}
          <DropdownMenuGroup>
            {/* Profile menu item */}
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              <Icon icon="lucide:user" className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            {/* Settings menu item */}
            <DropdownMenuItem onClick={() => navigate("/settings")}>
              <Icon icon="lucide:settings" className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            {persona === "user" && (
              <DropdownMenuItem onClick={handleUpgrade}>
                <Icon icon="lucide:arrow-up-circle" className="mr-2 h-4 w-4" />
                <span>Upgrade to Developer</span>
              </DropdownMenuItem>
            )}
            {/* Theme toggle submenu */}
            {/* <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Icon icon="lucide:sun-moon" className="mr-2 h-4 w-4" />
              <span>Toggle theme</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Icon icon="lucide:sun" className="mr-2 h-4 w-4" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Icon icon="lucide:moon" className="mr-2 h-4 w-4" />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Icon icon="lucide:laptop" className="mr-2 h-4 w-4" />
                System
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub> */}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          {/* Logout option */}
          <DropdownMenuItem onClick={handleLogout}>
            <Icon icon="lucide:log-out" className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/about")}>
            <Icon icon="lucide:info" className="mr-2 h-4 w-4" />
            <span>About</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-full max-w-md">
          <DialogTitle>Request Developer Access</DialogTitle>
          <DialogDescription>
            It looks like you're currently an End User. If you'd like to upgrade
            to a Developer role, please submit a request below.
          </DialogDescription>
          <div className="mt-4 flex gap-4">
            <Button onClick={closeDialog} variant="outline">
              Cancel
            </Button>
            <Button
              onClick={() => {
                closeDialog();
              }}
            >
              Submit Request
            </Button>
          </div>
        </DialogContent>
      </Dialog> */}
      <DeveloperAccessDialog
        isDialogOpen={isDialogOpen}
        setDialogOpen={setDialogOpen}
      />
    </>
  );
}
