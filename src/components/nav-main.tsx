import { NavLink } from "react-router";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Icon } from "@iconify/react";

export function NavMain({
  items,
}: {
  items: {
    name: string;
    path: string;
    icon: string;
    isActive?: boolean;
    items?: {
      name: string;
      path: string;
      icon: string;
    }[];
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <>
              {item.path && (
                <NavLink key={item.name} to={item.path} end>
                  {({ isActive }) => (
                    <SidebarMenuButton tooltip={item.name} isActive={isActive}>
                      <Icon icon={item.icon} />
                      <span>{item.name}</span>
                    </SidebarMenuButton>
                  )}
                </NavLink>
              )}

              {item.items && item.items.length ? (
                <Collapsible
                  key={item.name}
                  asChild
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.name}
                        className={
                          "flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors"
                        }
                      >
                        <Icon icon={item.icon} />
                        <span>{item.name}</span>
                        <Icon
                          icon="lucide:chevron-down"
                          className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180"
                        />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.name}>
                            <SidebarMenuSubButton asChild>
                              <NavLink to={subItem.path}>
                                <Icon icon={subItem.icon} />
                                <span>{subItem.name}</span>
                              </NavLink>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : null}
            </>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
