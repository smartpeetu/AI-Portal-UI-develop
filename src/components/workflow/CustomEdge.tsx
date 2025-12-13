// src/components/workflow/CustomEdge.tsx
import React from "react";
import { Icon } from "@iconify/react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
  type EdgeProps,
} from "@xyflow/react";
import { Button } from "../ui/button";

const CustomEdge = React.memo((props: EdgeProps) => {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    selected,
    markerStart,
    markerEnd,
  } = props;
  const { setEdges } = useReactFlow();

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const onDelete = () => {
    setEdges((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerStart={markerStart}
        markerEnd={markerEnd}
        style={{
          stroke: "var(--color-primary-400)",
          strokeWidth: selected ? 3 : 2,
          strokeLinecap: "round",
          transition: "stroke 0.2s ease, stroke-width 0.2s ease",
          filter: "drop-shadow(0 0 1px rgba(0,0,0,0.12))",
        }}
        interactionWidth={20}
      />

      <EdgeLabelRenderer>
        <div
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
          }}
          className="nodrag nopan pointer-events-auto absolute z-10"
        >
          <Button
            variant="outline"
            aria-label="Delete Edge"
            onClick={onDelete}
            className="bg-background hover:bg-destructive/10 border-destructive/20 flex h-6 w-6 items-center justify-center rounded-full border p-0 shadow-sm"
          >
            <Icon icon="lucide:x" className="text-destructive h-3 w-3" />
          </Button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
});

export default CustomEdge;
