// src/pages/profile/ProfilePage.tsx
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import UserSessionManager from "@/modules/UserSessionManager";
import { getInitials } from "@/lib/utils";

const session = new UserSessionManager();

// --- Dummy Data ---
// In a real app, this would come from a user context or an API call.
let dummyUser = {
  name: "Hardik Soni",
  role: "Solution Architect",
  avatarUrl: "/images/hardik.soni.jpg",
  email: "hardik.soni@example.com",
  joinedDate: new Date("2023-08-15T10:00:00Z"),
  persona:
    "A creative and analytical architect specializing in designing and implementing complex AI-driven workflows. Passionate about leveraging large language models to solve real-world business problems and optimize data pipelines.",
  permissions: [
    {
      id: "p1",
      label: "Workflow Management",
      description: "Can create, edit, and delete workflows.",
      enabled: true,
    },
    {
      id: "p2",
      label: "Agent Configuration",
      description: "Can configure and deploy new agents.",
      enabled: true,
    },
    {
      id: "p3",
      label: "Provider Management",
      description: "Can add and manage API provider credentials.",
      enabled: false,
    },
    {
      id: "p4",
      label: "Billing & Invoices",
      description: "Can view and manage billing information.",
      enabled: false,
    },
  ],
};

const ProfilePage = () => {
  const navigate = useNavigate();

  const persona = JSON.parse(localStorage.getItem("persona") as string);

  dummyUser = {
    ...dummyUser,
    role: persona.charAt(0).toUpperCase() + persona.slice(1),
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={dummyUser.avatarUrl || session?.user?.image}
                alt="User Avatar"
              />
              <AvatarFallback>
                {getInitials(session?.user?.username || dummyUser.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {session?.user?.username || dummyUser.name}
              </h1>
              <p className="text-muted-foreground">{dummyUser.role}</p>
            </div>
          </div>
          <Button>Edit Profile</Button>
        </div>
      </div>

      {/* --- Main Content Grid (Two-Column Layout) --- */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-8 lg:col-span-2">
          {/* Persona Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon icon="lucide:user-cog" className="h-5 w-5" />
                User Persona
              </CardTitle>
              <CardDescription>
                This is your configured persona for interacting with AI models.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <blockquote className="text-muted-foreground border-l-2 pl-6 italic">
                {dummyUser.persona}
              </blockquote>
            </CardContent>
          </Card>

          {/* Permissions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon icon="lucide:shield-check" className="h-5 w-5" />
                Permissions
              </CardTitle>
              <CardDescription>
                Manage your access levels for different platform features.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {dummyUser.permissions.map((permission) => (
                <div
                  key={permission.id}
                  className="bg-muted/50 flex items-center justify-between rounded-md p-3"
                >
                  <div>
                    <h4 className="font-medium">{permission.label}</h4>
                    <p className="text-muted-foreground text-sm">
                      {permission.description}
                    </p>
                  </div>
                  <Switch checked={permission.enabled} disabled />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-8 lg:col-span-1">
          {/* Account Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium">
                  {session?.user?.email || dummyUser.email}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Joined</span>
                <span className="font-medium">
                  {dummyUser.joinedDate.toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone Card */}
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" className="w-full">
                <Icon icon="lucide:trash-2" className="mr-2 h-4 w-4" />
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
