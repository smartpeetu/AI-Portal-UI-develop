// src/components/models/ModelCard.tsx
import React from "react";
import { Icon } from "@iconify/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// import { Link } from "react-router";
import type { Model } from "@/types";
import { cn } from "@/lib/utils";
import { getDynamicIcon } from "@/lib/icon-map";

const isModelDisabled = (model: Model): boolean => {
  const lowerCaseName = model?.name.toLowerCase();
  const lowerCaseProvider = model?.provider.toLowerCase();

  // Rule 1: Disable if inference type is only "PROVISIONED"
  const isProvisionedOnly =
    model?.model_metadata?.inferenceTypesSupported.length === 1 &&
    model?.model_metadata?.inferenceTypesSupported[0] === "PROVISIONED";

  // Rule 2: Disable if the name or provider contains specific keywords
  const isDisabledByName =
    lowerCaseName.includes("qwen") ||
    lowerCaseName.includes("deepseek") ||
    lowerCaseProvider.includes("meta");

  return isProvisionedOnly || isDisabledByName;
};

interface ModelCardProps {
  model: Model;
}

// Skeleton component
function ModelCardSkeleton() {
  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col gap-4 p-4">
        <div className="flex items-start gap-4">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="flex-grow space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
        <div className="flex-grow space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <div className="mt-auto flex items-center justify-between border-t pt-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}

type ModelCardType = React.FC<ModelCardProps> & {
  Skeleton: typeof ModelCardSkeleton;
};

const ModelCard: ModelCardType = ({ model }) => {
  const providerIcon = getDynamicIcon({
    provider: model?.provider,
    family: model?.model_family,
    name: model?.name,
  });
  const isActive = model?.model_metadata?.modelLifecycle?.status === "ACTIVE";
  const isDisabled = isModelDisabled(model);

  const renderIcon = () => {
    if (providerIcon.endsWith(".svg")) {
      // If it's a path to an SVG, render an <img> tag
      return (
        <img
          src={providerIcon}
          alt={`${model?.provider} logo`}
          className="h-6 w-6 object-contain"
        />
      );
    }
    // Otherwise, render an <Icon> component
    return (
      <Icon icon={providerIcon} className="text-muted-foreground h-6 w-6" />
    );
  };

  return (
    <Card
      className={cn(
        "flex h-full flex-col transition-shadow duration-300",
        isDisabled
          ? "bg-muted/50 cursor-not-allowed opacity-60 grayscale"
          : "hover:shadow-lg",
      )}
    >
      <CardHeader className="flex flex-row items-start gap-4 p-4">
        <div className="bg-muted rounded-lg p-2">{renderIcon()}</div>
        <div className="flex-grow">
          <CardTitle className="text-base">
            {/* <Link
              to={isDisabled ? "#" : `/models/${model?.id}`}
              onClick={(e) => isDisabled && e.preventDefault()}
              className={cn(!isDisabled && "hover:underline")}
            > */}
            {model?.name}
            {/* </Link> */}
          </CardTitle>
          <p className="text-muted-foreground text-xs">
            Provider: {model?.provider}
          </p>
        </div>
        <Badge
          variant={isActive ? "default" : "outline"}
          className={cn(isActive && "bg-green-100 text-green-800")}
        >
          {model?.model_metadata?.modelLifecycle?.status}
        </Badge>
      </CardHeader>
      <CardContent className="flex flex-grow flex-col gap-4 p-4 pt-0">
        <p className="text-muted-foreground line-clamp-2 flex-grow text-sm">
          {model?.description ||
            model?.model_metadata?.modelArn ||
            "No description available."}
        </p>
        <div className="flex flex-wrap gap-2">
          {model?.modality.map((modality) => (
            <Badge key={modality} variant="secondary">
              {modality}
            </Badge>
          ))}
        </div>
      </CardContent>
      <div className="text-muted-foreground flex items-center justify-between border-t p-4 pt-3 text-xs">
        <span>Family: {model?.model_family || "N/A"}</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                disabled={isDisabled}
              >
                <Icon icon="lucide:more-horizontal" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {isDisabled ? "Model is currently unavailable" : "View Details"}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </Card>
  );
};

ModelCard.Skeleton = ModelCardSkeleton;

export default ModelCard;
