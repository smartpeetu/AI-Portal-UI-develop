import { RouterProvider } from "react-router";
import router from "./routes";
import { ThemeProvider } from "./components/providers/ThemeProvider";
import { UserProvider } from "./components/providers/UserProvider";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="isoletic-ai-theme">
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
