// src/components/workflow/ChatInterface.tsx
import { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import type { Node, Edge } from "@xyflow/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import sessionManager from "@/modules/UserSessionManager";

import { runPipelineAPI } from "@/services/endpoints";
import type {
  Agent,
  DataSource,
  KnowledgeBase,
  PipelineRequest,
  PipelineStep,
} from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

// Shape of a chat message
interface Message {
  sender: "user" | "bot";
  text: string;
}

interface ChatInterfaceProps {
  nodes: Node[];
  edges: Edge[];
}

// --- Type Guard Functions ---
// This function checks if an object has the properties of a DataSource.
const isDataSourceData = (
  data: unknown,
): data is DataSource & { creds?: Record<string, string> } => {
  return (
    typeof data === "object" && data !== null && "id" in data && "name" in data
  );
};

// This function checks if an object has the properties of a KnowledgeBase.
const isKnowledgeBaseData = (data: unknown): data is KnowledgeBase => {
  return (
    typeof data === "object" &&
    data !== null &&
    "index" in data &&
    "uuid" in data
  );
};

export const ChatInterface = ({ nodes, edges }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // get the user's initials
  const session = new sessionManager();
  const userInitials = getInitials(session?.user?.username);

  // Automatically scroll to the bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const buildPayload = (): PipelineRequest => {
    const nodeMap = new Map(nodes.map((node) => [node.id, node]));
    const agentNodes = nodes.filter((n) => n.type === "agentNode");

    // --- Topological Sort ---
    const adj = new Map<string, string[]>(agentNodes.map((n) => [n.id, []]));
    edges.forEach((e) => {
      const sourceNode = nodeMap.get(e.source);
      const targetNode = nodeMap.get(e.target);
      if (
        sourceNode?.type === "agentNode" &&
        targetNode?.type === "agentNode"
      ) {
        adj.get(sourceNode.id)?.push(targetNode.id);
      }
    });
    const visited = new Set<string>();
    const sortedAgents: Node[] = [];
    const recursionStack = new Set<string>();
    const dfs = (nodeId: string) => {
      if (recursionStack.has(nodeId)) {
        console.warn("Cycle detected in graph");
        return;
      }
      if (visited.has(nodeId)) return;
      visited.add(nodeId);
      recursionStack.add(nodeId);
      adj.get(nodeId)?.forEach(dfs);
      recursionStack.delete(nodeId);
      const node = nodeMap.get(nodeId);
      if (node) {
        sortedAgents.push(node);
      }
    };
    agentNodes.forEach((n) => {
      if (!visited.has(n.id)) dfs(n.id);
    });
    const executionOrder = sortedAgents.reverse();

    // --- Build the final "steps" array ---
    const steps: PipelineStep[] = executionOrder.map((agentNode) => {
      // Type guard to check if agentNode.data conforms to Agent interface
      const isAgentData = (data: unknown): data is Agent => {
        return (
          typeof data === "object" &&
          data !== null &&
          "id" in data &&
          "name" in data &&
          "provider" in data &&
          "provider_agent_id" in data
        );
      };

      if (!isAgentData(agentNode.data)) {
        throw new Error("Invalid agent data");
      }

      const agentData = agentNode.data;

      const step: PipelineStep = {
        agent_id: agentData.provider_agent_id,
        alias: agentData.name,
        provider:
          agentData.provider.toLowerCase() === "azure" ? "azure" : "AWS",
        input_key: "inputText",
        output_key: agentData.name,
      };

      // Find an edge where the TARGET is our current agent node.
      const incomingEdge = edges.find((e) => e.target === agentNode.id);
      // Get the node at the SOURCE of that edge.
      const sourceNode = incomingEdge ? nodeMap.get(incomingEdge.source) : null;

      // Check if the source node is a data source.
      if (
        sourceNode &&
        sourceNode.type === "dataSourceNode" &&
        isDataSourceData(sourceNode.data)
      ) {
        const dsData = sourceNode.data;
        const creds = dsData.creds || {};

        if (dsData.name === "AWS S3") {
          step.datasource = {
            source_type: "s3",
            s3: {
              s3_bucket: creds.bucketName ?? "",
              s3_region: creds.region ?? "",
              s3_prefix: creds.prefix ?? "",
            },
          };
        } else if (dsData.name === "AWS RDS") {
          step.datasource = {
            source_type: "rds",
            rds: {
              db_host: creds.dbIdentifier ?? "",
              db_user: creds.dbUsername ?? "",
              db_password: creds.dbPassword ?? "",
              db_name: "",
              db_type: "mysql",
            },
          };
        } else if (dsData.name === "AWS Redshift") {
          step.datasource = {
            source_type: "redshift",
            redshift: {
              host: creds.host ?? "",
              // Convert port from string to number, default to 5439
              port: creds.port ? parseInt(creds.port, 10) : 5439,
              database: creds.database ?? "",
              username: creds.username ?? "",
              password: creds.password ?? "",
              schema: creds.schema ?? "",
              region: creds.region ?? "",
              // Convert ssl from string ("true"/"false") to boolean
              ssl: creds.ssl === "true",
            },
          };
        } else if (dsData.name === "File Upload") {
          step.datasource = {
            source_type: "file_upload",
            file_upload: {
              file_name: creds.fileName ?? "",
              file_content: creds.fileContent ?? "", // The Base64 content
            },
          };
        }
      } else if (
        sourceNode &&
        sourceNode.type === "knowledgeBaseNode" &&
        isKnowledgeBaseData(sourceNode.data)
      ) {
        const kbData = sourceNode.data;
        step.datasource = {
          source_type: "knowledge_base",
          knowledge_base: {
            knowledge_base_index_name: kbData.index,
          },
        };
      }
      return step;
    });

    return {
      steps,
      input: {
        input: prompt.trim(),
      },
    };
  };

  const handleSend = async () => {
    if (!prompt.trim() || isLoading) return;

    const userMessage: Message = { sender: "user", text: prompt.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setPrompt("");
    setIsLoading(true);

    try {
      const payload = buildPayload();
      const response = await runPipelineAPI(payload);
      const botMessage: Message = {
        sender: "bot",
        text: response.output || "Sorry, I couldn't get a response.",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error: unknown) {
      const errorMessage: Message = {
        sender: "bot",
        text: `Error: ${
          (error as Error).message || "An unknown error occurred."
        }`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-6">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${
                msg.sender === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <Avatar className="h-8 w-8">
                {msg.sender === "user" ? (
                  <AvatarFallback>{userInitials}</AvatarFallback>
                ) : (
                  <AvatarFallback className="bg-primary/10">
                    <Icon
                      icon="ph:robot-bold"
                      className="text-primary h-5 w-5"
                    />
                  </AvatarFallback>
                )}
              </Avatar>
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ className, children }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return match ? (
                        // For block code with language
                        <SyntaxHighlighter
                          style={oneDark}
                          language={match[1]}
                          PreTag="div"
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        // For inline code
                        <code className="bg-muted-foreground/20 rounded-sm px-1 py-0.5">
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type your prompt here..."
            disabled={isLoading}
            autoComplete="off"
          />
          <Button type="submit" disabled={isLoading || !prompt.trim()}>
            {isLoading ? (
              <Icon icon="lucide:loader-2" className="h-4 w-4 animate-spin" />
            ) : (
              <Icon icon="lucide:send" className="h-4 w-4" />
            )}
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
};
