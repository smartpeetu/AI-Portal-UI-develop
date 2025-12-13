// src/components/workflow/WorkflowTable.tsx
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Icon } from "@iconify/react";
import { Link, useNavigate, useParams } from "react-router";
import { useContext, useState } from "react";
import { UserContext } from "@/context/user-context";
import type { ApiWorkflow } from "@/types";
import type { SortConfig } from "@/hooks/use-table-controls";
import { cn } from "@/lib/utils";
import { ExposeApiSheet } from "./ExposeApiSheet";

const SortableHeader = ({
  label,
  sortKey,
  sortConfig,
  onSort,
  className,
}: {
  label: string;
  sortKey: keyof ApiWorkflow;
  sortConfig: SortConfig<ApiWorkflow> | null;
  onSort: (key: keyof ApiWorkflow) => void;
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

interface WorkflowTableProps {
  data: ApiWorkflow[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  sortConfig: SortConfig<ApiWorkflow> | null;
  onSort: (key: keyof ApiWorkflow) => void;
  onDelete: (workflowId: string) => Promise<void>;
}

export const WorkflowTable = ({
  data,
  searchTerm,
  onSearchChange,
  sortConfig,
  onSort,
  onDelete,
}: WorkflowTableProps) => {
  const navigate = useNavigate();
  const { setIsCollapsed } = useContext(UserContext);
  const { appTitle } = useParams();

  // --- State to manage the confirmation dialog ---
  const [itemToDelete, setItemToDelete] = useState<ApiWorkflow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- STATE for the Expose API sheet ---
  const [itemToExpose, setItemToExpose] = useState<ApiWorkflow | null>(null);

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(itemToDelete.id);
    } finally {
      setIsDeleting(false);
      setItemToDelete(null); // Close the dialog
    }
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
              placeholder="Find by name or description..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <Button
            onClick={() => {
              setIsCollapsed(true);
              navigate(`/developer-studio/${appTitle}/workflow/create`);
            }}
          >
            <Icon icon="lucide:plus" className="mr-2 h-4 w-4" />
            New Recipe
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30%]">
                  <SortableHeader
                    label="Name"
                    sortKey="name"
                    sortConfig={sortConfig}
                    onSort={onSort}
                  />
                </TableHead>
                <TableHead className="w-[40%]">
                  <SortableHeader
                    label="Description"
                    sortKey="description"
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
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((workflow) => (
                <TableRow key={workflow.id}>
                  <TableCell className="font-medium">
                    <Link
                      to={`/developer-studio/${appTitle}/workflow/${workflow.id}`}
                      className="text-primary hover:underline"
                    >
                      {workflow.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-sm truncate">
                    {workflow.description}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {workflow.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <TooltipProvider>
                      <div className="flex items-center justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-primary hover:text-green-600"
                              onClick={() => setItemToExpose(workflow)}
                            >
                              <Icon icon="hugeicons:api" className="h-8 w-8" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            Expose {workflow.name}'s API
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive/90"
                              onClick={() => setItemToDelete(workflow)}
                            >
                              <Icon icon="lucide:trash-2" className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            Delete {workflow.name} Recipe
                          </TooltipContent>
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
      {/* --- The Confirmation Dialog --- */}
      <AlertDialog
        open={!!itemToDelete}
        onOpenChange={(isOpen) => !isOpen && setItemToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              recipe
              <strong className="mx-1">"{itemToDelete?.name}"</strong>
              and all of its associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting && (
                <Icon
                  icon="lucide:loader-2"
                  className="mr-2 h-4 w-4 animate-spin"
                />
              )}
              Yes, delete recipe
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <ExposeApiSheet
        key={itemToExpose?.id || "empty"}
        workflow={itemToExpose}
        onOpenChange={(isOpen) => !isOpen && setItemToExpose(null)}
      />
    </>
  );
};

// --- SKELETON COMPONENT ---
WorkflowTable.Skeleton = function WorkflowTableSkeleton() {
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
              <TableHead className="w-[30%]">
                <Skeleton className="h-5 w-20" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-5 w-24" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-5 w-24" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-5 w-20" />
              </TableHead>
              <TableHead className="text-right">
                <Skeleton className="ml-auto h-5 w-20" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Create 5 skeleton rows */}
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-5 w-48" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-28" />
                </TableCell>
                <TableCell className="flex flex-wrap gap-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-20" />
                </TableCell>
                <TableCell className="flex items-center justify-end gap-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </TableCell>
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
