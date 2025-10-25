import { useState } from "react";
import { ArrowLeft, Calculator, TrendingUp, DollarSign, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";

export default function CalculatorsPage() {
  // Break-even calculator state
  const [fixedCosts, setFixedCosts] = useState("");
  const [variableCost, setVariableCost] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");

  // Cash flow calculator state
  const [monthlyRevenue, setMonthlyRevenue] = useState("");
  const [monthlyCosts, setMonthlyCosts] = useState("");
  const [initialCash, setInitialCash] = useState("");

  // Loan calculator state
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTerm, setLoanTerm] = useState("");

  // Rent ratio calculator state
  const [monthlyRent, setMonthlyRent] = useState("");
  const [monthlySales, setMonthlySales] = useState("");

  // Break-even calculation
  const calculateBreakEven = () => {
    const fixed = Number.parseFloat(fixedCosts) || 0;
    const variable = Number.parseFloat(variableCost) || 0;
    const price = Number.parseFloat(sellingPrice) || 0;

    if (price <= variable) return { units: 0, revenue: 0 };

    const units = Math.ceil(fixed / (price - variable));
    const revenue = units * price;

    return { units, revenue };
  };

  // Cash flow calculation
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

  // Loan calculation
  const calculateLoan = () => {
    const principal = Number.parseFloat(loanAmount) || 0;
    const rate = Number.parseFloat(interestRate) / 100 / 12 || 0;
    const term = Number.parseFloat(loanTerm) * 12 || 0;

    if (rate === 0) {
      return {
        monthlyPayment: principal / term,
        totalPayment: principal,
        totalInterest: 0,
      };
    }

    const monthlyPayment = (principal * rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);
    const totalPayment = monthlyPayment * term;
    const totalInterest = totalPayment - principal;

    return {
      monthlyPayment: isNaN(monthlyPayment) ? 0 : monthlyPayment,
      totalPayment: isNaN(totalPayment) ? 0 : totalPayment,
      totalInterest: isNaN(totalInterest) ? 0 : totalInterest,
    };
  };

  // Rent ratio calculation
  const calculateRentRatio = () => {
    const rent = Number.parseFloat(monthlyRent) || 0;
    const sales = Number.parseFloat(monthlySales) || 0;

    if (sales === 0) return { ratio: 0, status: "데이터 없음" };

    const ratio = (rent / sales) * 100;

    let status = "";
    if (ratio < 10) status = "매우 좋음";
    else if (ratio < 15) status = "좋음";
    else if (ratio < 20) status = "주의";
    else status = "위험";

    return { ratio, status };
  };

  const breakEven = calculateBreakEven();
  const cashFlow = calculateCashFlow();
  const loan = calculateLoan();
  const rentRatio = calculateRentRatio();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Button asChild variant="ghost" size="sm">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              홈으로
            </Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Calculator className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">재무 계산기 모음</h1>
              <p className="text-muted-foreground">사업 운영에 필요한 핵심 재무 지표를 계산하세요</p>
            </div>
          </div>
        </div>

        {/* Calculators */}
        <Tabs defaultValue="breakeven" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto">
            <TabsTrigger value="breakeven" className="flex items-center gap-2 py-3">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">손익분기점</span>
            </TabsTrigger>
            <TabsTrigger value="cashflow" className="flex items-center gap-2 py-3">
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">현금흐름</span>
            </TabsTrigger>
            <TabsTrigger value="loan" className="flex items-center gap-2 py-3">
              <Calculator className="h-4 w-4" />
              <span className="hidden sm:inline">대출 상환</span>
            </TabsTrigger>
            <TabsTrigger value="rent" className="flex items-center gap-2 py-3">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">임대료 비율</span>
            </TabsTrigger>
          </TabsList>

          {/* Break-even Calculator */}
          <TabsContent value="breakeven" className="mt-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>손익분기점 계산기</CardTitle>
                  <CardDescription>고정비와 변동비를 입력하여 손익분기점을 계산하세요</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fixedCosts">월 고정비 (원)</Label>
                    <Input
                      id="fixedCosts"
                      type="number"
                      placeholder="예: 3000000"
                      value={fixedCosts}
                      onChange={(e) => setFixedCosts(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">임대료, 인건비, 보험료 등</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="variableCost">개당 변동비 (원)</Label>
                    <Input
                      id="variableCost"
                      type="number"
                      placeholder="예: 5000"
                      value={variableCost}
                      onChange={(e) => setVariableCost(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">재료비, 포장비 등</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sellingPrice">개당 판매가 (원)</Label>
                    <Input
                      id="sellingPrice"
                      type="number"
                      placeholder="예: 15000"
                      value={sellingPrice}
                      onChange={(e) => setSellingPrice(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>계산 결과</CardTitle>
                  <CardDescription>손익분기점 달성을 위한 목표</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center p-6 bg-primary/5 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">손익분기점 판매량</p>
                    <p className="text-4xl font-bold text-primary">{breakEven.units.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground mt-1">개</p>
                  </div>
                  <div className="text-center p-6 bg-secondary/5 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">손익분기점 매출</p>
                    <p className="text-4xl font-bold text-secondary">{breakEven.revenue.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground mt-1">원</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      월 {breakEven.units.toLocaleString()}개 이상 판매하면 이익이 발생합니다.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Cash Flow Calculator */}
          <TabsContent value="cashflow" className="mt-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>현금흐름 예측</CardTitle>
                  <CardDescription>향후 6개월간 현금 흐름을 예측하세요</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="monthlyRevenue">월 평균 매출 (원)</Label>
                    <Input
                      id="monthlyRevenue"
                      type="number"
                      placeholder="예: 10000000"
                      value={monthlyRevenue}
                      onChange={(e) => setMonthlyRevenue(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthlyCosts">월 평균 지출 (원)</Label>
                    <Input
                      id="monthlyCosts"
                      type="number"
                      placeholder="예: 7000000"
                      value={monthlyCosts}
                      onChange={(e) => setMonthlyCosts(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="initialCash">현재 보유 현금 (원)</Label>
                    <Input
                      id="initialCash"
                      type="number"
                      placeholder="예: 5000000"
                      value={initialCash}
                      onChange={(e) => setInitialCash(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>예측 결과</CardTitle>
                  <CardDescription>6개월 현금 흐름 전망</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-6 bg-primary/5 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">월 순현금흐름</p>
                    <p className={`text-4xl font-bold ${cashFlow.monthlyFlow >= 0 ? "text-success" : "text-danger"}`}>
                      {cashFlow.monthlyFlow >= 0 ? "+" : ""}
                      {cashFlow.monthlyFlow.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">원</p>
                  </div>
                  <div className="space-y-2">
                    {cashFlow.projections.map((proj) => (
                      <div key={proj.month} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <span className="text-sm font-medium">{proj.month}개월 후</span>
                        <span className={`text-sm font-bold ${proj.balance >= 0 ? "text-success" : "text-danger"}`}>
                          {proj.balance.toLocaleString()}원
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Loan Calculator */}
          <TabsContent value="loan" className="mt-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>대출 상환 시뮬레이터</CardTitle>
                  <CardDescription>대출 조건을 입력하여 상환 계획을 확인하세요</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="loanAmount">대출 금액 (원)</Label>
                    <Input
                      id="loanAmount"
                      type="number"
                      placeholder="예: 50000000"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="interestRate">연 이자율 (%)</Label>
                    <Input
                      id="interestRate"
                      type="number"
                      step="0.1"
                      placeholder="예: 4.5"
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="loanTerm">대출 기간 (년)</Label>
                    <Input
                      id="loanTerm"
                      type="number"
                      placeholder="예: 5"
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>상환 계획</CardTitle>
                  <CardDescription>월 상환액과 총 이자 비용</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center p-6 bg-primary/5 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">월 상환액</p>
                    <p className="text-4xl font-bold text-primary">{loan.monthlyPayment.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground mt-1">원</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">총 상환액</p>
                      <p className="text-lg font-bold">{loan.totalPayment.toLocaleString()}원</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">총 이자</p>
                      <p className="text-lg font-bold text-danger">{loan.totalInterest.toLocaleString()}원</p>
                    </div>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      {Number.parseFloat(loanTerm) * 12}개월 동안 매월 {loan.monthlyPayment.toLocaleString()}원을
                      상환합니다.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Rent Ratio Calculator */}
          <TabsContent value="rent" className="mt-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>임대료 대비 매출 비율</CardTitle>
                  <CardDescription>임대료가 매출에서 차지하는 비율을 확인하세요</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="monthlyRent">월 임대료 (원)</Label>
                    <Input
                      id="monthlyRent"
                      type="number"
                      placeholder="예: 2000000"
                      value={monthlyRent}
                      onChange={(e) => setMonthlyRent(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthlySales">월 매출 (원)</Label>
                    <Input
                      id="monthlySales"
                      type="number"
                      placeholder="예: 15000000"
                      value={monthlySales}
                      onChange={(e) => setMonthlySales(e.target.value)}
                    />
                  </div>
                  <div className="p-4 bg-muted rounded-lg space-y-2">
                    <p className="text-sm font-medium">권장 비율</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• 10% 미만: 매우 좋음</li>
                      <li>• 10-15%: 좋음</li>
                      <li>• 15-20%: 주의 필요</li>
                      <li>• 20% 이상: 위험</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>분석 결과</CardTitle>
                  <CardDescription>임대료 부담 수준</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center p-6 bg-primary/5 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">임대료 비율</p>
                    <p className="text-4xl font-bold text-primary">{rentRatio.ratio.toFixed(1)}%</p>
                  </div>
                  <div
                    className={`text-center p-6 rounded-lg ${
                      rentRatio.status === "매우 좋음"
                        ? "bg-success/10"
                        : rentRatio.status === "좋음"
                        ? "bg-secondary/10"
                        : rentRatio.status === "주의"
                        ? "bg-warning/10"
                        : "bg-danger/10"
                    }`}
                  >
                    <p className="text-sm text-muted-foreground mb-2">평가</p>
                    <p
                      className={`text-3xl font-bold ${
                        rentRatio.status === "매우 좋음"
                          ? "text-success"
                          : rentRatio.status === "좋음"
                          ? "text-secondary"
                          : rentRatio.status === "주의"
                          ? "text-warning"
                          : "text-danger"
                      }`}
                    >
                      {rentRatio.status}
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      {rentRatio.status === "매우 좋음" && "임대료 부담이 매우 낮습니다. 안정적인 운영이 가능합니다."}
                      {rentRatio.status === "좋음" && "임대료 부담이 적절한 수준입니다."}
                      {rentRatio.status === "주의" && "임대료 부담이 다소 높습니다. 매출 증대가 필요합니다."}
                      {rentRatio.status === "위험" && "임대료 부담이 매우 높습니다. 임대료 협상이나 이전을 고려하세요."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
