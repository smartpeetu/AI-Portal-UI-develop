// src/types/index.d.ts
import type { Node, Edge } from "@xyflow/react";

//Agent types START
export interface Agent {
  id: string;
  name: string;
  provider: string;
  provider_agent_id: string;
  description: string;
  tags: string[];
  categories: string[];
  instruction: string;
  foundation_model: string;
  orchestration_type: string | null;
  icon_url: string;
  image_url: string;
  version: string;
  updated_at: string;
}

export interface GetAgentsParams {
  provider?: string | null;
  tags?: string[] | null;
  categories?: string[] | null;
  limit?: number;
  offset?: number;
}

export interface AgentsResponse {
  data: Agent[];
  count: number;
  next_offset: number;
  params: {
    provider: string | null;
    tags: string[] | null;
    categories: string[] | null;
    limit: number;
    offset: number;
  };
}

export interface AgentFilterOptions {
  providers: string[];
  tags: string[];
  categories: string[];
}

export interface UpdateAgentResponse {
  message: string;
  updatedAgent: {
    agentArn: string;
    agentCollaboration: string;
    agentId: string;
    agentName: string;
    agentResourceRoleArn: string;
    agentStatus: string;
    clientToken: string;
    createdAt: string;
    foundationModel: string;
    idleSessionTTLInSeconds: number;
    instruction: string;
    orchestrationType: string;
    updatedAt: string;
  };
  preparedStatus: string;
}
// Agent types END

// Model types START
export interface Model {
  id: string;
  name: string;
  provider: string;
  provider_model_id: string;
  model_family: string | null;
  model_type: string[];
  modality: string[];
  description: string;
  tags: string[] | null;
  model_metadata: {
    modelId: string;
    modelArn: string;
    modelName: string;
    providerName: string;
    modelLifecycle: {
      status: "ACTIVE" | string;
    };
    inputModalities: string[];
    outputModalities: string[];
    customizationsSupported: string[];
    inferenceTypesSupported: string[];
    responseStreamingSupported: boolean;
  };
  updated_at: string;
}

export interface ModelsResponse {
  data: Model[];
  count: number;
  next_offset: number;
  params: {
    provider: string | null;
    tags: string[] | null;
    categories: string[] | null;
    limit: number;
    offset: number;
  };
}

export interface ModelFilterOptions {
  providers?: string[];
  tags?: string[];
  limit?: number;
}
// Model types END

// Data Source types START
export interface DataSource {
  id: string;
  name: string;
  description: string;
  icon?: string;
}
// Data Source types END

// Pipeline types START
export interface PipelineRequest {
  steps: PipelineStep[];
  input: Record<string, string>;
}

export interface PipelineStep {
  agent_id: string;
  alias: string;
  input_key: string;
  provider: string;
  output_key: string;
  datasource?: {
    rds?: RDSDataSource;
    s3?: S3DataSource;
    redshift?: RedshiftDataSource;
    file_upload?: FileUploadDataSource;
    knowledge_base?: KnowledgeBaseDataSource;
    source_type: "rds" | "s3" | "redshift" | "file_upload" | "knowledge_base";
  };
}

export interface S3DataSource {
  s3_bucket: string;
  s3_region: string;
  s3_prefix?: string;
}

export interface RDSDataSource {
  db_host: string;
  db_user: string;

  db_password: string;
  db_name: string;
  db_type: string;
}

export interface RedshiftDataSource {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  schema?: string;
  region: string;
  ssl: boolean;
}

export interface FileUploadDataSource {
  file_name: string;
  file_content: string; // Base64 encoded content
}

export interface KnowledgeBaseDataSource {
  knowledge_base_index_name: string;
}

export interface PipelineResponse {
  output: string;
  memory: Record<string, string>;
}
// Pipeline types END

// RAG Ingestion types START
export interface RAGIngestionFormData {
  index_name: string;
  source_type: "s3-pdf" | "s3-csv" | "redshift";

  // ---------- S3 specific fields ----------
  bucket?: string;
  key?: string;
  column_to_embed?: string;

  // ---------- Redshift specific fields ----------
  secret_name?: string;
  aws_region?: string;
  host?: string;
  port?: number;
  dbname?: string;
  user?: string;
  password?: string;
  tablename?: string;
  schemaname?: string;
  redshift_column_to_embed?: string;

  // ---------- Common fields ----------
  file_type: "pdf" | "csv" | "database";

