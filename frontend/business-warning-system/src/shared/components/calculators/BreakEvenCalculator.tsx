import { TrendingUp } from "lucide-react";
import { useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function BreakEvenCalculator() {
  const [fixedCosts, setFixedCosts] = useState("");
  const [variableCost, setVariableCost] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");

  const calculateBreakEven = () => {
    const fixed = Number.parseFloat(fixedCosts) || 0;
    const variable = Number.parseFloat(variableCost) || 0;
    const price = Number.parseFloat(sellingPrice) || 0;

    if (price <= variable) return { units: 0, revenue: 0 };

    const units = Math.ceil(fixed / (price - variable));
    const revenue = units * price;

    return { units, revenue };
  };

  const breakEven = calculateBreakEven();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <CardTitle>손익분기점 계산기</CardTitle>
        </div>
        <CardDescription>고정비와 변동비를 입력하여 손익분기점을 계산하세요</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="fixed-costs">월 고정비 (원)</Label>
            <Input
              id="fixed-costs"
              type="number"
              placeholder="예: 3000000 (임대료, 인건비 등)"
              value={fixedCosts}
              onChange={(e) => setFixedCosts(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">임대료, 인건비, 공과금 등 매달 고정적으로 나가는 비용</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="variable-cost">제품/서비스당 변동비 (원)</Label>
            <Input
              id="variable-cost"
              type="number"
              placeholder="예: 5000 (원재료비 등)"
              value={variableCost}
              onChange={(e) => setVariableCost(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">제품/서비스 1개당 드는 원재료비, 포장비 등</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="selling-price">판매가 (원)</Label>
            <Input
              id="selling-price"
              type="number"
              placeholder="예: 15000"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">제품/서비스의 판매가격</p>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
          <h3 className="font-semibold text-lg mb-4 text-center">손익분기점</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="text-center p-4 bg-white rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">필요 판매량</p>
              <p className="text-3xl font-bold text-blue-600">{breakEven.units.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">개/건</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">필요 매출액</p>
              <p className="text-3xl font-bold text-purple-600">
                ₩{(breakEven.revenue / 10000).toFixed(0)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">만원</p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-white rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">해석:</strong> 한 달에 최소{" "}
              <strong className="text-blue-600">{breakEven.units.toLocaleString()}개</strong>를 팔아야 적자가 나지 않습니다.
              이는 매출 기준 <strong className="text-purple-600">₩{breakEven.revenue.toLocaleString()}원</strong>에
              해당합니다.
            </p>
          </div>
        </div>

        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-yellow-600" />
            💡 활용 팁
          </h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• 손익분기점 이하면 적자, 이상이면 흑자입니다</li>
            <li>• 일일 판매 목표: 약 {Math.ceil(breakEven.units / 30)}개 (월 30일 기준)</li>
            <li>• 판매가를 올리거나 고정비/변동비를 줄이면 손익분기점이 낮아집니다</li>
            <li>• 현실적으로 달성 가능한 판매량인지 검토하세요</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

