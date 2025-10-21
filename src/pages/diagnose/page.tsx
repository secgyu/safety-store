import { useState } from "react";
import { useRouter } from "@/lib/next-compat";
import { ArrowLeft, ArrowRight, Loader2, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { AppHeader } from "@/components/app-header";
import { Breadcrumb } from "@/components/breadcrumb";
import { usePredictDiagnosis } from "@/lib/api";

type Step = {
  id: number;
  question: string;
  field: "industry" | "region" | "sales_1m" | "sales_3m_avg" | "cust_1m";
  type: "select" | "number";
  options?: string[];
  placeholder?: string;
  unit?: string;
};

const steps: Step[] = [
  {
    id: 1,
    question: "안녕하세요! 어떤 업종을 운영하시나요?",
    field: "industry",
    type: "select",
    options: ["음식점", "카페", "소매업", "서비스업", "미용업", "학원", "기타"],
  },
  {
    id: 2,
    question: "어느 지역에서 영업하시나요?",
    field: "region",
    type: "select",
    options: ["강남구", "서초구", "송파구", "강동구", "마포구", "용산구", "종로구", "중구", "기타"],
  },
  {
    id: 3,
    question: "최근 1개월 매출은 얼마였나요?",
    field: "sales_1m",
    type: "number",
    placeholder: "5000000",
    unit: "원",
  },
  {
    id: 4,
    question: "최근 3개월 평균 매출은 얼마였나요?",
    field: "sales_3m_avg",
    type: "number",
    placeholder: "4500000",
    unit: "원",
  },
  {
    id: 5,
    question: "최근 1개월 고객 수는 얼마나 되나요?",
    field: "cust_1m",
    type: "number",
    placeholder: "300",
    unit: "명",
  },
];

export default function DiagnosePage() {
  const router = useRouter();
  const predict = usePredictDiagnosis();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    industry: "",
    region: "",
    sales_1m: "",
    sales_3m_avg: "",
    cust_1m: "",
  });
  const [messages, setMessages] = useState<Array<{ role: "assistant" | "user"; content: string }>>([
    { role: "assistant", content: steps[0].question },
  ]);

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const formatNumber = (value: string) => {
    const number = value.replace(/[^\d]/g, "");
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleSelectOption = (value: string) => {
    const field = currentStepData.field;
    setFormData((prev) => ({ ...prev, [field]: value }));
    setMessages((prev) => [...prev, { role: "user", content: value }]);

    if (currentStep < steps.length - 1) {
      setTimeout(() => {
        setMessages((prev) => [...prev, { role: "assistant", content: steps[currentStep + 1].question }]);
        setCurrentStep((prev) => prev + 1);
      }, 500);
    } else {
      handleSubmit(value);
    }
  };

  const handleNumberInput = (value: string) => {
    const field = currentStepData.field;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNumberSubmit = () => {
    const value = formData[currentStepData.field];
    if (!value) return;

    const displayValue = formatNumber(value) + (currentStepData.unit || "");
    setMessages((prev) => [...prev, { role: "user", content: displayValue }]);

    if (currentStep < steps.length - 1) {
      setTimeout(() => {
        setMessages((prev) => [...prev, { role: "assistant", content: steps[currentStep + 1].question }]);
        setCurrentStep((prev) => prev + 1);
      }, 500);
    } else {
      handleSubmit(value);
    }
  };

  const handleSubmit = async (lastValue?: string) => {
    setMessages((prev) => [...prev, { role: "assistant", content: "분석 중입니다... 잠시만 기다려주세요." }]);

    // Prepare final data
    const finalData = lastValue ? { ...formData, [currentStepData.field]: lastValue } : formData;

    try {
      // API call - convert form data to diagnosis request
      const result = await predict.mutateAsync({
        industry: finalData.industry,
        yearsInBusiness: 3, // Mock value - could be added to form
        monthlyRevenue: Number(finalData.sales_1m),
        monthlyExpenses: Number(finalData.sales_1m) * 0.8, // Mock calculation
        customerCount: Number(finalData.cust_1m),
      });

      // Store result in sessionStorage for results page
      sessionStorage.setItem("diagnosisData", JSON.stringify(finalData));
      sessionStorage.setItem("diagnosisResult", JSON.stringify(result));

      // Navigate to results page
      router.push("/results");
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
          <Breadcrumb items={[{ label: "진단하기" }]} />

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
                  {currentStepData.type === "select" ? (
                    <div className="flex flex-wrap gap-2">
                      {currentStepData.options?.map((option) => (
                        <Button
                          key={option}
                          onClick={() => handleSelectOption(option)}
                          variant="outline"
                          size="lg"
                          className="text-base"
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          value={formatNumber(formData[currentStepData.field])}
                          onChange={(e) => handleNumberInput(e.target.value.replace(/[^\d]/g, ""))}
                          placeholder={currentStepData.placeholder}
                          className="text-lg h-12"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleNumberSubmit();
                            }
                          }}
                        />
                        <Button onClick={handleNumberSubmit} size="lg" className="px-8">
                          다음
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </div>
                      {currentStepData.unit && (
                        <p className="text-sm text-muted-foreground">단위: {currentStepData.unit}</p>
                      )}
                    </div>
                  )}
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
            <Button onClick={() => router.push("/")} variant="ghost" disabled={predict.isPending}>
              취소
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
