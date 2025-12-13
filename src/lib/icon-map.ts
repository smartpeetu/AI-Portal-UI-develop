// src/lib/icon-map.ts

// Define a type for our icon mapping rules
interface IconRule {
  keywords: string[];
  icon: string; // Can be an Iconify string or a path to an SVG
}

// The list of rules, ordered from most specific to most general.
// The first rule that matches will be used.
const ICON_RULES: IconRule[] = [
  // Specific Models/Families
  { keywords: ["claude", "anthropic"], icon: "simple-icons:anthropic" },
  { keywords: ["llama", "meta"], icon: "logos:meta-icon" },
  { keywords: ["mistral"], icon: "logos:mistral-ai-icon" },
  { keywords: ["qwen"], icon: "hugeicons:qwen" },
  { keywords: ["deepseek"], icon: "hugeicons:deepseek" },
  { keywords: ["stability"], icon: "logos:stability-ai-icon" },
  { keywords: ["cohere"], icon: "/icons/cohere.svg" },
  { keywords: ["twelve", "pegasus"], icon: "game-icons:pegasus" },
  { keywords: ["palmyra", "writer"], icon: "/icons/palmyra.svg" },

  // General Providers
  { keywords: ["aws", "amazon"], icon: "logos:aws" },
  { keywords: ["openai"], icon: "simple-icons:openai" },
  { keywords: ["google"], icon: "simple-icons:google" },
];

const DEFAULT_ICON = "lucide:brain-circuit";

/**
 * Dynamically gets an icon based on a model's provider, family, or name.
 * It checks against a list of keywords in a predefined order.
 *
 * @param {object} params - The model's properties.
 * @param {string} params.provider - The model's provider (e.g., "AWS", "Anthropic").
 * @param {string | null} params.family - The model's family (e.g., "Claude", "Llama").
 * @param {string} params.name - The model's name (e.g., "Claude Opus 4.1").
 * @returns {string} The Iconify string or SVG path for the best matching icon.
 */
export const getDynamicIcon = ({
  provider,
  family,
  name,
}: {
  provider: string;
  family: string | null;
  name: string;
}): string => {
  // Create a single, lowercased string to search against
  const searchText = `${provider.toLowerCase()} ${family?.toLowerCase() || ""} ${name.toLowerCase()}`;

  // Find the first rule where at least one keyword is present in the search text
  const foundRule = ICON_RULES.find((rule) =>
    rule.keywords.some((keyword) => searchText.includes(keyword)),
  );

  return foundRule ? foundRule.icon : DEFAULT_ICON;
};
