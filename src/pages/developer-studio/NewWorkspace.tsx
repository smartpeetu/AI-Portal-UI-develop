import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import type { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TagInput } from "./TagInput";


interface DataSourceFieldsProps {
  selectedSource: string | undefined;
  form: UseFormReturn<any>;
}

export function DataSourceFields({
  selectedSource,
  form,
}: DataSourceFieldsProps) {
  if (!selectedSource || selectedSource === "none") return null;

  return (
    <div className="border-border animate-in fade-in-50 slide-in-from-top-2 mt-6 space-y-5 rounded-xl border p-6 duration-300">
      {selectedSource === "s3" && (
        <>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <FormField
              control={form.control}
              name="accountName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Name</FormLabel>
                  <FormControl>
                    <Input placeholder="aws-account-name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role Name</FormLabel>
                  <FormControl>
                    <Input placeholder="my-cross-account-role" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <FormField
              control={form.control}
              name="bucketName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bucket Name</FormLabel>
                  <FormControl>
                    <Input placeholder="my-s3-bucket" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="path"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Path</FormLabel>
                  <FormControl>
                    <Input placeholder="folder/sub-folder/" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </>
      )}

      {selectedSource === "redshift" && (
        <>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <FormField
              control={form.control}
              name="secretName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secret Name</FormLabel>
                  <FormControl>
                    <Input placeholder="redshift-secret" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Region</FormLabel>
                  <FormControl>
                    <Input placeholder="us-east-1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <FormField
              control={form.control}
              name="hostName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Host Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="redshift-cluster.amazonaws.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="databaseName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Database Name</FormLabel>
                  <FormControl>
                    <Input placeholder="analytics" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="port"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Port</FormLabel>
                <FormControl>
                  <Input placeholder="5439" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}

      {selectedSource === "rds" && (
        <>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <FormField
              control={form.control}
              name="rdsSecretName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secret Name</FormLabel>
                  <FormControl>
                    <Input placeholder="rds-secret" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rdsRegion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Region</FormLabel>
                  <FormControl>
                    <Input placeholder="us-west-2" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <FormField
              control={form.control}
              name="rdsHostName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Host Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="mydb.123456789.rds.amazonaws.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rdsDatabaseName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Database Name</FormLabel>
                  <FormControl>
                    <Input placeholder="production" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="rdsPort"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Port</FormLabel>
                <FormControl>
                  <Input placeholder="5432" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
    </div>
  );
}

const newWorkspaceSchema = z.object({
  domain: z.string().min(1, "Please select a domain"),
  subdomain: z.string().optional(),
  projectDescription: z.string().min(10, "Please provide a description"),
  ioCode: z.string().min(1, "IO Code is required"),
  ucoa: z.string().min(1, "UCOA is required"),
  type: z.string().min(1, "Type is required"),
  owner: z.string().min(2, "Owner is required"),
  coDevelopers: z.array(z.string()),
  dataSource: z.enum(["s3", "redshift", "rds", "none"]).optional(),

  // S3 fields
  accountName: z.string().optional(),
  roleName: z.string().optional(),
  bucketName: z.string().optional(),
  path: z.string().optional(),

  // Redshift fields
  secretName: z.string().optional(),
  region: z.string().optional(),
  hostName: z.string().optional(),
  databaseName: z.string().optional(),
  port: z.string().optional(),

  // RDS fields
  rdsSecretName: z.string().optional(),
  rdsRegion: z.string().optional(),
  rdsHostName: z.string().optional(),
  rdsDatabaseName: z.string().optional(),
  rdsPort: z.string().optional(),
});

type NewWorkspaceInput = z.infer<typeof newWorkspaceSchema>;

// ---------------- Component ----------------

export default function NewWorkspace() {
  const form = useForm<NewWorkspaceInput>({
    resolver: zodResolver(newWorkspaceSchema),
    defaultValues: {
      domain: "",
      subdomain: "",
      projectDescription: "",
      ioCode: "",
      ucoa: "",
      type: "",
      owner: "",
      coDevelopers: [],
      dataSource: "none",

      // s3
      accountName: "",
      roleName: "",
      bucketName: "",
      path: "",

      // redshift
      secretName: "",
      region: "",
      hostName: "",
      databaseName: "",
      port: "5439",

      // rds
      rdsSecretName: "",
      rdsRegion: "",
      rdsHostName: "",
      rdsDatabaseName: "",
      rdsPort: "5432",
    },
  });

  const selectedDataSource = form.watch("dataSource");

  function onSubmit(data: NewWorkspaceInput) {
    console.log("Form submitted:", data);
    toast.success("Workspace created successfully!");
  }

  return (
    <div className="bg-background min-h-screen md:p-8 lg:p-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <h1 className="text-foreground text-3xl font-semibold">
            New Workspace
          </h1>
          <p className="text-muted-foreground mt-2">
            Configure workspace metadata and connect optional data sources.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
            <div className="border-border border-b pb-10">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
                <div>
                  <h2 className="text-foreground text-lg font-semibold">
                    Basic
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Define basic workspace metadata.
                  </p>
                </div>

                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="domain"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Domain</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Please select a domain" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Commercial">
                              Commercial
                            </SelectItem>
                            <SelectItem value="Supply Chain">
                              Supply Chain
                            </SelectItem>
                            <SelectItem value="Manufacturing">
                              Manufacturing
                            </SelectItem>
                            <SelectItem value="Clinical">Clinical</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          The primary domain this workspace belongs to.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Subdomain */}
                  <FormField
                    control={form.control}
                    name="subdomain"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subdomain</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Optional subdomain..."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Narrow the domain if applicable.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="projectDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the workspace..."
                            className="min-h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          At least 10 characters summarizing the workspace
                          purpose.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ioCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>IO Code</FormLabel>
                        <FormControl>
                          <Input placeholder="IO Code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ucoa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>UCOA</FormLabel>
                        <FormControl>
                          <Input placeholder="UCOA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Workspace Type</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Analytics, ML, ETL..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="owner"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Owner</FormLabel>
                        <FormControl>
                          <Input placeholder="hsoni@exelixis.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="coDevelopers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Co-developers</FormLabel>
                        <FormControl>
                          <TagInput
                            value={field.value || []}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="pb-10">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
                <div>
                  <h2 className="text-foreground text-lg font-semibold">
                    Data Source
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Select and configure an AWS data source, or continue without
                    connecting.
                  </p>
                </div>

                <div>
                  <FormField
                    control={form.control}
                    name="dataSource"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Data Source</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="mt-4"
                          >
                            <div className="flex flex-col gap-4 sm:flex-row">
                              <Label
                                htmlFor="s3"
                                className={`hover:border-primary/50 relative flex flex-1 cursor-pointer flex-col rounded-lg border-2 p-5 transition-all ${
                                  field.value === "s3"
                                    ? "border-primary bg-primary/5"
                                    : "border-border bg-card"
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <RadioGroupItem
                                    value="s3"
                                    id="s3"
                                    className="mt-1"
                                  />
                                  <div className="flex-1">
                                    <div className="font-semibold">
                                      Amazon S3
                                    </div>
                                    <p className="text-muted-foreground text-sm">
                                      Object storage for files, logs, and
                                      datasets.
                                    </p>
                                  </div>
                                </div>
                              </Label>
                              <Label
                                htmlFor="redshift"
                                className={`hover:border-primary/50 relative flex flex-1 cursor-pointer flex-col rounded-lg border-2 p-5 transition-all ${
                                  field.value === "redshift"
                                    ? "border-primary bg-primary/5"
                                    : "border-border bg-card"
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <RadioGroupItem
                                    value="redshift"
                                    id="redshift"
                                    className="mt-1"
                                  />
                                  <div className="flex-1">
                                    <div className="font-semibold">
                                      Amazon Redshift
                                    </div>
                                    <p className="text-muted-foreground text-sm">
                                      High-performance data warehouse.
                                    </p>
                                  </div>
                                </div>
                              </Label>

                              <Label
                                htmlFor="rds"
                                className={`hover:border-primary/50 relative flex flex-1 cursor-pointer flex-col rounded-lg border-2 p-5 transition-all ${
                                  field.value === "rds"
                                    ? "border-primary bg-primary/5"
                                    : "border-border bg-card"
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <RadioGroupItem
                                    value="rds"
                                    id="rds"
                                    className="mt-1"
                                  />
                                  <div className="flex-1">
                                    <div className="font-semibold">
                                      Amazon RDS
                                    </div>
                                    <p className="text-muted-foreground text-sm">
                                      Managed relational database.
                                    </p>
                                  </div>
                                </div>
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DataSourceFields
                    selectedSource={selectedDataSource}
                    form={form}
                  />
                </div>
              </div>
            </div>

            <div className="border-border flex justify-end border-t pt-6">
              <Button
                type="submit"
                size="lg"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting
                  ? "Creating..."
                  : "Create Workspace"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
