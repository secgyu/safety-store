import { AlertCircle, ArrowLeft, Calendar, CheckCircle2, Edit3, Target, Trash2, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { type ActionPlanItem, useActionPlans, useDeleteActionPlanItem, useUpdateActionPlan } from "@/lib/api";

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

  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");

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
      data: { items: updatedItems },
    });
  };

  const deleteItem = async (itemId: string) => {
    if (!currentPlanId) return;

    await deleteMutation.mutateAsync({ id: currentPlanId, itemId });
  };

  const saveNote = async (id: string) => {
    if (!currentPlanId) return;

    const updatedItems = actionItems.map((item) =>
      item.id === id ? { ...item, description: `${item.description}\n\n메모: ${noteText}` } : item
    );

    await updatePlanMutation.mutateAsync({
      id: currentPlanId,
      data: { items: updatedItems },
    });

    setEditingNote(null);
    setNoteText("");
  };

  const startEditNote = (id: string, _currentNote?: string) => {
    setEditingNote(id);
    setNoteText("");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      case "medium":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "low":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "높음";
      case "medium":
        return "보통";
      case "low":
        return "낮음";
      default:
        return priority;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "RED":
        return "text-red-600";
      case "ORANGE":
        return "text-orange-600";
      case "YELLOW":
        return "text-yellow-600";
      case "GREEN":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">개선 계획을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">데이터를 불러올 수 없습니다</h2>
            <p className="text-gray-600 mb-4">로그인이 필요하거나 일시적인 오류가 발생했습니다.</p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => navigate("/login")}>로그인</Button>
              <Button variant="outline" onClick={() => navigate(-1)}>
                돌아가기
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // 데이터가 없는 경우
  if (!actionPlans || actionPlans.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            돌아가기
          </Button>
          <Card className="p-12 text-center">
            <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">개선 계획이 없습니다</h2>
            <p className="text-gray-600 mb-6">진단을 완료한 후 AI가 맞춤 개선 계획을 생성해드립니다.</p>
            <Button onClick={() => navigate("/diagnose")}>진단 시작하기</Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 hover:bg-blue-100">
            <ArrowLeft className="mr-2 h-4 w-4" />
            돌아가기
          </Button>

          <div className="flex items-center gap-3 mb-2">
            <Target className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">개선 계획</h1>
          </div>
          <p className="text-gray-600">위험도를 낮추기 위한 단계별 실행 계획을 확인하고 진행 상황을 관리하세요</p>
        </div>

        {/* Goal Overview */}
        <Card className="p-6 mb-6 bg-gradient-to-br from-blue-50 to-white border-blue-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">목표 설정</h2>
              <p className="text-sm text-gray-600">현재 위험도를 개선하여 안정적인 사업 운영을 목표로 합니다</p>
            </div>
            <Badge className={`${getRiskColor(riskLevel)} bg-white border`}>현재: {riskLevel}</Badge>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">현재 점수</p>
              <p className="text-2xl font-bold text-gray-900">{goal.current}점</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600 mb-1">목표 점수</p>
              <p className="text-2xl font-bold text-blue-600">{goal.target}점</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">달성 기한</p>
              <p className="text-2xl font-bold text-gray-900">{goal.deadline}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">목표 달성률</span>
              <span className="font-semibold text-gray-900">
                {Math.round(((goal.current - 50) / (goal.target - 50)) * 100)}%
              </span>
            </div>
            <Progress value={((goal.current - 50) / (goal.target - 50)) * 100} className="h-3" />
          </div>
        </Card>

        {/* Progress Summary */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card className="p-6 bg-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">전체 진행률</p>
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{completionRate}%</p>
            <p className="text-sm text-gray-600">
              {completedCount}/{totalCount} 완료
            </p>
          </Card>

          <Card className="p-6 bg-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">높은 우선순위</p>
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{highPriorityCount}개</p>
            <p className="text-sm text-gray-600">즉시 실행 필요</p>
          </Card>

          <Card className="p-6 bg-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">예상 개선</p>
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">+{goal.target - goal.current}점</p>
            <p className="text-sm text-gray-600">목표 달성 시</p>
          </Card>
        </div>

        {/* Action Items by Priority */}
        <div className="space-y-6">
          {["high", "medium", "low"].map((priority) => {
            const items = actionItems.filter((item) => item.priority === priority);
            if (items.length === 0) return null;

            return (
              <div key={priority}>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Badge className={getPriorityColor(priority)}>{getPriorityLabel(priority)} 우선순위</Badge>
                  <span className="text-sm font-normal text-gray-600">
                    ({items.filter((i) => i.status !== "completed").length}개 남음)
                  </span>
                </h3>

                <div className="space-y-3">
                  {items.map((item) => (
                    <Card
                      key={item.id}
                      className={`p-5 transition-all ${
                        item.status === "completed" ? "bg-gray-50 opacity-75" : "bg-white hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <Checkbox
                          checked={item.status === "completed"}
                          onCheckedChange={() => toggleComplete(item.id)}
                          className="mt-1"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1">
                              <h4
                                className={`font-semibold mb-1 ${
                                  item.status === "completed" ? "line-through text-gray-500" : "text-gray-900"
                                }`}
                              >
                                {item.title}
                              </h4>
                              <p
                                className={`text-sm ${item.status === "completed" ? "text-gray-400" : "text-gray-600"}`}
                              >
                                {item.description}
                              </p>
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteItem(item.id)}
                              className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <Badge variant="outline" className="text-xs">
                              우선순위: {getPriorityLabel(item.priority)}
                            </Badge>
                            {item.dueDate && (
                              <div className="flex items-center gap-1 text-xs text-gray-600">
                                <Calendar className="h-3 w-3" />
                                {item.dueDate}
                              </div>
                            )}
                          </div>

                          {/* Notes Section */}
                          {editingNote === item.id ? (
                            <div className="space-y-2">
                              <Textarea
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                placeholder="메모를 입력하세요..."
                                className="min-h-[80px]"
                              />
                              <div className="flex gap-2">
                                <Button size="sm" onClick={() => saveNote(item.id)}>
                                  저장
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => setEditingNote(null)}>
                                  취소
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => startEditNote(item.id)}
                                className="text-gray-500 hover:text-gray-700 h-8 px-2"
                              >
                                <Edit3 className="h-3 w-3 mr-1" />
                                메모 추가
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Button onClick={() => navigate("/consultation")} className="flex-1 bg-blue-600 hover:bg-blue-700">
            AI 상담으로 맞춤 조언 받기
          </Button>
          <Button onClick={() => navigate("/dashboard")} variant="outline" className="flex-1">
            대시보드에서 진행 상황 확인
          </Button>
        </div>
      </div>
    </div>
  );
}
