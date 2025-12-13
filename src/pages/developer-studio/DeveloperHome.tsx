import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { WorkspaceCard } from "@/components/WorkspaceCard";
import { useNavigate } from "react-router";

const apps = [
  {
    id: "app1",
    title: "App 1",
    icon: "lucide:app-window",
    description: "Recent App 1",
    link: `/developer-studio/${encodeURIComponent("app1")}`,
    headerImage: "app1.jpg",
  },
  {
    id: "app2",
    title: "App 2",
    icon: "lucide:app-window",
    description: "Recent App 2",
    link: `/developer-studio/${encodeURIComponent("app2")}`,
    headerImage: "app2.jpg",
  },

  {
    id: "app3",
    title: "App 3",
    disbaled: true,
    icon: "lucide:app-window",
    description: "Recent App 3",
    link: `/developer-studio/${encodeURIComponent("app2")}`,
    headerImage: "app3.jpg",
  },
];

const recentApps = [
  {
    id: "app1",
    title: "App1",
    icon: "lucide:app-window",
    description: "Pinned App 1",
    link: `/developer-studio/${encodeURIComponent("app1")}`,
    headerImage: "app1.jpg",
  },
  {
    id: "app2",
    title: "App2",
    icon: "lucide:app-window",
    description: "Pinned App 2",
    link: `/developer-studio/${encodeURIComponent("app2")}`,
    headerImage: "app2.jpg",
  },
];

export default function DeveloperHome() {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="md:p-2">
      <div className="flex flex-col gap-6">
        {/* --- App Workspace --- */}
        <div className="flex flex-col rounded-md border bg-white p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-foreground text-lg font-semibold">
              App Workspace
            </h2>

            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => navigate(`/developer-studio/new-workspace`)}
            >
              <Icon icon={"lucide:plus-circle"} />
              New Workspace
            </Button>
          </div>

          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <WorkspaceCard.Skeleton key={i} />
                ))
              : apps.map((app) => (
                  <WorkspaceCard
                    key={app.id}
                    id={app.id}
                    disabled={app.disbaled}
                    title={app.title}
                    action="Choose Workspace"
                    icon={app.icon}
                    description={app.description}
                    link={app.link}
                    headerImage={app.headerImage}
                    pinned={false}
                  />
                ))}
          </div>

          <div className="text-primary-600 cursor-pointer text-right text-sm hover:underline">
            View More
          </div>
        </div>

        <div className="flex flex-col rounded-md border bg-white p-4">
          <h2 className="text-foreground mb-4 text-lg font-semibold">
            Recent Apps
          </h2>

          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {isLoading
              ? Array.from({ length: 2 }).map((_, i) => (
                  <WorkspaceCard.Skeleton key={i} />
                ))
              : recentApps.map((app) => (
                  <WorkspaceCard
                    key={app.id}
                    id={app.id}
                    title={app.title}
                    icon={app.icon}
                    action="Choose Workspace"
                    description={app.description}
                    link={app.link}
                    headerImage={app.headerImage}
                    pinned={true}
                  />
                ))}
          </div>

          <div className="text-primary-600 cursor-pointer text-right text-sm hover:underline">
            View More
          </div>
        </div>
      </div>
    </section>
  );
}
