// src/components/agents/AgentsTable.tsx
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Agent } from "@/types";
import { Icon } from "@iconify/react";
import { Link } from "react-router";
import { Skeleton } from "../ui/skeleton";

// Helper to format dates
const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

interface AgentsTableProps {
  data: Agent[];
  selectedRows: Set<string>;
  onRowSelect: (id: string) => void;
  onSelectAll: (isSelected: boolean) => void;
  onSort: (column: keyof Agent) => void;
  onSync: () => void;
  isSyncing: boolean;
}

export const AgentsTable = ({
  data,
  selectedRows,
  onRowSelect,
  onSelectAll,
  onSort,
  onSync,
  isSyncing,
}: AgentsTableProps) => {
  const numSelected = selectedRows.size;
  const isAllSelected = data.length > 0 && numSelected === data.length;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <div className="relative w-full max-w-sm">
          <Icon
            icon="lucide:search"
            className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
          />
          <Input
            placeholder="Find Agents by name or description"
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onSync} disabled={isSyncing}>
            {isSyncing ? (
              <Icon
                icon="lucide:loader-2"
                className="mr-2 h-4 w-4 animate-spin"
              />
            ) : (
              <Icon icon="lucide:refresh-cw" className="mr-2 h-4 w-4" />
            )}
            Sync Agents
          </Button>
          <Button disabled={numSelected === 0}>Delete</Button>
          <Button disabled={numSelected !== 1}>Edit</Button>
          <Button>Create agent</Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={(checked) => onSelectAll(!!checked)}
                />
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => onSort("name")}
                  className="-ml-4 text-gray-700"
                >
                  Name{" "}
                  <Icon icon="lucide:arrow-up-down" className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => onSort("updated_at")}
                  className="-ml-4 text-gray-700"
                >
                  Last updated{" "}
                  <Icon icon="lucide:arrow-up-down" className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((agent) => (
                <TableRow
                  key={agent?.id}
                  data-state={selectedRows.has(agent?.id) && "selected"}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.has(agent?.id)}
                      onCheckedChange={() => onRowSelect(agent?.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Link
                      to="#"
                      className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                    >
                      {agent?.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/50 dark:text-green-300">
                      <Icon icon="lucide:check-circle-2" className="h-4 w-4" />{" "}
                      Prepared
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-xs truncate">
                    {agent?.description}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDateTime(agent?.updated_at)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

// Skeleton
AgentsTable.Skeleton = function AgentsTableSkeleton() {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <Skeleton className="h-10 w-full max-w-sm" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableHead key={i}>
                  <Skeleton className="h-6 w-full" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 10 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 5 }).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
