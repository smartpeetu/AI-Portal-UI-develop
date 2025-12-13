// src/components/workflow/ExposeApiSheet.tsx
import { useState } from "react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { exposeWorkflowApi } from "@/services/endpoints";
import type { ApiWorkflow, ExposeApiResponse } from "@/types";

// Helper to copy text to clipboard
const copyToClipboard = (text: string, label: string) => {
  navigator.clipboard.writeText(text);
  toast.success(`${label} copied to clipboard!`);
};

// Helper to download content as a file
const downloadAsFile = (content: string, filename: string, type: string) => {
  const blob = new Blob([content], { type });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// --- ZOD SCHEMA for the optional fields ---
const formSchema = z.object({
  path: z.string().optional(),
  allowed_ips: z.string().optional(), // We'll take IPs as a comma-separated string
});

type FormValues = z.infer<typeof formSchema>;

interface ExposeApiSheetProps {
  workflow: ApiWorkflow | null;
  onOpenChange: (isOpen: boolean) => void;
}

export const ExposeApiSheet = ({
  workflow,
  onOpenChange,
}: ExposeApiSheetProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiDetails, setApiDetails] = useState<ExposeApiResponse | null>(null);

  // --- Initialize React Hook Form ---
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      path: workflow?.name.toLowerCase().replace(/\s+/g, "-") || "",
      allowed_ips: "",
    },
  });

  const handleExposeApi = async (values: FormValues) => {
    if (!workflow) return;
    setIsLoading(true);

    const promise = async () => {
      const payload = {
        workflow_id: workflow.id,
        workflow_version_id: workflow.latest_version_id,
        // Use the path from the form, or fall back to the default
        path: values.path || workflow.name.toLowerCase().replace(/\s+/g, "-"),
        // Split the comma-separated string into an array, filtering out empty strings
        allowed_ips:
          values.allowed_ips
            ?.split(",")
            .map((ip) => ip.trim())
            .filter(Boolean) || [],
      };
      const response = await exposeWorkflowApi(payload);
      setApiDetails(response);
    };

    toast.promise(promise(), {
      loading: "Generating API key...",
      success: "API key generated successfully!",
      error: (err) => err.message || "Failed to expose API.",
      finally: () => setIsLoading(false),
    });
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      );
    }

    if (apiDetails) {
      const detailsToSave = JSON.stringify(apiDetails, null, 2);
      return (
        <div className="space-y-6 px-4">
          <Alert variant="destructive">
            <Icon icon="lucide:shield-alert" className="h-4 w-4" />
            <AlertTitle>Important: Save Your Secret Key</AlertTitle>
            <AlertDescription>
              This is the only time you will see your API secret. Store it in a
              secure location. If you lose it, you will need to generate a new
              key.
            </AlertDescription>
          </Alert>
          <div className="space-y-4 rounded-md border p-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Key ID</span>
              <div className="flex items-center gap-2">
                <code className="text-sm">{apiDetails.auth.key_id}</code>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    copyToClipboard(apiDetails.auth.key_id, "Key ID")
                  }
                >
                  <Icon icon="lucide:copy" className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Secret</span>
              <div className="flex items-center gap-2">
                <code className="text-sm">
                  ********************{apiDetails.auth.last4}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    copyToClipboard(apiDetails.auth.secret, "Secret")
                  }
                >
                  <Icon icon="lucide:copy" className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              variant="secondary"
              className="w-full"
              onClick={() =>
                downloadAsFile(
                  detailsToSave,
                  `${workflow?.name}-api-key.json`,
                  "application/json",
                )
              }
            >
              <Icon icon="lucide:download" className="mr-2 h-4 w-4" />
              Download as JSON
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() =>
                downloadAsFile(
                  detailsToSave,
                  `${workflow?.name}-api-key.txt`,
                  "text/plain",
                )
              }
            >
              <Icon icon="lucide:file-text" className="mr-2 h-4 w-4" />
              Download as TXT
            </Button>
          </div>
        </div>
      );
    }

    // Initial confirmation view
    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleExposeApi)}
          className="space-y-4 px-4"
        >
          <p className="text-muted-foreground text-sm">
            You are about to expose the recipe{" "}
            <strong className="text-foreground">"{workflow?.name}"</strong> as a
            public API endpoint.
          </p>

          <Accordion type="single" collapsible>
            <AccordionItem value="advanced-options" className="border-none">
              <AccordionTrigger className="p-0 text-sm hover:no-underline">
                Advanced Options
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="path"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom Path</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., my-custom-endpoint"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="allowed_ips"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Allowed IPs (comma-separated)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., 192.168.1.1, 10.0.0.0/16"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Alert>
            <Icon icon="lucide:info" className="h-4 w-4" />
            <AlertTitle>What happens next?</AlertTitle>
            <AlertDescription>
              An API key and secret will be generated. The secret will only be
              shown once.
            </AlertDescription>
          </Alert>
        </form>
      </Form>
    );
  };

  return (
    <Sheet open={!!workflow} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Expose Recipe as API</SheetTitle>
          <SheetDescription>
            Generate a secure API key to run this recipe programmatically.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 py-4">{renderContent()}</div>
        <SheetFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {apiDetails ? "Close" : "Cancel"}
          </Button>
          {!apiDetails && (
            // The button now triggers the form submission
            <Button
              onClick={form.handleSubmit(handleExposeApi)}
              disabled={isLoading}
            >
              {isLoading && (
                <Icon
                  icon="lucide:loader-2"
                  className="mr-2 h-4 w-4 animate-spin"
                />
              )}
              Generate API Key
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
