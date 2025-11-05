import { RiskCard } from "../RiskIndicators/RiskCard";

interface RiskComponents {
  sales_risk: number;
  customer_risk: number;
  market_risk: number;
}

interface RiskDetailCardsProps {
  riskComponents: RiskComponents;
  getScoreDescription: (type: "sales" | "customer" | "market", score: number) => string;
}

export function RiskDetailCards({ riskComponents, getScoreDescription }: RiskDetailCardsProps) {
  return (
    <div className="mb-10">
      <h2 className="text-3xl font-bold mb-8">상세 분석</h2>
      <div className="grid md:grid-cols-3 gap-6">
        <RiskCard
          type="sales"
          value={riskComponents.sales_risk}
          description={getScoreDescription("sales", riskComponents.sales_risk)}
        />
        <RiskCard
          type="customer"
          value={riskComponents.customer_risk}
          description={getScoreDescription("customer", riskComponents.customer_risk)}
        />
        <RiskCard
          type="market"
          value={riskComponents.market_risk}
          description={getScoreDescription("market", riskComponents.market_risk)}
        />
      </div>
    </div>
  );
}
