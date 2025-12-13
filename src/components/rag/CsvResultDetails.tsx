// src/components/rag/CsvResultDetails.tsx
import { Icon } from "@iconify/react";
import type { CsvResultBody } from "@/types";

interface CsvResultDetailsProps {
  body: CsvResultBody;
}

export const CsvResultDetails = ({ body }: CsvResultDetailsProps) => {
  return (
    <div className="grid grid-cols-3 gap-4 text-sm">
      <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
        <Icon icon="lucide:check-circle" />
        <span>{body.success_count} Succeeded</span>
      </div>
      <div className="text-destructive flex items-center gap-2">
        <Icon icon="lucide:x-circle" />
        <span>{body.fail_count} Failed</span>
      </div>
      <div className="text-muted-foreground flex items-center gap-2">
        <Icon icon="lucide:list" />
        <span>{body.total_rows} Total Rows</span>
      </div>
    </div>
  );
};
