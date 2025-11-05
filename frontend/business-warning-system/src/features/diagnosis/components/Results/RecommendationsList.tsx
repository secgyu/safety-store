import { ActionCard } from "../RiskIndicators/ActionCard";

interface Recommendation {
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}

interface RecommendationsListProps {
  recommendations: Recommendation[];
}

export function RecommendationsList({ recommendations }: RecommendationsListProps) {
  return (
    <div className="mb-10">
      <h2 className="text-3xl font-bold mb-8">맞춤 개선 제안</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((rec, index) => (
          <ActionCard
            key={index}
            title={rec.title}
            description={rec.description}
            priority={rec.priority.toUpperCase() as "HIGH" | "MEDIUM" | "LOW"}
            onLearnMore={() => {
              console.log("Learn more clicked:", rec.title);
            }}
          />
        ))}
      </div>
    </div>
  );
}

