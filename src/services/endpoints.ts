// src/services/endpoints.ts
import { dataSources } from "@/lib/data/dataSources";
import axiosInstance from "./axiosInstance";
import type {
  GetAgentsParams,
  AgentsResponse,
  ModelFilterOptions,
  ModelsResponse,
  PipelineRequest,
  PipelineResponse,
  RagPipelineResponse,
  KnowledgeBase,
  DataSource,
  RAGIngestionPayload,
  UpdateAgentResponse,
  ApiWorkflow,
  GetWorkflowsParams,
  CreateWorkflowPayload,
  CreateWorkflowResponse,
  CreateWorkflowVersionPayload,
  ExposeApiPayload,
  ExposeApiResponse,
  SyncAgentsResponse,
  RagPipelineStatusResponse,
  SyncModelsResponse,
  GetEnterpriseChatbotModels,
  EnterpriseChatbotModelsResponse,
  EnterpriseChatRequest,
  EnterpriseChatResponse,
  GetChatListRequest,
  GetChatList,
  GetChatMessages,
  GetChatMessagesRequest,
  CreateOrReplaceChatRequest,
  CreateOrReplaceChat,
  DeleteChatRequest,
  Workflow,
} from "@/types";

const Endpoints = {
  GET_AGENTS: "/db/agents",
  GET_MODELS: "/db/models",
  RUN_PIPELINE: "/pipeline/",
  TRIGGER_RAG_PIPELINE: "/trigger-rag-pipeline/start",
  GET_KNOWLEDGE_BASES: "/aoss/",
  GET_DATA_SOURCES: "/data-sources/",
  UPDATE_AGENT: "/agents",
  GET_WORKFLOWS: "/workflows",
  GET_WORKFLOW_VERSION: "/workflows/versions",
  SYNC_AGENTS: "/admin/sync-agents",
  SYNC_MODELS: "/admin/sync-models",
  GET_ENTERPRISE_CHATBOT_MODELS: "/chatbot/models",
  ENTERPRISE_CHAT: "/chatbot/chat",
  GET_CHAT_LIST: "/chatbot/chats",
  GET_CHAT_MESSAGES: "/chatbot/chats",
  CREATE_OR_REPLACE_CHAT: "/chatbot/chats",
  DELETE_CHAT: "/chatbot",
};

export const getAgents = (
  params: GetAgentsParams = {},
): Promise<AgentsResponse> =>
  axiosInstance
    .get<AgentsResponse>(Endpoints.GET_AGENTS, { params })
    .then((res) => res.data);

export const getModels = (
  params: ModelFilterOptions = {},
): Promise<ModelsResponse> =>
  axiosInstance
    .get<ModelsResponse>(Endpoints.GET_MODELS, { params })
    .then((res) => res.data);

export const runPipelineAPI = (
  payload: PipelineRequest,
): Promise<PipelineResponse> => {
  return axiosInstance
    .post<PipelineResponse>(Endpoints.RUN_PIPELINE, payload)
    .then((res) => res.data);
};

export const triggerRagPipeline = (
  payload: RAGIngestionPayload,
): Promise<RagPipelineResponse> => {
  return axiosInstance
    .post<RagPipelineResponse>(Endpoints.TRIGGER_RAG_PIPELINE, payload)
    .then((res) => res.data);
};

export const getKnowledgeBases = (): Promise<KnowledgeBase[]> => {
  return axiosInstance
    .get<KnowledgeBase[]>(Endpoints.GET_KNOWLEDGE_BASES)
    .then((res) => res.data);
};

export const getDataSources = (): Promise<DataSource[]> => {
  return Promise.resolve(dataSources);
};

export const updateAgentModel = (
  agentId: string,
  foundationModel: string,
): Promise<UpdateAgentResponse> => {
  const params = { foundationModel };
  return axiosInstance
    .put<UpdateAgentResponse>(`${Endpoints.UPDATE_AGENT}/${agentId}`, null, {
      params,
    })
    .then((res) => res.data);
};

export const getWorkflows = (
  params: GetWorkflowsParams = {},
): Promise<ApiWorkflow[]> => {
  return axiosInstance
    .get<ApiWorkflow[]>(Endpoints.GET_WORKFLOWS, { params })
    .then((res) => res.data);
};

