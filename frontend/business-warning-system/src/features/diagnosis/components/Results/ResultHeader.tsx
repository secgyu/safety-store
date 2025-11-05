import { Card, CardContent } from "@/shared/components/ui/card";

import { RiskGauge } from "../RiskIndicators/RiskGauge";

type AlertLevel = "GREEN" | "YELLOW" | "ORANGE" | "RED";

interface ResultHeaderProps {
  riskScore: number;
  alertLevel: AlertLevel;
  alertInfo: {
    label: string;
    color: string;
    description: string;
  };
}

export function ResultHeader({ riskScore, alertLevel, alertInfo }: ResultHeaderProps) {
  return (
    <Card className="mb-10 glass-card rounded-3xl">
      <CardContent className="pt-10 pb-10">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="flex-shrink-0">
            <RiskGauge value={riskScore} alert={alertLevel} size="large" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              현재 안전점수는 <span className={alertInfo.color}>'{alertInfo.label}'</span> 단계입니다
            </h1>
            <p className="text-xl text-muted-foreground mb-6">{alertInfo.description}</p>
            <p className="text-lg text-muted-foreground">
              우리 가게는 같은 업종 평균보다{" "}
              <span className="font-semibold">{riskScore > 20 ? "조금 낮은" : "양호한"}</span> 상태입니다
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
