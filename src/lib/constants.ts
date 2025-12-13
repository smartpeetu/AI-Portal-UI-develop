import type { Edge, Node } from "@xyflow/react";

export const initialNodes: Node[] = [];
export const initialEdges: Edge[] = [];

// A simple utility type for our options on the RAG Ingestion Pipeline page
type Option = { id: string; name: string };

export const DEPARTMENT_OPTIONS: Option[] = [
  { id: "finance", name: "Finance" },
  { id: "hr", name: "Human Resources" },
  { id: "engineering", name: "Engineering" },
  { id: "legal", name: "Legal" },
  { id: "marketing", name: "Marketing" },
];

export const DOC_CLASSIFICATION_OPTIONS: Option[] = [
  { id: "public", name: "Public" },
  { id: "internal", name: "Internal" },
  { id: "confidential", name: "Confidential" },
  { id: "restricted", name: "Restricted" },
];

export const ACCESS_LEVEL_OPTIONS: Option[] = [
  { id: "public", name: "Public" },
  { id: "internal", name: "Internal" },
  { id: "team-only", name: "Team Only" },
  { id: "private", name: "Private" },
];

export const EXTRACTION_ENGINE_OPTIONS: Option[] = [
  { id: "textract", name: "AWS Textract" },
  { id: "pypdf", name: "PyPDF" },
  { id: "unstructured", name: "Unstructured.io" },
];

export const EXTRACTION_STRATEGY_OPTIONS: Option[] = [
  { id: "detect_text", name: "Detect Text" },
  { id: "ocr_only", name: "OCR Only" },
  { id: "layout_aware", name: "Layout Aware" },
];

export const LANGUAGE_OPTIONS: Option[] = [
  { id: "en", name: "English" },
  { id: "es", name: "Spanish" },
  { id: "fr", name: "French" },
  { id: "de", name: "German" },
];

export const CHUNKING_STRATEGY_OPTIONS: Option[] = [
  { id: "recursive", name: "Recursive Character" },
  { id: "fixed_size", name: "Fixed Size" },
  { id: "semantic", name: "Semantic" },
];

export const SPLIT_BY_OPTIONS: Option[] = [
  { id: "sentence", name: "Sentence" },
  { id: "paragraph", name: "Paragraph" },
  { id: "word", name: "Word" },
];

export const EMBEDDING_PROVIDER_OPTIONS: Option[] = [
  { id: "aws-bedrock", name: "AWS Bedrock" },
  { id: "openai", name: "OpenAI" },
  { id: "cohere", name: "Cohere" },
];

export const EMBEDDING_MODEL_OPTIONS: Option[] = [
  { id: "amazon.titan-embed-text-v2:0", name: "Titan Embed Text v2:0" },
  { id: "text-embedding-ada-002", name: "Ada v2 (OpenAI)" },
  { id: "embed-english-v2.0", name: "Embed English v2 (Cohere)" },
];
