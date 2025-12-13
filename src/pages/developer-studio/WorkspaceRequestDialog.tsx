import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const accessRequestSchema = z.object({
  departmentName: z.string().min(2, "Department Name is required"),
  justification: z.string().min(10, "Please provide a detailed justification"),
});

type AccessRequestForm = z.infer<typeof accessRequestSchema>;

export function WorkspaceRequestDialog({
  isDialogOpen,
  setDialogOpen,
}: {
  isDialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AccessRequestForm>({
    resolver: zodResolver(accessRequestSchema),
    defaultValues: {
      departmentName: "",
      justification: "",
    },
  });

  const closeDialog = () => setDialogOpen(false);

  const onSubmit = async (values: AccessRequestForm) => {
    setIsSubmitting(true);
    const payload = {
      ...values,
      submittedAt: new Date().toISOString(),
    };

    try {
      await new Promise((res) => setTimeout(res, 1000));
      toast.success("Your access request has been submitted.");
      closeDialog();
      form.reset();
      console.log("Access Request Payload:", payload);
    } catch (err) {
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="bg-background border-border w-full max-w-lg rounded-xl border p-8 shadow-lg">
        <DialogTitle className="text-foreground mb-2 text-2xl font-bold">
          Request Access
        </DialogTitle>
        <DialogDescription className="text-muted-foreground mb-6 text-sm">
          Fill out the form below to request access for your department.
        </DialogDescription>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <FormField
              control={form.control}
              name="departmentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground text-sm font-medium">
                    Department Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Engineering"
                      {...field}
                      className="bg-background border-border focus:ring-primary focus:border-primary"
                    />
                  </FormControl>
                  <FormMessage className="text-destructive text-xs" />
                </FormItem>
              )}
            />

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
                      placeholder="Explain why your department needs access..."
                      {...field}
                      className="bg-background border-border focus:ring-primary focus:border-primary resize-none"
                    />
                  </FormControl>
                  <FormMessage className="text-destructive text-xs" />
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
