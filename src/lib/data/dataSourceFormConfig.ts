// src/lib/data/dataSourceFormConfig.ts
import { awsRegions } from "./awsRegions";

// Define a strict type for our form field configurations
export interface FormFieldConfig {
  name: string;
  label: string;
  type: "input" | "select" | "password";
  placeholder?: string;
  required: boolean;
  options?: { value: string; label: string }[];
}

// Define the shape of the configuration for a single data source
interface DataSourceConfig {
  icon: string;
  fields: FormFieldConfig[];
}

// The main configuration object. The keys MUST match the `name` property
// of the hardcoded data sources in your CreateEditWorkflow component.
export const dataSourceFormConfig: Record<string, DataSourceConfig> = {
  "AWS S3": {
    icon: "logos:aws-s3",
    fields: [
      {
        name: "bucketName",
        label: "S3 Bucket Name",
        type: "input",
        placeholder: "e.g., my-ai-data-bucket",
        required: true,
      },
      {
        name: "region",
        label: "AWS Region",
        type: "select",
        required: true,
        options: awsRegions,
      },
      {
        name: "prefix",
        label: "S3 Prefix (Optional)",
        type: "input",
        placeholder: "e.g., raw-data/",
        required: false,
      },
    ],
  },
  "AWS RDS": {
    icon: "logos:aws-rds",
    fields: [
      {
        name: "dbIdentifier",
        label: "Database Identifier",
        type: "input",
        placeholder: "e.g., my-rds-instance",
        required: true,
      },
      {
        name: "dbUsername",
        label: "Username",
        type: "input",
        placeholder: "admin",
        required: true,
      },
      {
        name: "dbPassword",
        label: "Password",
        type: "password",
        placeholder: "Enter database password",
        required: true,
      },
    ],
  },
  "AWS Redshift": {
    // If your icon set doesn't have this, use "simple-icons:amazonredshift"
    icon: "logos:aws-redshift",
    fields: [
      {
        name: "host",
        label: "Cluster Endpoint",
        type: "input",
        placeholder: "example.abc123.us-east-1.redshift.amazonaws.com",
        required: true,
      },
      {
        name: "port",
        label: "Port",
        type: "input",
        placeholder: "5439",
        required: true,
      },
      {
        name: "database",
        label: "Database",
        type: "input",
        placeholder: "dev",
        required: true,
      },
      {
        name: "username",
        label: "Username",
        type: "input",
        placeholder: "awsuser",
        required: true,
      },
      {
        name: "password",
        label: "Password",
        type: "password",
        placeholder: "Enter database password",
        required: true,
      },
      {
        name: "schema",
        label: "Schema (Optional)",
        type: "input",
        placeholder: "public",
        required: false,
      },
      {
        name: "region",
        label: "AWS Region",
        type: "select",
        required: true,
        options: awsRegions,
      },
      {
        name: "ssl",
        label: "Require SSL",
        type: "select",
        required: false,
        options: [
          { value: "true", label: "Yes" },
          { value: "false", label: "No" },
        ],
      },
    ],
  },
  "File Upload": {
    icon: "lucide:upload-cloud",
    fields: [], // No configurable fields, the UI is handled separately
  },
};
