// src/hooks/use-table-controls.ts
import { useState, useMemo } from "react";

// Define a generic type for the sort configuration
export type SortConfig<T> = {
  key: keyof T;
  dir: "asc" | "desc";
};

// Define the return type of our hook for clarity
export interface TableControls<T> {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortConfig: SortConfig<T> | null;
  setSortConfig: (config: SortConfig<T> | null) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  paginatedData: T[];
  totalPages: number;
  totalItems: number;
  toggleSort: (key: keyof T) => void;
}

// The custom hook
export function useTableControls<T>(
  initialData: T[],
  searchPredicate: (item: T, term: string) => boolean,
  initialSort?: SortConfig<T>,
): TableControls<T> {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig<T> | null>(
    initialSort || null,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Memoized filtering and sorting logic
  const processedData = useMemo(() => {
    const lowerCaseSearch = searchTerm.toLowerCase();

    const filtered = initialData.filter((item) =>
      searchPredicate(item, lowerCaseSearch),
    );

    if (!sortConfig) return filtered;

    return [...filtered].sort((a, b) => {
      const valA = a[sortConfig.key];
      const valB = b[sortConfig.key];

      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;

      let comparison = 0;
      if (valA < valB) comparison = -1;
      if (valA > valB) comparison = 1;

      return sortConfig.dir === "asc" ? comparison : -comparison;
    });
  }, [initialData, searchTerm, sortConfig, searchPredicate]);

  // Memoized pagination logic
  const totalItems = processedData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return processedData.slice(start, start + pageSize);
  }, [processedData, currentPage, pageSize]);

  // Helper to toggle sort direction
  const toggleSort = (key: keyof T) => {
    setSortConfig((prev) =>
      prev?.key === key && prev.dir === "asc"
        ? { key, dir: "desc" }
        : { key, dir: "asc" },
    );
  };

  // Reset page when search term or page size changes
  if (currentPage > 1 && currentPage > totalPages) {
    setCurrentPage(totalPages);
  }

  return {
    searchTerm,
    setSearchTerm,
    sortConfig,
    setSortConfig,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    paginatedData,
    totalPages,
    totalItems,
    toggleSort,
  };
}
