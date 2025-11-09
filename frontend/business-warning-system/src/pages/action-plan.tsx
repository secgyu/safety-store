import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useActionPlans, useDeleteActionPlanItem, useUpdateActionPlan } from "@/features/action-plan";
import { ActionPlanList, GoalSummary } from "@/features/action-plan/components";
import type { ActionPlanItem } from "@/features/action-plan/types";
import { Button } from "@/shared/components/ui/button";

interface Goal {
  current: number;
  target: number;
  metric: string;
  deadline: string;
}

export default function ActionPlanPage() {
  const navigate = useNavigate();
  const { data: actionPlans, isPending: loading, error } = useActionPlans();

  const updatePlanMutation = useUpdateActionPlan();
  const deleteMutation = useDeleteActionPlanItem();

  const riskLevel: "RED" | "ORANGE" | "YELLOW" | "GREEN" = "ORANGE";
  const goal: Goal = {
    current: 65,
    target: 85,
    metric: "종합 위험도 점수",
    deadline: "3개월 후",
  };

  // API에서 받은 ActionPlan의 items
  const actionItems: ActionPlanItem[] = actionPlans?.[0]?.items || [];
  const currentPlanId = actionPlans?.[0]?.id;

  const completedCount = actionItems.filter((item) => item.status === "completed").length;
  const totalCount = actionItems.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const highPriorityCount = actionItems.filter(
    (item) => item.priority === "high" && item.status !== "completed"
  ).length;

  const toggleComplete = async (id: string) => {
    if (!currentPlanId) return;

    const updatedItems = actionItems.map((item) =>
      item.id === id ? { ...item, status: item.status === "completed" ? "pending" : "completed" } : item
    );

    await updatePlanMutation.mutateAsync({
      id: currentPlanId,
      data: { diagnosisId: currentPlanId, items: updatedItems },
    });
  };

  const deleteItem = async (itemId: string) => {
    if (!currentPlanId) return;
    await deleteMutation.mutateAsync({ id: currentPlanId, itemId });
  };

  const saveNote = async (id: string, noteText: string) => {
    if (!currentPlanId) return;

    const updatedItems = actionItems.map((item) =>
      item.id === id ? { ...item, description: `${item.description}\n\n메모: ${noteText}` } : item
    );

    await updatePlanMutation.mutateAsync({
      id: currentPlanId,
      data: { items: updatedItems },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">오류가 발생했습니다: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/30">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">개선 실행 계획</h1>
            <p className="text-muted-foreground">단계별로 실행하고 진행 상황을 추적하세요</p>
          </div>
        </div>

        {/* Goal Summary */}
        <GoalSummary
          riskLevel={riskLevel}
          goal={goal}
          completionRate={completionRate}
          highPriorityCount={highPriorityCount}
          completedCount={completedCount}
          totalCount={totalCount}
        />

        {/* Action Plan List */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">실행 항목</h2>
          {actionItems.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">
              아직 실행 계획이 없습니다. 진단 결과에서 계획을 생성하세요.
            </p>
          ) : (
            <ActionPlanList
              items={actionItems}
              onToggleComplete={toggleComplete}
              onDeleteItem={deleteItem}
              onSaveNote={saveNote}
            />
          )}
        </div>
      </div>
    </div>
  );
}
