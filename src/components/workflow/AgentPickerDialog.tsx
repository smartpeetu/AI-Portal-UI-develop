// src/components/workflow/AgentPickerDialog.tsx
import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Agent, AgentFilterOptions } from "@/types";
import { Icon } from "@iconify/react";
import { Checkbox } from "@/components/ui/checkbox";
import { AgentFilters } from "@/components/agents/AgentFilters";
import { cn } from "@/lib/utils";

type SortKey = "name" | "updated_at";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agents: Agent[];
  loading?: boolean;
  onConfirm: (agentId: string) => void;
  filterOptions: AgentFilterOptions;
  total?: number; // optional (for server-side pagination)
};

export function AgentPickerDialog({
  open,
  onOpenChange,
  agents,
  loading,
  onConfirm,
  filterOptions,
  total,
}: Props) {
  // --- search / select / sort ---
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({
    key: "name",
    dir: "asc",
  });

  // --- filters state: providers/tags/categories -> Set<string>
  const [activeFilters, setActiveFilters] = useState<
    Record<keyof AgentFilterOptions, Set<string>>
  >({
    providers: new Set<string>(),
    tags: new Set<string>(),
    categories: new Set<string>(),
  });
  const onFilterChange = (category: keyof AgentFilterOptions, value: string) =>
    setActiveFilters((prev) => {
      const copy = new Set(prev[category]);
      copy.has(value) ? copy.delete(value) : copy.add(value);
      return { ...prev, [category]: copy };
    });

  // --- pagination (client-side) ---
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const goFirst = () => setPage(1);
  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = (max: number) => setPage((p) => Math.min(max, p + 1));
  const goLast = (max: number) => setPage(max);

  // reset selection & page whenever dialog closes
  const handleOpenChange = (o: boolean) => {
    onOpenChange(o);
    if (!o) {
      setSelectedId(null);
      setQuery("");
      setPage(1);
    }
  };

  // --- filtered + sorted dataset ---
  const filteredSorted = useMemo(() => {
    const q = query.trim().toLowerCase();

    const passesFilters = (a: Agent) => {
      const inProviders =
        activeFilters.providers.size === 0 ||
        activeFilters.providers.has((a.provider || "").toString());
      const inTags =
        activeFilters.tags.size === 0 ||
        a.tags?.some((t) => activeFilters.tags.has(t));
      const inCategories =
        activeFilters.categories.size === 0 ||
        a.categories?.some((c) => activeFilters.categories.has(c));
      return inProviders && inTags && inCategories;
    };

    const textMatch = (a: Agent) =>
      !q ||
      a.name.toLowerCase().includes(q) ||
      (a.description || "").toLowerCase().includes(q) ||
      (a.provider || "").toLowerCase().includes(q);

    const base = agents.filter((a) => passesFilters(a) && textMatch(a));

    const sorted = base.sort((a, b) => {
      const va =
        sort.key === "updated_at"
          ? new Date(a.updated_at).getTime()
          : a.name.toLowerCase();
      const vb =
        sort.key === "updated_at"
          ? new Date(b.updated_at).getTime()
          : b.name.toLowerCase();
      const cmp = va < vb ? -1 : va > vb ? 1 : 0;
      return sort.dir === "asc" ? cmp : -cmp;
    });

    return sorted;
  }, [agents, query, sort, activeFilters]);

  // --- page model (client-side) ---
  const totalItems = total ?? filteredSorted.length;
  const totalPages = Math.max(
    1,
    Math.ceil((total ?? filteredSorted.length) / pageSize),
  );
  const pageSlice = useMemo(() => {
    // client-side slice
    const start = (page - 1) * pageSize;
    return filteredSorted.slice(start, start + pageSize);
  }, [filteredSorted, page, pageSize]);

  const toggleSort = (key: SortKey) =>
    setSort((s) =>
      s.key === key
        ? { key, dir: s.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" },
    );

  const handleConfirm = () => {
    if (!selectedId) return;
    onConfirm(selectedId);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {/* fixed size + internal scroll to avoid tall page */}
      <DialogContent size="2xl" className="overflow-hidden rounded-2xl p-0">
        <div className="flex h-[80vh] flex-col">
          <DialogHeader className="px-6 pt-6 pb-3">
            <DialogTitle className="flex items-center gap-2">
              <Icon icon="ph:robot-bold" className="text-primary h-5 w-5" />
              Add Agent to Workflow
            </DialogTitle>
            <DialogDescription>
              Select one agent and click “Add Agent”.
            </DialogDescription>
          </DialogHeader>

          {/* body */}
          <div className="grid flex-1 grid-cols-12 gap-6 overflow-hidden px-6 pb-6">
            {/* Filters column */}
            <aside className="col-span-4 overflow-y-auto rounded-xl border p-4">
              <AgentFilters
                options={filterOptions}
                activeFilters={activeFilters}
                onFilterChange={onFilterChange}
              />
            </aside>

            {/* Table column */}
            <section className="col-span-8 flex flex-col overflow-hidden">
              {/* search + sort hint */}
              <div className="flex items-center justify-between pb-4">
                <div className="relative w-full max-w-sm">
                  <Icon
                    icon="lucide:search"
                    className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
                  />
                  <Input
                    placeholder="Search agents…"
                    className="rounded-xl pl-10"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setPage(1);
                    }}
                  />
                </div>
                {/* page size */}
                <div className="text-muted-foreground text-sm">
                  Page size:
                  <select
                    className="ml-2 rounded-md border bg-transparent px-2 py-1"
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setPage(1);
                    }}
                  >
                    {[10, 20, 50].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* table wrapper must scroll, not the dialog */}
              <div className="flex-1 overflow-auto rounded-md border">
                <Table>
                  <TableHeader className="bg-background sticky top-0 z-10">
                    <TableRow>
                      <TableHead className="w-10" />
                      <TableHead>
                        <Button
                          variant="ghost"
                          className="-ml-3"
                          onClick={() => toggleSort("name")}
                        >
                          Name{" "}
                          <Icon
                            icon="lucide:arrow-up-down"
                            className="ml-2 h-4 w-4"
                          />
                        </Button>
                      </TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-44">
                        <Button
                          variant="ghost"
                          className="-ml-3"
                          onClick={() => toggleSort("updated_at")}
                        >
                          Last updated{" "}
                          <Icon
                            icon="lucide:arrow-up-down"
                            className="ml-2 h-4 w-4"
                          />
                        </Button>
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {loading ? (
                      Array.from({ length: 8 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell
                            colSpan={5}
                            className="text-muted-foreground h-12 animate-pulse"
                          >
                            Loading…
                          </TableCell>
                        </TableRow>
                      ))
                    ) : pageSlice.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No agents found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      pageSlice.map((a) => {
                        const selected = selectedId === a.id;
                        return (
                          <TableRow
                            key={a.id}
                            data-state={selected ? "selected" : undefined}
                            className={cn(
                              "cursor-pointer",
                              selected && "bg-accent",
                            )}
                            onClick={() => setSelectedId(a.id)}
                          >
                            <TableCell className="align-middle">
                              <Checkbox
                                checked={selected}
                                onCheckedChange={() => setSelectedId(a.id)}
                                aria-label={`Select ${a.name}`}
                              />
                            </TableCell>
                            <TableCell className="font-medium">
                              {a.name}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {a.provider}
                            </TableCell>
                            <TableCell className="text-muted-foreground max-w-md truncate">
                              {a.description}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {new Date(a.updated_at).toLocaleString()}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* pagination footer */}
              <div className="mt-3 flex items-center justify-between">
                <div className="text-muted-foreground text-sm">
                  Showing{" "}
                  <span className="font-medium">{pageSlice.length}</span> of{" "}
                  <span className="font-medium">{totalItems}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goFirst}
                    disabled={page === 1}
                  >
                    <Icon icon="lucide:chevrons-left" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goPrev}
                    disabled={page === 1}
                  >
                    <Icon icon="lucide:chevron-left" />
                  </Button>
                  <span className="px-2 text-sm">
                    Page {page} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goNext(totalPages)}
                    disabled={page === totalPages}
                  >
                    <Icon icon="lucide:chevron-right" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goLast(totalPages)}
                    disabled={page === totalPages}
                  >
                    <Icon icon="lucide:chevrons-right" />
                  </Button>
                </div>
              </div>
            </section>
          </div>

          {/* footer */}
          <div className="flex justify-end gap-2 px-6 pb-6">
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={!selectedId}>
              <Icon icon="lucide:plus" className="mr-2 h-4 w-4" />
              Add Agent
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