  security_metadata: {
    user_id_external: string;
    department: string;
    document_classification: string;
    access_level: string;
    retention_policy_days: number;
  };

  config: {
    extraction: {
      engine: string;
      strategy: string;
      language: string;
      preserve_layout: boolean;
    };
    chunking: {
      strategy: string;
      chunk_size: number;
      chunk_overlap: number;
      split_by: string;
      max_chunks: number;
    };
    embedding: {
      enabled: boolean;
      provider: string;
      model_id: string;
      embedding_dimension: number;
      normalize_embeddings: boolean;
    };
  };
}

// This is the shape the API endpoint EXPECTS.
export interface RAGIngestionPayload {
  source?: {
    type?: string; //s3 or redshift
    details?: {
      bucket?: string;
      key?: string;
      file_type?: string;
      host?: string;
      port?: number;
      dbname?: string;
      user?: string;
      password?: string;
      tablename?: string;
      schemaname?: string;
    };
  };
  secret_name?: string;
  aws_region?: string;
  config: {
    index_name: string;
    opensearch_endpoint: string;
    id_col?: string;
    metadata_cols?: string[];
    column_to_embed?: string[];
    security_metadata: {
      user_id_external?: string;
      department: string;
      document_classification?: string;
      access_level: string;
      retention_policy_days?: number;
    };
    extraction: {
      engine: string;
      strategy: string;
      language: string;
      preserve_layout: boolean;
    };
    chunking: {
      strategy: string;
      chunk_size: number;
      chunk_overlap: number;
      split_by: string;
      max_chunks: number;
    };
    embedding: {
      enabled: boolean;
      provider: string;
      model_id: string;
      embedding_dimension: number;
      normalize_embeddings: boolean;
    };
  };
}

export interface RagExecution {
  executionArn: string;
  startDate: string;
  status: "STARTED" | string;
}

// Response from the initial POST /trigger-rag-pipeline/start
export interface RagPipelineResponse {
  executions: RagExecution[];
}

export interface CsvResultBody {
  message: string;
  total_rows: number;
  success_count: number;
  fail_count: number;
}

export interface PdfResultBody {
  message: string;
  bucket: string;
  key: string;
  file_type: "pdf";
  chunks: number;
  indexed: number;
  index_name: string;
}

interface RagPipelineOutput {
  file_type: "csv" | "pdf" | string;
  bucket: string;
  key: string;
  config: RAGIngestionFormData["config"]; // Reuse existing config type
  // The result can be one of these shapes
  csvResult?: { Payload: { statusCode: number; body: string } };
  pdfResult?: { Payload: { statusCode: number; body: string } };
}

// Response from the GET /trigger-rag-pipeline/status/{arn}
export interface RagPipelineStatusResponse {
  executionArn: string;
  status: "RUNNING" | "SUCCEEDED" | "FAILED" | "TIMED_OUT" | "ABORTED" | string;
  output?: RagPipelineOutput; // The output is optional and only present on success
}
// RAG Ingestion types END

// Knowledge Base types START
export interface KnowledgeBase {
  health: string;
  status: "OPEN" | string;
  index: string;
  uuid: string;
  pri: string;
  rep: string;
  "docs.count": string;
  "docs.deleted": string;
  "store.size": string;
  "pri.store.size": string;
  uuid_meta: string;
  creation_date: string; // This will be an ISO date string
  number_of_shards: string;
  number_of_replicas: string;
  aliases: Record<string, unknown>; // An object for aliases
}
// Knowledge Base types END

// Workflow types START
// Represents a single workflow object from the GET /workflows/ endpoint
export interface ApiWorkflow {
  id: string;
  tenant_id: string;
  name: string;
  description: string;
  status: "draft" | string; // Be specific with known values
  latest_version_id: string;
}

// Represents the parameters for the GET /workflows/ endpoint
export interface GetWorkflowsParams {
  tenant_id?: string | null;
  q?: string | null; // Search query
  status?: string | null;
  offset?: number;
  limit?: number;
}

export interface CreateWorkflowPayload {
  tenant_id: string;
  name: string;
  description: string;
}

// Response from the first API call
export interface CreateWorkflowResponse {
  id: string; // This is the crucial "recipe id"
  tenant_id: string;
  name: string;
  description: string;
  status: string;
  latest_version_id: string;
}

