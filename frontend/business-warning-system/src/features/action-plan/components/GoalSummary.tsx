import { AlertCircle, Calendar, Target, TrendingUp } from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";
import { Card } from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";

interface GoalSummaryProps {
  riskLevel: "RED" | "ORANGE" | "YELLOW" | "GREEN";
  goal: {
    current: number;
    target: number;
    metric: string;
    deadline: string;
  };
  completionRate: number;
  highPriorityCount: number;
  completedCount: number;
  totalCount: number;
}

function getRiskLevelInfo(level: "RED" | "ORANGE" | "YELLOW" | "GREEN") {
  switch (level) {
    case "RED":
      return { label: "위험", color: "bg-red-500", textColor: "text-red-700" };
    case "ORANGE":
      return { label: "경고", color: "bg-orange-500", textColor: "text-orange-700" };
    case "YELLOW":
      return { label: "주의", color: "bg-yellow-500", textColor: "text-yellow-700" };
    case "GREEN":
      return { label: "안전", color: "bg-green-500", textColor: "text-green-700" };
  }
}

export function GoalSummary({
  riskLevel,
  goal,
  completionRate,
  highPriorityCount,
  completedCount,
  totalCount,
}: GoalSummaryProps) {
  const riskInfo = getRiskLevelInfo(riskLevel);
  const progressToGoal = goal.target > 0 ? ((goal.current / goal.target) * 100).toFixed(0) : 0;

  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      {/* Current Status */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-muted-foreground">현재 상태</h3>
          <Badge variant="outline" className={riskInfo.color}>
            {riskInfo.label}
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">{goal.current}</span>
            <span className="text-sm text-muted-foreground">/ {goal.target}</span>
          </div>
          <p className="text-sm text-muted-foreground">{goal.metric}</p>
          <Progress value={Number(progressToGoal)} className="h-2" />
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            목표일: {goal.deadline}
          </p>
        </div>
      </Card>

      {/* Completion Rate */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-muted-foreground">진행 상황</h3>
          <TrendingUp className="h-5 w-5 text-purple-600" />
        </div>
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">{completionRate}%</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {completedCount} / {totalCount} 완료
          </p>
          <Progress value={completionRate} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {completionRate >= 70
              ? "목표 달성에 가까워지고 있어요! 👍"
              : completionRate >= 40
              ? "꾸준히 진행중입니다 💪"
              : "조금 더 집중이 필요해요 🎯"}
          </p>
        </div>
      </Card>

      {/* Priority Items */}
      <Card className="p-6 bg-gradient-to-br from-red-50 to-orange-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-muted-foreground">높은 우선순위</h3>
          <AlertCircle className="h-5 w-5 text-red-600" />
        </div>
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-red-600">{highPriorityCount}</span>
            <span className="text-sm text-muted-foreground">개 미완료</span>
          </div>
          <p className="text-sm text-muted-foreground">즉시 처리가 필요한 항목</p>
          {highPriorityCount > 0 ? (
            <div className="flex items-center gap-1 text-xs text-red-600 mt-2">
              <Target className="h-3 w-3" />
              <span>우선순위 항목을 먼저 완료하세요</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-xs text-green-600 mt-2">
              <Target className="h-3 w-3" />
              <span>긴급한 항목이 없습니다 ✓</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

