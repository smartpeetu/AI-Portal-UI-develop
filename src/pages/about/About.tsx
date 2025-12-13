// src/pages/about/AboutPage.tsx
import { useNavigate } from "react-router";
import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// --- Dummy Data ---
const APP_VERSION = import.meta.env.VITE_APP_VERSION || "1.1.0";

interface ChangelogEntry {
  version: string;
  date: string;
  changes: Record<string, string[]>;
}

interface TechStackItem {
  name: string;
  icon: string;
}

interface TechStackCategory {
  category: string;
  technologies: TechStackItem[];
}

const changelogData: ChangelogEntry[] = [
  {
    version: `v${APP_VERSION} (Latest)`,
    date: "September 03, 2025",
    changes: {
      "New Features": [
        "Introduced the Knowledge Base management page.",
        "Added collapsible, categorized sidebar navigation.",
        "Implemented a dynamic RAG Ingestion form.",
      ],
      "Bug Fixes": [
        "Resolved performance issues on the workflow canvas.",
        "Fixed authentication flow for non-localhost environments.",
      ],
    },
  },
  {
    version: "v1.0.5",
    date: "July 1, 2025",
    changes: {
      Improvements: ["Enhanced the styling of custom workflow nodes."],
      "Bug Fixes": ["Corrected type errors in the DataSourceNode component."],
    },
  },
  {
    version: "v1.0.0",
    date: "May 23, 2025",
    changes: {
      "New Features": ["Initial release of the AI Portal."],
    },
  },
];

const techStackCategories: TechStackCategory[] = [
  {
    category: "Backend",
    technologies: [
      { name: "FastAPI", icon: "simple-icons:fastapi" },
      { name: "Uvicorn", icon: "devicon:fastapi" },
      { name: "Boto3 (AWS SDK)", icon: "simple-icons:amazonaws" },
      { name: "Pydantic", icon: "simple-icons:pydantic" },
      { name: "SQLAlchemy", icon: "simple-icons:sqlalchemy" },
      { name: "PostgreSQL", icon: "logos:postgresql" },
      { name: "OpenAI", icon: "simple-icons:openai" },
    ],
  },
  {
    category: "Infrastructure & Services",
    technologies: [
      { name: "AWS ECS", icon: "logos:aws-ecs" },
      { name: "AWS ECR", icon: "lucide:container" },
      { name: "AWS Lambda", icon: "logos:aws-lambda" },
      { name: "AWS S3", icon: "logos:aws-s3" },
      { name: "AWS RDS", icon: "logos:aws-rds" },
      { name: "Amazon Bedrock", icon: "simple-icons:amazonaws" },
      { name: "OpenSearch", icon: "simple-icons:opensearch" },
      { name: "Okta SSO", icon: "simple-icons:okta" },
    ],
  },
  {
    category: "Frontend",
    technologies: [
      { name: "React", icon: "logos:react" },
      { name: "TypeScript", icon: "logos:typescript-icon" },
      { name: "Vite", icon: "logos:vitejs" },
      { name: "Tailwind CSS", icon: "logos:tailwindcss-icon" },
      { name: "Shadcn/UI", icon: "simple-icons:shadcnui" },
      { name: "React Hook Form", icon: "fluent:form-new-28-regular" },
      { name: "Zod", icon: "logos:zod" },
      { name: "XYflow", icon: "lucide:workflow" },
    ],
  },
];

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-4 sm:p-6 lg:p-8">
      {/* --- Page Header --- */}
      <div className="flex flex-col gap-4">
        <button
          onClick={() => navigate(-1)}
          className="text-muted-foreground hover:text-foreground flex w-fit items-center gap-2 text-sm transition-colors"
        >
          <Icon icon="lucide:arrow-left" className="h-4 w-4" />
          Back
        </button>
      </div>

      {/* --- Main App Info Card --- */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/30 flex flex-row items-center gap-4">
          <img
            src={`/images/${import.meta.env.VITE_ORG_NAME.toLowerCase()}-logo.png`}
            alt={`${import.meta.env.VITE_ORG_NAME} Logo`}
            className="h-12"
          />
          <div>
            <div className="flex items-center gap-3">
              <CardTitle className="text-2xl">AI Portal</CardTitle>
              <Badge>Version {APP_VERSION}</Badge>
            </div>
            <CardDescription className="mt-1">
              An integrated platform for building, managing, and deploying
              AI-powered workflows.
            </CardDescription>
          </div>
        </CardHeader>
      </Card>

      {/* --- Changelog Section --- */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Changelog</h2>
        <Card>
          <CardContent className="p-4">
            <Accordion
              type="single"
              collapsible
              defaultValue={`v${APP_VERSION} (Latest)`}
            >
              {changelogData.map((log) => (
                <AccordionItem key={log.version} value={log.version}>
                  <AccordionTrigger className="text-lg font-medium">
                    <div className="flex items-center gap-4">
                      <span>{log.version}</span>
                      <span className="text-muted-foreground text-sm font-normal">
                        {log.date}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pl-4">
                    <div className="space-y-4">
                      {Object.entries(log.changes).map(([type, items]) => (
                        <div key={type}>
                          <h4 className="text-md mb-2 font-semibold">{type}</h4>
                          <ul className="text-muted-foreground list-disc space-y-1 pl-5">
                            {items.map((item: string, index: number) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>

      {/* --- Tech Stack Section --- */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">
          Technology Stack
        </h2>
        <Card>
          <CardContent className="space-y-8 p-6">
            {techStackCategories.map((category: TechStackCategory) => (
              <div key={category.category}>
                <h3 className="text-foreground mb-4 text-lg font-semibold">
                  {category.category}
                </h3>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {category.technologies.map((tech: TechStackItem) => (
                    <div
                      key={tech.name}
                      className="bg-muted/50 hover:bg-muted flex items-center gap-3 rounded-md p-3 transition-colors"
                    >
                      <Icon
                        icon={tech.icon}
                        className="h-6 w-6 flex-shrink-0"
                      />
                      <span className="text-sm font-medium">{tech.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AboutPage;
