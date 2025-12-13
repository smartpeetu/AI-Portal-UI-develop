//src\components\rag\RAGIngestionForm.tsx
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";

// shadcn/ui
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Types & constants
import type { RAGIngestionFormData } from "@/types";
import {
  DEPARTMENT_OPTIONS,
  DOC_CLASSIFICATION_OPTIONS,
  ACCESS_LEVEL_OPTIONS,
  EXTRACTION_ENGINE_OPTIONS,
  EXTRACTION_STRATEGY_OPTIONS,
  LANGUAGE_OPTIONS,
  CHUNKING_STRATEGY_OPTIONS,
  SPLIT_BY_OPTIONS,
  EMBEDDING_PROVIDER_OPTIONS,
  EMBEDDING_MODEL_OPTIONS,
} from "@/lib/constants";
import { awsRegions } from "@/lib/data/awsRegions";

// ---- Schema: mirrors the existing shape, minimal rules ----
const formSchema = z
  .object({
    index_name: z.string().min(1, "Index name is required"),
    source_type: z.enum(["s3-pdf", "s3-csv", "redshift"]),
    // S3 or Redshift shared base fields
    bucket: z.string().optional(),
    key: z.string().optional(),
    file_type: z.enum(["pdf", "csv"]).optional(),

    // Redshift specific
    secret_name: z.string().optional(),
    aws_region: z.string().optional(),
    host: z.string().optional(),
    port: z.coerce.number().optional(),
    dbname: z.string().optional(),
    user: z.string().optional(),
    password: z.string().optional(),
    tablename: z.string().optional(),
    schemaname: z.string().optional(),

    column_to_embed: z.string().optional(),
    redshift_column_to_embed: z.string().optional(),

    security_metadata: z.object({
      user_id_external: z.string().min(1, "Required").optional(),
      department: z.string().min(1, "Required"),
      document_classification: z.string().min(1, "Required").optional(),
      access_level: z.string().min(1, "Required"),
      retention_policy_days: z.coerce
        .number()
        .int()
        .positive("Must be positive")
        .optional(),
    }),

    config: z.object({
      extraction: z.object({
        engine: z.string().min(1, "Required"),
        strategy: z.string().min(1, "Required"),
        language: z.string().min(1, "Required"),
        preserve_layout: z.boolean(),
      }),
      chunking: z.object({
        strategy: z.string().min(1, "Required"),
        chunk_size: z.coerce.number().int().positive("Must be positive"),
        chunk_overlap: z.coerce.number().int().min(0, "Must be >= 0"),
        split_by: z.string().min(1, "Required"),
        max_chunks: z.coerce.number().int().positive("Must be positive"),
      }),
      embedding: z.object({
        enabled: z.boolean(),
        provider: z.string().optional(),
        model_id: z.string().optional(),
        embedding_dimension: z.coerce.number().optional(),
        normalize_embeddings: z.boolean(),
      }),
    }),
  })
  .superRefine((val, ctx) => {
    // Embedding rules
    if (val.config.embedding.enabled) {
      if (!val.config.embedding.provider) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["config", "embedding", "provider"],
          message: "Provider is required when embedding is enabled",
        });
      }
      if (!val.config.embedding.model_id) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["config", "embedding", "model_id"],
          message: "Model ID is required when embedding is enabled",
        });
      }
      if (!val.config.embedding.embedding_dimension) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["config", "embedding", "embedding_dimension"],
          message: "Embedding dimension is required when embedding is enabled",
        });
      }
    }

    // S3 PDF or CSV
    if (val.source_type === "s3-pdf" || val.source_type === "s3-csv") {
      if (!val.bucket) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["bucket"],
          message: "S3 Bucket is required.",
        });
      }
      if (!val.key) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["key"],
          message: "S3 Key is required.",
        });
      }
    }

    // S3 CSV only
    if (val.source_type === "s3-csv" && !val.column_to_embed) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["column_to_embed"],
        message: "Column to Embed is required for CSV files.",
      });
    }

    // Redshift only
    if (val.source_type === "redshift") {
      const required = [
        "secret_name",
        "aws_region",
        "host",
        "port",
        "dbname",
        "user",
        "password",
        "schemaname",
        "tablename",
      ] as const;

      for (const field of required) {
        if (!val[field]) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [field],
            message: `${field.replace("_", " ")} is required for Redshift.`,
          });
        }
      }
    }
  });

// 👇 KEY: split the types
type FormValuesInput = z.input<typeof formSchema>; // what RHF holds BEFORE parsing (strings allowed)
type FormValuesOutput = z.output<typeof formSchema>; // what zod returns AFTER parsing (numbers guaranteed)

