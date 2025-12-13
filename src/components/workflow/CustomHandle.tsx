// src/components/workflow/StyledHandle.tsx
import { memo } from "react";
import { Handle, Position, type HandleProps } from "@xyflow/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import clsx from "clsx";

type StyledHandleProps = HandleProps & {
  label?: string;
};

const CustomHandle = memo(
  ({ label, className, position, ...props }: StyledHandleProps) => {
    const positionOffset =
      position === Position.Left
        ? "!left-[-8px]"
        : position === Position.Right
          ? "!right-[-8px]"
          : position === Position.Top
            ? "!top-[-8px]"
            : position === Position.Bottom
              ? "!bottom-[-8px]"
              : "";
    const knob = (
      <Handle
        {...props}
        position={position}
        className={clsx(
          "group relative z-50 rounded-full border border-white/70 shadow-sm",
          "!h-3 !w-3",
          "!bg-primary",
          "transition outline-none",
          "hover:ring-offset-background hover:ring-primary/30 hover:ring-2 hover:ring-offset-2",
          "focus-visible:ring-primary/40 focus-visible:ring-2 focus-visible:ring-offset-2",
          "before:pointer-events-auto before:absolute before:-inset-3 before:rounded-full before:content-['']",
          "pointer-events-auto",
          positionOffset,
          className,
        )}
        aria-label={label ?? `${props.type} handle`}
        title={label}
      />
    );

    if (!label) return knob;

    const side: "top" | "right" | "bottom" | "left" =
      props.type === "source" ? "right" : "left";

    return (
      <TooltipProvider delayDuration={150}>
        <Tooltip>
          <TooltipTrigger asChild>{knob}</TooltipTrigger>
          <TooltipContent side={side} className="px-2 py-1 text-xs">
            {label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  },
);

export default CustomHandle;
