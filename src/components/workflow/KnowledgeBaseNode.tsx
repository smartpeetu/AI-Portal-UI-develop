// src/components/workflow/KnowledgeBaseNode.tsx
import { memo } from "react";
import { type NodeProps, Position, useReactFlow } from "@xyflow/react";
import { Icon } from "@iconify/react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import CustomHandle from "./CustomHandle";

// A small, reusable component for displaying stats
const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-mono font-medium">{value}</span>
  </div>
);

interface KnowledgeBaseNodeProps extends NodeProps {
  data: {
    uuid: string;
    index: string;
    status: string;
    "docs.count": string;
    "store.size": string;
  };
}

const KnowledgeBaseNode = memo(({ id, data }: KnowledgeBaseNodeProps) => {
  const { setNodes, setEdges } = useReactFlow();

  const handleDelete = () => {
    setNodes((n) => n.filter((node) => node.id !== id));
    setEdges((e) =>
      e.filter((edge) => edge.source !== id && edge.target !== id),
    );
  };

  return (
    <Card className="hover:border-primary/50 group/node pointer-events-auto w-72 rounded-lg border-2 border-transparent shadow-lg transition-colors">
      <CardHeader className="flex flex-row items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <Icon
            icon="garden:knowledge-base-26"
            className="h-5 w-5 text-green-500"
          />
          <CardTitle
            className="truncate text-base font-semibold"
            title={data?.index}
          >
            {data?.index}
          </CardTitle>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 flex-shrink-0"
          onClick={handleDelete}
        >
          <Icon icon="lucide:x" className="text-muted-foreground h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="space-y-3 p-3 pt-0">
        <div className="flex items-center gap-2">
          <Badge
            variant={data?.status === "OPEN" ? "default" : "outline"}
            className={
              data?.status === "OPEN"
                ? "border-green-300 bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                : ""
            }
          >
            {data?.status}
          </Badge>
          <CardDescription className="truncate text-xs" title={data?.uuid}>
            UUID: {data?.uuid}
          </CardDescription>
        </div>

        <Separator />

        <div className="space-y-2">
          <Stat label="Documents" value={data["docs.count"]} />
          <Stat label="Index Size" value={data["store.size"]} />
        </div>
      </CardContent>

      <CustomHandle type="target" position={Position.Left} />
      <CustomHandle type="source" position={Position.Right} />
    </Card>
  );
});

export default KnowledgeBaseNode;
