import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import UserSessionManager from "@/modules/UserSessionManager";
import type {
  PipelineRequest,
  PipelineStep,
  Agent,
  DataSource,
  KnowledgeBase,
} from "@/types";
import type { Edge, Node } from "@xyflow/react";

const session = new UserSessionManager();

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Deletes a cookie by setting its expiration date to the past.
 * @param name The name of the cookie to delete.
 * @param path The path of the cookie (defaults to '/').
 * @param domain The domain of the cookie (defaults to the current hostname).
 */
export function deleteCookie(
  name: string,
  path: string = "/",
  domain: string = window.location.hostname,
) {
  // Check if the cookie exists
  if (document.cookie.split(";").some((c) => c.trim().startsWith(name + "="))) {
    // Set the cookie with an expiration date in the past
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain};`;
    console.log(`Cookie '${name}' deleted.`);
  } else {
    console.log(`Cookie '${name}' not found.`);
  }
}

export function generateDefaultIndexName() {
  const username = session?.user?.username || "";
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${username}_index_${year}${month}${day}_${hours}${minutes}${seconds}`;
}

export function getInitials(name?: string | null): string {
  if (!name) return "AI";

  const parts = name.trim().split(/[\s._-]+/);

  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }

  const first = parts[0]?.[0] ?? "";
  const second = parts[1]?.[0] ?? "";
  return (first + second).toUpperCase();
}

const isDataSourceData = (
  data: unknown,
): data is DataSource & { creds?: Record<string, string> } => {
  return (
    typeof data === "object" && data !== null && "id" in data && "name" in data
  );
};

const isKnowledgeBaseData = (data: unknown): data is KnowledgeBase => {
  return (
    typeof data === "object" &&
    data !== null &&
    "index" in data &&
    "uuid" in data
  );
};

export const buildPipelinePayload = (
  nodes: Node[],
  edges: Edge[],
): PipelineRequest["steps"] => {
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  const agentNodes = nodes.filter((n) => n.type === "agentNode");

  // --- Topological Sort ---
  const adj = new Map<string, string[]>(agentNodes.map((n) => [n.id, []]));
  edges.forEach((e) => {
    const sourceNode = nodeMap.get(e.source);
    const targetNode = nodeMap.get(e.target);
    if (sourceNode?.type === "agentNode" && targetNode?.type === "agentNode") {
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
        agentData.provider.toLowerCase() === "azure" ? "azure" : "bedrock",
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

  return steps;
};
