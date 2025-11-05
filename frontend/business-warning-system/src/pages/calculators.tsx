import { Calculator, DollarSign, Home, TrendingUp } from "lucide-react";

import { AppHeader } from "@/shared/components/layout/AppHeader";
import {
  BreakEvenCalculator,
  CashFlowCalculator,
  LoanCalculator,
  RentRatioCalculator,
} from "@/shared/components/calculators";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";

export default function CalculatorsPage() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

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

          <TabsContent value="breakeven" className="mt-6">
            <BreakEvenCalculator />
          </TabsContent>

          <TabsContent value="cashflow" className="mt-6">
            <CashFlowCalculator />
          </TabsContent>

          <TabsContent value="loan" className="mt-6">
            <LoanCalculator />
          </TabsContent>

          <TabsContent value="rent" className="mt-6">
            <RentRatioCalculator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
