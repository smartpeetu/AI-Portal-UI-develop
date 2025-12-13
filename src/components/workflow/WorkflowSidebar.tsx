// src/components/workflow/WorkflowSidebar.tsx
import React, { memo } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import type { DataSource, KnowledgeBase } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

interface WorkflowSidebarProps {
  isLoading: { agents: boolean; dataSources: boolean; knowledgeBases: boolean };
  dataSources: DataSource[];
  selectedDataSourceId: string | null;
  onDataSourceSelect: (id: string) => void;
  onAddDataSource: () => void;
  onOpenAgentPicker: () => void;
  knowledgeBases: KnowledgeBase[];
  selectedKnowledgeBaseId: string | null;
  onKnowledgeBaseSelect: (id: string) => void;
  onAddKnowledgeBase: () => void;
}

const SectionCard = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-card/70 supports-[backdrop-filter]:bg-card/60 rounded-2xl border p-4 shadow-sm ring-1 ring-black/5 backdrop-blur">
    {children}
  </div>
);

const SectionHeader = ({
  title,
  icon,
  iconColor,
  count,
}: {
  title: string;
  icon: string;
  iconColor: string;
  count?: number;
}) => (
  <div className="mb-3 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <Icon icon={icon} className={`h-5 w-5 ${iconColor}`} />
      <h3 className="text-card-foreground text-sm font-semibold">{title}</h3>
    </div>
    {typeof count === "number" && (
      <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs">
        {count}
      </span>
    )}
  </div>
);

const FieldGroup = ({ children }: { children: React.ReactNode }) => (
  <div className="space-y-2">{children}</div>
);

const Hint = ({ children }: { children: React.ReactNode }) => (
  <p className="text-muted-foreground text-xs">{children}</p>
);

export const WorkflowSidebar = memo(
  ({
    isLoading,
    dataSources,
    selectedDataSourceId,
    onDataSourceSelect,
    onAddDataSource,
    onOpenAgentPicker,
    knowledgeBases,
    selectedKnowledgeBaseId,
    onKnowledgeBaseSelect,
    onAddKnowledgeBase,
  }: WorkflowSidebarProps) => {
    const noDataSources = (dataSources?.length ?? 0) === 0;
    const noKnowledgeBases = (knowledgeBases?.length ?? 0) === 0;

    const dsDisabled = isLoading.dataSources || noDataSources;
    const kbDisabled = isLoading.knowledgeBases || noKnowledgeBases;

    return (
      <aside className="from-background to-muted/30 w-72 flex-shrink-0 border-r bg-gradient-to-b p-4 pt-5">
        <div className="sticky top-4 flex max-h-[calc(100dvh-2rem)] flex-col gap-4 overflow-y-auto">
          {/* Agents */}
          <SectionCard>
            <SectionHeader
              title="Agents"
              icon="ph:robot-bold"
              iconColor="text-primary"
            />
            <Button
              className="mb-2 w-full gap-2 rounded-xl"
              onClick={onOpenAgentPicker}
              aria-label="Add agent to workflow"
            >
              <Icon icon="solar:add-circle-linear" className="text-lg" />
              Add Agent to Workflow
            </Button>
            <Hint>Choose one or more agents to orchestrate this workflow.</Hint>
          </SectionCard>

          {/* Data Sources */}
          <SectionCard>
            <SectionHeader
              title="Available Data Sources"
              icon="ph:database-bold"
              iconColor="text-primary"
              count={dataSources?.length ?? 0}
            />
            <FieldGroup>
              <div className="relative" aria-busy={isLoading.dataSources}>
                {isLoading.dataSources ? (
                  // Skeleton while loading
                  <div className="space-y-2">
                    <Skeleton className="h-9 w-full rounded-lg" />
                    <Skeleton className="h-8 w-1/2 rounded-md" />
                  </div>
                ) : (
                  <Select
                    value={selectedDataSourceId ?? ""}
                    onValueChange={onDataSourceSelect}
                    disabled={dsDisabled}
                  >
                    <SelectTrigger
                      aria-label="Select data source"
                      className="w-full rounded-lg"
                    >
                      <SelectValue
                        placeholder={
                          noDataSources
                            ? "No data sources found"
                            : "Select Data Source"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="max-h-72">
                      {dataSources.map((source) => (
                        <SelectItem key={source.id} value={source.id}>
                          <div className="flex items-center gap-2">
                            <Icon
                              icon={source?.icon ?? "ph:database-bold"}
                              className="text-muted-foreground h-4 w-4"
                            />
                            <span className="truncate">{source.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <Button
                variant="outline"
                className="w-full rounded-lg"
                onClick={onAddDataSource}
                disabled={!selectedDataSourceId}
                aria-disabled={!selectedDataSourceId}
                aria-label="Add selected data source"
              >
                <Icon icon="lucide:plus" className="mr-2 h-4 w-4" />
                Add Data Source
              </Button>

              {dsDisabled ? (
                <Hint>
                  {isLoading.dataSources
                    ? "Fetching your data sources…"
                    : "No data sources available. Add one in Settings or connect an integration."}
                </Hint>
              ) : (
                <Hint>
                  Pick a source, then click{" "}
                  <span className="font-medium">Add Data Source</span>.
                </Hint>
              )}
            </FieldGroup>
          </SectionCard>

          {/* Knowledge Bases */}
          <SectionCard>
            <SectionHeader
              title="Available Knowledge Bases"
              icon="garden:knowledge-base-26"
              iconColor="text-primary"
              count={knowledgeBases?.length ?? 0}
            />
            <FieldGroup>
              <div className="relative" aria-busy={isLoading.knowledgeBases}>
                {isLoading.knowledgeBases ? (
                  // Skeleton while loading
                  <div className="space-y-2">
                    <Skeleton className="h-9 w-full rounded-lg" />
                    <Skeleton className="h-8 w-2/3 rounded-md" />
                  </div>
                ) : (
                  <Select
                    value={selectedKnowledgeBaseId ?? ""}
                    onValueChange={onKnowledgeBaseSelect}
                    disabled={kbDisabled}
                  >
                    <SelectTrigger
                      aria-label="Select knowledge base"
                      className="w-full rounded-lg"
                    >
                      <SelectValue
                        placeholder={
                          noKnowledgeBases
                            ? "No knowledge bases found"
                            : "Select Knowledge Base"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="max-h-72">
                      {knowledgeBases.map((base) => (
                        <SelectItem key={base?.uuid} value={base?.uuid}>
                          <div className="flex items-center gap-2">
                            <Icon
                              icon="mdi:book-open-variant"
                              className="text-muted-foreground h-4 w-4"
                            />
                            <span className="truncate">{base?.index}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <Button
                variant="outline"
                className="w-full rounded-lg"
                onClick={onAddKnowledgeBase}
                disabled={!selectedKnowledgeBaseId}
                aria-disabled={!selectedKnowledgeBaseId}
                aria-label="Add selected knowledge base"
              >
                <Icon icon="lucide:plus" className="mr-2 h-4 w-4" />
                Add Knowledge Base
              </Button>

              {kbDisabled ? (
                <Hint>
                  {isLoading.knowledgeBases
                    ? "Fetching your knowledge bases…"
                    : "No knowledge bases available yet. Create or connect one first."}
                </Hint>
              ) : (
                <Hint>
                  Pick a knowledge base, then click{" "}
                  <span className="font-medium">Add Knowledge Base</span>.
                </Hint>
              )}
            </FieldGroup>
          </SectionCard>
        </div>
      </aside>
    );
  },
);
