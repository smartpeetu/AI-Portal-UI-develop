// src/context/theme-context.ts
import { createContext } from "react";

// Define the types for our context
export type Theme = "dark" | "light" | "system";

export type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

// Define the initial state for the context
export const initialThemeState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

// Create and export the context itself
export const ThemeProviderContext =
  createContext<ThemeProviderState>(initialThemeState);
