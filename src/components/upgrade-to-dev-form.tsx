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
import { Checkbox } from "@/components/ui/checkbox";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useState } from "react";
import { toast } from "sonner";

import type { DeveloperAccessRequestPayload } from "@/types";

const developerAccessSchema = z.object({
  domain: z.string().min(2, "Domain is required"),
  subdomain: z.string().min(2, "Subdomain is required"),
  justification: z.string().min(10, "Please provide a detailed justification"),
  acknowledgeTerms: z.boolean().refine((val) => val === true, {
    message: "You must acknowledge the terms to proceed",
  }),
});

type DeveloperAccessForm = z.infer<typeof developerAccessSchema>;

export function DeveloperAccessDialog({
  isDialogOpen,
  setDialogOpen,
}: {
  isDialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
}) {
  const closeDialog = () => setDialogOpen(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<DeveloperAccessForm>({
    resolver: zodResolver(developerAccessSchema),
    defaultValues: {
      domain: "",
      subdomain: "",
      justification: "",
      acknowledgeTerms: false,
    },
  });

  const onSubmit = async (values: DeveloperAccessForm) => {
    setIsSubmitting(true);

    const payload: DeveloperAccessRequestPayload = {
      ...values,
      submittedAt: new Date().toISOString(),
    };
    console.log(payload);
    try {
      await new Promise((res) => setTimeout(res, 1200));
      toast.success("Your developer access request has been submitted.");
      closeDialog();
      form.reset();
    } catch (error) {
      toast.error("Unable to submit your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="bg-background border-border w-full max-w-2xl rounded-xl border p-8 shadow-lg">
        <DialogTitle className="text-foreground mb-2 text-2xl font-bold">
          Request Developer Access
        </DialogTitle>
        <DialogDescription className="text-muted-foreground mb-6 text-sm">
          Fill out the form below to request Developer access.
        </DialogDescription>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                        placeholder="e.g. analytics"
                        {...field}
                        className="bg-background border-border focus:ring-primary focus:border-primary"
                      />
                    </FormControl>
                    <FormDescription className="text-muted-foreground text-xs">
                      Enter the domain you want access to.
                    </FormDescription>
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
                        placeholder="e.g. data-lake"
                        {...field}
                        className="bg-background border-border focus:ring-primary focus:border-primary"
                      />
                    </FormControl>
                    <FormDescription className="text-muted-foreground text-xs">
                      Enter the subdomain you require access to.
                    </FormDescription>
                    <FormMessage className="text-destructive text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="justification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground text-sm font-medium">
                    Justification
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Explain why you need developer access..."
                      {...field}
                      className="bg-background border-border focus:ring-primary focus:border-primary resize-none"
                    />
                  </FormControl>
                  <FormDescription className="text-muted-foreground text-xs">
                    Provide a clear, detailed reason.
                  </FormDescription>
                  <FormMessage className="text-destructive text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="acknowledgeTerms"
              render={({ field }) => (
                <FormItem className="border-border bg-background flex flex-row items-start gap-3 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="flex flex-col">
                    <FormLabel className="text-foreground text-sm font-medium">
                      I acknowledge the terms of use
                    </FormLabel>
                    <FormDescription className="text-muted-foreground text-xs">
                      Confirm you understand the responsibilities of Developer
                      access.
                    </FormDescription>
                    <FormMessage className="text-destructive text-xs" />
                  </div>
                </FormItem>
              )}
            />
            <div className="mt-2 flex justify-end gap-4">
              <Button
                variant="outline"
                type="button"
                onClick={closeDialog}
                className="px-4 py-2"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2"
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
