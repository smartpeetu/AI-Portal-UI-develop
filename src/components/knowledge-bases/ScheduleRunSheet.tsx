// src/components/knowledge-bases/ScheduleRunDialog.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import type { KnowledgeBase } from "@/types";

// Zod schema to handle time input
const formSchema = z
  .object({
    scheduleType: z.enum(["cron", "datetime"]),
    cronExpression: z.string().optional(),
    // Define the fields as optional at the base level.
    // The `.refine()` will handle making them required conditionally.
    runAtDate: z.date().optional(),
    runAtTime: z.string().optional(),
  })
  .refine(
    (data) => {
      // If the type is 'cron', the cronExpression must be a non-empty string.
      if (data.scheduleType === "cron") {
        return !!data.cronExpression && data.cronExpression.trim().length > 0;
      }
      // If the type is 'datetime', both date and time must be present.
      if (data.scheduleType === "datetime") {
        return !!data.runAtDate && !!data.runAtTime;
      }
      // This should not be reachable if scheduleType is always one of the enum values.
      return false;
    },
    {
      // This single message will apply if the refinement fails.
      message: "A valid value is required for the selected schedule type.",
      // Point the error to a relevant field. We can choose one, or it can be a global error.
      path: ["runAtDate"],
    },
  );

type FormValues = z.infer<typeof formSchema>;

interface ScheduleRunSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  knowledgeBase: KnowledgeBase | null;
}

export const ScheduleRunSheet = ({
  isOpen,
  onOpenChange,
  knowledgeBase,
}: ScheduleRunSheetProps) => {
  const [isDateOpen, setIsDateOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      scheduleType: "datetime",
      cronExpression: "",
      runAtDate: new Date(),
      runAtTime: format(new Date(), "HH:mm"),
    },
  });

  const onSubmit = (values: FormValues) => {
    let description = "";
    if (
      values.scheduleType === "datetime" &&
      values.runAtDate &&
      values.runAtTime
    ) {
      const [hours, minutes] = values.runAtTime.split(":");
      const finalDate = new Date(values.runAtDate);
      finalDate.setHours(parseInt(hours, 10));
      finalDate.setMinutes(parseInt(minutes, 10));
      description = `At: ${finalDate.toLocaleString()}`;
    } else {
      description = `Using cron: ${values.cronExpression}`;
    }
    console.info(description);
    toast.success(`Scheduled run for "${knowledgeBase?.index}"`, {
      description,
    });
    onOpenChange(false);
  };

  if (!knowledgeBase) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="p-4 sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Schedule Run for "{knowledgeBase.index}"</SheetTitle>
          <SheetDescription>
            Choose how you want to schedule the ingestion job for this knowledge
            base.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto py-4">
          <Form {...form}>
            <form
              id="schedule-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="h-full space-y-6"
            >
              <Tabs
                defaultValue="datetime"
                onValueChange={(value) =>
                  form.setValue("scheduleType", value as "cron" | "datetime")
                }
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="datetime">Date & Time</TabsTrigger>
                  <TabsTrigger value="cron">Cron Expression</TabsTrigger>
                </TabsList>

                <TabsContent value="datetime" className="pt-4">
                  <div className="flex items-start gap-4">
                    {/* Date Picker Field */}
                    <FormField
                      control={form.control}
                      name="runAtDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date</FormLabel>

                          {/* IMPORTANT: make Popover modal + controlled */}
                          <Popover
                            modal
                            open={isDateOpen}
                            onOpenChange={setIsDateOpen}
                          >
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  type="button"
                                  variant="outline"
                                  className={cn(
                                    "w-40 justify-between font-normal",
                                    !field.value && "text-muted-foreground",
                                  )}
                                  onClick={() => setIsDateOpen((o) => !o)}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>

                            <PopoverContent
                              className="z-[60] w-auto p-0"
                              align="start"
                              side="bottom"
                              // avoid focus jumping back to trigger and weird close/jitter
                              onCloseAutoFocus={(e) => e.preventDefault()}
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(d) => {
                                  field.onChange(d);
                                  // close only after a selection
                                  setIsDateOpen(false);
                                }}
                                captionLayout="dropdown"
                              />
                            </PopoverContent>
                          </Popover>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Time Picker Field */}
                    <FormField
                      control={form.control}
                      name="runAtTime"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Time</FormLabel>
                          <FormControl>
                            <Input
                              type="time"
                              className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="cron" className="pt-4">
                  <FormField
                    control={form.control}
                    name="cronExpression"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cron Expression</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 0 5 * * *" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>
            </form>
          </Form>
        </div>
        <SheetFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" form="schedule-form">
            Schedule Run
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
