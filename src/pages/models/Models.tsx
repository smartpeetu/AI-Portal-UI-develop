import { useEffect, useState, useMemo, useCallback } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router";
import { getModels, syncModels } from "@/services/endpoints";
import type { Model, ModelFilterOptions } from "@/types";
import ModelCard from "@/components/models/ModelCard";
import { PaginationController } from "@/components/common/PaginationController";
import { Input } from "@/components/ui/input";
import { FilterAccordion } from "@/components/common/FilterAccordion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const deriveFilterOptions = (models: Model[]): ModelFilterOptions => {
  const providers = new Set<string>();
  const tags = new Set<string>();

  models.forEach((model) => {
    if (model.provider) providers.add(model.provider);
    model.tags?.forEach((tag) => tags.add(tag));
  });

  return {
    providers: Array.from(providers).sort(),
    tags: Array.from(tags).sort(),
  };
};

// --- MAIN PAGE COMPONENT ---
export default function ModelsCatalogPage() {
  const navigate = useNavigate();
  // --- STATE MANAGEMENT ---
  const [allModels, setAllModels] = useState<Model[]>([]);
  const [filteredModels, setFilteredModels] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  type FilterCategory = "providers" | "tags";
  type FilterOptions = Record<FilterCategory, string[]>;
  type ActiveFilters = Record<FilterCategory, Set<string>>;

  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    providers: [],
    tags: [],
  });
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    providers: new Set<string>(),
    tags: new Set<string>(),
  });

  // Handling pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const modelsPerPage = 12;

  // --- DATA FETCHING ---
  const fetchAndProcessModels = useCallback(async () => {
    if (!allModels.length) setIsLoading(true);
    setError(null);
    try {
      const response = await getModels({ limit: 1000 });
      setAllModels(response.data);
      const options = deriveFilterOptions(response.data);
      setFilterOptions({
        providers: options.providers ?? [],
        tags: options.tags ?? [],
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred while fetching models.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [allModels.length]);

  useEffect(() => {
    fetchAndProcessModels();
  }, [fetchAndProcessModels]);

  const handleSyncModels = async () => {
    setIsSyncing(true);
    const promise = syncModels().then(() => {
      // On successful sync, refetch the list of models to update the UI
      return fetchAndProcessModels();
    });

    toast.promise(promise, {
      loading: "Syncing models with the source...",
      success: "Models synced successfully!",
      error: (err) => err.message || "Failed to sync models.",
      finally: () => {
        setIsSyncing(false);
      },
    });
  };

  // Apply filters and search
  useEffect(() => {
    let models = [...allModels];
    if (searchTerm) {
      models = models.filter(
        (m) =>
          m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.provider.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    if (activeFilters.providers.size > 0) {
      models = models.filter((m) => activeFilters.providers.has(m.provider));
    }
    if (activeFilters.tags.size > 0) {
      models = models.filter((m) =>
        m.tags?.some((tag) => activeFilters.tags.has(tag)),
      );
    }
    setFilteredModels(models);
    setCurrentPage(1); // Reset to first page on filter change
  }, [searchTerm, activeFilters, allModels]);

  const paginatedModels = useMemo(() => {
    const startIndex = (currentPage - 1) * modelsPerPage;
    return filteredModels.slice(startIndex, startIndex + modelsPerPage);
  }, [filteredModels, currentPage, modelsPerPage]);

  const handleFilterChange = (
    category: "providers" | "tags",
    value: string,
  ) => {
    setActiveFilters((prev) => {
      const newSet = new Set(prev[category]);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        newSet.add(value);
      }
      return { ...prev, [category]: newSet };
    });
  };
  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4">
        <button
          className="text-muted-foreground hover:text-foreground flex w-fit cursor-pointer items-center gap-2 text-sm transition-colors"
          onClick={() => navigate(-1)}
        >
          <Icon icon="lucide:arrow-left" className="h-4 w-4" />
          Back
        </button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Model Catalog&nbsp;
            {!isLoading && (
              <span className="text-muted-foreground text-3xl font-semibold">
                ({allModels.length})
              </span>
            )}
          </h1>
          <p className="mt-1 text-gray-600">
            Discover and select models that best fit your use case.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Filters Sidebar */}
        <aside className="w-full flex-shrink-0 lg:w-1/4 xl:w-1/5">
          {isLoading ? (
            <FilterAccordion.Skeleton />
          ) : (
            <FilterAccordion
              options={filterOptions}
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
            />
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-grow">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row">
            <div className="relative w-full max-w-sm">
              <Icon
                icon="lucide:search"
                className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
              />
              <Input
                placeholder="Find Models by name or description"
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={handleSyncModels} disabled={isSyncing}>
              {isSyncing ? (
                <Icon
                  icon="lucide:loader-2"
                  className="mr-2 h-4 w-4 animate-spin"
                />
              ) : (
                <Icon icon="lucide:refresh-cw" className="mr-2 h-4 w-4" />
              )}
              Sync Models
            </Button>
          </div>

          {paginatedModels.length > 0 || isLoading ? (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {isLoading
                  ? Array.from({ length: 9 }).map((_, i) => (
                      <ModelCard.Skeleton key={i} />
                    ))
                  : paginatedModels.map((model) => (
                      <ModelCard key={model.id} model={model} />
                    ))}
              </div>
              {!isLoading ? (
                <div className="mt-8 flex justify-end">
                  <PaginationController
                    totalItems={filteredModels.length}
                    itemsPerPage={modelsPerPage}
                    onPageChange={(paginationInfo) => {
                      setCurrentPage(paginationInfo.currentPage);
                    }}
                  />
                </div>
              ) : null}
            </>
          ) : (
            !isLoading &&
            !error && (
              <div className="py-16 text-center text-gray-500">
                No models found matching your criteria.
              </div>
            )
          )}
          {error && (
            <div className="rounded-md bg-red-50 p-4 text-red-500 dark:bg-red-900/20">
              Error: {error}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
