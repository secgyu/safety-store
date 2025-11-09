import { AlertCircle, Calendar, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

import { RiskGauge } from "@/features/diagnosis/components/RiskIndicators/RiskGauge";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type AlertLevel = "GREEN" | "YELLOW" | "ORANGE" | "RED";

interface LatestDiagnosis {
  date: string;
  riskScore: number;
  alert: AlertLevel;
  salesChange: number;
  customerChange: number;
}

interface TrendAnalysis {
  text: string;
  color: string;
  icon: React.ReactNode;
}

interface LatestDiagnosisSummaryProps {
  diagnosis: LatestDiagnosis;
  trendAnalysis?: TrendAnalysis | null;
}

function getAlertBadge(alert: AlertLevel) {
  switch (alert) {
    case "GREEN":
      return <Badge className="bg-success/10 text-success hover:bg-success/20 border-success/20">안전</Badge>;
    case "YELLOW":
      return <Badge className="bg-warning/10 text-warning hover:bg-warning/20 border-warning/20">주의</Badge>;
    case "ORANGE":
      return <Badge className="bg-alert/10 text-alert hover:bg-alert/20 border-alert/20">경고</Badge>;
    case "RED":
      return <Badge className="bg-danger/10 text-danger hover:bg-danger/20 border-danger/20">위험</Badge>;
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function LatestDiagnosisSummary({ diagnosis, trendAnalysis }: LatestDiagnosisSummaryProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6 mb-8">
      {/* Latest Diagnosis */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            최신 진단 결과
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <RiskGauge value={diagnosis.riskScore} alert={diagnosis.alert} size="medium" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                {getAlertBadge(diagnosis.alert)}
                <span className="text-2xl font-bold">{diagnosis.riskScore}/100</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4 flex items-center gap-2 justify-center md:justify-start">
                <Calendar className="h-4 w-4" />
                {formatDate(diagnosis.date)}
              </p>
              {trendAnalysis && (
                <div className={`flex items-center gap-2 mb-4 justify-center md:justify-start ${trendAnalysis.color}`}>
                  {trendAnalysis.icon}
                  <span className="text-sm font-medium">{trendAnalysis.text}</span>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 bg-white rounded-lg">
                  <p className="text-muted-foreground mb-1">매출 변화</p>
                  <p
                    className={`font-semibold ${
                      diagnosis.salesChange > 0 ? "text-success" : diagnosis.salesChange < 0 ? "text-danger" : "text-muted-foreground"
                    }`}
                  >
                    {diagnosis.salesChange > 0 ? "+" : ""}
                    {diagnosis.salesChange}%
                  </p>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <p className="text-muted-foreground mb-1">고객 변화</p>
                  <p
                    className={`font-semibold ${
                      diagnosis.customerChange > 0
                        ? "text-success"
                        : diagnosis.customerChange < 0
                        ? "text-danger"
                        : "text-muted-foreground"
                    }`}
                  >
                    {diagnosis.customerChange > 0 ? "+" : ""}
                    {diagnosis.customerChange}%
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <Button asChild className="flex-1">
              <Link to="/results">상세 보기</Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link to="/diagnose">새 진단</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>빠른 액션</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button asChild variant="outline" className="w-full justify-start gap-3 h-auto py-4">
            <Link to="/action-plan">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <div className="text-left flex-1">
                <p className="font-semibold">개선 계획 확인</p>
                <p className="text-xs text-muted-foreground">진행 중인 실행 계획을 확인하세요</p>
              </div>
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full justify-start gap-3 h-auto py-4">
            <Link to="/compare">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div className="text-left flex-1">
                <p className="font-semibold">업종 비교</p>
                <p className="text-xs text-muted-foreground">다른 업종과 비교 분석하세요</p>
              </div>
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full justify-start gap-3 h-auto py-4">
            <Link to="/insights">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div className="text-left flex-1">
                <p className="font-semibold">인사이트 보기</p>
                <p className="text-xs text-muted-foreground">맞춤 인사이트를 확인하세요</p>
              </div>
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

