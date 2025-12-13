// src/lib/validators/rag-ingestion.schema.ts
import * as z from "zod";

export const ragIngestionSchema = z.object({
  index_name: z.string().min(1, "Index Name is required."),
  bucket: z.string().min(1, "S3 Bucket is required."),
  key: z.string().min(1, "S3 Key is required."),
  security_metadata: z.object({
    user_id_external: z.string().min(1, "External User ID is required."),
    department: z.string().min(1, "Department is required."),
    document_classification: z.string().min(1, "Classification is required."),
    access_level: z.string().min(1, "Access Level is required."),
    retention_policy_days: z.coerce
      .number()
      .min(1, "Retention must be at least 1 day."),
  }),
  config: z.object({
    extraction: z.object({
      engine: z.string().min(1, "Engine is required."),
      strategy: z.string().min(1, "Strategy is required."),
      language: z.string().min(1, "Language is required."),
      preserve_layout: z.boolean(),
    }),
    chunking: z.object({
      strategy: z.string().min(1, "Strategy is required."),
      chunk_size: z.coerce.number().min(1, "Chunk size must be positive."),
      chunk_overlap: z.coerce.number().min(0, "Overlap cannot be negative."),
      split_by: z.string().min(1, "Split by is required."),
      max_chunks: z.coerce.number().min(1, "Max chunks must be at least 1."),
    }),
    embedding: z
      .object({
        enabled: z.boolean(),
        provider: z.string().optional(),
        model_id: z.string().optional(),
        embedding_dimension: z.coerce.number().optional(),
        normalize_embeddings: z.boolean(),
      })
      .refine(
        (data) => {
          if (data.enabled) {
            return (
              data.provider !== undefined &&
              data.model_id !== undefined &&
              data.embedding_dimension !== undefined
            );
          }
          return true;
        },
        {
          message:
            "Provider, Model ID, and Embedding Dimension are required when embedding is enabled.",
        },
      ),
  }),
});

// We can infer the TypeScript type directly from the schema
export type RagIngestionSchema = z.infer<typeof ragIngestionSchema>;
