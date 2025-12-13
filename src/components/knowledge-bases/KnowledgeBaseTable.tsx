// src/components/knowledge-bases/KnowledgeBaseTable.tsx
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { Icon } from "@iconify/react";
import type { KnowledgeBase } from "@/types";
import { useNavigate } from "react-router";
import type { SortConfig } from "@/hooks/use-table-controls";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ScheduleRunSheet } from "./ScheduleRunSheet";
import { toast } from "sonner";

// --- Helper to format dates nicely ---
const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

interface KnowledgeBaseTableProps {
  data: KnowledgeBase[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  sortConfig: SortConfig<KnowledgeBase> | null;
  onSort: (key: keyof KnowledgeBase) => void;
}

// --- Helper component for sortable table headers ---
const SortableHeader = ({
  label,
  sortKey,
  sortConfig,
  onSort,
  className,
}: {
  label: string;
  sortKey: keyof KnowledgeBase;
  sortConfig: SortConfig<KnowledgeBase> | null;
  onSort: (key: keyof KnowledgeBase) => void;
  className?: string;
}) => {
  const isSorted = sortConfig?.key === sortKey;
  const direction = sortConfig?.dir;

  return (
    <Button
      variant="ghost"
      onClick={() => onSort(sortKey)}
      className={cn("-ml-4", className)}
    >
      {label}
      <Icon
        icon={
          isSorted
            ? direction === "asc"
              ? "lucide:arrow-up"
              : "lucide:arrow-down"
            : "lucide:arrow-up-down"
        }
        className={cn("ml-2 h-4 w-4", !isSorted && "text-muted-foreground/50")}
      />
    </Button>
  );
};

export const KnowledgeBaseTable = ({
  data,
  searchTerm,
  onSearchChange,
  sortConfig,
  onSort,
}: KnowledgeBaseTableProps) => {
  const navigate = useNavigate();

  const [runningId, setRunningId] = useState<string | null>(null);
  const [schedulingItem, setSchedulingItem] = useState<KnowledgeBase | null>(
    null,
  );

  const handleRun = (item: KnowledgeBase) => {
    setRunningId(item.uuid);
    toast.info(`Starting run for "${item.index}"...`);
    // Simulate API call
    setTimeout(() => {
      toast.success(`Run for "${item.index}" started successfully.`);
      setRunningId(null);
    }, 2000);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Icon
              icon="lucide:search"
              className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
            />
            <Input
              placeholder="Find by index name or UUID..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <Button onClick={() => navigate("rag-ingestion")}>
            <Icon icon="lucide:plus" className="mr-2 h-4 w-4" />
            Create Index
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30%]">
                  <SortableHeader
                    label="Index Name"
                    sortKey="index"
                    sortConfig={sortConfig}
                    onSort={onSort}
                  />
                </TableHead>
                <TableHead>
                  <SortableHeader
                    label="Status"
                    sortKey="status"
                    sortConfig={sortConfig}
                    onSort={onSort}
                  />
                </TableHead>
                <TableHead className="text-right">
                  <SortableHeader
                    label="Documents"
                    sortKey="docs.count"
                    sortConfig={sortConfig}
                    onSort={onSort}
                    className="-mr-4 w-full justify-end"
                  />
                </TableHead>
                <TableHead className="text-right">
                  <SortableHeader
                    label="Size"
                    sortKey="store.size"
                    sortConfig={sortConfig}
                    onSort={onSort}
                    className="-mr-4 w-full justify-end"
                  />
                </TableHead>
                <TableHead>
                  <SortableHeader
                    label="Created At"
                    sortKey="creation_date"
                    sortConfig={sortConfig}
                    onSort={onSort}
                  />
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item?.uuid}>
                  <TableCell className="font-medium">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-primary border-primary/50 cursor-help border-b border-dotted">
                            {item.index}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="top" align="start">
                          <div className="space-y-1 text-xs">
                            <p>
                              <strong>UUID:</strong> {item.uuid}
                            </p>
                            <p>
                              <strong>Shards:</strong> {item.number_of_shards}
                            </p>
                            <p>
                              <strong>Replicas:</strong>{" "}
                              {item.number_of_replicas}
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={item?.status === "OPEN" ? "default" : "outline"}
                      className={
                        item?.status === "OPEN"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                          : ""
                      }
                    >
                      {item?.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {item["docs.count"]}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {item["store.size"]}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDate(item.creation_date)}
                  </TableCell>
                  <TableCell className="text-right">
                    <TooltipProvider>
                      <div className="flex items-center justify-end gap-2">
                        {/* --- Run Button --- */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRun(item)}
                              disabled={runningId === item.uuid}
                            >
                              {runningId === item.uuid ? (
                                <Icon
                                  icon="lucide:loader-2"
                                  className="h-4 w-4 animate-spin"
                                />
                              ) : (
                                <Icon
                                  icon="lucide:play"
                                  className="h-4 w-4 text-green-500"
                                />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Run {item?.index} now</TooltipContent>
                        </Tooltip>
                        {/* --- Schedule Button --- */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSchedulingItem(item)}
                            >
                              <Icon
                                icon="lucide:calendar-clock"
                                className="h-4 w-4"
                              />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            Schedule {item?.index}'s run
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Icon
                                icon="lucide:file-cog"
                                className="h-4 w-4"
                              />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            Manage {item?.index}'s configurations
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive/90"
                            >
                              <Icon icon="lucide:trash-2" className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete {item?.index}</TooltipContent>
                        </Tooltip>
                      </div>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* --- Render the Sheet --- */}
      <ScheduleRunSheet
        isOpen={!!schedulingItem}
        onOpenChange={(isOpen) => !isOpen && setSchedulingItem(null)}
        knowledgeBase={schedulingItem}
      />
    </>
  );
};

// --- SKELETON COMPONENT ---
KnowledgeBaseTable.Skeleton = function KnowledgeBaseTableSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-10 w-36" />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: 6 }).map((_, i) => (
                <TableHead key={i}>
                  <Skeleton className="h-5 w-full" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 6 }).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Skeleton className="h-10 w-64" />
      </CardFooter>
    </Card>
  );
};
