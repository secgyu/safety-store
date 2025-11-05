import { AlertOctagon, AlertTriangle, CheckCircle, PartyPopper, ThumbsUp } from "lucide-react";

import { Card, CardContent } from "@/shared/components/ui/card";

interface IndustryPositionProps {
  myRiskScore: number;
  averageRiskScore: number;
}

export function IndustryPosition({ myRiskScore, averageRiskScore }: IndustryPositionProps) {
  // 평균 대비 상대적 위치 계산 (0-100, 50이 평균)
  const relativePosition = Math.min(100, Math.max(0, 50 + ((averageRiskScore - myRiskScore) / averageRiskScore) * 50));

  const gaugeColor =
    relativePosition >= 70
      ? "#10b981" // 초록 - 매우 안전
      : relativePosition >= 55
      ? "#3b82f6" // 파랑 - 안전
      : relativePosition >= 45
      ? "#f59e0b" // 주황 - 평균 근처
      : relativePosition >= 30
      ? "#f97316" // 진한 주황 - 주의
      : "#ef4444"; // 빨강 - 위험

  const positionText =
    relativePosition >= 50
      ? `상위 ${Math.round(100 - relativePosition)}%`
      : `하위 ${Math.round(relativePosition)}%`;

  const statusMessage =
    relativePosition >= 70 ? (
      <span className="flex items-center gap-1">
        <PartyPopper className="h-4 w-4 text-green-600" /> 매우 안전한 상태입니다!
      </span>
    ) : relativePosition >= 55 ? (
      <span className="flex items-center gap-1">
        <CheckCircle className="h-4 w-4 text-green-600" /> 안전한 상태입니다
      </span>
    ) : relativePosition >= 45 ? (
      <span className="flex items-center gap-1">
        <ThumbsUp className="h-4 w-4 text-blue-600" /> 평균 수준입니다
      </span>
    ) : relativePosition >= 30 ? (
      <span className="flex items-center gap-1">
        <AlertTriangle className="h-4 w-4 text-orange-600" /> 주의가 필요합니다
      </span>
    ) : (
      <span className="flex items-center gap-1">
        <AlertOctagon className="h-4 w-4 text-red-600" /> 개선이 시급합니다
      </span>
    );

  return (
    <div className="mb-10">
      <h2 className="text-3xl font-bold mb-8">업종 내 내 위치</h2>
      <Card className="glass-card bg-gradient-to-br from-indigo-50 to-purple-50">
        <CardContent className="pt-8 pb-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">같은 업종 내 상대적 순위</p>
            <div className="relative">
              {/* 백분위 게이지 */}
              <div className="flex justify-center items-center mb-6">
                <div className="relative w-64 h-64">
                  <svg viewBox="0 0 200 120" className="w-full h-full">
                    {/* 배경 호 */}
                    <path
                      d="M 20 100 A 80 80 0 0 1 180 100"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="20"
                      strokeLinecap="round"
                    />
                    {/* 진행 호 */}
                    <path
                      d="M 20 100 A 80 80 0 0 1 180 100"
                      fill="none"
                      stroke={gaugeColor}
                      strokeWidth="20"
                      strokeLinecap="round"
                      strokeDasharray={`${(relativePosition * 2.51).toFixed(2)} 251`}
                    />
                    {/* 중앙 텍스트 */}
                    <text x="100" y="85" textAnchor="middle" className="text-5xl font-bold" fill="#1f2937">
                      {positionText}
                    </text>
                  </svg>
                </div>
              </div>

              {/* 설명 */}
              <div className="mb-6">
                <p className="text-lg font-semibold text-foreground mb-2">{statusMessage}</p>
                <p className="text-sm text-muted-foreground">
                  내 안전점수: <strong>{myRiskScore.toFixed(1)}점</strong> | 업종 평균:{" "}
                  <strong>{averageRiskScore.toFixed(1)}점</strong>
                  {myRiskScore > averageRiskScore ? (
                    <span className="text-green-600 font-semibold ml-2">
                      (평균보다 {Math.abs(myRiskScore - averageRiskScore).toFixed(1)}점 높음 ✓)
                    </span>
                  ) : (
                    <span className="text-orange-600 font-semibold ml-2">
                      (평균보다 {Math.abs(myRiskScore - averageRiskScore).toFixed(1)}점 낮음)
                    </span>
                  )}
                </p>
              </div>

              {/* 범위 표시 */}
              <div className="flex justify-between items-center px-4 text-xs text-muted-foreground">
                <div className="text-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1"></div>
                  <span>안전</span>
                </div>
                <div className="text-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-1"></div>
                  <span>양호</span>
                </div>
                <div className="text-center">
                  <div className="w-3 h-3 bg-orange-500 rounded-full mx-auto mb-1"></div>
                  <span>주의</span>
                </div>
                <div className="text-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-1"></div>
                  <span>위험</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

