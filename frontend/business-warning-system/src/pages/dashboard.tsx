import { TrendingUp } from "lucide-react";

import { useAuth } from "@/features/auth";
import { useResultData } from "@/features/diagnosis/hooks/useResultData";
import { DiagnosisHistory, LatestDiagnosisSummary, RiskTrendChart } from "@/shared/components/dashboard";
import { AppHeader } from "@/shared/components/layout/AppHeader";

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

  // Mock data for now
  const historyData: HistoryRecord[] = [];

  const { resultData: latestDiagnosis0, encodedMct } = useResultData(false);

  console.log(latestDiagnosis0, encodedMct);

  const latestDiagnosis = {
    date: new Date().toISOString(),
    riskScore: latestDiagnosis0?.p_final || 0,
    alert: latestDiagnosis0?.alert || "GREEN",
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

  return (
    <>
      <AppHeader />
      <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">안녕하세요, {authData?.user?.name || "사업자"}님 👋</h1>
            <p className="text-lg text-muted-foreground">오늘도 건강한 사업 운영을 응원합니다</p>
          </div>

          {/* Latest Diagnosis Summary */}
          <LatestDiagnosisSummary diagnosis={latestDiagnosis} trendAnalysis={trendAnalysis} />

          {/* Risk Trend Chart */}
          <RiskTrendChart data={chartData} />

          {/* Diagnosis History */}
          <DiagnosisHistory records={historyData} />
        </div>
      </div>
    </>
  );
}
