import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppCard } from "@/components/AppCard";

type App = {
  id: string;
  title: string;
  description: string;
  disabled?: boolean;
  icon: string;
  pinned: boolean;
  headerImage: string;
};

const initialApps: App[] = [
  {
    id: "app1",
    title: "App 1",
    description: "App Description",
    icon: "lucide:app-window",
    pinned: true,
    headerImage:
      "https://genai-studio.usefulbi.com/_next/image?url=%2Fuse-cases%2Fnlq.jpg&w=640&q=75",
  },
  {
    id: "app2",
    title: "App 2",
    description: "App Description",
    icon: "lucide:app-window",
    pinned: false,
    headerImage:
      "https://genai-studio.usefulbi.com/_next/image?url=%2Fuse-cases%2Fpsn.avif&w=640&q=75",
  },

  {
    id: "app3",
    title: "App 3",
    disabled: true,
    description: "App Description",
    icon: "lucide:app-window",
    pinned: false,
    headerImage:
      "https://genai-studio.usefulbi.com/_next/image?url=%2Fuse-cases%2Fregai.avif&w=640&q=75",
  },
];

export default function Catalog() {
  const [apps, setApps] = useState<App[]>(initialApps);
  const [search, setSearch] = useState("");
  const [filterDomain, setFilterDomain] = useState(false);
  const [filterAccess, setFilterAccess] = useState(false);
  // const [selectedApp, setSelectedApp] = useState<App | null>(null);
  // const [formValues, setFormValues] = useState({
  //   appName: "",
  //   detailedDescription: "",
  //   termsAccepted: false,
  // });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredApps = apps.filter((app) => {
    const matchesSearch = app.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesDomain = filterDomain ? app.pinned : true;
    const matchesAccess = filterAccess ? app.pinned : true;

    return matchesSearch && matchesDomain && matchesAccess;
  });

  const togglePin = (id: string) => {
    setApps((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, pinned: !app.pinned } : app,
      ),
    );
  };

  return (
    <section className="w-full rounded-md bg-white p-6 shadow-md">
      <div className="grow space-y-6">
        <div className="mb-6 flex w-full items-center justify-center space-x-3 px-4">
          <span className="shrink-0 text-sm font-medium">Filter</span>
          <Input
            type="search"
            placeholder="Search bar"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-full grow"
          />
          <Button
            variant={filterDomain ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterDomain(!filterDomain)}
            className="shrink-0"
          >
            Domain
          </Button>
          <Button
            variant={filterAccess ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterAccess(!filterAccess)}
            className="shrink-0"
          >
            Access
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <AppCard.Skeleton key={i} />
              ))
            : filteredApps.map((app) => (
                <AppCard
                  key={app.id}
                  id={app.id}
                  title={app.title}
                  icon={app.icon}
                  disabled={app.disabled}
                  description={app.description}
                  link={`/developer-studio/${encodeURIComponent(app.id)}`}
                  pinned={app.pinned}
                  onPinToggle={() => togglePin(app.id)}
                  headerImage={app.headerImage}
                />
              ))}
        </div>
      </div>
    </section>
  );
}
