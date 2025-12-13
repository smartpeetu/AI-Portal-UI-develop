import * as React from "react";

import { NavSecondary } from "@/components/nav-secondary";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";

const data = {
  navMain: [
    {
      name: "Home",
      path: "/dashboard",
      icon: "lucide:home",
    },
    {
      name: "AI Chat",
      path: "/chatbot",
      icon: "lucide:bot",
    },
    {
      name: "App Catalog",
      path: "/catalog",
      icon: "lucide:blocks",
    },
    {
      name: "Developer Studio",
      path: "/developer-studio",
      icon: "lucide:box",
    },
    {
      name: "Monitoring",
      icon: "lucide:activity",
      items: [
        {
          name: "Operations",
          icon: "lucide:factory",
          path: "/operations",
        },
        {
          name: "Monitoring",
          icon: "lucide:bar-chart-2",
          path: "/monitoring",
        },
      ],
    },
  ],
  navSecondary: [
    {
      name: "Docs",
      path: "#",
      icon: "lucide:book-open-check",
    },
    {
      name: "Support",
      path: "#",
      icon: "lucide:headphones",
    },
    {
      name: "Email Us",
      path: "#",
      icon: "lucide:mail",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="icon"
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarContent>
        {/* <NavMain items={data.navMain} /> */}
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
