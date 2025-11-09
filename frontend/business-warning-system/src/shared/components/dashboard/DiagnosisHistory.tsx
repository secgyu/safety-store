import { Calendar, Eye } from "lucide-react";
import { Link } from "react-router-dom";

import { useRecentDiagnosis } from "@/features/diagnosis";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type AlertLevel = "GREEN" | "YELLOW" | "ORANGE" | "RED";

interface HistoryRecord {
  id: string;
  date: string;
  riskScore: number;
  alert: AlertLevel;
  salesChange: number;
  customerChange: number;
}

interface DiagnosisHistoryProps {
  records: HistoryRecord[];
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

export function DiagnosisHistory({ records }: DiagnosisHistoryProps) {
  const { data: recentDiagnosis } = useRecentDiagnosis();

  if (recentDiagnosis === null) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            진단 이력
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">아직 진단 기록이 없습니다</p>
            <Button asChild>
              <Link to="/diagnose">첫 진단 받기</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          진단 이력
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">과거 진단 기록을 확인하고 변화 추이를 비교해보세요</p>
        <div className="space-y-3">
          {recentDiagnosis && (
            <div
              // key={record.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1">
                {/* <div className="flex items-center gap-3 mb-2">
                  {getAlertBadge(record.alert)}
                  <span className="font-bold text-lg">{record.riskScore}점</span>
                  <span className="text-sm text-muted-foreground">{formatDate(record.date)}</span>
                </div> */}
                <div className="flex gap-4 text-sm">
                  {/* <span className={"text-success"}>사업자명 : {recentDiagnosis.businessName}</span> */}
                  <span className={"text-success"}>진단일 : {formatDate(recentDiagnosis.createdAt)}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Link to="/diagnose">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Eye className="h-4 w-4" />
                    보기
                  </Button>
                </Link>
                {/* <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  PDF
                </Button> */}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
