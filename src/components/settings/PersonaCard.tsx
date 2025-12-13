// src/components/settings/PersonaCard.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

// Define the shape of our dummy persona data
export interface Persona {
  id: string;
  name: string;
  description: string;
}

interface PersonaCardProps {
  persona: Persona;
  isActive: boolean;
  onSwitch: (id: string) => void;
}

export const PersonaCard = React.memo(
  ({ persona, isActive, onSwitch }: PersonaCardProps) => {
    return (
      <Card
        className={cn("transition-all", isActive && "border-primary shadow-lg")}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{persona.name}</CardTitle>
            {isActive && (
              <div className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-600">
                <Icon icon="lucide:check-circle" className="h-4 w-4" />
                Active
              </div>
            )}
          </div>
          <CardDescription>{persona.description}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button
            className="w-full"
            variant={isActive ? "secondary" : "default"}
            disabled={isActive}
            onClick={() => onSwitch(persona.id)}
          >
            {isActive ? "Current Persona" : "Switch to this Persona"}
          </Button>
        </CardFooter>
      </Card>
    );
  },
);
