import { Home } from "lucide-react";
import { useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function RentRatioCalculator() {
  const [monthlyRent, setMonthlyRent] = useState("");
  const [monthlySales, setMonthlySales] = useState("");

  const calculateRentRatio = () => {
    const rent = Number.parseFloat(monthlyRent) || 0;
    const sales = Number.parseFloat(monthlySales) || 0;

    if (sales === 0) return { ratio: 0, status: "데이터 없음", color: "text-gray-600" };

    const ratio = (rent / sales) * 100;

    let status = "";
    let color = "";
    if (ratio < 10) {
      status = "매우 좋음";
      color = "text-green-600";
    } else if (ratio < 15) {
      status = "좋음";
      color = "text-blue-600";
    } else if (ratio < 20) {
      status = "주의";
      color = "text-orange-600";
    } else {
      status = "위험";
      color = "text-red-600";
    }

    return { ratio, status, color };
  };

  const rentRatio = calculateRentRatio();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Home className="h-5 w-5 text-orange-600" />
          <CardTitle>임대료 비율 분석</CardTitle>
        </div>
        <CardDescription>매출 대비 임대료 비율을 분석하여 적정성을 판단하세요</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="monthly-rent">월 임대료 (원)</Label>
            <Input
              id="monthly-rent"
              type="number"
              placeholder="예: 3000000"
              value={monthlyRent}
              onChange={(e) => setMonthlyRent(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">월세 + 관리비 + 기타 부동산 관련 비용</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthly-sales">월 매출 (원)</Label>
            <Input
              id="monthly-sales"
              type="number"
              placeholder="예: 50000000"
              value={monthlySales}
              onChange={(e) => setMonthlySales(e.target.value)}
            />
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg border-2 border-orange-200">
          <h3 className="font-semibold text-lg mb-4 text-center">임대료 비율</h3>

          <div className="text-center mb-6">
            <p className={`text-5xl font-bold ${rentRatio.color}`}>{rentRatio.ratio.toFixed(1)}%</p>
            <p className={`text-xl font-semibold mt-2 ${rentRatio.color}`}>{rentRatio.status}</p>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-white rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">월 임대료</span>
                <span className="text-lg font-bold">₩{(Number.parseFloat(monthlyRent) / 10000 || 0).toFixed(0)}만</span>
              </div>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">월 매출</span>
                <span className="text-lg font-bold">₩{(Number.parseFloat(monthlySales) / 10000 || 0).toFixed(0)}만</span>
              </div>
            </div>
          </div>

          {/* 적정 비율 가이드 */}
          <div className="mt-6 p-4 bg-white rounded-lg">
            <h4 className="font-semibold mb-3 text-sm">임대료 비율 가이드</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>매우 좋음</span>
                </span>
                <span className="text-muted-foreground">10% 미만</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span>좋음</span>
                </span>
                <span className="text-muted-foreground">10-15%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span>주의</span>
                </span>
                <span className="text-muted-foreground">15-20%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span>위험</span>
                </span>
                <span className="text-muted-foreground">20% 이상</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Home className="h-4 w-4 text-yellow-600" />
            💡 활용 팁
          </h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>
              • <strong>10% 미만:</strong> 임대료 부담이 낮아 안정적인 운영이 가능합니다
            </li>
            <li>
              • <strong>10-15%:</strong> 일반적으로 적정한 수준입니다
            </li>
            <li>
              • <strong>15-20%:</strong> 약간 높은 편입니다. 매출 증대 또는 비용 절감이 필요합니다
            </li>
            <li>
              • <strong>20% 이상:</strong> 위험 수준입니다. 임대료 재협상이나 이전을 고려하세요
            </li>
            <li>• 업종별로 적정 비율이 다를 수 있습니다 (고마진 업종은 높아도 괜찮음)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

