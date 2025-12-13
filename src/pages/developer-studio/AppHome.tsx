import { useParams, useNavigate } from "react-router";
import { Icon } from "@iconify/react";
import WorkflowPage from "../workflow/Workflow";

const apps = [
  { title: "App1", path: "app1" },
  { title: "App2", path: "app2" },
];

export default function AppHome() {
  const { appTitle } = useParams();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleSelectApp = (path: string) => {
    navigate(`/developer-studio/${path}`);
  };

  return (
    <section className="p-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <button
          onClick={handleBack}
          className="text-primary-600 inline-flex cursor-pointer items-center text-sm hover:underline"
        >
          <Icon icon="mdi:arrow-left" className="mr-1 h-4 w-4" />
          Go Back
        </button>

        <div className="relative w-full sm:w-auto">
          <select
            value={appTitle}
            onChange={(e) => handleSelectApp(e.target.value)}
            className="focus:ring-primary-500 w-full appearance-none rounded-md border border-gray-300 bg-white py-2 pr-8 pl-3 text-sm shadow-sm focus:ring-1 focus:outline-none sm:w-auto"
          >
            {apps.map((app) => (
              <option key={app.path} value={app.path}>
                {app.title}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500">
            <Icon icon="mdi:chevron-down" className="h-4 w-4" />
          </div>
        </div>
      </div>

      <div>
        <WorkflowPage />
      </div>
    </section>
  );
}
