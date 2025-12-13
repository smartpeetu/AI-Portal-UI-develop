import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";

interface FilterAccordionProps<T extends Record<string, string[]>> {
  options: T;
  activeFilters: Record<keyof T, Set<string>>;
  onFilterChange: (category: keyof T, value: string) => void;
  categories?: { title: string; key: keyof T }[];
}

export function FilterAccordion<T extends Record<string, string[]>>({
  options,
  activeFilters,
  onFilterChange,
  categories,
}: FilterAccordionProps<T>) {
  const defaultCategories =
    categories ??
    (Object.keys(options).map((key) => ({
      title: key.charAt(0).toUpperCase() + key.slice(1),
      key,
    })) as { title: string; key: keyof T }[]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Filters</h3>
      <Accordion
        type="multiple"
        defaultValue={defaultCategories.map((c) => c.title)}
        className="w-full"
      >
        {defaultCategories.map(({ title, key }) => (
          <AccordionItem key={title} value={title}>
            <AccordionTrigger className="text-base capitalize">
              {title}
            </AccordionTrigger>
            <AccordionContent>
              <div className="max-h-60 space-y-2 overflow-hidden">
                {options[key]?.map((option) => (
                  <div
                    key={option}
                    className="mb-3 flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`${String(key)}-${option}`}
                      checked={activeFilters[key]?.has(option) ?? false}
                      onCheckedChange={() => onFilterChange(key, option)}
                    />
                    <label
                      htmlFor={`${String(key)}-${option}`}
                      className="text-sm leading-none font-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
}

// Skeleton
FilterAccordion.Skeleton = function FilterAccordionSkeleton() {
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
