import React from "react";
import { Icon } from "@iconify/react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router";

interface StatCardProps {
  icon: string;
  value: number | string;
  label: string;
  iconColorClass?: string;
  iconBgClass?: string;
  groupHoverClass?: string;
  link?: string;
}

// Skeleton component
function StatCardSkeleton() {
  return (
    <Card className="cursor-pointer p-0 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-md">
      <CardContent className="relative flex items-center gap-4 overflow-hidden p-5">
        <div className="rounded-xl bg-gray-100 p-3">
          <Skeleton className="h-8 w-8 rounded" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 w-20 rounded" />
          <Skeleton className="h-4 w-16 rounded" />
        </div>
        <div className="absolute -right-4 -bottom-3">
          <Skeleton className="h-16 w-16 rounded" />
        </div>
      </CardContent>
    </Card>
  );
}

// Extend the type to include Skeleton
type StatCardType = React.FC<StatCardProps> & {
  Skeleton: typeof StatCardSkeleton;
};

const StatCard: StatCardType = ({
  icon,
  value,
  label,
  iconColorClass = "text-purple-500",
  iconBgClass = "bg-purple-100",
  groupHoverClass = "",
  link = "#",
}) => {
  const navigate = useNavigate();
  const isClickable = !!link && link !== "#";
  return (
    <Card
      className="cursor-pointer p-0 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-md"
      onClick={() => {
        if (isClickable) {
          navigate(link);
        }
      }}
    >
      <CardContent className="relative flex items-center gap-4 overflow-hidden p-5">
        <div
          className={`${iconBgClass} rounded-xl p-3 ${groupHoverClass} transition-colors`}
        >
          <Icon icon={icon} className={`h-8 w-8 ${iconColorClass}`} />
        </div>
        <div>
          <h5 className="text-2xl font-bold text-gray-800">{value}</h5>
          <p className="text-sm text-gray-500">{label}</p>
        </div>
        <div className="absolute -right-4 -bottom-3 text-gray-100 transition-colors duration-300 group-hover:text-gray-200">
          <Icon icon={icon} className="h-16 w-16 text-gray-300" />
        </div>
      </CardContent>
    </Card>
  );
};

StatCard.Skeleton = StatCardSkeleton;

export { StatCard };
