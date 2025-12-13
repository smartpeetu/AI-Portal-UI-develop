// src/pages/agents/AgentsPage.tsx

import { useEffect, useState, useMemo, useCallback } from "react";
import { Icon } from "@iconify/react";
import { AgentFilters } from "@/components/agents/AgentFilters";
import { AgentsTable } from "@/components/agents/AgentsTable";
import { Skeleton } from "@/components/ui/skeleton";
import { getAgents, syncAgents } from "@/services/endpoints";
import type { Agent, AgentFilterOptions } from "@/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

const deriveFilterOptions = (agents: Agent[]): AgentFilterOptions => {
  const providers = new Set<string>();
  const tags = new Set<string>();
  const categories = new Set<string>();

  agents.forEach((agent) => {
    if (agent.provider) providers.add(agent.provider);
    // Adding a null check: only iterate if `agent.tags` is an array
    if (agent.tags) {
      agent.tags.forEach((tag) => tags.add(tag));
    }
    // Adding a null check: only iterate if `agent.categories` is an array
    if (agent.categories) {
      agent.categories.forEach((category) => categories.add(category));
    }
  });

  return {
    providers: Array.from(providers).sort(),
    tags: Array.from(tags).sort(),
    categories: Array.from(categories).sort(),
  };
};

const Agents = () => {
  // --- STATE MANAGEMENT ---
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allAgents, setAllAgents] = useState<Agent[]>([]);
  const [filterOptions, setFilterOptions] = useState<AgentFilterOptions>({
    providers: [],
    tags: [],
    categories: [],
  });
  const [activeFilters, setActiveFilters] = useState<
    Record<keyof AgentFilterOptions, Set<string>>
  >({
    providers: new Set(),
    tags: new Set(),
    categories: new Set(),
  });
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Agent;
    direction: "asc" | "desc";
  } | null>(null);
  const [selectedRows, setSelectedRows] = useState(new Set<string>());
  const [isSyncing, setIsSyncing] = useState(false);

  // --- DATA FETCHING ---
  const fetchAndProcessAgents = useCallback(async () => {
    // Don't show the main table skeleton during a refetch, only on initial load
    if (!allAgents.length) setIsLoading(true);
    setError(null);
    try {
      const response = await getAgents({ limit: 1000 });
      setAllAgents(response.data);
      const options = deriveFilterOptions(response.data);
      setFilterOptions(options);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred while fetching agents.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [allAgents.length]); // Dependency on length to manage initial load state

  useEffect(() => {
    fetchAndProcessAgents();
  }, [fetchAndProcessAgents]);

  // --- HANDLER for the sync button ---
  const handleSyncAgents = async () => {
    setIsSyncing(true);
    const promise = syncAgents().then(() => {
      // On successful sync, refetch the list of agents to update the table
      return fetchAndProcessAgents();
    });

    toast.promise(promise, {
      loading: "Syncing agents with the source...",
      success: "Agents synced successfully!",
      error: (err) => err.message || "Failed to sync agents.",
      finally: () => {
        setIsSyncing(false);
      },
    });
  };

  // --- CLIENT-SIDE DATA MANIPULATION ---

  const filteredAgents = useMemo(() => {
    const noFiltersActive = Object.values(activeFilters).every(
      (set) => set.size === 0,
    );
    if (noFiltersActive) return allAgents;

    return allAgents.filter((agent) => {
      const providerMatch =
        activeFilters.providers.size === 0 ||
        activeFilters.providers.has(agent.provider);
      // Adding a null check before calling `.some()`
      const tagMatch =
        activeFilters.tags.size === 0 ||
        (agent.tags && agent.tags.some((tag) => activeFilters.tags.has(tag)));
      // Adding a null check before calling `.some()`
      const categoryMatch =
        activeFilters.categories.size === 0 ||
        (agent.categories &&
          agent.categories.some((category) =>
            activeFilters.categories.has(category),
          ));
      return providerMatch && tagMatch && categoryMatch;
    });
  }, [allAgents, activeFilters]);

  // This useMemo hook is updated to handle nulls safely.
  const sortedAndFilteredAgents = useMemo(() => {
    if (!sortConfig) {
      return filteredAgents;
    }

    return [...filteredAgents].sort((a, b) => {
      const valA = a[sortConfig.key];
      const valB = b[sortConfig.key];

      if (valA === null && valB === null) return 0;
      if (valA === null) return -1;
      if (valB === null) return 1;
      // --- End of null-safe logic ---

      let comparison = 0;
      if (valA < valB) {
        comparison = -1;
      } else if (valA > valB) {
        comparison = 1;
      }

      return sortConfig.direction === "desc" ? -comparison : comparison;
    });
  }, [filteredAgents, sortConfig]);

  // --- EVENT HANDLERS ---
  const handleFilterChange = (
    category: keyof AgentFilterOptions,
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

  const handleSort = (key: keyof Agent) => {
    setSortConfig((prev) => ({
      key,
      direction: prev?.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleRowSelect = (id: string) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };
  const handleSelectAll = (isSelected: boolean) => {
    setSelectedRows(
      isSelected
        ? new Set(sortedAndFilteredAgents.map((agent) => agent.id))
        : new Set(),
    );
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-baseline gap-3">
          <h1 className="text-3xl font-bold tracking-tight">Agents</h1>
          {!isLoading && !error && (
            <span className="text-muted-foreground text-3xl font-semibold">
              ({allAgents.length})
            </span>
          )}
          {isLoading && <Skeleton className="h-8 w-16" />}
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <aside className="lg:col-span-1">
          {isLoading ? (
            <AgentFilters.Skeleton />
          ) : (
            <AgentFilters
              options={filterOptions}
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
            />
          )}
        </aside>
        <main className="lg:col-span-3">
          {error && (
            <Alert variant="destructive">
              <Icon icon="lucide:alert-triangle" className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {isLoading ? (
            <AgentsTable.Skeleton />
          ) : (
            <AgentsTable
              data={sortedAndFilteredAgents}
              selectedRows={selectedRows}
              onRowSelect={handleRowSelect}
              onSelectAll={handleSelectAll}
              onSort={handleSort}
              onSync={handleSyncAgents}
              isSyncing={isSyncing}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Agents;
