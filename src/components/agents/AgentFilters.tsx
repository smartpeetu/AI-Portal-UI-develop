// src/components/agents/AgentFilters.tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import type { AgentFilterOptions } from "@/types";

interface AgentFiltersProps {
  options: AgentFilterOptions;
  activeFilters: Record<string, Set<string>>;
  onFilterChange: (category: keyof AgentFilterOptions, value: string) => void;
}

export const AgentFilters = ({
  options,
  activeFilters,
  onFilterChange,
}: AgentFiltersProps) => {
  const filterCategories: { title: string; key: keyof AgentFilterOptions }[] = [
    { title: "Providers", key: "providers" },
    { title: "Tags", key: "tags" },
    { title: "Categories", key: "categories" },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Filters</h3>
      <Accordion
        type="multiple"
        defaultValue={["Providers", "Tags", "Categories"]}
        className="w-full"
      >
        {filterCategories.map(({ title, key }) => (
          <AccordionItem key={title} value={title}>
            <AccordionTrigger className="text-base capitalize">
              {title}
            </AccordionTrigger>
            <AccordionContent>
              <div className="max-h-60 space-y-2 overflow-y-auto">
                {options[key].map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${key}-${option}`}
                      checked={activeFilters[key]?.has(option) ?? false}
                      onCheckedChange={() => onFilterChange(key, option)}
                    />
                    <label
                      htmlFor={`${key}-${option}`}
                      className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

// Skeleton
AgentFilters.Skeleton = function AgentFiltersSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-7 w-24" />
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border-b">
            <div className="flex items-center justify-between py-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
