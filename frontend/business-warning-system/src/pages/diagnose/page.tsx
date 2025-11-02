import { ArrowLeft, Bot, Building2, Loader2, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth, usePredictDiagnosis, useSearchBusinesses } from "@/lib/api";

type Step = {
  id: number;
  question: string;
  field: "search_keyword" | "selected_mct";
  type: "search" | "select";
  placeholder?: string;
};

const steps: Step[] = [
  {
    id: 1,
    question:
      "안녕하세요! 진단하실 가게 이름을 입력해주세요.\n※ 개인정보 보호를 위해 가게명이 일부만 공개되어 있습니다. (예: 춘리** )",
    field: "search_keyword",
    type: "search",
    placeholder: "가게 이름 앞 글자를 입력하세요 (1-2자)",
  },
  {
    id: 2,
    question: "검색 결과에서 진단하실 가게를 선택해주세요.",
    field: "selected_mct",
    type: "select",
  },
];

export default function DiagnosePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: user, isLoading: isLoadingAuth } = useAuth();
  const predict = usePredictDiagnosis();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    search_keyword: "",
    selected_mct: "",
  });
  const [searchKeyword, setSearchKeyword] = useState("");
  const { data: searchResults, isLoading: isSearching } = useSearchBusinesses(searchKeyword);
  const [messages, setMessages] = useState<Array<{ role: "assistant" | "user"; content: string }>>([
    { role: "assistant", content: steps[0].question },
  ]);

  // 로그인 체크
  useEffect(() => {
    if (!isLoadingAuth && !user) {
      toast({
        title: "로그인이 필요합니다",
        description: "진단 서비스를 이용하시려면 로그인해주세요.",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [user, isLoadingAuth, navigate, toast]);

  // 로딩 중이면 아무것도 렌더링하지 않음
  if (isLoadingAuth) {
    return (
      <>
        <AppHeader />
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </>
    );
  }

  // 로그인하지 않은 경우 렌더링하지 않음
  if (!user) {
    return null;
  }

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleTextInput = (value: string) => {
    const field = currentStepData.field;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    const keyword = formData.search_keyword;
    if (!keyword || keyword.length < 1) {
      setMessages((prev) => [...prev, { role: "assistant", content: "검색어를 1자 이상 입력해주세요." }]);
      return;
    }

    setMessages((prev) => [...prev, { role: "user", content: keyword }]);
    setSearchKeyword(keyword);

    // 다음 스텝으로 이동
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setMessages((prev) => [...prev, { role: "assistant", content: steps[currentStep + 1].question }]);
    }
  };

  const handleSelectBusiness = async (encodedMct: string, businessName: string) => {
    setFormData((prev) => ({ ...prev, selected_mct: encodedMct }));
    setMessages((prev) => [...prev, { role: "user", content: businessName }]);
    setMessages((prev) => [...prev, { role: "assistant", content: "분석 중입니다... 잠시만 기다려주세요." }]);

    try {
      // API call - send encoded_mct to /predict endpoint
      const result = await predict.mutateAsync({
        encodedMct: encodedMct,
      });

      // Store result in sessionStorage for results page
      sessionStorage.setItem("diagnosisData", JSON.stringify({ encoded_mct: encodedMct }));
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
      // 검색 초기화
      if (currentStep === 1) {
        setSearchKeyword("");
      }
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
                {(predict.isPending || isSearching) && (
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
                  {currentStepData.type === "search" && (
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
                              handleSearch();
                            }
                          }}
                        />
                        <Button onClick={handleSearch} size="lg" className="px-8">
                          <Search className="mr-2 h-5 w-5" />
                          검색
                        </Button>
                      </div>
                    </div>
                  )}

                  {currentStepData.type === "select" && (
                    <div className="space-y-4">
                      {isSearching ? (
                        <div className="text-center py-8">
                          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
                          <p className="text-sm text-muted-foreground">검색 중...</p>
                        </div>
                      ) : searchResults && searchResults.results.length > 0 ? (
                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                          <p className="text-sm text-muted-foreground mb-3">
                            {searchResults.results.length}개의 가게를 찾았습니다.
                            <br />
                            <span className="text-xs">※ 개인정보 보호를 위해 가게명이 일부 가려져 있습니다.</span>
                          </p>
                          {searchResults.results.map((business, index) => (
                            <Card
                              key={index}
                              className="p-4 cursor-pointer hover:bg-primary/5 hover:border-primary transition-all"
                              onClick={() => handleSelectBusiness(business.encodedMct, business.name)}
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                  <Building2 className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-semibold text-base">{business.name}</h3>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {business.area} • {business.businessType}
                                  </p>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Building2 className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                          <p className="text-sm text-muted-foreground">
                            검색 결과가 없습니다. 다른 검색어로 시도해보세요.
                            <br />
                            <span className="text-xs mt-1 block">TIP: 가게명의 앞 1-2글자만 입력해보세요.</span>
                          </p>
                        </div>
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
            <Button onClick={() => navigate("/")} variant="ghost" disabled={predict.isPending}>
              취소
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
