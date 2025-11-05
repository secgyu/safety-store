import { DollarSign } from "lucide-react";
import { useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function CashFlowCalculator() {
  const [monthlyRevenue, setMonthlyRevenue] = useState("");
  const [monthlyCosts, setMonthlyCosts] = useState("");
  const [initialCash, setInitialCash] = useState("");

  const calculateCashFlow = () => {
    const revenue = Number.parseFloat(monthlyRevenue) || 0;
    const costs = Number.parseFloat(monthlyCosts) || 0;
    const initial = Number.parseFloat(initialCash) || 0;

    const monthlyFlow = revenue - costs;
    const projections = [];

    for (let i = 1; i <= 6; i++) {
      const balance = initial + monthlyFlow * i;
      projections.push({
        month: i,
        balance,
        flow: monthlyFlow,
      });
    }

    return { monthlyFlow, projections };
  };

  const cashFlow = calculateCashFlow();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-600" />
          <CardTitle>현금흐름 예측</CardTitle>
        </div>
        <CardDescription>월 매출과 비용을 입력하여 향후 6개월 현금흐름을 예측하세요</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="monthly-revenue">월 예상 매출 (원)</Label>
            <Input
              id="monthly-revenue"
              type="number"
              placeholder="예: 50000000"
              value={monthlyRevenue}
              onChange={(e) => setMonthlyRevenue(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthly-costs">월 총 비용 (원)</Label>
            <Input
              id="monthly-costs"
              type="number"
              placeholder="예: 40000000 (고정비 + 변동비)"
              value={monthlyCosts}
              onChange={(e) => setMonthlyCosts(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">임대료, 인건비, 원재료비, 공과금 등 모든 비용 합계</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="initial-cash">초기 현금 보유액 (원)</Label>
            <Input
              id="initial-cash"
              type="number"
              placeholder="예: 20000000"
              value={initialCash}
              onChange={(e) => setInitialCash(e.target.value)}
            />
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border-2 border-green-200">
          <h3 className="font-semibold text-lg mb-4 text-center">월별 현금 흐름</h3>

          <div className="mb-4 p-4 bg-white rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-1">월 순 현금흐름</p>
            <p
              className={`text-3xl font-bold ${
                cashFlow.monthlyFlow >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {cashFlow.monthlyFlow >= 0 ? "+" : ""}
              ₩{(cashFlow.monthlyFlow / 10000).toFixed(0)}만
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {cashFlow.monthlyFlow >= 0 ? "매달 흑자입니다" : "매달 적자입니다"}
            </p>
          </div>

          <div className="space-y-2">
            {cashFlow.projections.map((proj) => (
              <div key={proj.month} className="flex items-center justify-between p-3 bg-white rounded-lg">
                <span className="font-medium">{proj.month}개월 후</span>
                <div className="text-right">
                  <p
                    className={`font-bold ${
                      proj.balance >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    ₩{(proj.balance / 10000).toFixed(0)}만
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ({proj.flow >= 0 ? "+" : ""}
                    {(proj.flow / 10000).toFixed(0)}만/월)
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-yellow-600" />
            💡 활용 팁
          </h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• 현금흐름이 마이너스면 빠르게 비용을 줄이거나 매출을 늘려야 합니다</li>
            <li>• 초기 운영비는 최소 3-6개월치 고정비를 확보하는 것이 안전합니다</li>
            <li>
              • 계절적 요인, 비수기를 고려하여 보수적으로 예측하세요
            </li>
            <li>• 현금이 바닥나기 전에 대출이나 추가 투자를 고려해야 합니다</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

