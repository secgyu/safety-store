import { ArrowLeft,ArrowRight, X } from "lucide-react";
import { useEffect,useState } from "react";

import { Button } from "@/components/ui/button";

interface TourStep {
  title: string;
  description: string;
  target?: string;
  position?: "top" | "bottom" | "left" | "right";
}

const tourSteps: TourStep[] = [
  {
    title: "자영업 조기경보 시스템에 오신 것을 환영합니다!",
    description:
      "간단한 진단으로 귀하의 사업 위험도를 분석하고, 맞춤형 개선 방안을 제공합니다. 지금부터 주요 기능을 안내해드리겠습니다.",
  },
  {
    title: "무료 진단 시작하기",
    description:
      "5가지 간단한 질문에 답하시면 AI가 귀하의 사업 위험도를 분석합니다. 업종, 매출, 고객 수 등 기본 정보만 입력하시면 됩니다.",
    target: '[data-tour="diagnose-button"]',
    position: "bottom",
  },
  {
    title: "위험도 결과 확인",
    description:
      "진단 후 GREEN, YELLOW, ORANGE, RED 4단계로 위험도를 확인할 수 있습니다. 각 위험 요소별 상세 분석과 개선 제안을 제공합니다.",
  },
  {
    title: "업종 비교",
    description:
      "내 사업을 같은 업종의 다른 사업자들과 비교해보세요. 업종 평균 대비 내 위치를 파악하고 벤치마크할 수 있습니다.",
    target: '[data-tour="compare-link"]',
    position: "bottom",
  },
  {
    title: "AI 상담 받기",
    description:
      "진단 결과에 대해 궁금한 점이 있으신가요? AI 챗봇이 24시간 귀하의 질문에 답변하고 맞춤형 조언을 제공합니다.",
  },
  {
    title: "개선 계획 수립",
    description:
      "위험도를 낮추기 위한 단계별 실행 계획을 만들어보세요. 체크리스트로 진행 상황을 추적하고 목표를 달성할 수 있습니다.",
  },
  {
    title: "재무 계산기 활용",
    description: "손익분기점, 현금흐름, 대출 상환 등 유용한 재무 계산기를 무료로 사용하실 수 있습니다.",
    target: '[data-tour="calculators-link"]',
    position: "bottom",
  },
  {
    title: "준비 완료!",
    description:
      "이제 시작할 준비가 되었습니다. 지금 바로 무료 진단을 받아보시고, 귀하의 사업을 더 안전하게 지켜보세요!",
  },
];

export function OnboardingTour({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [highlightPosition, setHighlightPosition] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  const currentTourStep = tourSteps[currentStep];

  useEffect(() => {
    if (currentTourStep.target) {
      const element = document.querySelector(currentTourStep.target);
      if (element) {
        const rect = element.getBoundingClientRect();
        setHighlightPosition({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
        });
        // Scroll to element
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        setHighlightPosition(null);
      }
    } else {
      setHighlightPosition(null);
    }
  }, [currentStep, currentTourStep.target]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    onComplete();
  };

  const handleSkip = () => {
    setIsVisible(false);
    onComplete();
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm" />

      {/* Highlight spotlight */}
      {highlightPosition && (
        <div
          className="fixed z-[101] pointer-events-none"
          style={{
            top: highlightPosition.top - 8,
            left: highlightPosition.left - 8,
            width: highlightPosition.width + 16,
            height: highlightPosition.height + 16,
            boxShadow: "0 0 0 4px rgba(37, 99, 235, 0.5), 0 0 0 9999px rgba(0, 0, 0, 0.6)",
            borderRadius: "12px",
            transition: "all 0.3s ease",
          }}
        />
      )}

      {/* Tour modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[102] w-full max-w-lg mx-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 relative">
          {/* Close button */}
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Progress indicator */}
          <div className="flex gap-1 mb-6">
            {tourSteps.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  index <= currentStep ? "bg-blue-600" : "bg-gray-200"
                }`}
              />
            ))}
          </div>

          {/* Content */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">{currentTourStep.title}</h2>
            <p className="text-gray-600 leading-relaxed">{currentTourStep.description}</p>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {currentStep + 1} / {tourSteps.length}
            </div>
            <div className="flex gap-3">
              {currentStep > 0 && (
                <Button variant="outline" onClick={handlePrevious} className="gap-2 bg-transparent">
                  <ArrowLeft className="w-4 h-4" />
                  이전
                </Button>
              )}
              <Button onClick={handleNext} className="gap-2">
                {currentStep < tourSteps.length - 1 ? (
                  <>
                    다음
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  "시작하기"
                )}
              </Button>
            </div>
          </div>

          {/* Skip button */}
          {currentStep < tourSteps.length - 1 && (
            <button
              onClick={handleSkip}
              className="w-full text-center text-sm text-gray-500 hover:text-gray-700 mt-4 transition-colors"
            >
              튜토리얼 건너뛰기
            </button>
          )}
        </div>
      </div>
    </>
  );
}
