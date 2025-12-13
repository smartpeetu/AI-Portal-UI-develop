import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { Link } from "react-router";
import { Skeleton } from "./ui/skeleton";
import { useState } from "react";
import { WorkspaceRequestDialog } from "@/pages/developer-studio/WorkspaceRequestDialog";

interface AppCardProps {
  id: string;
  icon?: string;
  action?: string;
  title: string;
  description: string;
  link: string;
  disabled?: boolean;
  pinned?: boolean;
  onPinToggle?: () => void;
  headerImage?: string;
  onClick?: () => void;
}

export const WorkspaceCard = ({
  title,
  action = "Launch App",
  description,
  link,
  disabled,
  pinned = false,
  onPinToggle,
  headerImage,
  onClick,
}: AppCardProps) => {
  const [isAccessDialogOpen, setAccessDialogOpen] = useState(false);

  return (
    <Card
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-xl transition-shadow duration-300 hover:shadow-lg"
    >
      {headerImage && (
        <>
          <div
            className={`absolute inset-0 bg-cover bg-center brightness-40 ${disabled ? "opacity-50" : ""}`}
            style={{ backgroundImage: `url(${headerImage})` }}
          />
          <div className="absolute inset-0" />
        </>
      )}
      <div className="relative z-10 flex min-h-[180px] flex-col justify-between p-4">
        {onPinToggle && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPinToggle();
            }}
            className="hover:bg-primary hover:border-primary absolute top-3 right-3 z-20 rounded-full border border-transparent bg-white/80 p-1.5 text-gray-700 shadow-md backdrop-blur-sm transition-colors hover:text-white"
            aria-label={pinned ? "Unpin app" : "Pin app"}
          >
            <Icon
              icon={pinned ? "lucide:pin-off" : "lucide:pin"}
              className="h-4 w-4"
            />
          </button>
        )}
        <div>
          <CardTitle className="mb-1.5 text-lg font-extrabold text-white drop-shadow-2xl">
            {title}
          </CardTitle>
          <CardDescription className="text-sm font-semibold text-white drop-shadow-lg">
            {description}
          </CardDescription>
        </div>

        <div className="flex flex-wrap items-center justify-between">
          {disabled ? (
            <>
              <Button
                onClick={() => setAccessDialogOpen(true)}
                className="border-border text-muted-foreground hover:bg-muted hover:text-foreground bg-background flex items-center gap-1 shadow-sm"
              >
                Request Access
              </Button>
              <WorkspaceRequestDialog
                isDialogOpen={isAccessDialogOpen}
                setDialogOpen={setAccessDialogOpen}
              />
            </>
          ) : (
            <Button
              asChild
              className="text-primary-600 hover:bg-primary-600 w-fit rounded-md bg-white px-3 py-1.5 text-sm font-semibold shadow-md transition-colors hover:text-white"
            >
              <Link to={link} className="flex items-center">
                {action}
                <Icon icon="lucide:arrow-right" className="ml-2 h-3.5 w-3.5" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

WorkspaceCard.Skeleton = function AppCardSkeleton() {
  return (
    <Card className="group relative cursor-pointer overflow-hidden rounded-xl bg-white">
      <CardContent className="min-h-[180px] space-y-2 p-4">
        <Skeleton className="h-5 w-28 rounded" />
        <Skeleton className="h-4 w-36 rounded" />
        <div className="mt-4">
          <Skeleton className="h-8 w-24 rounded" />
        </div>
      </CardContent>
    </Card>
  );
};
