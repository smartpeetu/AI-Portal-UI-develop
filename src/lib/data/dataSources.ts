import type { DataSource } from "@/types";

export const dataSources: DataSource[] = [
  { id: "1", name: "AWS S3", description: "Amazon Simple Storage Service" },
  {
    id: "2",
    name: "AWS RDS",
    description: "Amazon Relational Database Service",
  },
  {
    id: "3",
    name: "AWS Redshift",
    description:
      "Amazon Redshift is a fully managed, petabyte-scale data warehouse service in the cloud.",
    icon: "logos:aws-redshift",
  },
  {
    id: "4",
    name: "File Upload",
    description: "Upload files directly from your device",
  },
];
