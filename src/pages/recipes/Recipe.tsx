import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { WorkflowTable } from "@/components/workflow/WorkflowTable";
import { useTableControls } from "@/hooks/use-table-controls";
import { deleteWorkflow, getWorkflows } from "@/services/endpoints";
import type { ApiWorkflow } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const getPaginationItems = (currentPage: number, totalPages: number) => {
  const delta = 2;
  const range = [];
  for (
    let i = Math.max(2, currentPage - delta);
    i <= Math.min(totalPages - 1, currentPage + delta);
    i++
  ) {
    range.push(i);
  }

  if (currentPage - delta > 2) {
    range.unshift("...");
  }
  if (currentPage + delta < totalPages - 1) {
    range.push("...");
  }

  range.unshift(1);
  if (totalPages > 1) {
    range.push(totalPages);
  }
  return range;
};

interface RecipeProps {
  onRecipeCountChange: (count: number) => void;
}

export default function Recipe({ onRecipeCountChange }: RecipeProps) {
  const [allWorkflows, setAllWorkflows] = useState<ApiWorkflow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    searchTerm,
    setSearchTerm,
    sortConfig,
    toggleSort,
    paginatedData,
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
  } = useTableControls<ApiWorkflow>(
    allWorkflows,
    // Define how to search for a workflow
    (item, term) =>
      item.name.toLowerCase().includes(term) ||
      item.description.toLowerCase().includes(term),
  );

  const fetchWorkflows = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getWorkflows({ limit: 200 });
      setAllWorkflows(data);
      onRecipeCountChange(data.length);
    } catch (err) {
      let errorMessage = "An unexpected error occurred.";
      if (err instanceof Error) errorMessage = err.message;
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const handleDeleteWorkflow = async (workflowId: string) => {
    const promise = deleteWorkflow(workflowId).then(() => {
      // fetchWorkflows();
      setAllWorkflows((prev) => prev.filter((w) => w.id !== workflowId));
    });

    toast.promise(promise, {
      loading: "Deleting recipe...",
      success: "Recipe deleted successfully!",
      error: (err) => err.message || "Failed to delete recipe.",
    });

    return promise;
  };

  const paginationItems = getPaginationItems(currentPage, totalPages);
  return (
    <div className="space-y-8 p-4 !px-3 sm:p-6 lg:p-8">
      {error ? (
        <div className="bg-destructive/10 text-destructive rounded-lg py-20 text-center">
          <h3 className="text-xl font-semibold">Failed to load workflows</h3>
          <p>{error}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {isLoading ? (
            <WorkflowTable.Skeleton />
          ) : (
            <WorkflowTable
              data={paginatedData}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              sortConfig={sortConfig}
              onSort={toggleSort}
              onDelete={handleDeleteWorkflow}
            />
          )}

          {/* --- Add the pagination UI, controlled by the page --- */}
          {!isLoading && totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground text-sm">
                Showing {paginatedData.length} of {totalItems} recipes.
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(currentPage - 1)}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                  {paginationItems.map((item, index) =>
                    typeof item === "number" ? (
                      <PaginationItem key={index}>
                        <PaginationLink
                          onClick={() => setCurrentPage(item)}
                          isActive={currentPage === item}
                          className="cursor-pointer"
                        >
                          {item}
                        </PaginationLink>
                      </PaginationItem>
                    ) : (
                      <PaginationEllipsis key={index} />
                    ),
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(currentPage + 1)}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
