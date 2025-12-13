import { useContext, useMemo } from "react";
import { Link, useLocation } from "react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { UserContext } from "@/context/user-context";
import {
  sidebarCategories,
  type SidebarItem,
  type SidebarEntry,
  RESTRICTED_BY_PERSONA,
  type Persona,
} from "@/config/navigation";

interface SidebarProps {
  isCollapsed: boolean;
}

const NavLink = ({
  isCollapsed,
  item,
}: {
  isCollapsed: boolean;
  item: SidebarItem;
}) => {
  const location = useLocation();
  const { setIsCollapsed } = useContext(UserContext);

  const isActive =
    item.path === "/dashboard"
      ? location.pathname === item.path
      : location.pathname.startsWith(item.path);

  const handleLinkClick = () => {
    if (isCollapsed) {
      setIsCollapsed(false);
    }
  };

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to={item.path}
            onClick={handleLinkClick}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
              isCollapsed && "justify-center",
            )}
          >
            <Icon icon={item.icon} className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span className="truncate">{item.name}</span>}
          </Link>
        </TooltipTrigger>
        {isCollapsed && (
          <TooltipContent side="right" sideOffset={5}>
            {item.name}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

export function Sidebar({ isCollapsed }: SidebarProps) {
  let persona: Persona | null = null;
  try {
    persona = JSON.parse(localStorage.getItem("persona") || "null");
  } catch {
    persona = null;
  }

  const restrictedSet = persona ? RESTRICTED_BY_PERSONA[persona] : new Set(); // default: no restrictions if persona unknown

  // IMPORTANT: do NOT mutate sidebarCategories; derive a filtered copy
  const visibleEntries = useMemo<SidebarEntry[]>(() => {
    return sidebarCategories.reduce<SidebarEntry[]>((acc, entry) => {
      if (!persona) {
        acc.push(entry);
        return acc;
      }

      if (!entry.isCategory) {
        if (!restrictedSet.has(entry.item.id)) {
          acc.push(entry);
        }
        return acc;
      }

      const filteredItems = entry.items.filter(
        (item) => !restrictedSet.has(item.id),
      );

      if (filteredItems.length > 0) {
        acc.push({ ...entry, items: filteredItems });
      }

      return acc;
    }, []);
  }, [persona, restrictedSet]);

  return (
    <aside
      className={cn(
        "bg-card flex h-full flex-col border-r transition-all duration-300",
        isCollapsed ? "w-16" : "w-60",
      )}
    >
      <nav className="flex-1 space-y-2 p-2">
        {visibleEntries.map((entry) => {
          if (!entry.isCategory) {
            return (
              <NavLink
                key={entry.item.id}
                isCollapsed={isCollapsed}
                item={entry.item}
              />
            );
          }

          return (
            <div key={entry.id}>
              {/* Expanded view */}
              <Accordion
                type="single"
                collapsible
                className={cn("space-y-2", isCollapsed && "hidden")}
              >
                <AccordionItem
                  value={entry.categoryName}
                  className="border-none"
                >
                  <AccordionTrigger className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-md px-3 py-2 text-sm font-medium hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Icon
                        icon={entry.icon}
                        className="h-5 w-5 flex-shrink-0"
                      />
                      <span>{entry.categoryName}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-1 pl-6">
                    {entry.items.map((item) => (
                      <NavLink
                        key={item.id}
                        isCollapsed={isCollapsed}
                        item={item}
                      />
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Collapsed view */}
              <div className={cn("space-y-2", !isCollapsed && "hidden")}>
                {entry.items.map((item) => (
                  <NavLink
                    key={item.id}
                    isCollapsed={isCollapsed}
                    item={item}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer Section */}
      <footer className="mt-auto border-t border-gray-200 dark:border-slate-700">
        <div
          className={cn(
            "py-3 text-xs text-gray-600",
            isCollapsed ? "flex flex-col items-center gap-3" : "px-4",
          )}
        >
          {/* Footer title (only visible when expanded) */}
          {!isCollapsed && (
            <p className="mb-2 font-semibold text-gray-400">
              <span className="font-medium text-gray-700">Need help?</span>{" "}
              We're here for you.
            </p>
          )}

          {/* Links container */}
          <div
            className={cn(
              isCollapsed
                ? "flex w-full flex-col items-center gap-2"
                : "flex flex-wrap gap-x-3 gap-y-2",
            )}
          >
            <a
              href="/docs"
              className={cn(
                "hover:text-primary-600 flex items-center gap-2 transition-colors",
                isCollapsed ? "w-full justify-center" : "hover:underline",
              )}
            >
              <Icon icon="lucide:book-open-check" className="h-3.5 w-3.5" />
              {!isCollapsed && <span>Docs</span>}
            </a>

            <a
              href="/support"
              className={cn(
                "hover:text-primary-600 flex items-center gap-2 transition-colors",
                isCollapsed ? "w-full justify-center" : "hover:underline",
              )}
            >
              <Icon icon="lucide:headphones" className="h-3.5 w-3.5" />
              {!isCollapsed && <span>Support</span>}
            </a>

            <a
              href={`mailto:support@${import.meta.env.VITE_ORG_NAME.toLowerCase()}.com`}
              className={cn(
                "hover:text-primary-600 flex items-center gap-2 transition-colors",
                isCollapsed ? "w-full justify-center" : "hover:underline",
              )}
            >
              <Icon icon="lucide:mail" className="h-3.5 w-3.5" />
              {!isCollapsed && <span>Email Us</span>}
            </a>
          </div>
        </div>
      </footer>
    </aside>
  );
}
