import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import UserSessionManager from "@/modules/UserSessionManager";

// The getGreetingDetails helper function remains the same
type GreetingDetails = {
  greeting: string;
  icon: string;
};

const getGreetingDetails = (hour: number): GreetingDetails => {
  if (hour >= 5 && hour < 12) {
    return { greeting: "Good morning", icon: "lucide:sunrise" };
  }
  if (hour >= 12 && hour < 18) {
    return { greeting: "Good afternoon", icon: "lucide:sun" };
  }
  if (hour >= 18 && hour < 22) {
    return { greeting: "Good evening", icon: "lucide:sunset" };
  }
  return { greeting: "Good evening", icon: "lucide:moon-star" };
};

const Admin = () => {
  const session = new UserSessionManager();
  const userName = session?.user?.username || "Jane Doe";
  const [greetingDetails, setGreetingDetails] =
    useState<GreetingDetails | null>(null);

  useEffect(() => {
    const currentHour = new Date().getHours();
    setGreetingDetails(getGreetingDetails(currentHour));
  }, []);

  return (
    // SECTION: Greeting
    <section className="space-y-8 p-4 sm:p-6 lg:p-8">
      <section className="flex flex-col items-center justify-center p-4 text-center">
        {greetingDetails && (
          <div className="flex space-x-1">
            <h1 className="text-5xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
              {greetingDetails.greeting}, {userName}
            </h1>
            <div className="text-primary mb-6">
              <Icon
                icon={greetingDetails.icon}
                className={`animate__animated animate__fadeIn h-14 w-14 ${
                  greetingDetails.greeting === "Good morning"
                    ? "animate-rise-up"
                    : greetingDetails.greeting === "Good afternoon"
                      ? "animate-spin-slow"
                      : greetingDetails.greeting === "Good evening"
                        ? "animate-set-down"
                        : "animate-pulse-soft"
                } `}
              />
            </div>
          </div>
        )}
        <p className="text-2xl text-gray-600 dark:text-gray-400">
          Coming soon!
        </p>
      </section>
    </section>
  );
};

export default Admin;
