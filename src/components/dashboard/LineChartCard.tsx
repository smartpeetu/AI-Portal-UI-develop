import { Card, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

const data = [
  { name: "Mon", value: 12 },
  { name: "Tue", value: 18 },
  { name: "Wed", value: 10 },
  { name: "Thu", value: 25 },
  { name: "Fri", value: 20 },
  { name: "Sat", value: 28 },
  { name: "Sun", value: 22 },
];

// Skeleton component
function LineChartCardSkeleton() {
  return (
    <Card className="w-full shadow-sm transition-all duration-300 hover:shadow-md">
      <CardContent>
        <Skeleton className="mb-4 h-6 w-32 rounded" />
        <div className="flex h-59 w-full items-center">
          <Skeleton className="h-40 w-full rounded" />
        </div>
      </CardContent>
    </Card>
  );
}

// Extend the type to include Skeleton
type LineChartCardType = React.FC & {
  Skeleton: typeof LineChartCardSkeleton;
};

const LineChartCard: LineChartCardType = () => {
  return (
    <Card className="w-full shadow-sm transition-all duration-300 hover:shadow-md">
      <CardContent className="">
        {/* Title */}
        <h4 className="text-md mb-4 font-bold text-gray-800">
          Weekly Activity
        </h4>

        {/* Chart */}
        <div className="h-59 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                stroke="#9ca3af"
                strokeWidth={0.5}
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: "#d1d5db", strokeWidth: 0.5 }}
              />
              <YAxis
                stroke="#9ca3af"
                strokeWidth={0.5}
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: "#d1d5db", strokeWidth: 0.5 }}
                width={30}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                }}
                cursor={{ stroke: "#d1d5db", strokeWidth: 1 }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#f47521"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

LineChartCard.Skeleton = LineChartCardSkeleton;

export default LineChartCard;
