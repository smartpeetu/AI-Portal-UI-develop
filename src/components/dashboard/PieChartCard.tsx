// PieChartCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

const data = [
  { name: "Completed", value: 40 },
  { name: "In Progress", value: 25 },
  { name: "Pending", value: 20 },
  { name: "Failed", value: 15 },
];

const COLORS = [
  "var(--primary-700)",
  "var(--primary-500)",
  "var(--primary-400)",
  "var(--primary-200)",
];

function PieChartCardSkeleton() {
  return (
    <Card className="h-full w-full shadow-sm transition-all duration-300 hover:shadow-md">
      <CardContent className="h-full">
        <Skeleton className="mb-2 h-6 w-32 rounded" />
        <Skeleton className="mb-6 h-4 w-48 rounded" />
        <div className="flex h-[calc(100%-30px)] items-center gap-6">
          <div className="flex h-[180px] w-[60%] items-center justify-center">
            <Skeleton className="h-36 w-36 rounded-full" />
          </div>
          <div className="flex w-[40%] flex-col gap-2">
            <Skeleton className="mb-1 h-4 w-24 rounded" />
            <Skeleton className="mb-1 h-4 w-20 rounded" />
            <Skeleton className="mb-1 h-4 w-20 rounded" />
            <Skeleton className="mb-1 h-4 w-20 rounded" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

type PieChartCardType = React.FC & {
  Skeleton: typeof PieChartCardSkeleton;
};

const num = (u: unknown): number => {
  if (typeof u === "number") return u;
  if (typeof u === "string") {
    const n = Number.parseFloat(u);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
};

const PieChartCard: PieChartCardType = () => {
  return (
    <Card className="h-full w-full shadow-sm transition-all duration-300 hover:shadow-md">
      <CardContent className="h-full">
        <h4 className="text-md font-bold text-gray-800">Task Distribution</h4>
        <p className="text-sm font-normal text-gray-400">
          Task distribution description with details
        </p>

        <div className="flex h-[calc(100%-30px)] items-center gap-6">
          {/* Donut chart */}
          <div className="h-[100%] w-[60%]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data as unknown as Record<string, unknown>[]}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  nameKey="name"
                  label={(props: unknown) => {
                    // props is ‘unknown’ in some Recharts typings; treat it as a bag.
                    const p = props as Record<string, unknown>;

                    const cx = num(p.cx);
                    const cy = num(p.cy);
                    const innerRadius = num(p.innerRadius);
                    const outerRadius = num(p.outerRadius);
                    const midAngle = num(p.midAngle);
                    const percent = num(p.percent);

                    const RADIAN = Math.PI / 180;
                    const radius =
                      innerRadius + (outerRadius - innerRadius) / 2;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);

                    return (
                      <text
                        x={x}
                        y={y}
                        fill="white"
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={12}
                        fontWeight={500}
                      >
                        {`${(percent * 100).toFixed(0)}%`}
                      </text>
                    );
                  }}
                  labelLine={false}
                >
                  {data.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "0.875rem",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Custom Legend */}
          <div className="flex flex-col gap-2 text-sm text-gray-700">
            {data.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span>{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

PieChartCard.Skeleton = PieChartCardSkeleton;

export default PieChartCard;
