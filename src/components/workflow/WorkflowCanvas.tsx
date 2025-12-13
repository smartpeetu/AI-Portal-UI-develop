import {
  memo,
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
} from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  useReactFlow,
} from "@xyflow/react";
import type {
  NodeChange,
  EdgeChange,
  Connection,
  Edge,
  Node,
  NodeTypes,
  EdgeTypes,
  FitViewOptions,
} from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";

export interface WorkflowCanvasHandle {
  fitView: (opts?: FitViewOptions) => void;
}

interface WorkflowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  nodeTypes: NodeTypes;
  edgeTypes: EdgeTypes;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  runPipeline: () => void;
  saveRecipe: () => void;
}

export const WorkflowCanvas = memo(
  forwardRef<WorkflowCanvasHandle, WorkflowCanvasProps>(
    (
      {
        nodes,
        edges,
        nodeTypes,
        onNodesChange,
        onEdgesChange,
        onConnect,
        runPipeline,
        edgeTypes,
        saveRecipe,
      },
      ref,
    ) => {
      const reactFlowInstance = useReactFlow();

      // Expose fitView method to parent
      useImperativeHandle(ref, () => ({
        fitView: (
          options?: Parameters<typeof reactFlowInstance.fitView>[0],
        ) => {
          reactFlowInstance.fitView(options);
        },
      }));

      const prevCount = useRef(nodes.length);
      useEffect(() => {
        if (nodes.length > prevCount.current) {
          // new node added
          reactFlowInstance.fitView({ padding: 0.25, maxZoom: 1 });
        }
        prevCount.current = nodes.length;
      }, [nodes.length, reactFlowInstance]);

      return (
        <>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
          >
            <Background
              variant={BackgroundVariant.Lines}
              gap={10}
              id="1"
              color="#f1f1f1"
            />
            <Background
              variant={BackgroundVariant.Lines}
              gap={100}
              id="2"
              color="#ccc"
            />
            <Controls />
            <MiniMap nodeStrokeWidth={3} zoomable pannable />
          </ReactFlow>

          {/* top-right actions */}
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <Button
              variant="outline"
              onClick={() =>
                reactFlowInstance.fitView({ padding: 0.25, maxZoom: 1 })
              }
              className="rounded-xl"
            >
              <Icon icon="solar:crop-linear" className="h-4 w-4" />
              Fit
            </Button>
            <Button onClick={saveRecipe} className="rounded-xl">
              <Icon icon="material-symbols:save-rounded" className="h-4 w-4" />
              Save
            </Button>
            <Button onClick={runPipeline} className="rounded-xl">
              <Icon icon="lucide:play" className="h-4 w-4" />
              Run Recipe
            </Button>
          </div>
        </>
      );
    },
  ),
);
