import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface PromptLibraryProps {
  onSend: (prompt: string) => void;
}

const tabs = [
  {
    label: "Create",
    prompts: [
      { title: "Project Update", desc: "Executive status report on Project." },
      { title: "Topic Report", desc: "Update me on Topic." },
      {
        title: "Customer Brief",
        desc: "Help me prepare for a meeting with Customer.",
      },
      {
        title: "Market Analysis",
        desc: "Analyze the market position of Company.",
      },
    ],
    more: [
      {
        title: "Campaign Summary",
        desc: "Summarize marketing campaign results.",
      },
      {
        title: "Proposal Draft",
        desc: "Create a draft for a new client proposal.",
      },
      { title: "Weekly Report", desc: "Generate weekly progress overview." },
      {
        title: "Budget Review",
        desc: "Prepare analysis of quarterly budgets.",
      },
      {
        title: "Task Breakdown",
        desc: "Divide project tasks into milestones.",
      },
      { title: "Goal Planner", desc: "Outline objectives for next quarter." },
    ],
  },
  {
    label: "Explore",
    prompts: [
      {
        title: "How does AI work?",
        desc: "Understand the basics of artificial intelligence.",
      },
      {
        title: "What is quantum computing?",
        desc: "Learn the principles behind quantum computers.",
      },
      {
        title: "Are black holes real?",
        desc: "Explore scientific evidence for black holes.",
      },
      {
        title: "Why is the sky blue?",
        desc: "Understand atmospheric light scattering.",
      },
    ],
    more: [
      {
        title: "How do neural networks learn?",
        desc: "Explain how neural networks adjust weights and learn patterns.",
      },
      {
        title: "Explain gravitational waves",
        desc: "Describe the ripples in spacetime caused by massive objects.",
      },
      {
        title: "What's the future of quantum tech?",
        desc: "Discuss potential applications and challenges of quantum computing.",
      },
      {
        title: "Is time travel theoretically possible?",
        desc: "Explore the physics theories related to traveling through time.",
      },
    ],
  },
  {
    label: "Code",
    prompts: [
      {
        title: "Explain recursion in simple terms",
        desc: "Simplify recursion concepts for easy understanding.",
      },
      {
        title: "How does async/await work?",
        desc: "Explain asynchronous JavaScript functions clearly.",
      },
      {
        title: "Write a function to reverse a string",
        desc: "Code a simple string reversal function.",
      },
      {
        title: "Debug this React error for me",
        desc: "Provide guidance on fixing a React issue.",
      },
    ],
    more: [
      {
        title: "Explain closures in JavaScript",
        desc: "Understand how closures capture variables in JS functions.",
      },
      {
        title: "Convert code from JS to Python",
        desc: "Translate JavaScript code logic into Python syntax.",
      },
      {
        title: "Optimize this algorithm",
        desc: "Improve the efficiency of a given code algorithm.",
      },
      {
        title: "Add error handling to this snippet",
        desc: "Enhance the code to handle potential runtime errors.",
      },
    ],
  },
  {
    label: "Learn",
    prompts: [
      {
        title: "What is the meaning of life?",
        desc: "Philosophical perspective on life's purpose.",
      },
      {
        title: "Summarize the theory of relativity",
        desc: "Simplified explanation of Einstein's theory.",
      },
      {
        title: "Explain blockchain in 2 sentences",
        desc: "Concise overview of blockchain technology.",
      },
      {
        title: "Teach me basic Japanese phrases",
        desc: "Learn introductory Japanese expressions.",
      },
    ],
    more: [
      {
        title: "Explain photosynthesis simply",
        desc: "Describe how plants turn sunlight into energy.",
      },
      {
        title: "How do airplanes fly?",
        desc: "Explain the principles of lift and aerodynamics.",
      },
      {
        title: "Describe relativity like I'm five",
        desc: "Simplify Einstein's relativity in easy-to-understand terms.",
      },
      {
        title: "Teach me about the Renaissance",
        desc: "Give a brief overview of the cultural movement in Europe.",
      },
    ],
  },
];

export default function PromptLibrary({ onSend }: PromptLibraryProps) {
  const [activeTab, setActiveTab] = useState("Create");
  const activeData = tabs.find((tab) => tab.label === activeTab)!;

  return (
    <div className="relative w-full max-w-3xl transition-all duration-300">
      {/* Tabs */}
      <div className="mb-6 flex flex-wrap justify-center gap-2 sm:gap-3">
        {tabs.map((tab) => (
          <Button
            key={tab.label}
            variant={activeTab === tab.label ? "default" : "outline"}
            onClick={() => setActiveTab(tab.label)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
              activeTab === tab.label
                ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
                : "border-border bg-background hover:bg-muted/60 hover:text-foreground border"
            }`}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Prompt Cards */}
      <div key={activeTab} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {activeData.prompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => onSend(`${prompt.title}: ${prompt.desc}`)}
            className="group border-border bg-muted/30 hover:bg-muted/50 focus-visible:ring-primary/50 rounded-2xl border px-4 py-3 text-left shadow-sm transition-all hover:-translate-y-[1px] hover:shadow-md focus-visible:ring-2"
          >
            <h4 className="text-foreground group-hover:text-primary mb-1 text-sm font-medium transition-colors">
              {prompt.title}
            </h4>
            <p className="text-muted-foreground text-xs leading-snug">
              {prompt.desc}
            </p>
          </button>
        ))}
      </div>

      {/* See More Button (bottom-right) */}
      <div className="mt-6 flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full shadow-sm transition-all">
              See More
            </Button>
          </DialogTrigger>

          {/* Dialog */}
          <DialogContent className="border-border bg-background/95 max-w-4xl rounded-2xl border p-8 shadow-2xl backdrop-blur-lg">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-foreground text-xl font-semibold">
                {activeTab} Prompts Catalog
              </DialogTitle>
            </DialogHeader>
            <Separator className="mb-4" />

            <div className="grid max-h-[70vh] grid-cols-1 gap-4 overflow-y-auto pr-1 sm:grid-cols-2 md:grid-cols-3">
              {activeData.more.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => onSend(`${prompt.title}: ${prompt.desc}`)}
                  className="group border-border bg-muted/30 hover:bg-muted/50 focus-visible:ring-primary/50 rounded-xl border px-4 py-3 text-left shadow-sm transition-all hover:-translate-y-[1px] hover:shadow-md focus-visible:ring-2"
                >
                  <h4 className="text-foreground group-hover:text-primary mb-1 text-sm font-medium transition-colors">
                    {prompt.title}
                  </h4>
                  <p className="text-muted-foreground text-xs leading-snug">
                    {prompt.desc}
                  </p>
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
