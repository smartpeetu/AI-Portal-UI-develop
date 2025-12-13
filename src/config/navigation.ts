// src/config/navigation.ts
export type Persona = "user" | "developer" | "admin";

export const NavItemId = {
  HOME: "home",
  AI_CHAT: "ai_chat",
  APP_CATALOG: "app_catalog",
  DEV_STUDIO: "dev_studio",

  MONITORING_CATEGORY: "monitoring_category",
  MONITORING: "monitoring",
  OPERATIONS: "operations",

  ADMIN: "admin",
} as const;

// This creates a literal union type:
export type NavItemId = typeof NavItemId[keyof typeof NavItemId];

export interface SidebarItem {
  id: NavItemId;
  name: string;
  icon: string;
  path: string;
}

export interface StandaloneItem {
  isCategory: false;
  item: SidebarItem;
}

export interface CategoryItem {
  isCategory: true;
  id: NavItemId;
  categoryName: string;
  icon: string;
  items: SidebarItem[];
  disabled?: boolean;
}

export type SidebarEntry = StandaloneItem | CategoryItem;

export const sidebarCategories: SidebarEntry[] = [
  {
    isCategory: false,
    item: {
      id: NavItemId.HOME,
      name: "Home",
      icon: "lucide:home",
      path: "/dashboard",
    },
  },
  {
    isCategory: false,
    item: {
      id: NavItemId.AI_CHAT,
      name: "AI Chat",
      icon: "lucide:bot",
      path: "/chatbot",
    },
  },
  {
    isCategory: false,
    item: {
      id: NavItemId.APP_CATALOG,
      name: "App Catalog",
      icon: "lucide:blocks",
      path: "/catalog",
    },
  },
  {
    isCategory: false,
    item: {
      id: NavItemId.DEV_STUDIO,
      name: "Developer Studio",
      icon: "lucide:box",
      path: "/developer-studio",
    },
  },
  {
    isCategory: true,
    id: NavItemId.MONITORING_CATEGORY,
    categoryName: "Monitoring",
    icon: "lucide:activity",
    items: [
      {
        id: NavItemId.OPERATIONS,
        name: "Operations",
        icon: "lucide:factory",
        path: "/operations",
      },
      {
        id: NavItemId.MONITORING,
        name: "Monitoring",
        icon: "lucide:bar-chart-2",
        path: "/monitoring",
      },
    ],
  },
  {
    isCategory: false,
    item: {
      id: NavItemId.ADMIN,
      name: "Admin",
      icon: "lucide:user-cog",
      path: "/admin",
    },
  },
];

// Role-based restrictions
export const RESTRICTED_BY_PERSONA: Record<Persona, Set<NavItemId>> = {
  user: new Set<NavItemId>([
    NavItemId.DEV_STUDIO,
    NavItemId.OPERATIONS,
    NavItemId.MONITORING,
    NavItemId.ADMIN,
  ]),
  developer: new Set<NavItemId>([
    NavItemId.ADMIN,
  ]),
  admin: new Set<NavItemId>([]),
};
