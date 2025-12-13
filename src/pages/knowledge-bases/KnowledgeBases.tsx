// src/pages/knowledge-bases/KnowledgeBasesPage.tsx
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { KnowledgeBaseTable } from "@/components/knowledge-bases/KnowledgeBaseTable";
import type { KnowledgeBase } from "@/types";
import { getKnowledgeBases } from "@/services/endpoints";
import { useTableControls } from "@/hooks/use-table-controls";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// --- Helper function to generate pagination links ---
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

const KnowledgeBasesPage = () => {
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
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
  } = useTableControls<KnowledgeBase>(
    knowledgeBases,
    (item, term) =>
      item.index.toLowerCase().includes(term) ||
      item.uuid.toLowerCase().includes(term),
  );

  useEffect(() => {
    const fetchKnowledgeBases = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getKnowledgeBases();
        setKnowledgeBases(data);
      } catch (err) {
        let errorMessage = "An unexpected error occurred.";
        if (err instanceof Error) {
          errorMessage = err.message;
        }
        setError(errorMessage);
      } finally {
        // Use a small timeout to prevent jarring flashes on fast connections
        setTimeout(() => setIsLoading(false), 300);
      }
    };

    fetchKnowledgeBases();
  }, []);

  const paginationItems = getPaginationItems(currentPage, totalPages);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4">
        {/* <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit cursor-pointer"
        >
          <Icon icon="lucide:arrow-left" className="h-4 w-4" />
          Back
        </button> */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Knowledge Bases</h1>
          <p className="text-muted-foreground mt-1">
            Manage your vector search knowledge bases and document stores.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      {error ? (
        <div className="bg-destructive/10 text-destructive rounded-lg py-20 text-center">
          <Icon icon="lucide:server-crash" className="mx-auto mb-4 h-12 w-12" />
          <h3 className="text-xl font-semibold">Failed to load data</h3>
          <p>{error}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {isLoading ? (
            <KnowledgeBaseTable.Skeleton />
          ) : (
            <KnowledgeBaseTable
              data={paginatedData}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              sortConfig={sortConfig}
              onSort={toggleSort}
            />
          )}

          {/* --- THIS IS THE UPDATED PAGINATION --- */}
          {!isLoading && totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground text-sm">
                Showing {paginatedData.length} of {totalItems} indices.
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
};

export default KnowledgeBasesPage;
