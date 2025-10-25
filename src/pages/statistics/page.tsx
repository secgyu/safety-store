import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStatistics } from "@/lib/api";
import { Link } from "react-router-dom";

export default function StatisticsPage() {
  const { data: stats, isLoading } = useStatistics();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">통계 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return <div>데이터를 불러올 수 없습니다.</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            홈으로
          </Link>
        </Button>

        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">자영업 통계</h1>
          <p className="text-xl text-muted-foreground">최신 자영업 데이터와 업종별 통계를 확인하세요</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>전체 사업체 수</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalBusinesses.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground mt-2">개</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>평균 폐업률</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-danger">{stats.closureRate}%</div>
              <p className="text-sm text-muted-foreground mt-2">전체 업종 평균</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>평균 생존 기간</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">{stats.averageSurvivalYears}년</div>
              <p className="text-sm text-muted-foreground mt-2">평균 운영 기간</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>업종별 폐업률</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.byIndustry.map((stat) => (
                  <div key={stat.industry} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{stat.industry}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{stat.closureRate}%</div>
                      <div className="text-sm text-muted-foreground">사업체 {(stat.count / 1000).toFixed(0)}K</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>개폐업 트렌드</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.trends.labels.map((label, index) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="font-medium">{label}</span>
                    <div className="flex gap-4">
                      <div className="text-right">
                        <div className="text-lg font-bold text-success">
                          {(stats.trends.openings[index] / 1000).toFixed(0)}K
                        </div>
                        <div className="text-xs text-muted-foreground">개업</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-danger">
                          {(stats.trends.closures[index] / 1000).toFixed(0)}K
                        </div>
                        <div className="text-xs text-muted-foreground">폐업</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-blue-50">
          <CardContent className="pt-6">
            <h3 className="text-xl font-bold mb-4">주요 시사점</h3>
            <ul className="space-y-2">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>전체 자영업 평균 폐업률은 {stats.closureRate}%로 높은 수준을 유지하고 있습니다.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>평균 생존 기간은 {stats.averageSurvivalYears}년으로, 체계적인 경영 관리가 필요합니다.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>업종별로 폐업률 편차가 크므로, 업종 특성을 고려한 전략이 중요합니다.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>정기적인 진단을 통해 위험 요소를 조기에 파악하고 대응하세요.</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
