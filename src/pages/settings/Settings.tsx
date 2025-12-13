// src/pages/settings/SettingsPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonaCard, type Persona } from "@/components/settings/PersonaCard";

// --- Dummy Data ---
// In a real app, this would come from an API call.
const dummyPersonas: Persona[] = [
  {
    id: "persona-1",
    name: "Admin",
    description:
      "Responsible for managing system access, configurations, and overall platform governance.",
  },
  {
    id: "persona-2",
    name: "Developer",
    description:
      "Focused on building, integrating, and maintaining applications, workflows, and system components.",
  },
  {
    id: "persona-3",
    name: "Operator",
    description:
      "Handles day-to-day operations, monitors system performance, and ensures reliable execution of processes.",
  },
];

const SettingsPage = () => {
  const navigate = useNavigate();
  // State to track the currently active persona. Default to the first one.
  const [activePersonaId, setActivePersonaId] = useState<string>(
    dummyPersonas[0].id,
  );

  const handleSwitchPersona = (id: string) => {
    const selectedPersona = dummyPersonas.find((p) => p.id === id);
    setActivePersonaId(id);
    toast.success(`Persona switched to "${selectedPersona?.name}"`);
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      {/* --- Page Header --- */}
      <div className="flex flex-col gap-4">
        <button
          className="text-muted-foreground hover:text-foreground flex w-fit cursor-pointer items-center gap-2 text-sm transition-colors"
          onClick={() => navigate(-1)}
        >
          <Icon icon="lucide:arrow-left" className="h-4 w-4" />
          Back
        </button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account settings and preferences.
          </p>
        </div>
      </div>

      {/* --- Tabbed Interface --- */}
      <Tabs defaultValue="persona" className="w-full">
        <TabsList>
          <TabsTrigger value="persona">Persona</TabsTrigger>
          <TabsTrigger value="notifications" disabled>
            Notifications
          </TabsTrigger>
          <TabsTrigger value="api-keys" disabled>
            API Keys
          </TabsTrigger>
        </TabsList>

        {/* Persona Tab Content */}
        <TabsContent value="persona" className="mt-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold">Manage Personas</h3>
              <p className="text-muted-foreground">
                Select the persona you want to use for your AI interactions.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {dummyPersonas.map((persona) => (
                <PersonaCard
                  key={persona.id}
                  persona={persona}
                  isActive={persona.id === activePersonaId}
                  onSwitch={handleSwitchPersona}
                />
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
