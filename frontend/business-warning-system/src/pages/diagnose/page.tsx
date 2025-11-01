import { ArrowLeft, ArrowRight, Bot, Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { usePredictDiagnosis } from "@/lib/api";

type Step = {
  id: number;
  question: string;
  field: "encoded_mct";
  type: "text";
  placeholder?: string;
};

const steps: Step[] = [
  {
    id: 1,
    question: "안녕하세요! 성동구에 있는 사업체 코드(ENCODED_MCT)를 입력해주세요.",
    field: "encoded_mct",
    type: "text",
    placeholder: "사업체 코드를 입력하세요",
  },
];

export default function DiagnosePage() {
  const navigate = useNavigate();
  const predict = usePredictDiagnosis();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    encoded_mct: "",
  });
  const [messages, setMessages] = useState<Array<{ role: "assistant" | "user"; content: string }>>([
    { role: "assistant", content: steps[0].question },
  ]);

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleTextInput = (value: string) => {
    const field = currentStepData.field;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTextSubmit = () => {
    const value = formData[currentStepData.field];
    if (!value) return;

    setMessages((prev) => [...prev, { role: "user", content: value }]);
    handleSubmit(value);
  };

  const handleSubmit = async (lastValue?: string) => {
    setMessages((prev) => [...prev, { role: "assistant", content: "분석 중입니다... 잠시만 기다려주세요." }]);

    // Prepare final data
    const finalData = lastValue ? { ...formData, [currentStepData.field]: lastValue } : formData;

    try {
      // API call - send encoded_mct to /predict endpoint
      const result = await predict.mutateAsync({
        encodedMct: finalData.encoded_mct,
      });

      // Store result in sessionStorage for results page
      sessionStorage.setItem("diagnosisData", JSON.stringify(finalData));
      sessionStorage.setItem("diagnosisResult", JSON.stringify(result));

      // Navigate to results page
      navigate("/results");
    } catch (error) {
      console.error("Error submitting diagnosis:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "일시적인 오류가 발생했습니다. 다시 시도해주세요." },
      ]);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      // Remove last two messages (user answer and assistant question)
      setMessages((prev) => prev.slice(0, -2));
    }
  };

  return (
    <>
      <AppHeader />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                진행 상황: {currentStep + 1} / {steps.length}
              </span>
              <span className="text-sm font-medium text-primary">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Chat Interface */}
          <Card className="mb-6 min-h-[500px] flex flex-col">
            <CardContent className="flex-1 p-6 flex flex-col">
              {/* Messages */}
              <div className="flex-1 space-y-4 mb-6 overflow-y-auto max-h-[400px]">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.role === "assistant" && (
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-5 w-5 text-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                ))}
                {predict.isPending && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Loader2 className="h-5 w-5 text-primary animate-spin" />
                    </div>
                    <div className="bg-muted rounded-2xl px-4 py-3">
                      <div className="flex gap-1">
                        <div
                          className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        />
                        <div
                          className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />
                        <div
                          className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              {!predict.isPending && (
                <div className="border-t pt-6">
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        value={formData[currentStepData.field]}
                        onChange={(e) => handleTextInput(e.target.value)}
                        placeholder={currentStepData.placeholder}
                        className="text-lg h-12"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleTextSubmit();
                          }
                        }}
                      />
                      <Button onClick={handleTextSubmit} size="lg" className="px-8">
                        진단하기
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button onClick={handleBack} variant="ghost" disabled={currentStep === 0 || predict.isPending}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              이전
            </Button>
            <Button onClick={() => navigate("/")} variant="ghost" disabled={predict.isPending}>
              취소
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
