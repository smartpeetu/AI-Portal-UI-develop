// src/pages/dashboard/Dashboard.tsx
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import UserSessionManager from "@/modules/UserSessionManager";
import { AppCard } from "@/components/AppCard";

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

const Dashboard = () => {
  const session = new UserSessionManager();
  const userName = session?.user?.username || "Jane Doe";
  const [greetingDetails, setGreetingDetails] =
    useState<GreetingDetails | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentHour = new Date().getHours();
    setGreetingDetails(getGreetingDetails(currentHour));

    // Simulate loading for stat cards and other initial data
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const recentApps = [
    {
      title: "App1",
      icon: "lucide:app-window",
      description: "Recent App 1",
      link: `/developer-studio/${encodeURIComponent("app1")}`,
      headerImage:
        "https://genai-studio.usefulbi.com/_next/image?url=%2Fuse-cases%2Fnlq.jpg&w=640&q=75",
    },
    {
      title: "App2",
      icon: "lucide:app-window",
      description: "Recent App 2",
      link: `/developer-studio/${encodeURIComponent("app2")}`,
      headerImage:
        "https://genai-studio.usefulbi.com/_next/image?url=%2Fuse-cases%2Fpsn.avif&w=640&q=75",
    },
  ];

  const pinnedApps = [
    {
      title: "App1",
      icon: "lucide:app-window",
      description: "Pinned App 1",
      link: `/developer-studio/${encodeURIComponent("app1")}`,
      headerImage:
        "https://genai-studio.usefulbi.com/_next/image?url=%2Fuse-cases%2Fnlq.jpg&w=640&q=75",
    },
    {
      title: "App2",
      icon: "lucide:app-window",
      description: "Pinned App 2",
      link: `/developer-studio/${encodeURIComponent("app2")}`,
      headerImage:
        "https://genai-studio.usefulbi.com/_next/image?url=%2Fuse-cases%2Fpsn.avif&w=640&q=75",
    },
  ];

  /* const quickActions = [
    {
      title: "Agents",
      icon: "ri:speak-ai-line",
      description: "Customize your agents",
      iconColorClass: "text-primary",
      link: "/agents",
    },
    {
      title: "Models",
      icon: "fa7-solid:hexagon-nodes",
      description: "Add/Update your models",
      iconColorClass: "text-primary",
      link: "/models",
    },
    {
      title: "Knowledge Bases",
      icon: "garden:knowledge-base-26",
      description: "Add/Update your knowledge bases",
      iconColorClass: "text-primary",
      link: "/knowledge-bases",
    },
  ]; */

  /* const hcpApp = {
    title: "HCP Insights",
    icon: "lucide:user-search",
    description:
      "Unlock deep insights into Healthcare Professional profiles and activities.",
    link: "/apps/hcp-insights", // Example link
    disabled: true,
  }; */

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
          Welcome to your workflow dashboard
        </p>
        {/* {persona !== "user" && (
          <Link
            to="/workflow"
            className="text-primary-600 mt-2 hover:underline"
          >
            <Button size="lg" className="bg-primary hover:bg-primary-600 mt-8">
              <Icon icon="lucide:play-circle" className="mr-2 h-5 w-5" />
              Get Started
            </Button>
          </Link>
        )} */}
      </section>

      {/* SECTION: Quick Actions*/}
      {/* <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Quick Actions
        </h2>
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <QuickActionCard.Skeleton key={i} />
              ))
            : quickActions.map((action) => (
                <QuickActionCard
                  key={action.title}
                  icon={action.icon}
                  title={action.title}
                  description={action.description}
                  iconColorClass={action.iconColorClass}
                  link={action.link}
                />
              ))}
        </section>
      </div> */}

      {/* --- Applications Section --- */}
      {/* <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Applications
        </h2>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading ? (
            <AppCard.Skeleton />
          ) : (
            <AppCard
              title={hcpApp.title}
              icon={hcpApp.icon}
              description={hcpApp.description}
              link={hcpApp.link}
              disabled={hcpApp.disabled}
            />
          )}
          
        </section>
      </div> */}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex h-full flex-col rounded-md border p-4">
          <h2 className="text-foreground mb-4 text-lg font-semibold">
            Recent Apps
          </h2>
          <div className="mb-auto grid grid-cols-1 gap-4 sm:grid-cols-2">
            {isLoading
              ? Array.from({ length: 2 }).map((_, i) => (
                  <AppCard.Skeleton key={i} />
                ))
              : recentApps.map((app) => (
                  <AppCard
                    key={app.title}
                    title={app.title}
                    description={app.description}
                    link={app.link}
                    headerImage={app.headerImage}
                    pinned={false}
                    id={""}
                  />
                ))}
          </div>
          <div className="text-primary-600 mt-4 cursor-pointer text-right text-sm hover:underline">
            View More
          </div>
        </div>

        <div className="flex h-full flex-col rounded-md border p-4">
          <h2 className="text-foreground mb-4 text-lg font-semibold">
            Pinned Apps
          </h2>
          <div className="mb-auto grid grid-cols-1 gap-4 sm:grid-cols-2">
            {isLoading
              ? Array.from({ length: 2 }).map((_, i) => (
                  <AppCard.Skeleton key={i} />
                ))
              : pinnedApps.map((app) => (
                  <AppCard
                    key={app.title}
                    title={app.title}
                    description={app.description}
                    link={app.link}
                    headerImage={app.headerImage}
                    pinned={true}
                    id={""}
                  />
                ))}
          </div>
          <div className="text-primary-600 mt-4 cursor-pointer text-right text-sm hover:underline">
            View More
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
