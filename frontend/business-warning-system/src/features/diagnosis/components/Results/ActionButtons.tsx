import { BarChart3, Bell, Download, Lightbulb, MessageCircle, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";

interface ActionButtonsProps {
  onDownloadPDF: () => void;
}

export function ActionButtons({ onDownloadPDF }: ActionButtonsProps) {
  return (
    <>
      <div className="flex flex-wrap gap-4 justify-center mb-10">
        <Button asChild size="lg" className="gap-2 rounded-2xl shadow-lg hover:shadow-xl transition-all">
          <Link to="/action-plan">
            <Lightbulb className="h-5 w-5" />
            개선 계획 수립
          </Link>
        </Button>
        <Button asChild size="lg" className="gap-2 rounded-2xl shadow-lg hover:shadow-xl transition-all">
          <Link to="/consultation">
            <MessageCircle className="h-5 w-5" />
            AI 상담 받기
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="gap-2 glass-hover rounded-2xl bg-transparent">
          <Link to="/notifications">
            <Bell className="h-5 w-5" />
            알림 센터
          </Link>
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="gap-2 glass-hover rounded-2xl bg-transparent"
          onClick={onDownloadPDF}
        >
          <Download className="h-5 w-5" />
          상세 보고서 다운로드
        </Button>
        <Button asChild size="lg" variant="outline" className="gap-2 glass-hover rounded-2xl bg-transparent">
          <Link to="/compare">
            <BarChart3 className="h-5 w-5" />
            다른 업종과 비교하기
          </Link>
        </Button>
        <Button asChild size="lg" variant="secondary" className="gap-2 rounded-3xl">
          <Link to="/dashboard">
            <TrendingUp className="h-5 w-5" />
            정기 모니터링 설정
          </Link>
        </Button>
      </div>

      <Card className="glass-card rounded-3xl">
        <CardContent className="pt-8 pb-8">
          <div className="flex gap-4">
            <Lightbulb className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-3">진단 결과를 저장하고 싶으신가요?</h3>
              <p className="text-base text-muted-foreground mb-6">
                회원가입 후 대시보드에서 과거 진단 기록을 확인하고 추세를 분석할 수 있습니다.
              </p>
              <Button asChild variant="default" size="sm" className="rounded-xl">
                <Link to="/dashboard">대시보드로 이동</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

