import { StatCard } from "@/components/common/StatCard";
import PieChartCard from "../../components/dashboard/PieChartCard";
import LineChartCard from "../../components/dashboard/LineChartCard";

const overviewStats = [
  {
    icon: "arcticons:workflowy",
    value: 29,
    label: "Active Workflows",
    iconColorClass: "text-primary-500",
    iconBgClass: "bg-primary-100",
    groupHoverClass: "group-hover:bg-primary-200",
  },
  {
    icon: "ix:success",
    value: "98%",
    label: "Success Rate",
    iconColorClass: "text-primary-400",
    iconBgClass: "bg-primary-100",
    groupHoverClass: "group-hover:bg-primary-200",
  },
  {
    icon: "carbon:pipelines",
    value: 20,
    label: "Active Pipelines",
    iconColorClass: "text-primary-400",
    iconBgClass: "bg-primary-100",
    groupHoverClass: "group-hover:bg-primary-200",
  },
];
const Operations = () => {
  return (
    <div>
      <h6 className="mt-8 mb-3 text-sm font-semibold text-gray-600">
        Operations
      </h6>
      <section className="flex gap-4 pb-4">
        <div className="flex w-[30%] flex-col gap-4">
          {overviewStats.map((stat, index) => (
            <StatCard
              key={index}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
              iconColorClass={stat.iconColorClass}
              iconBgClass={stat.iconBgClass}
              groupHoverClass={stat.groupHoverClass}
            />
          ))}
        </div>
        <div className="flex w-[70%] gap-4">
          <div className="w-[50%]">
            <PieChartCard />
          </div>
          <div className="w-[50%]">
            {" "}
            <LineChartCard />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Operations;
