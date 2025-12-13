import React from "react";
import { Icon } from "@iconify/react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router";

interface QuickActionProps {
  icon: string;
  title: string;
  description: string;
  iconColorClass?: string;
  link?: string;
}

// Skeleton component
function QuickActionCardSkeleton() {
  return (
    <Card className="cursor-pointer transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg">
      <CardContent className="flex flex-col items-center justify-center gap-1.5">
        <Skeleton className="mb-2 h-14 w-14 rounded-full" />
        <Skeleton className="h-5 w-24 rounded" />
        <Skeleton className="h-4 w-38 rounded" />
      </CardContent>
    </Card>
  );
}

// Extend the type to include Skeleton
type QuickActionCardType = React.FC<QuickActionProps> & {
  Skeleton: typeof QuickActionCardSkeleton;
};

const QuickActionCard: QuickActionCardType = ({
  icon,
  title,
  description,
  iconColorClass = "text-blue-500",
  link,
}) => {
  return (
    <Link to={link || "#"} className="no-underline">
      <Card className="cursor-pointer transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg">
        <CardContent className="flex flex-col items-center justify-center">
          <Icon icon={icon} className={`h-14 w-14 ${iconColorClass} mb-2`} />
          <p className="font-bold text-gray-800">{title}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

QuickActionCard.Skeleton = QuickActionCardSkeleton;

export { QuickActionCard };
