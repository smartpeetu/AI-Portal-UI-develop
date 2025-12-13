// src/components/rag/ExecutionRow.tsx
import { useState, useCallback, useEffect } from "react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getRagPipelineStatus } from "@/services/endpoints";
import { usePolling } from "@/hooks/use-polling";
import type { RagExecution, RagPipelineStatusResponse } from "@/types";

// UI Configuration for different statuses
const statusConfig: Record<
  RagPipelineStatusResponse["status"],
  { icon: string; color: string; text: string }
> = {
  RUNNING: {
    icon: "svg-spinners:180-ring-with-bg",
    color: "text-primary-500",
    text: "Running",
  },
  SUCCEEDED: {
    icon: "lucide:check-circle-2",
    color: "text-green-500",
    text: "Succeeded",
  },
  FAILED: {
    icon: "lucide:x-circle",
    color: "text-destructive",
    text: "Failed",
  },
  TIMED_OUT: {
    icon: "lucide:clock",
    color: "text-destructive",
    text: "Timed Out",
  },
  ABORTED: {
    icon: "lucide:ban",
    color: "text-muted-foreground",
    text: "Aborted",
  },
};

interface ExecutionRowProps {
  execution: RagExecution;
  onCompletion: (finalStatus: RagPipelineStatusResponse) => void; // Callback to notify parent when this job is done
}

const ExecutionRow = ({ execution, onCompletion }: ExecutionRowProps) => {
  const [status, setStatus] =
    useState<RagPipelineStatusResponse["status"]>("RUNNING");
  const [finalResult, setFinalResult] =
    useState<RagPipelineStatusResponse | null>(null);

  // --- STATE for polling metadata ---
  const [pollCount, setPollCount] = useState(0);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const pollStatus = useCallback(async () => {
    try {
      const response = await getRagPipelineStatus(execution.executionArn);
      setStatus(response.status);
      setLastChecked(new Date());
      setPollCount((prev) => prev + 1);
      if (response.status !== "RUNNING") {
        setFinalResult(response);
      }
    } catch (err) {
      console.error(`Polling failed for ${execution.executionArn}:`, err);
      setStatus("FAILED");
      setLastChecked(new Date());
      setPollCount((prev) => prev + 1);
      setFinalResult({
        executionArn: execution.executionArn,
        status: "FAILED",
      });
    }
  }, [execution.executionArn]);

  usePolling(pollStatus, status === "RUNNING" ? 10000 : null);

  useEffect(() => {
    if (finalResult) {
      onCompletion(finalResult);
    }
  }, [finalResult, onCompletion]);

  const copyArn = () => {
    navigator.clipboard.writeText(execution.executionArn);
    toast.success("Execution ARN copied!");
  };

  const currentStatus = statusConfig[status];
  const fileName =
    execution.executionArn.split(":").pop()?.split("-")[1] || "Unknown";

  return (
    <TableRow>
      <TableCell className="font-medium">{fileName}</TableCell>
      <TableCell>
        <Badge variant="secondary" className="capitalize">
          <Icon
            icon={currentStatus.icon}
            className={`mr-2 h-4 w-4 ${currentStatus.color}`}
          />
          {currentStatus.text}
        </Badge>
      </TableCell>
      <TableCell className="text-muted-foreground text-xs">
        {lastChecked ? lastChecked.toLocaleTimeString() : "Pending..."}
      </TableCell>
      <TableCell className="text-muted-foreground text-center text-xs">
        {pollCount}
      </TableCell>
      <TableCell className="text-muted-foreground text-xs">
        <div className="flex items-center gap-2">
          <span className="max-w-[150px] truncate">
            {execution.executionArn}
          </span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={copyArn}
                >
                  <Icon icon="lucide:copy" className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Copy ARN</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ExecutionRow;
