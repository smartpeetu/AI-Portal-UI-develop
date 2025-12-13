// src/components/workflow/PipelineOutputDrawer.tsx
import type { Edge, Node } from "@xyflow/react";
import { ChatInterface } from "./ChatInterface";

interface PipelineOutputDrawerProps {
  nodes: Node[];
  edges: Edge[];
}

export const PipelineOutputDrawer = ({
  nodes,
  edges,
}: PipelineOutputDrawerProps) => {
  // The drawer's only job is to render the chat interface and pass the data down.
  return <ChatInterface nodes={nodes} edges={edges} />;
};
