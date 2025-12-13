// src/pages/login/Login.tsx
import { useEffect, useState, useCallback, useRef, use } from "react";
import { useNavigate } from "react-router";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Icon } from "@iconify/react";
import { ModeToggle } from "@/components/common/ModeToggle";
import { loginViaAlbLambda, hasAlbAuthCookie } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { UserContext } from "@/context/user-context";

const AUTH_COOKIE_NAME = "AWSELBAuthSessionCookie-0";

// Full URL when on localhost, relative path when deployed
const LAMBDA_ENDPOINT =
  window.location.hostname === "localhost"
    ? `https://dev-ai.aws-${import.meta.env.VITE_ORG_NAME.toLowerCase()}.com/lambda-test/`
    : "/lambda-test/";

/* const personas = [
  { id: "user", name: "User", icon: "lucide:box", description: "" },
  {
    id: "developer",
    name: "Developer",
    icon: "lucide:shield-check",
    description: "",
  },
  { id: "admin", name: "Admin", icon: "lucide:user-cog", description: "" },
]; */

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { handlePersonaChange } = use(UserContext);
  // const [loadingWorkspace, setLoadingWorkspace] = useState<string | null>(null);

  // prevents duplicate auto-login attempts (strict mode, re-renders, etc.)
  const autoTriedRef = useRef(false);

  const doLogin = useCallback(async () => {
    setAuthError(null);
    setIsLoading(true);
    // setLoadingWorkspace(workspaceId); // Track which tile was clicked
    try {
      // In a real scenario, you might pass the workspaceId to the login function
      // console.log(`Logging into workspace: ${workspaceId}`);
      // localStorage.setItem("persona", JSON.stringify("developer"));
      handlePersonaChange("developer");
      await loginViaAlbLambda(LAMBDA_ENDPOINT);
      navigate("/dashboard", { replace: true });
    } catch (e) {
      console.error("Login failed:", e);
      if (e instanceof Error) {
        setAuthError(e.message);
      } else {
        setAuthError("Login failed. Please try again.");
      }
      setIsLoading(false);
      // setLoadingWorkspace(null);
    }
  }, [navigate]);

  useEffect(() => {
    const isDeployedEnvironment = window.location.hostname !== "localhost";
    const url = new URL(window.location.href);
    const forceAuto = url.searchParams.get("auto") === "1"; // optional override: ?auto=1

    // basic “came from dashboard” heuristic (works when same-site referrer is sent)
    const referrerHost = (() => {
      try {
        const r = new URL(document.referrer);
        return r.host;
      } catch {
        return "";
      }
    })();

    const cameFromDashboard =
      !!referrerHost &&
      // adjust to your customer’s dashboard host if you know it, or keep this loose same-org check:
      referrerHost.endsWith(
        `.${import.meta.env.VITE_ORG_NAME.toLowerCase()}.com`,
      );

    const cookiePresent = hasAlbAuthCookie(AUTH_COOKIE_NAME);

    // only try once per page load
    if (!autoTriedRef.current) {
      // auto-login if:
      // - deployed AND the ALB/Okta auth cookie exists, OR
      // - we can reasonably tell we came from their dashboard, OR
      // - ?auto=1 is present (handy for testing/links on the dashboard tile)
      if (
        isDeployedEnvironment &&
        (cookiePresent || cameFromDashboard || forceAuto)
      ) {
        autoTriedRef.current = true;
        void doLogin(); // Default to a primary workspace for auto-login
      }
    }
  }, [doLogin]);

  return (
    <main className="from-primary/5 via-primary/10 to-primary/20 dark:from-primary-foreground/5 dark:via-primary-foreground/10 dark:to-primary-foreground/20 relative flex min-h-screen bg-gradient-to-br">
      <div className="absolute top-5 right-5 z-20">
        <ModeToggle />
      </div>

      {/* Left Side - Image & Features */}
      <section
        className="relative hidden overflow-hidden lg:flex lg:w-1/2"
        aria-label="Portal overview"
      >
        <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/50 to-black/70"></div>
        <div className="absolute inset-0 z-0">
          <div className="bg-primary/40 absolute top-[-10%] left-[-15%] h-96 w-96 rounded-full opacity-60 blur-3xl filter"></div>
          <div className="bg-primary-400/40 absolute right-[-15%] bottom-[-10%] h-96 w-96 rounded-full opacity-60 blur-3xl filter"></div>
        </div>

        <div className="relative z-20 flex h-full max-w-xl flex-col justify-center space-y-10 p-16 text-white">
          <h1 className="text-4xl leading-tight font-extrabold tracking-tight drop-shadow-lg">
            Unlock the{" "}
            <span className="from-primary to-primary-400 bg-linear-to-r bg-clip-text text-transparent">
              Power of AI
            </span>
          </h1>
          <p className="text-lg leading-relaxed opacity-90 drop-shadow-sm">
            Manage AI agents, build workflows, and run powerful pipelines — all
            in one unified portal.
          </p>

          <div className="grid grid-cols-2 gap-6">
            {[
              {
                icon: "carbon:chat-bot",
                title: "AI Agents",
                desc: "Deploy specialized agents for tasks like research, support, and automation.",
              },
              {
                icon: "carbon:workflow-automation",
                title: "Recipe Builder",
                desc: "Visually design automated workflows connecting multiple agents and tools.",
              },
              {
                icon: "carbon:pipelines",
                title: "Data Pipelines",
                desc: "Query, process, and transform your data in real-time with custom pipelines.",
              },
              {
                icon: "carbon:dashboard",
                title: "Insights Dashboard",
                desc: "Monitor results and metrics with interactive, real-time visualizations.",
              },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="hover:border-primary/60 hover:shadow-primary/20 transform rounded-xl border border-white/20 bg-black/20 p-5 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1"
              >
                <Icon
                  icon={icon}
                  className="text-primary mb-3 text-4xl"
                  aria-hidden="true"
                />
                <h3 className="text-md mb-1 font-semibold">{title}</h3>
                <p className="text-xs opacity-80">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Right Side - Login Card */}
      <section className="flex w-full items-center justify-center p-10 lg:w-1/2">
        <Card className="dark:bg-background/95 bg-background/95 w-full max-w-md rounded-2xl border-0 shadow-2xl backdrop-blur-sm">
          <CardHeader className="space-y-2 pb-2">
            <div className="mb-4 flex justify-center">
              <img
                src={`/images/${import.meta.env.VITE_ORG_NAME.toLowerCase()}-logo.png`}
                alt={`${import.meta.env.VITE_ORG_NAME} logo`}
                // className="h-10"
              />
            </div>
            <CardTitle className="text-center text-xl leading-tight font-extrabold">
              Welcome to AI <span className="text-primary">Portal</span>
            </CardTitle>
          </CardHeader>

          <CardContent className="px-6">
            {/* <div className="grid grid-cols-2 gap-4">
              {personas.map((persona) => (
                <button
                  key={persona.id}
                  onClick={() => doLogin(persona.id)}
                  disabled={isLoading}
                  className={cn(
                    "bg-card hover:bg-muted/80 hover:border-primary/50 focus-visible:ring-ring flex transform flex-col items-center justify-center rounded-lg border p-4 text-center transition-all duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                    isLoading && "cursor-not-allowed opacity-60",
                  )}
                >
                  {loadingWorkspace === persona.id ? (
                    <Icon
                      icon="svg-spinners:180-ring"
                      className="text-primary h-8 w-8"
                    />
                  ) : (
                    <Icon
                      icon={persona.icon}
                      className="text-primary h-8 w-8"
                    />
                  )}
                  <h3 className="mt-3 text-sm font-semibold">{persona.name}</h3>
                  <p className="text-muted-foreground mt-1 text-xs">
                    {persona.description}
                  </p>
                </button>
              ))}
            </div> */}
            <div className="text-center">
              <Button
                className="rounded-md px-4 py-2"
                disabled={isLoading}
                onClick={() => doLogin()}
              >
                Sign in with Okta SSO
              </Button>
            </div>
            {authError && (
              <div className="text-destructive mt-4 px-4 text-center text-xs">
                {authError}
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-6 pt-4 pb-5">
            <p className="text-muted-foreground text-center text-sm">
              Don&apos;t have access?{" "}
              <a
                href={`mailto:${
                  import.meta.env.VITE_ADMIN_EMAIL_ADDRESS
                }?subject=Request%20Access%20to%20AI%20Portal&body=Hello%20Team,%0D%0A%0D%0AI%20would%20like%20to%20request%20access%20to%20the%20${
                  import.meta.env.VITE_ORG_NAME
                }AI%20Portal.%20Please%20let%20me%20know%20the%20next%20steps.%0D%0A%0D%0AThank%20you.`}
                className="text-primary font-semibold hover:underline"
              >
                Request access
              </a>
            </p>
          </CardFooter>
        </Card>
      </section>
    </main>
  );
};

export default Login;