type Props = {
  initialValues: RAGIngestionFormData;
  isSubmitting: boolean;
  onSubmit: (values: RAGIngestionFormData) => void; // API contract stays
};

export default function RAGIngestionForm({
  initialValues,
  isSubmitting,
  onSubmit,
}: Props) {
  // 👇 KEY: pass all 3 generics: <TFieldValues, TContext, TTransformedValues>
  const form = useForm<FormValuesInput, unknown, FormValuesOutput>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues as unknown as FormValuesInput, // initial UI values (strings/numbers both ok)
    mode: "onBlur",
  });

  const handleSubmit: SubmitHandler<FormValuesOutput> = (values) => {
    // values are already parsed by zod (numbers are numbers)
    onSubmit(values as unknown as RAGIngestionFormData);
  };

  const embeddingEnabled = form.watch("config.embedding.enabled");
  const renderOptions = (opts: { id: string; name: string }[]) =>
    opts.map((o) => (
      <SelectItem key={o.id} value={o.id}>
        {o.name}
      </SelectItem>
    ));

  const sourceType = form.watch("source_type");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="index_name"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              {" "}
              {/* Span full width */}
              <FormLabel>Index Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter a unique name for the knowledge base index"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />

        {/* --- Source Document --- */}
        <Card className="border-muted">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon
                icon="mdi:database-outline"
                className="text-primary h-5 w-5"
              />
              Source Document
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* --- NEW: Source Type Toggle --- */}
            <FormField
              control={form.control}
              name="source_type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Source Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-wrap items-center gap-x-4 gap-y-2"
                    >
                      <FormItem className="flex items-center space-y-0 space-x-2">
                        <FormControl>
                          <RadioGroupItem value="s3-pdf" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          AWS S3 (PDF)
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-y-0 space-x-2">
                        <FormControl>
                          <RadioGroupItem value="s3-csv" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          AWS S3 (CSV)
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-y-0 space-x-2">
                        <FormControl>
                          <RadioGroupItem value="redshift" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          AWS Redshift
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* --- Conditional Fields for S3 --- */}
            {(sourceType === "s3-pdf" || sourceType === "s3-csv") && (
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="bucket"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>S3 Bucket</FormLabel>
                      <FormControl>
                        <Input placeholder="my-bucket" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="key"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>S3 Key (File Path)</FormLabel>
                      <FormControl>
                        <Input placeholder="path/to/file.pdf" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {sourceType === "s3-csv" && (
                  <FormField
                    control={form.control}
                    name="column_to_embed"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Columns to Embed</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., content, title"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            )}

            {/* --- Conditional Fields for Redshift --- */}
            {sourceType === "redshift" && (
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="secret_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secrets Manager Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., redshift-credentials"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="aws_region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>AWS Region</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a region" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {awsRegions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 🔹 Redshift connection details */}
                <FormField
                  control={form.control}
                  name="host"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Host</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="redshift-cluster.endpoint.amazonaws.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dbname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Database Name</FormLabel>
                      <FormControl>
                        <Input placeholder="analytics_db" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="user"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User</FormLabel>
                      <FormControl>
                        <Input placeholder="db_user" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="schemaname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Schema Name</FormLabel>
                      <FormControl>
                        <Input placeholder="public" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tablename"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Table Name</FormLabel>
                      <FormControl>
                        <Input placeholder="documents" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="redshift_column_to_embed"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Columns to Embed</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., content, title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Metadata */}
        <Card className="border-muted">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon
                icon="mdi:shield-lock-outline"
                className="text-primary h-5 w-5"
              />
              Security Metadata
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="security_metadata.user_id_external"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>External User ID</FormLabel>
                  <FormControl>
                    <Input placeholder="user-abc123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField<FormValuesInput>
              control={form.control}
              name="security_metadata.retention_policy_days"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Retention Policy (Days)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      // Narrow `unknown` to what <input> accepts
                      value={
                        field.value === undefined || field.value === null
                          ? ""
                          : (field.value as number | string)
                      }
                      onChange={(e) => {
                        const v = e.target.value;
                        // allow empty string for UX, otherwise coerce
                        field.onChange(v === "" ? "" : Number(v));
                      }}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="security_metadata.department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {renderOptions(DEPARTMENT_OPTIONS)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="security_metadata.document_classification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Classification</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select classification" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {renderOptions(DOC_CLASSIFICATION_OPTIONS)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="security_metadata.access_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Access Level</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select access level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {renderOptions(ACCESS_LEVEL_OPTIONS)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Separator />

        {/* Ingestion Configuration */}
        <div>
          <h3 className="mb-2 text-lg font-semibold">
            Ingestion Configuration
          </h3>
          <p className="text-muted-foreground text-sm">
            Control how the document is extracted, chunked, and embedded.
          </p>
        </div>

        {/* Extraction Config */}
        <Card className="border-muted">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2">
              <Icon icon="mdi:content-copy" className="text-primary h-5 w-5" />
              Extraction Config
            </CardTitle>
            <FormField
              control={form.control}
              name="config.extraction.preserve_layout"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-3">
                  <FormLabel className="text-muted-foreground text-sm">
                    Preserve layout
                  </FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <FormField
              control={form.control}
              name="config.extraction.engine"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Engine</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select engine" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {renderOptions(EXTRACTION_ENGINE_OPTIONS)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="config.extraction.strategy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Strategy</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select strategy" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {renderOptions(EXTRACTION_STRATEGY_OPTIONS)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="config.extraction.language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Language</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {renderOptions(LANGUAGE_OPTIONS)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Chunking Config */}
        <Card className="border-muted">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon
                icon="mdi:vector-arrange-above"
                className="text-primary h-5 w-5"
              />
              Chunking Config
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <FormField
              control={form.control}
              name="config.chunking.strategy"
              render={({ field }) => (
                <FormItem className="md:col-span-1">
                  <FormLabel>Strategy</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select strategy" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {renderOptions(CHUNKING_STRATEGY_OPTIONS)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="config.chunking.split_by"
              render={({ field }) => (
                <FormItem className="md:col-span-1">
                  <FormLabel>Split By</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {renderOptions(SPLIT_BY_OPTIONS)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-4 md:col-span-3 md:grid-cols-3">
              <FormField<FormValuesInput>
                control={form.control}
                name="config.chunking.chunk_size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chunk Size</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        value={
                          field.value === undefined || field.value === null
                            ? ""
                            : (field.value as number | string)
                        }
                        onChange={(e) => {
                          const v = e.target.value;
                          field.onChange(v === "" ? "" : Number(v));
                        }}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField<FormValuesInput>
                control={form.control}
                name="config.chunking.chunk_overlap"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chunk Overlap</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        value={
                          field.value === undefined || field.value === null
                            ? ""
                            : (field.value as number | string)
                        }
                        onChange={(e) => {
                          const v = e.target.value;
                          field.onChange(v === "" ? "" : Number(v));
                        }}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField<FormValuesInput>
                control={form.control}
                name="config.chunking.max_chunks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Chunks</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        value={
                          field.value === undefined || field.value === null
                            ? ""
                            : (field.value as number | string)
                        }
                        onChange={(e) => {
                          const v = e.target.value;
                          field.onChange(v === "" ? "" : Number(v));
                        }}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Embedding Config */}
        <Card className="border-muted">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2">
              <Icon icon="mdi:vector-circle" className="text-primary h-5 w-5" />
              Embedding Config
            </CardTitle>
            <FormField
              control={form.control}
              name="config.embedding.enabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-3">
                  <FormLabel className="text-muted-foreground text-sm">
                    Enabled
                  </FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardHeader>

          <CardContent>
            {embeddingEnabled ? (
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="config.embedding.provider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provider</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select provider" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {renderOptions(EMBEDDING_PROVIDER_OPTIONS)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="config.embedding.model_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model ID</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select model" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {renderOptions(EMBEDDING_MODEL_OPTIONS)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField<FormValuesInput>
                  control={form.control}
                  name="config.embedding.embedding_dimension"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Embedding Dimension</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          value={
                            field.value === undefined || field.value === null
                              ? ""
                              : (field.value as number | string)
                          }
                          onChange={(e) => {
                            const v = e.target.value;
                            field.onChange(v === "" ? "" : Number(v));
                          }}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="config.embedding.normalize_embeddings"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-3 pt-2">
                      <FormLabel className="text-muted-foreground text-sm">
                        Normalize Embeddings
                      </FormLabel>
                      <FormControl>
                        <Switch
                          checked={!!field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            ) : (
              <div className="text-muted-foreground text-sm">
                Embedding is disabled. Enable it to configure settings.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center"
          >
            {isSubmitting ? (
              <>
                <Icon
                  icon="svg-spinners:270-ring-with-bg"
                  className="mr-2 h-5 w-5"
                />
                Submitting…
              </>
            ) : (
              <>
                <Icon
                  icon="mdi:rocket-launch-outline"
                  className="mr-2 h-5 w-5"
                />
                Start Ingestion
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
