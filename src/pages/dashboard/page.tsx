import { Link } from "@/lib/next-compat";
import { Calendar, TrendingUp, AlertCircle, Eye, Download, MessageCircle, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RiskGauge } from "@/components/risk-gauge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Badge } from "@/components/ui/badge";
import { AppHeader } from "@/components/app-header";
import { Breadcrumb } from "@/components/breadcrumb";
import { useDiagnosisHistory, useAuth } from "@/lib/api";

type AlertLevel = "GREEN" | "YELLOW" | "ORANGE" | "RED";

type HistoryRecord = {
  id: string;
  date: string;
  riskScore: number;
  alert: AlertLevel;
  salesChange: number;
  customerChange: number;
};

export default function DashboardPage() {
  const { data: authData } = useAuth();
  const { data: diagnosisData, isLoading } = useDiagnosisHistory();

  // Convert API data to UI format
  const historyData: HistoryRecord[] =
    diagnosisData?.diagnoses.map((d) => ({
      id: d.id,
      date: d.createdAt,
      riskScore: d.overallScore,
      alert: d.riskLevel,
      salesChange: d.components.sales.score - 50, // Mock calculation
      customerChange: d.components.customer.score - 50, // Mock calculation
    })) || [];

  const latestDiagnosis = historyData[0] || {
    id: "1",
    date: new Date().toISOString(),
    riskScore: 0,
    alert: "GREEN" as AlertLevel,
    salesChange: 0,
    customerChange: 0,
  };

  const chartData = historyData
    .slice()
    .reverse()
    .map((record) => ({
      date: new Date(record.date).toLocaleDateString("ko-KR", { month: "short", day: "numeric" }),
      risk: record.riskScore,
    }));

  const getAlertBadge = (alert: AlertLevel) => {
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
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getTrendAnalysis = () => {
    if (historyData.length < 2) return null;

    const recent = historyData[0].riskScore;
    const previous = historyData[1].riskScore;
    const change = recent - previous;

    if (change > 0) {
      return {
        text: `지난 달 대비 ${change}%p 증가`,
        color: "text-danger",
        icon: <TrendingUp className="h-5 w-5 text-danger" />,
      };
    } else if (change < 0) {
      return {
        text: `지난 달 대비 ${Math.abs(change)}%p 감소`,
        color: "text-success",
        icon: <TrendingUp className="h-5 w-5 text-success rotate-180" />,
      };
    }
    return {
      text: "지난 달과 동일",
      color: "text-muted-foreground",
      icon: <TrendingUp className="h-5 w-5 text-muted-foreground rotate-90" />,
    };
  };

  const trendAnalysis = getTrendAnalysis();

  if (isLoading) {
    return (
      <>
        <AppHeader />
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">진단 기록을 불러오는 중...</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AppHeader />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Breadcrumb items={[{ label: "대시보드" }]} />
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              {authData?.user.name ? `${authData.user.name}님의 대시보드` : "내 대시보드"}
            </h1>
            <p className="text-lg text-muted-foreground">우리 가게의 위험도 추세를 확인하고 관리하세요</p>
          </div>

          {/* Latest Diagnosis Summary */}
          <Card className="mb-8 border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                최근 진단 결과
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <RiskGauge value={latestDiagnosis.riskScore} alert={latestDiagnosis.alert} size="medium" />
                </div>
                <div className="flex-1 space-y-4 w-full">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">진단 날짜</p>
                    <p className="text-lg font-semibold">{formatDate(latestDiagnosis.date)}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">매출 변화</p>
                      <p
                        className={`text-2xl font-bold ${
                          latestDiagnosis.salesChange >= 0 ? "text-success" : "text-danger"
                        }`}
                      >
                        {latestDiagnosis.salesChange > 0 ? "+" : ""}
                        {latestDiagnosis.salesChange}%
                      </p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">고객 변화</p>
                      <p
                        className={`text-2xl font-bold ${
                          latestDiagnosis.customerChange >= 0 ? "text-success" : "text-danger"
                        }`}
                      >
                        {latestDiagnosis.customerChange > 0 ? "+" : ""}
                        {latestDiagnosis.customerChange}%
                      </p>
                    </div>
                  </div>
                  {trendAnalysis && (
                    <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                      {trendAnalysis.icon}
                      <span className={`text-sm font-medium ${trendAnalysis.color}`}>{trendAnalysis.text}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Time Series Chart */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>위험도 추세</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" tick={{ fill: "#6b7280" }} />
                  <YAxis
                    tick={{ fill: "#6b7280" }}
                    domain={[0, 100]}
                    label={{ value: "위험도 (%)", angle: -90, position: "insideLeft" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [`${value}%`, "위험도"]}
                  />
                  {/* Risk level zones */}
                  <ReferenceLine y={20} stroke="#10b981" strokeDasharray="3 3" label="안전" />
                  <ReferenceLine y={40} stroke="#f59e0b" strokeDasharray="3 3" label="주의" />
                  <ReferenceLine y={60} stroke="#f97316" strokeDasharray="3 3" label="경고" />
                  <Line
                    type="monotone"
                    dataKey="risk"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: "#3b82f6", r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-success" />
                  <span className="text-sm text-muted-foreground">안전 (0-20%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-warning" />
                  <span className="text-sm text-muted-foreground">주의 (20-40%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-alert" />
                  <span className="text-sm text-muted-foreground">경고 (40-60%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-danger" />
                  <span className="text-sm text-muted-foreground">위험 (60-100%)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* History Table */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>진단 기록</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {historyData.map((record) => (
                  <div
                    key={record.id}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium">{formatDate(record.date)}</p>
                        <p className="text-sm text-muted-foreground">
                          매출 {record.salesChange > 0 ? "+" : ""}
                          {record.salesChange}% • 고객 {record.customerChange > 0 ? "+" : ""}
                          {record.customerChange}%
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold">{record.riskScore}%</p>
                        {getAlertBadge(record.alert)}
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/results?id=${record.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              <Link href="/action-plan">
                <TrendingUp className="h-5 w-5" />
                개선 계획 수립
              </Link>
            </Button>
            <Button asChild size="lg" className="gap-2 bg-gradient-to-r from-primary to-blue-600">
              <Link href="/consultation">
                <MessageCircle className="h-5 w-5" />
                AI 상담 받기
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent gap-2">
              <Link href="/notifications">
                <Bell className="h-5 w-5" />
                알림 센터
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent">
              <Link href="/diagnose">새로운 진단 시작</Link>
            </Button>
            <Button size="lg" variant="outline" className="gap-2 bg-transparent">
              <Download className="h-5 w-5" />
              전체 기록 다운로드
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent">
              <Link href="/settings">설정</Link>
            </Button>
          </div>

          {/* Alert Info */}
          <Card className="mt-8 bg-amber-50 border-amber-200">
            <CardContent className="pt-6 pb-6">
              <div className="flex gap-4">
                <AlertCircle className="h-6 w-6 text-warning flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">정기 진단을 권장합니다</h3>
                  <p className="text-sm text-muted-foreground">
                    매월 정기적으로 진단을 받으면 위험 요인을 조기에 발견하고 대응할 수 있습니다. 다음 진단 권장일은{" "}
                    <span className="font-semibold">2025년 2월 10일</span>입니다.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