export const getWorkflowDetails = (
  workflowId?: string,
): Promise<ApiWorkflow> => {
  return axiosInstance
    .get<ApiWorkflow>(`${Endpoints.GET_WORKFLOWS}/${workflowId}`)
    .then((res) => res.data);
};

export const getWorkflowVersion = (version?: string): Promise<Workflow> => {
  return axiosInstance
    .get<Workflow>(`${Endpoints.GET_WORKFLOW_VERSION}/${version}`)
    .then((res) => res.data);
};

export const createWorkflow = (
  payload: CreateWorkflowPayload,
): Promise<CreateWorkflowResponse> => {
  return axiosInstance
    .post<CreateWorkflowResponse>("/workflows/", payload)
    .then((res) => res.data);
};

export const createWorkflowVersion = (
  workflowId: string,
  payload: CreateWorkflowVersionPayload,
): Promise<void> => {
  return axiosInstance
    .post(`/workflows/${workflowId}/versions`, payload)
    .then((res) => res.data);
};

export const deleteWorkflow = (workflowId: string): Promise<void> => {
  return axiosInstance
    .delete(`/workflows/${workflowId}`)
    .then((res) => res.data);
};

export const exposeWorkflowApi = (
  payload: ExposeApiPayload,
): Promise<ExposeApiResponse> => {
  return axiosInstance
    .post<ExposeApiResponse>("/workflows/expose", payload)
    .then((res) => res.data);
};

export const syncAgents = (): Promise<SyncAgentsResponse> => {
  return axiosInstance
    .post<SyncAgentsResponse>(Endpoints.SYNC_AGENTS)
    .then((res) => res.data);
};

export const getRagPipelineStatus = (
  executionArn: string,
): Promise<RagPipelineStatusResponse> => {
  const encodedArn = encodeURIComponent(executionArn);
  return axiosInstance
    .get<RagPipelineStatusResponse>(
      `/trigger-rag-pipeline/status/${encodedArn}`,
    )
    .then((res) => res.data);
};

export const syncModels = (): Promise<SyncModelsResponse> => {
  return axiosInstance
    .post<SyncModelsResponse>(Endpoints.SYNC_MODELS)
    .then((res) => res.data);
};

export const getEnterpriseChatbotModels = (
  params: GetEnterpriseChatbotModels = {},
): Promise<EnterpriseChatbotModelsResponse> =>
  axiosInstance
    .get<EnterpriseChatbotModelsResponse>(
      Endpoints.GET_ENTERPRISE_CHATBOT_MODELS,
      { params },
    )
    .then((res) => res.data);

export const enterpriseChat = (
  payload: EnterpriseChatRequest,
): Promise<EnterpriseChatResponse> => {
  return axiosInstance
    .post<EnterpriseChatResponse>(Endpoints.ENTERPRISE_CHAT, payload)
    .then((res) => res.data);
};

export const getChatList = (
  params: GetChatListRequest,
): Promise<GetChatList> => {
  return axiosInstance
    .get<GetChatList>(Endpoints.GET_CHAT_LIST, { params })
    .then((res) => res.data);
};

export const getChatMessages = (
  params: GetChatMessagesRequest,
  path: string,
): Promise<GetChatMessages> => {
  return axiosInstance
    .get<GetChatMessages>(`${Endpoints.GET_CHAT_MESSAGES}/${path}`, { params })
    .then((res) => res.data);
};

export const createOrReplaceChat = (
  params: CreateOrReplaceChatRequest,
  path: string,
  payload: EnterpriseChatRequest["messages"],
): Promise<CreateOrReplaceChat> => {
  return axiosInstance
    .put<CreateOrReplaceChat>(
      `${Endpoints.CREATE_OR_REPLACE_CHAT}/${path}`,
      { messages: payload },
      {
        params,
      },
    )
    .then((res) => res.data);
};

export const deleteChat = (
  params: DeleteChatRequest,
  path: string,
): Promise<number> => {
  return axiosInstance
    .delete(`${Endpoints.DELETE_CHAT}/${path}`, {
      params,
    })
    .then((res) => res.status);
};
