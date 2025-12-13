// src/components/workflow/DataSourceNode.tsx
import React, { useMemo, useRef, useState } from "react";
import { Position, useReactFlow } from "@xyflow/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Icon } from "@iconify/react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CustomHandle from "./CustomHandle";

import type { DataSource } from "@/types";
import { dataSourceFormConfig } from "@/lib/data/dataSourceFormConfig";
import type { FormFieldConfig } from "@/lib/data/dataSourceFormConfig";

interface DataSourceNodeProps {
  id: string;
  data: DataSource & {
    creds?: {
      fileName?: string;
      fileContent?: string;
      [key: string]: string | undefined;
    };
  };
}

// 1) Build a Zod schema that always outputs string
const generateSchema = (fields: FormFieldConfig[]) => {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const { name, label, required } of fields) {
    if (required) {
      shape[name] = z
        .string({ message: `${label} is required.` })
        .min(1, { message: `${label} is required.` });
    } else {
      shape[name] = z.string();
    }
  }
  return z.object(shape);
};

const DataSourceNode = React.memo(function DataSourceNode({
  id,
  data,
}: DataSourceNodeProps) {
  const { setNodes, setEdges } = useReactFlow();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);

  const realConfig = dataSourceFormConfig[data.name];
  const config = realConfig ?? { icon: "", fields: [] };

  //
  // ─── UNCONDITIONAL HOOKS ───────────────────────────────────────────────────────
  //
  const formSchema = useMemo(
    // cast so TS knows every output is ZodString
    () =>
      generateSchema(config.fields) as z.ZodObject<Record<string, z.ZodString>>,
    [config.fields],
  );
  type FormValues = z.infer<typeof formSchema>; // => Record<string,string>

  const defaultValues = config.fields.reduce<Record<string, string>>(
    (acc, { name }) => {
      acc[name] = data.creds?.[name] ?? "";
      return acc;
    },
    {} as Record<string, string>,
  );

  // now `field.value` is a `string`
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  //
  // ─── EARLY RETURN ────────────────────────────────────────────────────────────
  //
  if (!realConfig) {
    return <div>Error: Configuration for {data.name} not found.</div>;
  }

  //
  // ─── HANDLERS ────────────────────────────────────────────────────────────────
  //
  const onUpdateData = (newData: Partial<DataSourceNodeProps["data"]>) =>
    setNodes((n) =>
      n.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...newData } } : node,
      ),
    );

  const onSubmit = (values: FormValues) => {
    // make sure no `undefined` sneaks in
    const creds = {} as Record<string, string>;
    for (const k of Object.keys(values)) {
      creds[k] = values[k] ?? "";
    }
    onUpdateData({ creds });
    toast.success(`Configuration for ${data.name} saved!`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    toast.info(`Processing ${file.name}...`);

    const reader = new FileReader();

    // This function runs when the file has been successfully read
    reader.onload = () => {
      const result = reader.result as string; // e.g., "data:application/pdf;base64,JVBERi..."
      const base64Content = result.split(",")[1]; // Extract just the Base64 part

      // Update the node's data with both the name and the content
      onUpdateData({
        creds: {
          fileName: file.name,
          fileContent: base64Content,
        },
      });

      toast.success(`${file.name} uploaded successfully.`);
      setIsUploading(false);
    };

    // This function runs if there's an error reading the file
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      toast.error("Failed to read the file.");
      setIsUploading(false);
    };

    // This starts the asynchronous file reading process
    reader.readAsDataURL(file);
  };

  const handleDelete = () => {
    setNodes((n) => n.filter((node) => node.id !== id));
    setEdges((e) =>
      e.filter((edge) => edge.source !== id && edge.target !== id),
    );
  };

  //
  // ─── RENDER ───────────────────────────────────────────────────────────────────
  //
  return (
    <Card className="hover:border-primary/50 group/node pointer-events-auto w-72 rounded-lg border-2 border-transparent shadow-lg transition-colors">
      <CardHeader className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <Icon icon={config.icon} className="h-6 w-6" />
          <CardTitle className="text-base">{data.name}</CardTitle>
        </div>
        <Button variant="ghost" size="icon" onClick={handleDelete}>
          <Icon icon="lucide:x" className="text-muted-foreground h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="space-y-3 p-3 pt-0">
        <CardDescription className="text-xs">
          {data.description}
        </CardDescription>

        {data.name === "File Upload" ? (
          <div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            {/* --- UPDATED BUTTON WITH LOADING STATE --- */}
            <Button
              variant="outline"
              className="w-full border-dashed"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <Icon
                  icon="lucide:loader-2"
                  className="mr-2 h-4 w-4 animate-spin"
                />
              ) : (
                <Icon icon="lucide:upload-cloud" className="mr-2 h-4 w-4" />
              )}
              {isUploading
                ? "Processing..."
                : data.creds?.fileName || "Upload a file"}
            </Button>
          </div>
        ) : (
          //  ─── SPREAD THE WHOLE FORM──
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              {config.fields.map((fc) => (
                <FormField
                  key={fc.name}
                  control={form.control}
                  name={fc.name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">{fc.label}</FormLabel>

                      {fc.type === "select" ? (
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={fc.placeholder} />
                            </SelectTrigger>
                            <SelectContent>
                              {fc.options?.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                      ) : (
                        <FormControl>
                          <Input
                            {...field}
                            type={fc.type}
                            placeholder={fc.placeholder}
                          />
                        </FormControl>
                      )}

                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              <Button type="submit" size="sm" className="w-full">
                Save Configuration
              </Button>
            </form>
          </Form>
        )}
      </CardContent>

      <CustomHandle
        id="in"
        type="target"
        position={Position.Left}
        label="Incoming"
      />
      <CustomHandle
        id="out"
        type="source"
        position={Position.Right}
        label="Outgoing"
      />
    </Card>
  );
});

export default DataSourceNode;
