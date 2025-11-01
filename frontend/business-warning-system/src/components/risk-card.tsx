import { MapPin, TrendingDown, Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface RiskCardProps {
  type: "sales" | "customer" | "market";
  value: number; // 0-100
  description: string;
}

export function RiskCard({ type, value, description }: RiskCardProps) {
  const getTypeInfo = () => {
    switch (type) {
      case "sales":
        return {
          icon: TrendingDown,
          title: "매출 점수",
          color: "text-blue-600",
          bgColor: "bg-blue-100",
        };
      case "customer":
        return {
          icon: Users,
          title: "고객 점수",
          color: "text-green-600",
          bgColor: "bg-green-100",
        };
      case "market":
        return {
          icon: MapPin,
          title: "시장 점수",
          color: "text-purple-600",
          bgColor: "bg-purple-100",
        };
    }
  };

  const { icon: Icon, title, color, bgColor } = getTypeInfo();

  const getRiskLevel = (value: number) => {
    if (value < 20) return { label: "낮음", color: "text-success" };
    if (value < 40) return { label: "보통", color: "text-warning" };
    if (value < 60) return { label: "높음", color: "text-alert" };
    return { label: "매우 높음", color: "text-danger" };
  };

  const riskLevel = getRiskLevel(value);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="pt-6 pb-6">
        <div className="flex items-start gap-4 mb-4">
          <div className={cn("w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0", bgColor)}>
            <Icon className={cn("h-6 w-6", color)} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">{title}</h3>
            <div className="flex items-center gap-2">
              <span className={cn("text-2xl font-bold", riskLevel.color)}>{value}%</span>
              <span className="text-sm text-muted-foreground">({riskLevel.label})</span>
            </div>
          </div>
        </div>
        <Progress value={value} className="h-2 mb-3" />
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}
