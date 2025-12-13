import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { Link } from "react-router";

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center dark:bg-gray-900">
      <div className="w-full max-w-md">
        <Icon
          icon="ph:ghost-light"
          className="text-primary mx-auto h-32 w-32"
        />

        <h1 className="from-primary-600 to-primary-200 mt-8 bg-gradient-to-r bg-clip-text text-8xl font-extrabold tracking-tighter text-transparent">
          404
        </h1>

        <h2 className="mt-4 text-3xl font-bold text-gray-800 dark:text-gray-100">
          Oops! You've found a ghost page.
        </h2>

        <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
          The page you are looking for might have been moved, renamed, or is
          temporarily unavailable. Let's get you back on track.
        </p>

        <Button asChild size="lg" className="mt-8">
          <Link to="/dashboard">
            <Icon icon="lucide:home" className="mr-2 h-5 w-5" />
            Go to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
