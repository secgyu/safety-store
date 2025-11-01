import { AlertCircle, ArrowLeft, BarChart3, CheckCircle2, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            홈으로 돌아가기
          </Link>
        </Button>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">이용 가이드</h1>
          <p className="text-lg text-muted-foreground mb-12">
            사업 안전 진단 서비스를 효과적으로 활용하는 방법을 안내합니다.
          </p>

          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">시작하기</h2>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      진단 시작하기
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-muted-foreground">홈페이지에서 "진단 하기" 버튼을 클릭하여 진단을 시작합니다.</p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                      <li>회원가입 후 바로 진단 가능합니다</li>
                      <li>약 3분 정도 소요됩니다</li>
                      <li>모바일에서도 편리하게 이용할 수 있습니다</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      정보 입력하기
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-muted-foreground">챗봇이 안내하는 질문에 답변해주세요.</p>
                    <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                      <p className="font-semibold text-sm">필요한 정보:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                        <li>사업체 코드</li>
                        <li>가게이름</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                      결과 확인하기
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-muted-foreground">AI가 분석한 위험도와 개선 방안을 확인합니다.</p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                      <li>전체 위험도 점수 및 등급</li>
                      <li>매출, 고객, 시장 분석 상세 결과</li>
                      <li>맞춤형 개선 제안</li>
                      <li>업종 평균과의 비교</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6">위험도 등급 이해하기</h2>
              <div className="space-y-4">
                <Card className="border-l-4 border-l-success">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="h-6 w-6 text-success" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-2">안전 (GREEN) - 0-25점</h3>
                        <p className="text-muted-foreground mb-3">
                          사업이 안정적으로 운영되고 있습니다. 현재 상태를 유지하면서 성장 기회를 모색하세요.
                        </p>
                        <p className="text-sm font-semibold">권장 조치:</p>
                        <ul className="list-disc list-inside text-sm text-muted-foreground ml-4">
                          <li>정기적인 모니터링 유지</li>
                          <li>고객 만족도 관리</li>
                          <li>신규 고객 유치 전략 수립</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-warning">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-warning/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="h-6 w-6 text-warning" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-2">주의 (YELLOW) - 26-50점</h3>
                        <p className="text-muted-foreground mb-3">
                          일부 지표에서 주의가 필요합니다. 조기에 개선 조치를 취하면 위험을 예방할 수 있습니다.
                        </p>
                        <p className="text-sm font-semibold">권장 조치:</p>
                        <ul className="list-disc list-inside text-sm text-muted-foreground ml-4">
                          <li>매출 및 고객 추세 면밀히 관찰</li>
                          <li>비용 구조 점검 및 최적화</li>
                          <li>마케팅 활동 강화</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-alert">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-alert/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="h-6 w-6 text-alert" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-2">경고 (ORANGE) - 51-75점</h3>
                        <p className="text-muted-foreground mb-3">
                          여러 지표에서 경고 신호가 나타나고 있습니다. 즉시 개선 계획을 수립하고 실행해야 합니다.
                        </p>
                        <p className="text-sm font-semibold">권장 조치:</p>
                        <ul className="list-disc list-inside text-sm text-muted-foreground ml-4">
                          <li>전문가 상담 고려</li>
                          <li>사업 모델 재검토</li>
                          <li>긴급 비용 절감 방안 마련</li>
                          <li>추가 수익원 발굴</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-danger">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-danger/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <BarChart3 className="h-6 w-6 text-danger" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-2">위험 (RED) - 76-100점</h3>
                        <p className="text-muted-foreground mb-3">
                          폐업 위험이 매우 높은 상태입니다. 즉각적인 조치와 전문가의 도움이 필요합니다.
                        </p>
                        <p className="text-sm font-semibold">권장 조치:</p>
                        <ul className="list-disc list-inside text-sm text-muted-foreground ml-4">
                          <li>전문 컨설팅 즉시 받기</li>
                          <li>금융기관 상담 (대출 조정 등)</li>
                          <li>정부 지원 프로그램 확인</li>
                          <li>사업 전환 또는 정리 검토</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6">효과적인 활용 팁</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">정기적인 진단</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    월 1회 정기적으로 진단을 받아 추세를 파악하세요. 조기에 문제를 발견하면 대응이 훨씬 쉽습니다.
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">정확한 데이터 입력</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    가능한 한 정확한 매출과 고객 수를 입력하세요. 정확한 데이터가 더 신뢰할 수 있는 결과를 만듭니다.
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">업종 비교 활용</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    같은 업종의 다른 사업장과 비교하여 우리 가게의 상대적 위치를 파악하세요.
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">개선 제안 실행</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    AI가 제안하는 개선 방안을 우선순위에 따라 하나씩 실행해보세요. 작은 변화가 큰 차이를 만듭니다.
                  </CardContent>
                </Card>
              </div>
            </section>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground mb-4">더 자세한 도움이 필요하신가요?</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild variant="default">
                    <Link to="/support">고객 지원 문의</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/faq">FAQ 보기</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
