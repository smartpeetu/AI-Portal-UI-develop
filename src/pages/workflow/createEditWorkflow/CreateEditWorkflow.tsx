// src/pages/workflow/createEditWorkflow/CreateEditWorkflow.tsx

// --- Core React & Routing Imports ---
import { useEffect, useState, useMemo, useCallback, memo, useRef } from "react";
import { useNavigate, useParams } from "react-router";

// --- Third-Party Library Imports ---
import {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

// --- Local Component Imports ---
import { WorkflowSidebar } from "@/components/workflow/WorkflowSidebar";
import { WorkflowCanvas } from "@/components/workflow/WorkflowCanvas";
import { PipelineOutputDrawer } from "@/components/workflow/PipelineOutputDrawer";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { AgentPickerDialog } from "@/components/workflow/AgentPickerDialog";
import type { WorkflowCanvasHandle } from "@/components/workflow/WorkflowCanvas";
import SaveRecipeDialog from "@/components/workflow/SaveRecipeDialog";

// --- Service & Type Imports ---
import {
  getAgents,
  getDataSources,
  getKnowledgeBases,
  createWorkflow,
  createWorkflowVersion,
  getWorkflowVersion,
  getWorkflowDetails,
} from "@/services/endpoints";
import type { KnowledgeBase, Agent, DataSource } from "@/types";
import type { Edge, Node, Connection } from "@xyflow/react";

// --- Constants & Utility Imports ---
import { initialEdges, initialNodes } from "@/lib/constants";
import "./CreateEditWorkflow.css";
import { buildPipelinePayload } from "@/lib/utils";
import UserSessionManager from "@/modules/UserSessionManager";

// Import custom node components
import AgentNode from "@/components/workflow/AgentNode";
import DataSourceNode from "@/components/workflow/DataSourceNode";
import KnowledgeBaseNode from "@/components/workflow/KnowledgeBaseNode";
import CustomEdge from "@/components/workflow/CustomEdge";

const CreateEditWorkflow = memo(() => {
  const navigate = useNavigate();
  const { workflowId } = useParams();
  const workflowCanvasRef = useRef<WorkflowCanvasHandle | null>(null);
  const session = new UserSessionManager();
  const username = session?.user?.username || "";

  // --- State for Sidebar Data ---
  const [agents, setAgents] = useState<Agent[]>([]);
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);

  // --- Filters for Agent Modal ---
  const filterOptions = useMemo(() => {
    const providers = new Set<string>();
    const tags = new Set<string>();
    const categories = new Set<string>();
    for (const a of agents) {
      if (a.provider) providers.add(a.provider);
      a.tags?.forEach((t) => t && tags.add(t));
      a.categories?.forEach((c) => c && categories.add(c));
    }
    return {
      providers: Array.from(providers).sort(),
      tags: Array.from(tags).sort(),
      categories: Array.from(categories).sort(),
    };
  }, [agents]);

  // --- State for UI Control (Loading, Errors, Selections) ---
  const [isLoading, setIsLoading] = useState({
    agents: true,
    dataSources: false,
    knowledgeBases: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [selectedDataSourceId, setSelectedDataSourceId] = useState<
    string | null
  >(null);
  const [agentPickerOpen, setAgentPickerOpen] = useState(false);
  const [selectedKnowledgeBaseId, setSelectedKnowledgeBaseId] = useState<
    string | null
  >(null);

  // ReactFlow node + edge state
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // --- State for the Drawer ---
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // --- State for the Save Modal ---
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // --- Data Fetching Effect ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (workflowId) {
          const workflowDetails = await getWorkflowDetails(workflowId);
          const workflow = await getWorkflowVersion(
            workflowDetails.latest_version_id,
          );
          if (workflow?.schema_json) {
            const { nodes: savedNodes = [], edges: savedEdges = [] } =
              workflow.schema_json;
            setNodes(savedNodes);
            setEdges(savedEdges);
            setTimeout(() => {
              workflowCanvasRef.current?.fitView({ padding: 0.25, maxZoom: 1 });
            }, 100);
          }
        }
        const agentsRes = await getAgents({ limit: 1000 });
        setAgents(agentsRes.data);
        const knowledgeBasesRes = await getKnowledgeBases();
        setKnowledgeBases(knowledgeBasesRes);
        const dataSourcesRes = await getDataSources();
        setDataSources(dataSourcesRes);
      } catch (err) {
        console.error("Failed to fetch workflow:", err);
        setError("Could not load workflow. Please try again.");
      } finally {
        setIsLoading({
          agents: false,
          dataSources: false,
          knowledgeBases: false,
        });
      }
    };

    fetchData();
  }, []);

  const addAgentNodeById = useCallback(
    (agentId: string) => {
      const agentToAdd = agents.find((a) => a.id === agentId);
      if (!agentToAdd) return;

      const position = {
        x: 250 + Math.random() * 50,
        y: 50 + nodes.length * 60,
      };
      const newNode: Node = {
        id: uuidv4(),
        type: "agentNode",
        position,
        data: { ...agentToAdd } as Record<string, unknown>,
      };
      setNodes((prev) => [...prev, newNode]);

      // perfect-fit right after add
      workflowCanvasRef.current?.fitView({ padding: 0.25, maxZoom: 1 });
    },
    [agents, nodes.length, setNodes],
  );

  const handleAddDataSource = useCallback(() => {
    if (!selectedDataSourceId) return;
    const ds = dataSources.find((d) => d.id === selectedDataSourceId);
    if (!ds) return;

    const position = { x: 250 + Math.random() * 50, y: 50 + nodes.length * 60 };
    const newNode: Node = {
      id: uuidv4(),
      type: "dataSourceNode",
      position,
      data: { ...ds } as Record<string, unknown>,
    };
    setNodes((prev) => [...prev, newNode]);
    setSelectedDataSourceId(null);
    // perfect-fit right after add
    workflowCanvasRef.current?.fitView({ padding: 0.25, maxZoom: 1 });
  }, [selectedDataSourceId, dataSources, nodes.length, setNodes]);

  const handleAddKnowledgeBase = useCallback(() => {
    if (!selectedKnowledgeBaseId) return;
    const kb = knowledgeBases.find((k) => k.uuid === selectedKnowledgeBaseId);
    if (!kb) return;

    const position = { x: 250 + Math.random() * 50, y: 50 + nodes.length * 60 };
    const newNode: Node = {
      id: uuidv4(),
      type: "knowledgeBaseNode",
      position,
      data: { ...kb } as Record<string, unknown>,
    };
    setNodes((prev) => [...prev, newNode]);
    setSelectedKnowledgeBaseId(null);
    // perfect-fit right after add
    workflowCanvasRef.current?.fitView({ padding: 0.25, maxZoom: 1 });
  }, [selectedKnowledgeBaseId, knowledgeBases, nodes.length, setNodes]);

  // --- Handler for Connecting Nodes ---
  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdge: Edge = {
        ...connection,
        id: `e-${connection.source}-${connection.target}`,
        animated: true,
        type: "customEdge",
        style: { strokeWidth: 2 },
      };
      setEdges((prevEdges) => addEdge(newEdge, prevEdges));
    },
    [setEdges],
  );

  // --- Register Custom Node Types ---
  const nodeTypes = useMemo(
    () => ({
      agentNode: AgentNode,
      dataSourceNode: DataSourceNode,
      knowledgeBaseNode: KnowledgeBaseNode,
    }),
    [],
  );

  const edgeTypes = useMemo(
    () => ({
      customEdge: CustomEdge,
    }),
    [],
  );

  const runPipeline = useCallback(() => {
    console.log("XYFlow JSON:", JSON.stringify({ nodes, edges }, null, 2));
    setIsDrawerOpen(true);
  }, [nodes, edges]);

  // The `saveRecipe` function now just opens the modal
  const saveRecipe = useCallback(() => {
    if (nodes.length === 0) {
      toast.error("Cannot save an empty recipe.", {
        description: "Please add at least one node to the canvas.",
      });
      return;
    }
    setIsSaveModalOpen(true);
  }, [nodes]);

  // This new handler contains the multi-step API logic
  const handleConfirmSave = async (values: {
    name: string;
    description?: string;
  }) => {
    setIsSaving(true);

    const tenantId = import.meta.env.VITE_TENANT_ID;
    if (!tenantId) {
      toast.error("Configuration Error", {
        description: "Tenant ID is not set.",
      });
      setIsSaving(false);
      return;
    }

    const savePromise = async () => {
      // Step 1: Create the workflow to get an ID
      const workflowResponse = await createWorkflow({
        tenant_id: tenantId,
        name: values.name,
        description:
          values.description || `${username}'s recipe for ${values.name}`,
      });
      const recipeId = workflowResponse.id;

      // Step 2: Prepare the version payload
      const cleanedNodes = nodes.map(
        ({ measured: _measured, ...node }) => node,
      );
      const versionPayload = {
        definition_json: {
          steps: buildPipelinePayload(nodes, edges),
          input: { input: "" },
        },
        schema_json: {
          nodes: cleanedNodes,
          edges,
        },
      };

      // Step 3: Create the workflow version
      await createWorkflowVersion(recipeId, versionPayload);
    };

    toast.promise(savePromise(), {
      loading: "Saving your recipe...",
      success: () => {
        setIsSaveModalOpen(false);
        navigate(-1); // Navigate back on success
        return "Recipe saved successfully!";
      },
      error: (err) => {
        return err.message || "Failed to save recipe.";
      },
      finally: () => {
        setIsSaving(false);
      },
    });
  };

  return (
    <div className="flex h-[calc(100vh-90px)] rounded-md border border-gray-300">
      <ReactFlowProvider>
        <WorkflowSidebar
          isLoading={isLoading}
          dataSources={dataSources}
          selectedDataSourceId={selectedDataSourceId}
          onDataSourceSelect={setSelectedDataSourceId}
          onAddDataSource={handleAddDataSource}
          onOpenAgentPicker={() => setAgentPickerOpen(true)}
          knowledgeBases={knowledgeBases}
          selectedKnowledgeBaseId={selectedKnowledgeBaseId}
          onKnowledgeBaseSelect={setSelectedKnowledgeBaseId}
          onAddKnowledgeBase={handleAddKnowledgeBase}
        />

        <main className="bg-background relative flex-1">
          {error && (
            <div className="bg-destructive/10 absolute top-4 left-4 z-10 rounded-md p-3 text-red-500">
              {error}
            </div>
          )}
          <WorkflowCanvas
            ref={workflowCanvasRef}
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            runPipeline={runPipeline}
            edgeTypes={edgeTypes}
            saveRecipe={saveRecipe}
          />
          {/* --- The Drawer Component --- */}
          <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <SheetContent className="flex w-full flex-col p-0 sm:w-4/5 sm:max-w-none">
              <SheetHeader className="p-6 pb-2">
                <SheetTitle>Run Pipeline</SheetTitle>
                <SheetDescription>
                  Interact with your workflow in real-time.
                </SheetDescription>
              </SheetHeader>
              <div className="flex-1 overflow-hidden">
                <PipelineOutputDrawer nodes={nodes} edges={edges} />
              </div>
            </SheetContent>
          </Sheet>
          {/*Agent Picker Dialog */}
          <AgentPickerDialog
            open={agentPickerOpen}
            onOpenChange={setAgentPickerOpen}
            agents={agents}
            loading={isLoading.agents}
            onConfirm={(agentId) => {
              setAgentPickerOpen(false);
              addAgentNodeById(agentId);
            }}
            filterOptions={filterOptions}
            total={agents.length}
          />
          <SaveRecipeDialog
            isOpen={isSaveModalOpen}
            onOpenChange={setIsSaveModalOpen}
            onSave={handleConfirmSave}
            isSaving={isSaving}
          />
        </main>
      </ReactFlowProvider>
    </div>
  );
});

export default CreateEditWorkflow;
