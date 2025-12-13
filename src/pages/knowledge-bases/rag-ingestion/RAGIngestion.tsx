//src\pages\knowledge-bases\rag-ingestion\RAGIngestion.tsx
import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { Icon } from "@iconify/react";
import { isAxiosError } from "axios";

// shadcn/ui
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Types & API
import type {
  RAGIngestionFormData,
  RagPipelineResponse,
  RAGIngestionPayload,
  RagPipelineStatusResponse,
  CsvResultBody,
  PdfResultBody,
} from "@/types";
import { triggerRagPipeline } from "@/services/endpoints";

// Form and helpers
import RAGIngestionForm from "@/components/rag/RAGIngestionForm";
import { generateDefaultIndexName } from "@/lib/utils";
import ExecutionRow from "@/components/rag/ExecutionRow";
import { CsvResultDetails } from "@/components/rag/CsvResultDetails";
import { PdfResultDetails } from "@/components/rag/PdfResultDetails";
import { Badge } from "@/components/ui/badge";

// ---------- Initial Values ----------
const initialFormValues: RAGIngestionFormData = {
  index_name: generateDefaultIndexName(),
  source_type: "s3-csv",
  host: "",
  port: 5439,
  dbname: "",
  user: "",
  password: "",
  schemaname: "",
  tablename: "",
  column_to_embed: "content",
  bucket: "ai-portal-rag-ingestion-bucket",
  key: "sample-local-csv.csv",
  secret_name: "ai-portal-secret-redshift",
  aws_region: "us-west-2",
  file_type: "csv",
  redshift_column_to_embed: "",
  security_metadata: {
    user_id_external: "user-abc123",
    department: "finance",
    document_classification: "confidential",
    access_level: "internal",
    retention_policy_days: 365,
  },
  config: {
    extraction: {
      engine: "textract",
      strategy: "detect_text",
      language: "en",
      preserve_layout: true,
    },
    chunking: {
      strategy: "recursive",
      chunk_size: 512,
      chunk_overlap: 50,
      split_by: "sentence",
      max_chunks: 1000,
    },
    embedding: {
      enabled: true,
      provider: "aws-bedrock",
      model_id: "amazon.titan-embed-text-v2:0",
      embedding_dimension: 1024,
      normalize_embeddings: true,
    },
  },
};