// Payload for the second API call: POST /workflows/{id}/versions
export interface CreateWorkflowVersionPayload {
  definition_json: PipelineRequest; // The same payload as the chat
  schema_json: {
    nodes: Node[];
    edges: Edge[];
  };
}

// Payload for the POST /workflows/expose endpoint
export interface ExposeApiPayload {
  workflow_id: string;
  workflow_version_id: string;
  path?: string; // This will be derived from the workflow name
  allowed_ips?: string[]; // Optional
}

// Response from the POST /workflows/expose endpoint
export interface ExposeApiResponse {
  exposed_api_id: string;
  path?: string;
  auth: {
    mode: "HMAC";
    key_id: string;
    secret: string;
    last4: string;
  };
}

// Workflow types END

export interface SyncAgentsResponse {
  status: "success" | string;
  message: string;
}

export interface SyncModelsResponse {
  status: "success" | string;
  message: string;
}

export interface GetEnterpriseChatbotModels {
  region?: string;
}

export interface EnterpriseChatbotModelInfo {
  name: string;
  arn: string;
  provider: string;
  inferenceType: string;
  source: string;
  shortName: string;
  family: string;
  iconUrl: string;
}

export type EnterpriseChatbotCategory =
  | "text"
  | "video"
  | "audio"
  | "embedding";

export type EnterpriseChatbotModelsResponse = Record<
  EnterpriseChatbotCategory,
  EnterpriseChatbotModelInfo[]
>;

export interface EnterpriseChatRequest {
  model: string;
  region: string;
  messages: { role: "system" | "user" | "assistant"; content: string }[];
}

export interface EnterpriseChatResponse {
  response: string;
  model: string;
  metrics: {
    latencyMs: number;
  };
}

export interface GetChatListRequest {
  userid: string;
}

export interface GetChatMessagesRequest {
  userid: string;
}

export interface CreateOrReplaceChatRequest {
  userid: string;
}

export interface DeleteChatRequest {
  userid: string;
}

export interface Chat {
  chatId: string;
  chatTitle: string;
  createdAt: string;
  lastUpdatedAt: string;
}

export type GetChatList = Chat[];

export interface GetChatMessages {
  createdAt: string;
  chatId: string;
  userEmailId: string;
  messages: { role: "system" | "user" | "assistant"; content: string }[];
  lastUpdatedAt: string;
  chatTitle: string;
}

export interface CreateOrReplaceChat {
  chatId: string;
  userEmailId: string;
  chatTitle: string;
  createdAt: string;
  lastUpdatedAt: string;
}

export type DeveloperAccessRequestPayload = {
  domain: string;
  subdomain: string;
  justification: string;
  acknowledgeTerms: boolean;
  submittedAt: string;
  userId?: string;
};

export interface WorkflowDefinition {
  input: { input: string };
  steps: Step[];
}

export interface Step {
  alias: string;
  agent_id: string;
  provider: string;
  input_key: string;
  datasource: WFDataSource | null;
  output_key: string;
}

export interface WFDataSource {
  s3: any | null;
  rds: RDS | null;
  redshift: any | null;
  source_type: string;
  knowledge_base: any | null;
}

export interface RDS {
  db_host: string;
  db_name: string;
  db_type: string;
  db_user: string;
  db_password: string;
}

export interface WorkflowSchema {
  edges: Edge[];
  nodes: Node[];
}

export interface Edge {
  id: string;
  type: string;
  style: { strokeWidth: number };
  source: string;
  target: string;
  animated?: boolean;
  sourceHandle?: string;
}

export type Node = AgentNode | DataSourceNode;

export interface BaseNode {
  id: string;
  type: string;
  dragging: boolean;
  position: { x: number; y: number };
  selected: boolean;
}

export interface AgentNode extends BaseNode {
  type: "agentNode";
  data: AgentData;
}

export interface DataSourceNode extends BaseNode {
  type: "dataSourceNode";
  data: { id: string; name: string; description?: string };
}

export interface AgentData {
  id: string;
  name: string;
  tags: string[];
  version: string;
  icon_url: string;
  provider: string;
  image_url: string;
  categories: string[] | null;
  updated_at: string;
  description: string;
  instruction: string;
  foundation_model: string;
  provider_agent_id: string;
  orchestration_type: string | null;
}

export interface Workflow {
  id: string;
  workflow_id: string;
  definition_json: WorkflowDefinition;
  schema_json: WorkflowSchema;
}
