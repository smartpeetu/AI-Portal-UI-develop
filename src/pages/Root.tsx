import { Outlet } from "react-router";
import { Toaster } from "@/components/ui/sonner";

const Root = () => {
  return (
    <main>
      <Outlet />
      <Toaster />
    </main>
  );
};

export default Root;
