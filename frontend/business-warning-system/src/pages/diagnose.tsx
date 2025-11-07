import { ArrowLeft, Bot, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/features/auth";
import { useBusinessSearch, useDiagnose, useRecentDiagnosis } from "@/features/diagnosis";
import { BusinessList, BusinessSearchForm } from "@/features/diagnosis/components/DiagnosisForm";
import { AppHeader } from "@/shared/components/layout/AppHeader";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";
import { useToast } from "@/shared/hooks/use-toast";

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
  const { data: recentDiagnosis, isLoading: isLoadingRecent } = useRecentDiagnosis();
  const predict = useDiagnose();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    search_keyword: "",
    selected_mct: "",
  });
  const [searchKeyword, setSearchKeyword] = useState("");
  const { data: searchResults, isLoading: isSearching } = useBusinessSearch(searchKeyword);
  const [messages, setMessages] = useState<Array<{ role: "assistant" | "user"; content: string }>>([
    { role: "assistant", content: steps[0].question },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 메시지 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  // 최근 진단 체크
  useEffect(() => {
    if (!isLoadingAuth && !isLoadingRecent && user && recentDiagnosis) {
      navigate("/results");
    }
  }, [user, recentDiagnosis, isLoadingAuth, isLoadingRecent, predict, navigate]);

  // 로딩 중
  if (isLoadingAuth || isLoadingRecent) {
    return (
      <>
        <AppHeader />
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </>
    );
  }

  // 로그인하지 않은 경우
  if (!user) {
    return null;
  }

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleSearch = () => {
    if (formData.search_keyword.trim()) {
      setSearchKeyword(formData.search_keyword.trim());
      setMessages((prev) => [
        ...prev,
        { role: "user", content: formData.search_keyword },
        { role: "assistant", content: steps[1].question },
      ]);
      setCurrentStep(1);
    }
  };

  const handleSelectBusiness = (mct: string) => {
    setFormData((prev) => ({ ...prev, selected_mct: mct }));
  };

  const handleSubmit = async () => {
    if (formData.selected_mct) {
      const selectedBusiness = searchResults?.find((b) => b.encoded_mct === formData.selected_mct);
      if (selectedBusiness) {
        setMessages((prev) => [
          ...prev,
          { role: "user", content: selectedBusiness.business_name },
          { role: "assistant", content: "진단을 시작합니다..." },
        ]);

        await predict.mutateAsync(
          { encoded_mct: formData.selected_mct },
          {
            onSuccess: () => {
              setTimeout(() => {
                navigate("/results");
              }, 1000);
            },
            onError: (error: Error) => {
              toast({
                title: "진단 실패",
                description: error.message || "진단 중 오류가 발생했습니다.",
                variant: "destructive",
              });
              setMessages((prev) => [
                ...prev.slice(0, -1),
                {
                  role: "assistant",
                  content: "죄송합니다. 진단 중 오류가 발생했습니다. 다시 시도해주세요.",
                },
              ]);
            },
          }
        );
      }
    }
  };

  const canProceed = currentStep === 0 ? formData.search_keyword.trim() : formData.selected_mct;

  return (
    <>
      <AppHeader />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => (currentStep > 0 ? setCurrentStep(currentStep - 1) : navigate("/dashboard"))}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Bot className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold">AI 진단 시작</h1>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">
                {currentStep + 1} / {steps.length} 단계
              </p>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="mb-4 max-h-[calc(100vh-380px)] overflow-y-auto">
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <Card
                    className={`max-w-[80%] ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-card"}`}
                  >
                    <CardContent className="p-4">
                      <p className="whitespace-pre-line">{msg.content}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <Card className="shadow-lg">
            <CardContent className="p-6">
              {currentStepData.type === "search" ? (
                <BusinessSearchForm
                  searchKeyword={formData.search_keyword}
                  onSearchChange={(value) => setFormData((prev) => ({ ...prev, search_keyword: value }))}
                  onSearch={handleSearch}
                  placeholder={currentStepData.placeholder}
                  isSearching={isSearching}
                />
              ) : currentStepData.type === "select" ? (
                <div className="space-y-4">
                  <BusinessList
                    businesses={searchResults?.results || []}
                    selectedMct={formData.selected_mct}
                    onSelect={handleSelectBusiness}
                  />
                  <Button
                    onClick={handleSubmit}
                    disabled={!canProceed || predict.isPending}
                    className="w-full h-12 text-lg font-semibold"
                  >
                    {predict.isPending ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        진단 중...
                      </>
                    ) : (
                      "진단 시작"
                    )}
                  </Button>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
