import { ChevronRight, Lightbulb } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ActionCardProps {
  title: string;
  description: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  onLearnMore: () => void;
}

export function ActionCard({ title, description, priority, onLearnMore }: ActionCardProps) {
  const getPriorityBadge = () => {
    switch (priority) {
      case "HIGH":
        return { label: "높음", color: "bg-red-100 text-red-700" };
      case "MEDIUM":
        return { label: "보통", color: "bg-amber-100 text-amber-700" };
      case "LOW":
        return { label: "낮음", color: "bg-blue-100 text-blue-700" };
    }
  };

  const badge = getPriorityBadge();
  console.log(priority);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="pt-6 pb-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
            <Lightbulb className="h-5 w-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-bold text-base leading-tight">{title}</h3>
              <span className={cn("text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap", badge.color)}>
                우선순위 {badge.label}
              </span>
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{description}</p>
        <Button variant="ghost" size="sm" onClick={onLearnMore} className="w-full justify-between group">
          자세히 보기
          <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
}
