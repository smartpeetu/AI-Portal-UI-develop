import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useState } from "react";
import { toast } from "sonner";

const newWorkspaceSchema = z.object({
  domain: z.string().min(2, "Domain is required"),
  subdomain: z.string().min(2, "Subdomain is required"),
  projectDescription: z.string().min(10, "Please provide a description"),
  ioCode: z.string().min(1, "IO Code is required"),
  ucoa: z.string().min(1, "UCOA is required"),
  type: z.string().min(1, "Type is required"),
  owner: z.string().min(2, "Owner is required"),
  coDevelopers: z.string().optional(),
});

type NewWorkspaceInput = z.input<typeof newWorkspaceSchema>;
type NewWorkspaceOutput = z.output<typeof newWorkspaceSchema>;

export function NewWorkspaceDialog({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const closeDialog = () => setIsOpen(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<NewWorkspaceInput, any, NewWorkspaceOutput>({
    resolver: zodResolver(newWorkspaceSchema),
    defaultValues: {
      domain: "",
      subdomain: "",
      projectDescription: "",
      ioCode: "",
      ucoa: "",
      type: "",
      owner: "",
      coDevelopers: "",
    },
  });

  const onSubmit = async (values: NewWorkspaceOutput) => {
    setIsSubmitting(true);
    try {
      console.log("Payload:", values);
      await new Promise((res) => setTimeout(res, 1200));
      toast.success("Workspace created successfully!");
      closeDialog();
      form.reset();
    } catch (error) {
      toast.error("Failed to create workspace. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-background border-border w-full max-w-2xl rounded-xl border p-8 shadow-lg">
        <DialogTitle className="text-foreground mb-4 flex items-center gap-2 text-xl font-bold">
          New Workspace
        </DialogTitle>
        <DialogDescription className="text-muted-foreground mb-6 text-sm">
          Please fill out the details below:
        </DialogDescription>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="domain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground text-sm font-medium">
                      Domain
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Domain"
                        className="bg-background border-border focus:ring-primary focus:border-primary"
                      />
                    </FormControl>
                    <FormMessage className="text-destructive text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subdomain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground text-sm font-medium">
                      Subdomain
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Subdomain"
                        className="bg-background border-border focus:ring-primary focus:border-primary"
                      />
                    </FormControl>
                    <FormMessage className="text-destructive text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ioCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground text-sm font-medium">
                      IO Code
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="IO Code"
                        className="bg-background border-border focus:ring-primary focus:border-primary"
                      />
                    </FormControl>
                    <FormMessage className="text-destructive text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ucoa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground text-sm font-medium">
                      UCOA
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="UCOA"
                        className="bg-background border-border focus:ring-primary focus:border-primary"
                      />
                    </FormControl>
                    <FormMessage className="text-destructive text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground text-sm font-medium">
                      Type
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Type"
                        className="bg-background border-border focus:ring-primary focus:border-primary"
                      />
                    </FormControl>
                    <FormMessage className="text-destructive text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="owner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground text-sm font-medium">
                      Owner
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Owner"
                        className="bg-background border-border focus:ring-primary focus:border-primary"
                      />
                    </FormControl>
                    <FormMessage className="text-destructive text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="projectDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground text-sm font-medium">
                    Project Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Project Description"
                      rows={3}
                      className="bg-background border-border focus:ring-primary focus:border-primary resize-none"
                    />
                  </FormControl>
                  <FormMessage className="text-destructive text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="coDevelopers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground text-sm font-medium">
                    Co-developers
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Separate names with commas"
                      className="bg-background border-border focus:ring-primary focus:border-primary"
                    />
                  </FormControl>
                  <FormDescription className="text-muted-foreground text-xs">
                    Enter co-developer names, separated by commas.
                  </FormDescription>
                </FormItem>
              )}
            />
            <div className="mt-4 flex justify-end gap-3">
              <Button
                variant="outline"
                type="button"
                onClick={closeDialog}
                className="bg-transparent px-4 py-2"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2"
              >
                {isSubmitting ? "Creating..." : "Create Workspace"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
