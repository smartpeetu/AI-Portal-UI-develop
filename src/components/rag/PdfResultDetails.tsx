// src/components/rag/PdfResultDetails.tsx
import { Icon } from "@iconify/react";
import type { PdfResultBody } from "@/types";

interface PdfResultDetailsProps {
  body: PdfResultBody;
}

export const PdfResultDetails = ({ body }: PdfResultDetailsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div className="text-muted-foreground flex items-center gap-2">
        <Icon icon="lucide:box-select" />
        <span>{body.chunks} Chunks Created</span>
      </div>
      <div className="text-muted-foreground flex items-center gap-2">
        <Icon icon="lucide:database-zap" />
        <span>{body.indexed} Chunks Indexed</span>
      </div>
    </div>
  );
};
