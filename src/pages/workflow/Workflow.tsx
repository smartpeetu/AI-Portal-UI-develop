import { useState, useEffect } from "react";
import { StatCard } from "@/components/common/StatCard";
import { getAgents, getKnowledgeBases } from "@/services/endpoints";
import KnowledgeBasesPage from "../knowledge-bases/KnowledgeBases";
import Agents from "../agents/Agents";
import Recipe from "../recipes/Recipe";

const WorkflowPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [statCounts, setStatCounts] = useState({
    recipe: 0,
    kb: 0,
    agents: 0,
  });
  const [selectedSection, setSelectedSection] = useState("recipe");

  const updateRecipeCount = (count: number) =>
    setStatCounts((prev) => ({ ...prev, recipe: count }));

  const handleCardClick = (id: string) => setSelectedSection(id);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const agentsRes = await getAgents({ limit: 200 });
        const kbRes = await getKnowledgeBases();

        setStatCounts((prev) => ({
          ...prev,
          agents: agentsRes.count,
          kb: kbRes.length,
        }));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const stats = [
    {
      id: "recipe",
      title: "Recipe",
      value: statCounts.recipe,
      icon: "ph:robot-bold",
    },
    {
      id: "kb",
      title: "Knowledge Bases",
      value: statCounts.kb,
      icon: "ph:book-bold",
    },
    {
      id: "agents",
      title: "Agents",
      value: statCounts.agents,
      icon: "ph:brain-bold",
    },
  ];

  return (
    <div className="space-y-8 p-4 px-3! sm:p-6 lg:p-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <StatCard.Skeleton key={i} />
            ))
          : stats.map((stat) => (
              <div
                key={stat.id}
                onClick={() => handleCardClick(stat.id)}
                className="cursor-pointer"
              >
                <StatCard
                  label={stat.title}
                  value={stat.value.toString()}
                  icon={stat.icon}
                  iconColorClass="text-primary-400"
                  iconBgClass="bg-primary-100"
                />
              </div>
            ))}
      </div>

      {selectedSection === "recipe" && (
        <Recipe onRecipeCountChange={updateRecipeCount} />
      )}
      {selectedSection === "kb" && <KnowledgeBasesPage />}
      {selectedSection === "agents" && <Agents />}
    </div>
  );
};

export default WorkflowPage;
