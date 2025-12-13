# AI Portal - Frontend

Welcome to the official frontend repository for the AI Portal. This is a modern and scalable web application built with a cutting-edge React and TypeScript stack. It serves as the user-facing interface for our AI services, prioritizing a clean user experience and robust, maintainable code.

## ✨ Core Technologies

This project is built with a curated set of modern technologies to ensure a high-quality development experience and a performant end product:

- **Framework**: [React 18](https://reactjs.org/) with [Vite](https://vitejs.dev/) for a lightning-fast development experience.
- **Language**: [TypeScript](https://www.typescriptlang.org/) for robust type safety.
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) for utility-first styling, configured for JIT compilation.
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) for a set of beautifully designed, accessible, and composable components.
- **Routing**: [React Router v6](https://reactrouter.com/) for client-side routing and navigation.
- **Icons**: [Iconify](https://iconify.design/) via `@iconify/react` for access to over 100,000 icons.
- **Linting & Formatting**: ESLint and Prettier configured for a consistent and clean codebase.

## 📂 Project Structure

The `src` directory is organized to promote scalability, modularity, and a clean separation of concerns.

```
src
├── assets/         # Static assets like images and fonts
├── components/     # Shared, reusable React components
│   ├── common/     # General-purpose components (e.g., ModeToggle)
│   ├── layout/     # Structural components (e.g., Header, UserNav)
│   └── ui/         # Unstyled components from shadcn/ui
├── context/        # React Context definitions (e.g., theme-context.ts)
├── hooks/          # Custom React hooks (e.g., use-theme.ts)
├── lib/            # Utility functions, constants, and type definitions
├── pages/          # Top-level page components for each route
│   ├── dashboard/
│   ├── error/
│   └── login/
├── providers/      # React Context Providers (e.g., ThemeProvider.tsx)
├── routes/         # Routing configuration and protected route logic
├── services/       # API call logic (e.g., Axios instances)
└── ...
```

## 🚀 Getting Started

Follow these steps to get the project up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### 1. Installation

Clone the repository and install the necessary dependencies.

```bash
git clone https://github.com/UsefulBI-Genai/AI-Portal-UI.git
cd AI-Portal-UI
npm install
```

### 2. Running the Development Server

To start the Vite development server, run:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`. The server supports Hot Module Replacement (HMR) for a seamless development experience.

### 💻 VS Code Integration (Recommended)

This project includes pre-configured VS Code tasks and launch configurations for an effortless setup.

1.  **Install Dependencies**:
    - Go to the "Run and Debug" panel (`Ctrl+Shift+D`).
    - Select **"1) Install Dependencies"** from the dropdown and press F5. This will run `npm install` in the integrated terminal.

2.  **Run & Debug**:
    - In the same panel, select **"2) Run and Debug App"** and press F5.
    - This will automatically start the dev server, wait for it to be ready, and launch a new Chrome instance with the debugger attached. You can now set breakpoints directly in your code.

## 🏛️ Key Architectural Concepts

### Theming (Light/Dark Mode)

The application features a persistent, system-aware theme toggle. The architecture is designed for maximum separation of concerns.

- **`src/context/theme-context.ts`**: Defines the shape of the theme context, its types (`Theme`, `ThemeProviderState`), and its initial value. This file contains no logic or components.

- **`src/providers/ThemeProvider.tsx`**: The core component that provides the theme state to the entire application. It handles:
  - Reading the user's saved theme from `localStorage`.
  - Applying the correct `light` or `dark` class to the root `<html>` element.
  - Handling the "system" theme by listening to the `prefers-color-scheme` media query.

- **`src/hooks/use-theme.ts`**: A simple custom hook that provides clean access to the theme context. It ensures that it's only used within a `ThemeProvider`.

- **Usage**: To add a theme toggle, simply import and use the `ModeToggle` component:

  ```tsx
  import { ModeToggle } from "@/components/common/ModeToggle";

  // ...
  <ModeToggle />;
  ```

### Routing Setup

Routing is managed by `react-router-dom` and is configured for clarity and security.

- **`src/routes/index.tsx`**: This is the central hub for all application routes. It uses `createBrowserRouter` to define the URL structure.

- **Root Layout (`/`)**: The root path uses the `Root.tsx` component, which renders an `<Outlet />`. This allows child routes to share a common layout shell.

- **Protected Routes**:
  - The `ProtectedRoute.tsx` component acts as a guard for authenticated routes.
  - It checks for an `isAuthenticated` flag in `localStorage`.
  - If the user is not authenticated, they are redirected to `/login`.
  - In `index.tsx`, we wrap authenticated routes within the `ProtectedRoute` element:
    ```tsx
    {
      element: <ProtectedRoute />,
      children: [
        { path: "dashboard", element: <Dashboard /> },
        // ... other protected routes
      ]
    }
    ```

- **404 Not Found**: A catch-all route (`path="*"`) is defined at the end of the configuration to render the beautiful `NotFound.tsx` page for any undefined URL.

## 📜 Available Scripts

- `npm run dev`: Starts the development server with HMR.
- `npm run build`: Compiles and bundles the application for production.
- `npm run lint`: Runs ESLint to check for code quality and style issues.
- `npm run preview`: Starts a local server to preview the production build.

---
