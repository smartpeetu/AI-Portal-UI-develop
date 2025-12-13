import { Button } from "@/components/ui/button";
import { Sparkles, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { useState } from "react";
import { AccessRequestDialog } from "./AppAccessRequestDialog";

interface AppDetailProps {
  appName?: string;
  imageUrl?: string;
  detailedDescription?: string;
  termsOfUse?: string;
}

export default function AppDetail({ appName, imageUrl }: AppDetailProps) {
  const [isAccessDialogOpen, setAccessDialogOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    appName: stateName,
    imageUrl: stateImage,
    disabled: isDisabled,
  } = location.state || {};

  const finalAppName = stateName || appName;
  const finalImageUrl = stateImage || imageUrl;

  return (
    <div className="from-background to-muted/20 min-h-screen bg-linear-to-b p-4">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-muted-foreground flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        <div className="mb-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <h1 className="text-foreground text-4xl font-bold tracking-tight sm:text-5xl">
                {finalAppName}
              </h1>
              <p className="text-muted-foreground max-w-prose text-lg">
                Next-generation AI application designed to transform your
                workflow
              </p>
            </div>
            {isDisabled && (
              <>
                <Button
                  size="lg"
                  onClick={() => setAccessDialogOpen(true)}
                  className="gap-2 sm:mt-8"
                >
                  Request Access
                </Button>

                <AccessRequestDialog
                  isDialogOpen={isAccessDialogOpen}
                  setDialogOpen={setAccessDialogOpen}
                />
              </>
            )}
          </div>
        </div>
        <div className="border-border bg-card mb-12 overflow-hidden rounded-2xl border shadow-md">
          {finalImageUrl ? (
            <img
              src={finalImageUrl}
              alt={finalAppName}
              className="h-[400px] w-full object-cover"
            />
          ) : (
            <div className="from-primary/5 via-primary/10 to-primary/5 flex h-[400px] w-full items-center justify-center bg-linear-to-br">
              <div className="text-center">
                <Sparkles className="text-primary/40 mx-auto mb-4 h-16 w-16" />
                <p className="text-muted-foreground text-sm">
                  Application Preview
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          <div className="border-border bg-card rounded-xl border p-8 shadow-sm">
            <h2 className="text-foreground mb-4 text-2xl font-semibold">
              About This Application
            </h2>
            <p className="text-foreground leading-relaxed">
              {
                "Our AI Workflow Assistant revolutionizes how you manage daily tasks by combining cutting-edge natural language processing with intelligent automation. This powerful application learns from your work patterns and adapts to your unique workflow, offering personalized suggestions and automating repetitive tasks. Whether you're managing complex projects, coordinating team communications, or analyzing data, our AI assistant provides real-time insights and recommendations to boost your productivity by up to 10x. Built on advanced neural networks and trained on millions of workflow patterns, it understands context, anticipates needs, and seamlessly integrates with your existing tools. Experience the future of work with an AI companion that truly understands your business."
              }
            </p>
          </div>

          <div className="border-border bg-card rounded-xl border p-8 shadow-sm">
            <h2 className="text-foreground mb-4 text-xl font-semibold">
              Terms of Use
            </h2>
            <p className="text-foreground text-sm leading-relaxed">
              {
                "By accessing and using this AI application, you acknowledge and agree to comply with all applicable terms and conditions. This application is provided as-is for authorized users only. You agree to use the service in accordance with all applicable laws and regulations. Your use of AI-generated content is subject to review and you maintain responsibility for all outputs. We employ industry-standard security measures to protect your data, including end-to-end encryption and SOC 2 compliance. You retain ownership of your input data, while generated outputs are licensed for your business use. The service may collect usage analytics to improve AI performance. We reserve the right to modify these terms with notice. Violation of these terms may result in immediate suspension of access. For enterprise licensing or custom deployment options, please contact our sales team."
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
