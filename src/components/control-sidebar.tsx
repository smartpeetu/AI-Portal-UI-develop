import * as React from "react";
import { Card } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  ChatControlsContent,
  ChatControlsSidebar,
} from "@/components/ui/chat-controls-sidebar";
import { useChat } from "@/context/chat-context";
import type { EnterpriseChatbotModelInfo } from "@/types";

const agents = [
  {
    id: "neuron-nexus-01",
    name: "NeuroNexus Agent",
    description:
      "Advanced agent optimized for neural network orchestration and management.",
  },
  {
    id: "cortex-pro-3",
    name: "Cortex Pro 3",
    description:
      "Agent specialized in high-level cognitive task automation and reasoning.",
  },
  {
    id: "logicflow-alpha",
    name: "LogicFlow Alpha",
    description:
      "Agent focused on logic processing and automated decision making.",
  },
  {
    id: "synapse-quantum",
    name: "Synapse Quantum",
    description:
      "Cutting-edge agent for quantum-inspired data analysis and prediction.",
  },
  {
    id: "axon-hyperion",
    name: "Axon Hyperion",
    description:
      "Agent designed for high throughput communication and data routing.",
  },
  {
    id: "mindwave-v2",
    name: "MindWave V2",
    description:
      "Versatile agent that integrates sensory data with AI reasoning.",
  },
  {
    id: "deepcore-omniscient",
    name: "DeepCore Omniscient",
    description:
      "Agent optimized for deep learning inference across multi-modal inputs.",
  },
  {
    id: "neuralmesh-pro",
    name: "NeuralMesh Pro",
    description:
      "Agent specialized in distributed neural computations and task parallelism.",
  },
  {
    id: "cognisync-lite",
    name: "CogniSync Lite",
    description:
      "Lightweight agent for synchronizing cognitive processes and workflows.",
  },
  {
    id: "intellisage-x",
    name: "IntelliSage X",
    description:
      "Intelligent agent focusing on predictive analytics and user behavior modeling.",
  },
];

export function Controls() {
  const [modelSheetOpen, setModelSheetOpen] = React.useState(false);
  const [agentSheetOpen, setAgentSheetOpen] = React.useState(false);

  const [selectedAgent, setSelectedAgent] = React.useState(agents[0]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [agentSearchTerm, setAgentSearchTerm] = React.useState("");

  const { model, modelList, setModel } = useChat();

  const handleModelSelect = (selected: EnterpriseChatbotModelInfo) => {
    setModel(selected);
    setModelSheetOpen(false);
  };

  const handleAgentSelect = (agent: (typeof agents)[number]) => {
    setSelectedAgent(agent);
    setAgentSheetOpen(false);
  };

  const filteredModels = React.useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return q
      ? modelList.filter((m) => m.name.toLowerCase().includes(q))
      : modelList;
  }, [searchQuery, modelList]);

  const filteredAgents = React.useMemo(() => {
    const q = agentSearchTerm.toLowerCase().trim();
    return q ? agents.filter((a) => a.name.toLowerCase().includes(q)) : agents;
  }, [agentSearchTerm]);

  return (
    <>
      <Sheet open={modelSheetOpen} onOpenChange={setModelSheetOpen}>
        <SheetTrigger asChild>
          <section
            className="mb-6 cursor-pointer p-2"
            aria-label="Open model selection"
          >
            <h2 className="mb-2 text-sm font-medium text-gray-600">Model</h2>
            <Card className="p-4 transition hover:bg-gray-50">
              <p className="text-sm font-medium">
                {model ? model.name : "Select a model"}
              </p>
              <p className="text-xs text-gray-500">
                {model ? model.provider : "No model selected"}
              </p>
            </Card>
          </section>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="h-screen w-full overflow-y-auto border-l border-gray-200 bg-white sm:w-[600px] md:w-[720px] lg:w-[800px]"
        >
          <SheetHeader className="mb-4 border-b pb-4">
            <SheetTitle className="text-lg font-semibold">
              Model selection
            </SheetTitle>
          </SheetHeader>

          <div className="mb-4 px-2">
            <Input
              placeholder="Search for a model"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-200 bg-gray-50"
            />
          </div>

          <ScrollArea className="h-[75vh] p-2">
            {filteredModels.length > 0 ? (
              <div className="space-y-4">
                {filteredModels.map((m) => {
                  const isSelected = model?.arn === m.arn;
                  return (
                    <Card
                      key={m.arn}
                      onClick={() => handleModelSelect(m)}
                      className={`cursor-pointer border p-4 shadow-sm transition hover:bg-gray-50 ${
                        isSelected
                          ? "border-primary bg-blue-50"
                          : "border-gray-200"
                      }`}
                    >
                      <h3 className="text-sm font-medium">{m.name}</h3>
                      <p className="text-xs text-gray-500">{m.provider}</p>
                      <p className="text-xs text-gray-600">{m.arn}</p>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="mt-8 text-center text-sm text-gray-500">
                No models found for “{searchQuery}”
              </div>
            )}
          </ScrollArea>
        </SheetContent>
      </Sheet>
      <Sheet open={agentSheetOpen} onOpenChange={setAgentSheetOpen}>
        <SheetTrigger asChild>
          <section
            className="mb-6 cursor-pointer p-2"
            aria-label="Open agent selection"
          >
            <h2 className="mb-2 text-sm font-medium text-gray-600">Agent</h2>
            <Card className="p-4 transition hover:bg-gray-50">
              <p className="text-sm font-medium">{selectedAgent.name}</p>
              <p className="text-xs text-gray-500">
                {selectedAgent.description}
              </p>
            </Card>
          </section>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="h-screen w-full overflow-y-auto border-l border-gray-200 bg-white sm:w-[600px] md:w-[720px] lg:w-[800px]"
        >
          <SheetHeader className="mb-4 border-b pb-4">
            <SheetTitle className="text-lg font-semibold">
              Agent selection
            </SheetTitle>
          </SheetHeader>

          <div className="mb-4 px-2">
            <Input
              placeholder="Search for an agent"
              value={agentSearchTerm}
              onChange={(e) => setAgentSearchTerm(e.target.value)}
              className="w-full border border-gray-200 bg-gray-50"
            />
          </div>

          <ScrollArea className="h-[75vh] p-2">
            {filteredAgents.length > 0 ? (
              <div className="space-y-4">
                {filteredAgents.map((agent) => {
                  const isSelected = agent.id === selectedAgent.id;
                  return (
                    <Card
                      key={agent.id}
                      onClick={() => handleAgentSelect(agent)}
                      className={`cursor-pointer border p-4 shadow-sm transition hover:bg-gray-50 ${
                        isSelected
                          ? "border-primary bg-blue-50"
                          : "border-gray-200"
                      }`}
                    >
                      <h3 className="text-sm font-medium">{agent.name}</h3>
                      <p className="text-xs text-gray-500">
                        {agent.description}
                      </p>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="mt-8 text-center text-sm text-gray-500">
                No agents found for “{agentSearchTerm}”
              </div>
            )}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
}

export function ControlSidebar({
  ...props
}: React.ComponentProps<typeof ChatControlsSidebar>) {
  return (
    <ChatControlsSidebar side="right" className="border-r-0" {...props}>
      <ChatControlsContent>
        <Controls />
      </ChatControlsContent>
    </ChatControlsSidebar>
  );
}
