import { CheckCircle2, Edit3, Trash2 } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Textarea } from "@/shared/components/ui/textarea";

import type { ActionPlanItem } from "../types";

interface ActionPlanListProps {
  items: ActionPlanItem[];
  onToggleComplete: (id: string) => Promise<void>;
  onDeleteItem: (id: string) => Promise<void>;
  onSaveNote: (id: string, note: string) => Promise<void>;
}

function getPriorityColor(priority: string) {
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
}

function getPriorityLabel(priority: string) {
  switch (priority) {
    case "high":
      return "높음";
    case "medium":
      return "중간";
    case "low":
      return "낮음";
    default:
      return priority;
  }
}

export function ActionPlanList({ items, onToggleComplete, onDeleteItem, onSaveNote }: ActionPlanListProps) {
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");

  const startEditNote = (id: string) => {
    setEditingNote(id);
    setNoteText("");
  };

  const handleSaveNote = async (id: string) => {
    await onSaveNote(id, noteText);
    setEditingNote(null);
    setNoteText("");
  };

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card
          key={item.id}
          className={`p-6 transition-all ${
            item.status === "completed" ? "opacity-60 bg-gray-50" : "hover:shadow-lg"
          }`}
        >
          <div className="flex items-start gap-4">
            {/* Checkbox */}
            <div className="flex-shrink-0 pt-1">
              <Checkbox
                id={`action-${item.id}`}
                checked={item.status === "completed"}
                onCheckedChange={() => onToggleComplete(item.id)}
                className="w-6 h-6"
              />
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <label
                    htmlFor={`action-${item.id}`}
                    className={`text-lg font-semibold cursor-pointer ${
                      item.status === "completed" ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {item.title}
                  </label>
                  <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Badge variant="outline" className={getPriorityColor(item.priority)}>
                    {getPriorityLabel(item.priority)}
                  </Badge>
                </div>
              </div>

              {/* Note editing */}
              {editingNote === item.id ? (
                <div className="mt-4 space-y-2">
                  <Textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="메모를 입력하세요..."
                    className="resize-none"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleSaveNote(item.id)}>
                      저장
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingNote(null)}>
                      취소
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2 mt-3">
                  {item.status !== "completed" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2"
                        onClick={() => startEditNote(item.id)}
                      >
                        <Edit3 className="h-4 w-4" />
                        메모 추가
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2 text-red-600 hover:text-red-700"
                        onClick={() => onDeleteItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        삭제
                      </Button>
                    </>
                  )}
                  {item.status === "completed" && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="h-5 w-5" />
                      <span className="text-sm font-medium">완료됨</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

