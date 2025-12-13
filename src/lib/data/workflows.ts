// src/lib/data/workflows.ts

export type Workflow = {
  id: string;
  name: string;
  createdBy: string;
  createdAt: Date;
  tags: string[];
};

export const workflows: Workflow[] = [
  {
    id: "wf_001",
    name: "Bedrock Workflow 1",
    createdBy: "Faran Mohammad",
    createdAt: new Date("2025-05-21T10:00:00Z"),
    tags: ["CLAUDE", "SONNET", "20240229"],
  },
  {
    id: "wf_002",
    name: "OpenAI Workflow",
    createdBy: "Faran Mohammad",
    createdAt: new Date("2025-05-21T11:30:00Z"),
    tags: ["OPENAI", "GPT-4O", "20240229"],
  },
  {
    id: "wf_003",
    name: "Perplexity Research Pipeline",
    createdBy: "Faran Mohammad",
    createdAt: new Date("2025-05-21T12:45:00Z"),
    tags: ["PERPLEXITY", "RESEARCH", "20240229"],
  },
  // Add more mock data as needed
];
