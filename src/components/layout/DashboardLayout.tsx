/* import { Outlet } from "react-router";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "../site-header";
import { AppSidebar } from "../app-sidebar";

const DashboardLayout = () => {
  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />

        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <main className="h-[calc(100vh-56px)] flex-1 overflow-y-auto bg-[image:var(--bg-gradient)] transition-[margin] duration-300 ease-in-out">
              <Outlet />
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout; */

import { Outlet } from "react-router";
import { Header } from "./Header";
import { useContext } from "react";
import { Sidebar } from "./Sidebar";
import { UserContext } from "@/context/user-context";

const DashboardLayout = () => {
  const { isCollapsed, setIsCollapsed } = useContext(UserContext);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header
        isCollapsed={isCollapsed}
        onToggleSidebar={() => setIsCollapsed(!isCollapsed)}
      />

      <div className="flex h-[calc(100vh-56px)] flex-1">
        <div className="fixed h-[calc(100vh-56px)] overflow-x-hidden">
          <Sidebar isCollapsed={isCollapsed} />
        </div>

        <main
          className="h-[calc(100vh-56px)] flex-1 overflow-y-auto bg-[image:var(--bg-gradient)] transition-[margin] duration-300 ease-in-out"
          style={{ marginLeft: isCollapsed ? "64px" : "240px" }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
