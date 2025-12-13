// src/pages/monitoring/MonitoringPage.tsx
import { useState } from "react";
import { Icon } from "@iconify/react";
import { addDays, format } from "date-fns";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { StatCard } from "@/components/common/StatCard";
import { ExecutionsLineChart } from "@/components/monitoring/ExecutionsLineChart";
import StatusPieChart from "@/components/monitoring/StatusPieChart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// --- Dummy Data ---
const statsData = [
  {
    title: "Pipelines Run (24h)",
    value: "1,204",
    change: "+12.5%",
    icon: "lucide:play-circle",
  },
  {
    title: "Success Rate",
    value: "98.2%",
    change: "+0.2%",
    icon: "lucide:check-circle",
  },
  {
    title: "Avg. Duration",
    value: "45.2s",
    change: "-2.1%",
    icon: "lucide:timer",
  },
];

const chartData = Array.from({ length: 7 }, (_, i) => {
  const date = addDays(new Date(), -6 + i);
  const successful = Math.floor(Math.random() * 300) + 200;
  const failed = Math.floor(Math.random() * 20) + 5;
  return {
    name: format(date, "MMM d"),
    total: successful + failed,
    successful,
    failed,
  };
});

const pieData = [
  { name: "Successful", value: 1850, fill: "hsl(var(--primary))" },
  { name: "Failed", value: 95, fill: "hsl(var(--destructive))" },
  { name: "In Progress", value: 35, fill: "hsl(var(--muted-foreground))" },
];

const recentRunsData = [
  {
    id: "run-1",
    name: "Daily Sales Report",
    status: "Successful",
    duration: "32s",
    timestamp: "2 minutes ago",
  },
  {
    id: "run-2",
    name: "Customer Data Sync",
    status: "Failed",
    duration: "1m 12s",
    timestamp: "15 minutes ago",
  },
  {
    id: "run-3",
    name: "Inventory Check",
    status: "Successful",
    duration: "58s",
    timestamp: "1 hour ago",
  },
];

const MonitoringPage = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -6),
    to: new Date(),
  });

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Monitoring Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            An overview of your AI pipeline performance and activity.
          </p>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal md:w-auto"
            >
              <Icon icon="lucide:calendar" className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  `${format(date.from, "LLL dd, y")} - ${format(date.to, "LLL dd, y")}`
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {statsData.map((stat) => (
          <StatCard
            key={stat.title}
            label={stat.title}
            value={stat.value}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <ExecutionsLineChart data={chartData} />
        </div>
        <div className="space-y-6 lg:col-span-2">
          <StatusPieChart data={pieData} />
          <Card>
            <CardHeader>
              <CardTitle>Recent Runs</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pipeline</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentRunsData.map((run) => (
                    <TableRow key={run.id}>
                      <TableCell className="font-medium">{run.name}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            run.status === "Successful"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {run.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-right text-xs">
                        {run.timestamp}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MonitoringPage;
