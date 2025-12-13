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
import { Checkbox } from "@/components/ui/checkbox";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

type Agent = {
  name: string;
  desc: string;
};

const dummyAgents: Agent[] = [
  { name: "Knowledge Assistant", desc: "Best for answering factual queries" },
  { name: "Data Extractor", desc: "Extracts key information from documents" },
  { name: "Summarizer", desc: "Condenses long texts into short summaries" },
  { name: "Creative Writer", desc: "Generates stories and creative content" },
  { name: "Technical Explainer", desc: "Explains code and technical topics" },
];

export function AgentSelector() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const totalItems = dummyAgents.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return dummyAgents.filter(
      (a) =>
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.desc.toLowerCase().includes(q),
    );
  }, [query]);

  const pageSlice = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const handleConfirm = () => {
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
    setQuery("");
    setPage(1);
    setSelectedAgent(null);
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2"
      >
        {selectedAgent ? selectedAgent : "Select Agent"}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent size="lg" className="overflow-hidden rounded-2xl p-0">
          <div className="flex h-[60vh] flex-col">
            <DialogHeader className="px-6 pt-6 pb-3">
              <DialogTitle className="flex items-center gap-2">
                <Icon icon="ph:user-bold" className="text-primary h-5 w-5" />
                Select Agent
              </DialogTitle>
              <DialogDescription>
                Choose an agent from the list.
              </DialogDescription>
            </DialogHeader>

            {/* body */}
            <div className="flex-1 overflow-hidden px-6 pb-6">
              {/* search + page size */}
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
                    {[5, 10, 20].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex-1 overflow-auto rounded-md border">
                <Table>
                  <TableHeader className="bg-background sticky top-0 z-10">
                    <TableRow>
                      <TableHead className="w-10" />
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {pageSlice.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="h-24 text-center">
                          No agents found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      pageSlice.map((a, i) => {
                        const selected = selectedAgent === a.name;
                        return (
                          <TableRow
                            key={i}
                            data-state={selected ? "selected" : undefined}
                            className={cn(
                              "cursor-pointer",
                              selected && "bg-accent",
                            )}
                            onClick={() => setSelectedAgent(a.name)}
                          >
                            <TableCell className="align-middle">
                              <Checkbox
                                checked={selected}
                                onCheckedChange={() => setSelectedAgent(a.name)}
                                aria-label={`Select ${a.name}`}
                              />
                            </TableCell>
                            <TableCell className="font-medium">
                              {a.name}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {a.desc}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* pagination */}
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
                    onClick={() => setPage(1)}
                    disabled={page === 1}
                  >
                    <Icon icon="lucide:chevrons-left" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
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
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    <Icon icon="lucide:chevron-right" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(totalPages)}
                    disabled={page === totalPages}
                  >
                    <Icon icon="lucide:chevrons-right" />
                  </Button>
                </div>
              </div>
            </div>

            {/* footer */}
            <div className="flex justify-end gap-2 px-6 pb-6">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleConfirm} disabled={!selectedAgent}>
                <Icon icon="lucide:plus" className="mr-2 h-4 w-4" />
                Select Agent
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