// ---------- Result card ----------
function SubmissionResult({
  result,
  onReset,
}: {
  result: RagPipelineResponse;
  onReset: () => void;
}) {
  const navigate = useNavigate();
  const [completedJobs, setCompletedJobs] = useState(0);
  const [finalStatuses, setFinalStatuses] = useState<
    RagPipelineStatusResponse[]
  >([]);
  const totalJobs = result.executions.length;
  const allJobsCompleted = completedJobs === totalJobs;

  const handleJobCompletion = useCallback(
    (finalStatus: RagPipelineStatusResponse) => {
      setCompletedJobs((prev) => prev + 1);
      setFinalStatuses((prev) => [...prev, finalStatus]);
    },
    [],
  );

  const successfulJobs = finalStatuses.filter((s) => s.status === "SUCCEEDED");
  const failedJobs = finalStatuses.filter(
    (s) => s.status !== "SUCCEEDED" && s.status !== "RUNNING",
  );

  const overallStatusText = allJobsCompleted ? "Completed" : "In Progress";
  const overallStatusIcon = allJobsCompleted
    ? "lucide:check-circle-2"
    : "svg-spinners:180-ring-with-bg";
  const overallStatusColor = allJobsCompleted
    ? "text-green-500"
    : "text-primary-500";

  return (
    <div className="space-y-8">
      <Card className="border-muted shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Icon
              icon={overallStatusIcon}
              className={`h-8 w-8 ${overallStatusColor}`}
            />
            <div>
              <CardTitle>Ingestion Pipeline {overallStatusText}</CardTitle>
              <CardDescription>
                {completedJobs} of {totalJobs} jobs completed. Live status is
                shown below.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File/Job</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Checked</TableHead>
                <TableHead className="text-center">Checks</TableHead>
                <TableHead>Execution ARN</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.executions.map((exec) => (
                <ExecutionRow
                  key={exec.executionArn}
                  execution={exec}
                  onCompletion={handleJobCompletion}
                />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* --- SUCCESSFUL JOBS SUMMARY --- */}
      {allJobsCompleted && successfulJobs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon
                icon="lucide:check-circle"
                className="h-5 w-5 text-green-500"
              />
              Successful Ingestions ({successfulJobs.length})
            </CardTitle>
            <CardDescription>
              Summary of all successfully processed documents.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {successfulJobs.map((job) => {
              const output = job.output;
              if (!output) return null;

              const resultPayload =
                output.csvResult?.Payload || output.pdfResult?.Payload;
              if (!resultPayload) return null;

              try {
                const body = JSON.parse(resultPayload.body);

                return (
                  <div
                    key={job.executionArn}
                    className="space-y-2 rounded-lg border p-4"
                  >
                    <h3 className="text-foreground font-semibold">
                      {output.key}
                    </h3>
                    <Separator />
                    {/* Conditionally render the correct details component */}
                    {output.file_type === "csv" && (
                      <CsvResultDetails body={body as CsvResultBody} />
                    )}
                    {output.file_type === "pdf" && (
                      <PdfResultDetails body={body as PdfResultBody} />
                    )}
                  </div>
                );
              } catch (e) {
                console.error("Failed to parse result body:", e);
                return (
                  <div
                    key={job.executionArn}
                    className="text-destructive rounded-lg border p-4"
                  >
                    <h3 className="font-semibold">{output.key}</h3>
                    <p className="text-sm">Could not parse result data.</p>
                  </div>
                );
              }
            })}
          </CardContent>
        </Card>
      )}

      {/* --- FAILED JOBS SUMMARY --- */}
      {allJobsCompleted && failedJobs.length > 0 && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <Icon icon="lucide:x-circle" className="h-5 w-5" />
              Failed Ingestions ({failedJobs.length})
            </CardTitle>
            <CardDescription>
              These documents could not be processed. Check logs for details.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {failedJobs.map((job) => (
              <div
                key={job.executionArn}
                className="bg-destructive/5 flex items-center justify-between rounded-md border p-3"
              >
                <span className="font-mono text-sm">
                  {job.executionArn.split(":").pop()?.split("-")[1]}
                </span>
                <Badge variant="destructive">{job.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* --- FOOTER with next actions --- */}
      {allJobsCompleted && (
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onReset}>
            <Icon icon="mdi:plus-circle-outline" className="mr-2 h-5 w-5" />
            Start New Ingestion
          </Button>
          <Button onClick={() => navigate(-1)}>
            <Icon icon="lucide:database" className="mr-2 h-5 w-5" />
            Go to Knowledge Bases
          </Button>
        </div>
      )}
    </div>
  );
}

export default function RagIngestionPage() {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<RagPipelineResponse | null>(null);

  const handleSubmit = async (values: RAGIngestionFormData) => {
    setIsSubmitting(true);
    try {
      const fileType =
        values.source_type === "s3-pdf"
          ? "pdf"
          : values.source_type === "s3-csv"
            ? "csv"
            : "";

      const basePayload: Partial<RAGIngestionPayload> = {
        source: {
          type:
            values.source_type === "s3-pdf" || values.source_type === "s3-csv"
              ? "s3"
              : "redshift",
          details: {
            file_type: fileType,
          },
        },
        config: {
          index_name: values.index_name,
          column_to_embed:
            values.source_type === "s3-csv" && values.column_to_embed
              ? values.column_to_embed
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
              : values.source_type === "redshift" &&
                  values.redshift_column_to_embed
                ? values.redshift_column_to_embed
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                : [],
          security_metadata: values.security_metadata,
          extraction: values.config.extraction,
          chunking: values.config.chunking,
          embedding: values.config.embedding,
          opensearch_endpoint:
            "https://8sp5xe16p04s32g3itb.us-west-2.aoss.amazonaws.com",
          id_col: "",
          metadata_cols: [],
        },
      };

      let finalPayload: RAGIngestionPayload;
      if (values.source_type === "s3-pdf" || values.source_type === "s3-csv") {
        finalPayload = {
          ...basePayload,
          source: {
            ...basePayload.source,
            details: {
              ...basePayload.source?.details,
              bucket: values.bucket!,
              key: values.key!,
            },
          },
        } as RAGIngestionPayload;
      } else {
        // Redshift
        finalPayload = {
          ...basePayload,
          source: {
            ...basePayload.source!,
            details: {
              ...basePayload.source!.details!,
              host: values.host!,
              port: Number(values.port),
              dbname: values.dbname!,
              user: values.user!,
              password: values.password!,
              schemaname: values.schemaname!,
              tablename: values.tablename!,
            },
          },
          secret_name: values.secret_name!,
          aws_region: values.aws_region!,
        } as RAGIngestionPayload;
      }

      const response = await triggerRagPipeline(finalPayload);

      toast("🚀 Ingestion Pipeline Started", {
        description: "The ingestion process was successfully initiated.",
      });
      setTimeout(() => setResult(response), 350);
    } catch (err: unknown) {
      let description = "Could not start the ingestion pipeline.";
      if (isAxiosError(err)) {
        description =
          (err.response?.data as { message?: string })?.message ??
          err.message ??
          description;
      } else if (err instanceof Error) {
        description = err.message ?? description;
      }
      toast("Submission Failed", { description });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => setResult(null);

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-8">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-muted-foreground hover:text-foreground flex w-fit cursor-pointer items-center gap-2 text-sm transition-colors"
        >
          <Icon icon="lucide:arrow-left" className="h-4 w-4" />
          Back
        </button>
      </div>
      {/* Header */}
      <div className="from-background to-muted/40 mb-6 rounded-2xl border bg-gradient-to-b p-6">
        <div className="flex items-center gap-3">
          <Icon
            icon="mdi:folder-upload-outline"
            className="text-primary h-7 w-7"
          />
          <h1 className="text-2xl font-semibold tracking-tight">
            New RAG Ingestion Job
          </h1>
        </div>
        <p className="text-muted-foreground mt-2">
          Configure and submit a document for processing and embedding into the
          vector store.
        </p>
      </div>

      {/* Content */}
      {result ? (
        <div className="mt-8">
          <SubmissionResult result={result} onReset={resetForm} />
        </div>
      ) : (
        <div className="relative">
          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <RAGIngestionForm
                initialValues={initialFormValues}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            </CardContent>
          </Card>

          {/* Submitting overlay */}
          {isSubmitting && (
            <div className="bg-background/60 absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-xl backdrop-blur-sm">
              <Icon icon="svg-spinners:180-ring" className="h-8 w-8" />
              <div className="text-muted-foreground text-sm">
                Submitting job…
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
