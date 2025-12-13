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
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import type { EnterpriseChatbotModelInfo } from "@/types";
import { useChat } from "@/context/chat-context";

type Props = {
  models: EnterpriseChatbotModelInfo[];
};

const sampleDescription = "This is a sample description";

export function ModelSelector({ models }: Props) {
  const { model, setModel } = useChat();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalItems = models.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return models.filter(
      (m) =>
        !q ||
        m.name.toLowerCase().includes(q) ||
        (m.provider || "").toLowerCase().includes(q),
    );
  }, [models, query]);

  const pageSlice = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const handleSelect = (selectedModel: EnterpriseChatbotModelInfo) => {
    setModel(selectedModel);
    setOpen(false);
    setQuery("");
    setPage(1);
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2"
      >
        {model ? model.shortName : "Select Model"}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent size="2xl" className="overflow-hidden rounded-2xl p-0">
          <div className="flex h-[80vh] flex-col">
            <DialogHeader className="px-6 pt-6 pb-3">
              <DialogTitle className="flex items-center gap-2">
                <Icon icon="ph:robot-bold" className="text-primary h-5 w-5" />
                Select Model
              </DialogTitle>
              <DialogDescription>
                Choose a model from the list.
              </DialogDescription>
            </DialogHeader>

            {/* Search + Page Size */}
            <div className="flex items-center justify-between border-b bg-gray-50 p-4">
              <div className="relative w-full max-w-sm">
                <Icon
                  icon="lucide:search"
                  className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
                />
                <Input
                  placeholder="Search models…"
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
                  {[10, 20, 50].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="flex min-h-[300px] flex-1 flex-col">
              <div className="flex-1 overflow-auto">
                <Table className="table-fixed">
                  <TableHeader className="bg-background sticky top-0 z-10">
                    <TableRow>
                      <TableHead className="w-24"></TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Family</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {pageSlice.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No models found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      pageSlice.map((m) => {
                        const selected = model?.arn === m.arn;
                        return (
                          <TableRow
                            key={m.arn}
                            className={cn(
                              "cursor-pointer transition-all hover:bg-gray-100",
                              selected && "bg-accent/30",
                            )}
                            onClick={() => handleSelect(m)}
                          >
                            <TableCell className="p-2">
                              {m.iconUrl ? (
                                <img
                                  src={m.iconUrl}
                                  alt={m.name}
                                  className="h-12 w-12 rounded-md object-cover"
                                />
                              ) : (
                                <div className="h-12 w-12 rounded-md bg-gray-200" />
                              )}
                            </TableCell>
                            <TableCell className="font-medium">
                              {m.shortName}
                            </TableCell>
                            <TableCell>{m.family}</TableCell>
                            <TableCell className="text-muted-foreground text-xs break-all">
                              {sampleDescription}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="mt-auto flex items-center justify-between border-t p-4">
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
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
