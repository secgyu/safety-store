import { Calculator } from "lucide-react";
import { useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTerm, setLoanTerm] = useState("");

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
      monthlyPayment: Number.isNaN(monthlyPayment) ? 0 : monthlyPayment,
      totalPayment: Number.isNaN(totalPayment) ? 0 : totalPayment,
      totalInterest: Number.isNaN(totalInterest) ? 0 : totalInterest,
    };
  };

  const loan = calculateLoan();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-purple-600" />
          <CardTitle>대출 상환 계산기</CardTitle>
        </div>
        <CardDescription>대출 금액과 이자율을 입력하여 월 상환액을 계산하세요</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="loan-amount">대출 금액 (원)</Label>
            <Input
              id="loan-amount"
              type="number"
              placeholder="예: 50000000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="interest-rate">연 이자율 (%)</Label>
            <Input
              id="interest-rate"
              type="number"
              step="0.1"
              placeholder="예: 4.5"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">은행 이자율 참고: 정책자금 2-4%, 일반 신용대출 4-8%</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="loan-term">상환 기간 (년)</Label>
            <Input
              id="loan-term"
              type="number"
              placeholder="예: 5"
              value={loanTerm}
              onChange={(e) => setLoanTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200">
          <h3 className="font-semibold text-lg mb-4 text-center">상환 계획</h3>
          <div className="grid gap-4">
            <div className="text-center p-4 bg-white rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">월 상환액</p>
              <p className="text-3xl font-bold text-purple-600">₩{(loan.monthlyPayment / 10000).toFixed(1)}만</p>
              <p className="text-xs text-muted-foreground mt-1">
                매월 동일한 금액 ({Math.round(Number.parseFloat(loanTerm) * 12 || 0)}회)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-white rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">총 상환액</p>
                <p className="text-2xl font-bold text-blue-600">₩{(loan.totalPayment / 10000).toFixed(0)}만</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">총 이자</p>
                <p className="text-2xl font-bold text-red-600">₩{(loan.totalInterest / 10000).toFixed(0)}만</p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-white rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">해석:</strong> 매달{" "}
              <strong className="text-purple-600">₩{loan.monthlyPayment.toLocaleString()}원</strong>씩{" "}
              <strong>{Math.round(Number.parseFloat(loanTerm) * 12 || 0)}개월</strong>동안 상환하면,
              원금 외에 이자로 <strong className="text-red-600">₩{loan.totalInterest.toLocaleString()}원</strong>을
              더 내게 됩니다.
            </p>
          </div>
        </div>

        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Calculator className="h-4 w-4 text-yellow-600" />
            💡 활용 팁
          </h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• 월 상환액이 월 순이익의 50%를 넘지 않도록 하세요</li>
            <li>• 상환 기간이 길수록 월 부담은 줄지만 총 이자는 늘어납니다</li>
            <li>• 정책자금 대출(소상공인진흥공단, 신용보증재단 등)은 이자가 낮습니다</li>
            <li>• 여유가 있다면 중도상환으로 이자를 절약할 수 있습니다</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

