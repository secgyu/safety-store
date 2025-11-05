import { AlertTriangle, CheckCircle, Lightbulb, TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

interface CompareInsightsProps {
  industryLabel: string;
  avgRevenue: number;
  avgRiskScore: number;
  avgCustomers: number;
}

export function CompareInsights({ industryLabel, avgRevenue, avgRiskScore, avgCustomers }: CompareInsightsProps) {
  // 고객 단가 계산
  const customerSpending = avgRevenue > 0 && avgCustomers > 0 ? Math.round(avgRevenue / avgCustomers) : 0;

  // 업종 평가
  const riskLevel =
    avgRiskScore > 60 ? { level: "높음", color: "text-red-600", icon: AlertTriangle } : avgRiskScore > 40 ? { level: "보통", color: "text-orange-600", icon: TrendingUp } : { level: "낮음", color: "text-green-600", icon: CheckCircle };

  // 매출 수준 평가
  const revenueLevel =
    avgRevenue > 50000000
      ? { level: "상위권", color: "text-green-600", description: "높은 매출 수준" }
      : avgRevenue > 30000000
      ? { level: "중상위권", color: "text-blue-600", description: "양호한 매출 수준" }
      : { level: "중하위권", color: "text-orange-600", description: "낮은 매출 수준" };

  // 고객 수 평가
  const customerLevel =
    avgCustomers > 5000
      ? { level: "상위권", color: "text-green-600" }
      : avgCustomers > 3000
      ? { level: "중상위권", color: "text-blue-600" }
      : { level: "중하위권", color: "text-orange-600" };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-600" />
          <span>AI 분석 인사이트</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">{industryLabel} 업종에 대한 종합 분석 결과입니다</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* 위험도 평가 */}
          <div className="p-5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <div className="flex items-start gap-3">
              <riskLevel.icon className={`h-6 w-6 ${riskLevel.color} mt-1 shrink-0`} />
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  폐업 위험도: <span className={riskLevel.color}>{riskLevel.level}</span>
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  현재 {industryLabel}의 평균 위험도는 <strong className={riskLevel.color}>{avgRiskScore.toFixed(1)}%</strong>
                  입니다.
                </p>
                {avgRiskScore > 60 ? (
                  <div className="space-y-1 text-sm">
                    <p className="text-red-700">
                      ⚠️ 이 업종은 폐업 위험이 높습니다. 신규 창업 시 충분한 자본과 운영 경험이 필요합니다.
                    </p>
                    <p className="text-muted-foreground">
                      • 권장사항: 6개월 이상 운영비 확보, 차별화된 경쟁력 필수, 멘토 또는 컨설팅 활용
                    </p>
                  </div>
                ) : avgRiskScore > 40 ? (
                  <div className="space-y-1 text-sm">
                    <p className="text-orange-700">
                      💡 보통 수준의 위험도입니다. 철저한 준비와 꾸준한 관리가 필요합니다.
                    </p>
                    <p className="text-muted-foreground">
                      • 권장사항: 3-6개월 운영비 확보, 시장 조사 및 입지 분석 필수, 초기 마케팅 예산 확보
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1 text-sm">
                    <p className="text-green-700">
                      ✓ 상대적으로 안정적인 업종입니다. 기본적인 운영 역량만 갖춰도 성공 가능성이 높습니다.
                    </p>
                    <p className="text-muted-foreground">
                      • 권장사항: 3개월 운영비 확보, 기본적인 입지 분석, 차별화 포인트 1-2가지 준비
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 매출 분석 */}
          <div className="p-5 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
            <div className="flex items-start gap-3">
              <TrendingUp className={`h-6 w-6 ${revenueLevel.color} mt-1 shrink-0`} />
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  매출 수준: <span className={revenueLevel.color}>{revenueLevel.level}</span>
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  월평균 매출 <strong className={revenueLevel.color}>₩{(avgRevenue / 10000).toFixed(0)}만원</strong>,
                  고객당 평균 소비{" "}
                  <strong className={revenueLevel.color}>₩{customerSpending.toLocaleString()}원</strong>
                </p>
                <div className="space-y-1 text-sm">
                  <p className={revenueLevel.color}>{revenueLevel.description}</p>
                  <p className="text-muted-foreground">
                    • 업종 특성: 고객 단가가{" "}
                    {customerSpending > 30000
                      ? "높은 편으로, 고급화 전략 가능"
                      : customerSpending > 15000
                      ? "중간 수준으로, 중가 시장 공략 적합"
                      : "낮은 편으로, 대중적인 가격 정책 필요"}
                  </p>
                  <p className="text-muted-foreground">
                    • 예상 손익분기점: 월 ₩{Math.round(avgRevenue * 0.7).toLocaleString()}원 (고정비 30% 가정)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 고객 분석 */}
          <div className="p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
            <div className="flex items-start gap-3">
              <CheckCircle className={`h-6 w-6 ${customerLevel.color} mt-1 shrink-0`} />
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  고객 유입: <span className={customerLevel.color}>{customerLevel.level}</span>
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  월평균 고객 수 <strong className={customerLevel.color}>{avgCustomers.toLocaleString()}명</strong>
                </p>
                <div className="space-y-1 text-sm">
                  <p className="text-muted-foreground">
                    •{" "}
                    {avgCustomers > 5000
                      ? "고객 유입이 많은 업종입니다. 회전율과 서비스 속도가 중요합니다."
                      : avgCustomers > 3000
                      ? "적정 수준의 고객 유입입니다. 재방문율 향상에 집중하세요."
                      : "상대적으로 고객 수가 적습니다. 고객당 단가와 충성도가 핵심입니다."}
                  </p>
                  <p className="text-muted-foreground">
                    • 일일 예상 고객 수: 약 {Math.round(avgCustomers / 30)}명 (월 30일 기준)
                  </p>
                  <p className="text-muted-foreground">
                    • 권장 전략:{" "}
                    {avgCustomers > 5000
                      ? "효율적인 운영 시스템, POS 활용, 키오스크 도입 검토"
                      : avgCustomers > 3000
                      ? "멤버십/포인트 제도, SNS 마케팅, 이벤트 기획"
                      : "VIP 고객 관리, 프리미엄 서비스, 1:1 맞춤 응대"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 종합 권장사항 */}
          <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-2 border-yellow-200">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-yellow-600" />
              <span>종합 권장사항</span>
            </h3>
            <div className="space-y-3 text-sm">
              <p className="flex items-start gap-2">
                <span className="text-yellow-600 font-bold shrink-0">1.</span>
                <span>
                  <strong>초기 자본:</strong> 최소 ₩{Math.round(avgRevenue * 3).toLocaleString()}원 (3개월 운영비) +
                  점포 보증금 + 인테리어 비용 확보 필요
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-yellow-600 font-bold shrink-0">2.</span>
                <span>
                  <strong>준비 기간:</strong> 최소 {avgRiskScore > 60 ? "6개월" : avgRiskScore > 40 ? "3-4개월" : "2-3개월"}{" "}
                  이상 시장 조사 및 사업 계획 수립
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-yellow-600 font-bold shrink-0">3.</span>
                <span>
                  <strong>차별화 전략:</strong>{" "}
                  {avgRiskScore > 60
                    ? "강력한 차별화 포인트 3가지 이상 필수 (맛/서비스/분위기/가격)"
                    : avgRiskScore > 40
                    ? "명확한 차별화 포인트 1-2가지 준비 (특화 메뉴, 특색 있는 공간)"
                    : "기본적인 품질 유지와 친절한 서비스만으로도 충분"}
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-yellow-600 font-bold shrink-0">4.</span>
                <span>
                  <strong>마케팅 전략:</strong> 온라인 채널(인스타그램, 네이버 플레이스) + 오프라인 홍보(전단지, 현수막) 병행
                  권장. 초기 3개월은 적극적인 프로모션 필요.
                </span>
              </p>
              <p className="mt-4 text-xs text-muted-foreground border-t pt-3">
                * 위 분석은 성동구 데이터 기반 통계이며, 실제 성과는 입지, 운영 능력, 시장 환경에 따라 크게 달라질 수
                있습니다. 창업 전 반드시 전문가 상담 및 현장 실사를 진행하세요.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

