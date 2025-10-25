import {
  ArrowRight,
  BarChart3,
  Shield,
  TrendingUp,
  CheckCircle2,
  Users,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserMenu } from "@/components/user-menu";
import { OnboardingTour } from "@/components/onboarding-tour";
import { hasCompletedOnboarding, markOnboardingComplete } from "@/lib/onboarding";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import RootLayout from "./layout";

export default function HomePage() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Check if user has completed onboarding
    if (!hasCompletedOnboarding()) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = () => {
    markOnboardingComplete();
    setShowOnboarding(false);
  };

  return (
    <RootLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/30">
        {showOnboarding && <OnboardingTour onComplete={handleOnboardingComplete} />}

        {/* Header */}
        <header className="glass sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">사업 안전 진단</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/diagnose"
                data-tour="diagnose-button"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                진단하기
              </Link>
              <Link
                to="/compare"
                data-tour="compare-link"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                업종 비교
              </Link>
              <Link
                to="/calculators"
                data-tour="calculators-link"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                재무 계산기
              </Link>
              <Link
                to="/support"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                고객 지원
              </Link>
              <Link
                to="/notifications"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
              </Link>
              <UserMenu />
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-8 text-balance leading-tight">
              우리 가게, 안전할까요?
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-6 text-pretty leading-relaxed">
              매출과 고객 데이터로 폐업 위험을 미리 알아보세요
            </p>
            <p className="text-lg text-muted-foreground mb-12">3분만에 우리 가게 건강 체크 • 무료 진단 • AI 분석</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="text-lg px-10 py-7 h-auto rounded-2xl shadow-lg hover:shadow-xl transition-all"
              >
                <Link to="/diagnose">
                  지금 바로 무료 진단받기
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-lg px-10 py-7 h-auto rounded-2xl glass-hover bg-transparent"
              >
                <Link to="/compare">업종별 통계 보기</Link>
              </Button>
            </div>

            {/* Trust Indicator */}
            <div className="mt-16 flex items-center justify-center gap-2 text-muted-foreground">
              <Users className="h-5 w-5" />
              <span className="text-sm">이미 1,000+ 자영업자가 사용중</span>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">어떻게 분석하나요?</h2>
            <p className="text-center text-muted-foreground mb-16 text-xl max-w-2xl mx-auto leading-relaxed">
              간단한 3단계로 우리 가게의 건강 상태를 확인하세요
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="glass-card glass-hover rounded-3xl">
                <CardContent className="pt-10 pb-10 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                    <BarChart3 className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">간단한 정보 입력</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    업종, 지역, 최근 매출과 고객 수만 입력하면 됩니다. 복잡한 서류는 필요 없어요.
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card glass-hover rounded-3xl">
                <CardContent className="pt-10 pb-10 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                    <TrendingUp className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">AI 위험도 분석</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    수천 개의 사업장 데이터를 학습한 AI가 우리 가게의 위험도를 정확하게 예측합니다.
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card glass-hover rounded-3xl">
                <CardContent className="pt-10 pb-10 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                    <CheckCircle2 className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">맞춤 개선 제안</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    위험 요인을 분석하고, 우리 가게에 딱 맞는 개선 방법을 제안해드립니다.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">정확한 위험도 예측</h2>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  매출 추세, 고객 변화, 지역 시장 상황을 종합적으로 분석하여 4단계 위험도로 표시합니다.
                </p>
                <ul className="space-y-6">
                  <li className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-xl bg-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-4 h-4 rounded-lg bg-success" />
                    </div>
                    <div>
                      <span className="font-semibold text-lg">안전 (GREEN)</span>
                      <span className="text-muted-foreground"> - 건강한 상태입니다</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-xl bg-warning/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-4 h-4 rounded-lg bg-warning" />
                    </div>
                    <div>
                      <span className="font-semibold text-lg">주의 (YELLOW)</span>
                      <span className="text-muted-foreground"> - 관심이 필요합니다</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-xl bg-alert/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-4 h-4 rounded-lg bg-alert" />
                    </div>
                    <div>
                      <span className="font-semibold text-lg">경고 (ORANGE)</span>
                      <span className="text-muted-foreground"> - 개선이 필요합니다</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-xl bg-danger/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-4 h-4 rounded-lg bg-danger" />
                    </div>
                    <div>
                      <span className="font-semibold text-lg">위험 (RED)</span>
                      <span className="text-muted-foreground"> - 즉시 조치가 필요합니다</span>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="glass-card rounded-3xl p-12 flex items-center justify-center min-h-[500px]">
                <div className="text-center">
                  <div className="w-56 h-56 mx-auto mb-8 relative">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="112" cy="112" r="100" stroke="#e5e7eb" strokeWidth="20" fill="none" />
                      <circle
                        cx="112"
                        cy="112"
                        r="100"
                        stroke="url(#gradient)"
                        strokeWidth="20"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 100 * 0.75} ${2 * Math.PI * 100}`}
                        strokeLinecap="round"
                        className="drop-shadow-lg"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="100%" stopColor="#14b8a6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div>
                        <div className="text-6xl font-bold text-foreground">75%</div>
                        <div className="text-base text-muted-foreground mt-2">안전</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-lg">실시간 위험도 분석</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">자주 묻는 질문</h2>

            <div className="space-y-6">
              <Card className="glass-card rounded-2xl">
                <CardContent className="pt-8 pb-8">
                  <h3 className="text-xl font-bold mb-3">진단 비용이 있나요?</h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    아니요, 완전 무료입니다. 회원가입 없이도 바로 진단을 받을 수 있습니다.
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card rounded-2xl">
                <CardContent className="pt-8 pb-8">
                  <h3 className="text-xl font-bold mb-3">입력한 정보는 안전한가요?</h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    네, 모든 데이터는 암호화되어 안전하게 보관됩니다. 개인정보는 분석 목적으로만 사용되며, 제3자에게
                    제공되지 않습니다.
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card rounded-2xl">
                <CardContent className="pt-8 pb-8">
                  <h3 className="text-xl font-bold mb-3">얼마나 정확한가요?</h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    수천 개의 실제 사업장 데이터를 학습한 AI 모델을 사용합니다. 평균 85% 이상의 예측 정확도를 보이고
                    있습니다.
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card rounded-2xl">
                <CardContent className="pt-8 pb-8">
                  <h3 className="text-xl font-bold mb-3">진단 결과를 저장할 수 있나요?</h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    네, 회원가입 후 대시보드에서 과거 진단 기록을 확인하고 추세를 분석할 수 있습니다.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto glass-card rounded-3xl p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-purple-500/20 -z-10" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">지금 바로 시작하세요</h2>
            <p className="text-xl mb-10 text-muted-foreground">3분이면 우리 가게의 건강 상태를 확인할 수 있습니다</p>
            <Button asChild size="lg" className="text-lg px-10 py-7 h-auto rounded-2xl shadow-xl">
              <Link to="/diagnose">
                무료 진단 시작하기
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>3분 소요</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <span>회원가입 불필요</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="glass mt-20">
          <div className="container mx-auto px-4 py-12">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                  <span className="font-bold">사업 안전 진단</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  소상공인을 위한 AI 기반 폐업 위험 조기경보 시스템
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  이메일: support@business-safety.kr
                  <br />
                  전화: 1588-0000
                </p>
                <div className="flex items-center gap-3">
                  <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">
                    <Facebook className="h-5 w-5" />
                  </Link>
                  <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">
                    <Twitter className="h-5 w-5" />
                  </Link>
                  <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">
                    <Instagram className="h-5 w-5" />
                  </Link>
                  <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">
                    <Youtube className="h-5 w-5" />
                  </Link>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-4">리소스</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link to="/blog" className="hover:text-foreground transition-colors">
                      블로그
                    </Link>
                  </li>
                  <li>
                    <Link to="/statistics" className="hover:text-foreground transition-colors">
                      자영업 통계
                    </Link>
                  </li>
                  <li>
                    <Link to="/insights" className="hover:text-foreground transition-colors">
                      업종별 인사이트
                    </Link>
                  </li>
                  <li>
                    <Link to="/success-stories" className="hover:text-foreground transition-colors">
                      성공 사례
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">고객 지원</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link to="/support" className="hover:text-foreground transition-colors">
                      문의하기
                    </Link>
                  </li>
                  <li>
                    <Link to="/faq" className="hover:text-foreground transition-colors">
                      자주 묻는 질문
                    </Link>
                  </li>
                  <li>
                    <Link to="/guide" className="hover:text-foreground transition-colors">
                      이용 가이드
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">약관 및 정책</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link to="/terms" className="hover:text-foreground transition-colors">
                      이용약관
                    </Link>
                  </li>
                  <li>
                    <Link to="/privacy" className="hover:text-foreground transition-colors">
                      개인정보처리방침
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
              <p>&copy; 2025 사업 안전 진단. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </RootLayout>
  );
}
