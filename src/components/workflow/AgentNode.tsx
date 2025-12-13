// src/components/workflow/AgentNode.tsx
import { useEffect, useState, memo, useMemo } from "react";
import { Position, useReactFlow } from "@xyflow/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getModels, updateAgentModel } from "@/services/endpoints";
import type { Model, Agent } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import CustomHandle from "./CustomHandle";
import { toast } from "sonner";
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

// --- HELPER FUNCTION for fuzzy matching ---
/**
 * Extracts the core model identifier from a full ARN or model ID string.
 * e.g., "arn:aws:.../anthropic.claude-3-5-sonnet-20240620-v1:0" -> "anthropic.claude-3-5-sonnet"
 * e.g., "anthropic.claude-3-5-sonnet-20240620-v1:0" -> "anthropic.claude-3-5-sonnet"
 * @param modelIdentifier The string to parse.
 * @returns The core model name.
 */
const getCoreModelName = (modelIdentifier: string): string => {
  if (!modelIdentifier) return "";
  // Get the part after the last '/' if it's an ARN
  const lastPart = modelIdentifier.includes("/")
    ? modelIdentifier.split("/").pop()!
    : modelIdentifier;
  // Remove versioning details (like -20240620-v1:0)
  return lastPart.split("-").slice(0, 3).join("-");
};

const formSchema = z.object({
  modelId: z.string().optional(),
});

interface AgentNodeProps {
  id: string;
  data: Agent;
}

// Using the full Agent type for the node's data prop
const AgentNode = memo(({ id, data }: AgentNodeProps) => {
  const { setNodes, setEdges } = useReactFlow();
  const [models, setModels] = useState<Model[]>([]);
  const [isModelsLoading, setIsModelsLoading] = useState(true);

  // --- loading state specifically for the form submission ---
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // defaultValues: { modelId: data?.foundation_model || "" },
  });

  useEffect(() => {
    const fetchAndSetModels = async () => {
      setIsModelsLoading(true);
      try {
        const modelsData = await getModels({ limit: 1000 });
        setModels(modelsData.data);

        // After fetching the models, find the one that matches the agent's foundation_model.
        if (data?.foundation_model) {
          const agentCoreModel = getCoreModelName(data?.foundation_model);
          const matchingModel = modelsData?.data?.find(
            (m) => getCoreModelName(m?.provider_model_id) === agentCoreModel,
          );

          if (matchingModel) {
            // If a match is found, reset the form with the model's UUID.
            form.reset({ modelId: matchingModel?.id });
          }
        }
      } catch (error) {
        console.error("Failed to fetch models:", error);
      } finally {
        setIsModelsLoading(false);
      }
    };
    fetchAndSetModels();
  }, [data?.foundation_model, form]);

  // --- Group models by provider for the dropdown ---
  const groupedModels = useMemo(() => {
    return models.reduce(
      (acc, model) => {
        const provider = model?.provider || "Other";
        if (!acc[provider]) {
          acc[provider] = [];
        }
        acc[provider].push(model);
        return acc;
      },
      {} as Record<string, Model[]>,
    );
  }, [models]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Only submit if a modelId is actually selected
    if (!values.modelId) {
      toast.info("No model selected. Nothing to save.");
      return;
    }

    setIsSaving(true);
    const promise = updateAgentModel(data?.provider_agent_id, values.modelId);

    toast.promise(promise, {
      loading: `Updating model for "${data?.name}"...`,
      success: (response) => {
        setNodes((nodes) =>
          nodes.map((node) =>
            node.id === id
              ? {
                  ...node,
                  data: {
                    ...node.data,
                    foundation_model: response.updatedAgent.foundationModel,
                  },
                }
              : node,
          ),
        );
        return response.message;
      },
      error: (err) => err.message || "Failed to update agent.",
      finally: () => {
        setIsSaving(false);
      },
    });
  };

  const handleDelete = () => {
    setNodes((n) => n.filter((node) => node.id !== id));
    setEdges((e) =>
      e.filter((edge) => edge.source !== id && edge.target !== id),
    );
  };

  const iconName =
    data?.provider.toLowerCase() === "azure"
      ? "logos:microsoft-azure"
      : "simple-icons:amazonaws";

  return (
    <Card className="hover:border-primary/50 group/node pointer-events-auto w-72 rounded-lg border-2 border-transparent shadow-lg transition-colors">
      <CardHeader className="flex flex-row items-center justify-between p-3">
        <div className="flex items-center space-x-2">
          <Icon icon={iconName} width={20} height={20} />
          <CardTitle className="text-base">{data?.name}</CardTitle>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={handleDelete}
        >
          <Icon icon="lucide:x" className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <CardDescription className="mb-3 line-clamp-2 text-xs">
          {data?.description}
        </CardDescription>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1" className="border-none">
            <AccordionTrigger className="text-muted-foreground justify-start gap-1 p-0 text-xs hover:no-underline">
              <Icon icon="lucide:settings-2" className="h-3 w-3" />
              Configure Model
            </AccordionTrigger>
            <AccordionContent className="pt-3">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-3"
                >
                  <FormField
                    control={form.control}
                    name="modelId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Model</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isModelsLoading || isSaving}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  isModelsLoading
                                    ? "Loading models..."
                                    : "Select a model"
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {isModelsLoading ? (
                              <div className="p-2">
                                <Skeleton className="h-5 w-full" />
                              </div>
                            ) : (
                              // --- RENDER THE GROUPED, STYLED, AND DISABLED OPTIONS ---
                              Object.entries(groupedModels).map(
                                ([provider, providerModels]) => (
                                  <SelectGroup key={provider}>
                                    <SelectLabel>{provider}</SelectLabel>
                                    {providerModels.map((model) => {
                                      const isDisabled = isModelDisabled(model);
                                      const icon = getDynamicIcon({
                                        provider: model?.provider,
                                        family: model?.model_family,
                                        name: model?.name,
                                      });
                                      return (
                                        <SelectItem
                                          key={model?.id}
                                          value={model?.id}
                                          disabled={isDisabled}
                                        >
                                          <div className="flex items-center gap-2">
                                            {icon.endsWith(".svg") ? (
                                              <img
                                                src={icon}
                                                alt={model?.name}
                                                className="h-4 w-4 object-contain"
                                              />
                                            ) : (
                                              <Icon
                                                icon={icon}
                                                className="text-muted-foreground h-4 w-4"
                                              />
                                            )}
                                            <span>{model?.name}</span>
                                          </div>
                                        </SelectItem>
                                      );
                                    })}
                                  </SelectGroup>
                                ),
                              )
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="w-full"
                    disabled={isModelsLoading || isSaving}
                  >
                    {isSaving && (
                      <Icon
                        icon="lucide:loader-2"
                        className="mr-2 h-4 w-4 animate-spin"
                      />
                    )}
                    Save Configuration
                  </Button>
                </form>
              </Form>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CustomHandle type="target" position={Position.Left} />
      <CustomHandle type="source" position={Position.Right} />
    </Card>
  );
});

export default AgentNode;
