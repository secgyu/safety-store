type ScoreLevel = "excellent" | "good" | "fair" | "average" | "caution" | "warning" | "danger";
type RiskType = "sales" | "customer" | "market";

const getScoreLevel = (score: number): ScoreLevel => {
  if (score >= 90) return "excellent";
  if (score >= 80) return "good";
  if (score >= 70) return "fair";
  if (score >= 60) return "average";
  if (score >= 50) return "caution";
  if (score >= 40) return "warning";
  return "danger";
};

const scoreMessages: Record<RiskType, Record<ScoreLevel, string>> = {
  sales: {
    excellent: "매출이 매우 안정적이고 지속적으로 성장하고 있어요",
    good: "매출이 양호하고 꾸준히 유지되고 있습니다",
    fair: "매출이 평균 수준을 유지하고 있어요",
    average: "매출이 약간 불안정한 모습을 보이고 있습니다",
    caution: "최근 매출이 소폭 감소하는 경향이 있어요",
    warning: "매출이 평균보다 감소했어요. 개선이 필요합니다",
    danger: "매출이 크게 감소했어요. 즉시 조치가 필요합니다",
  },
  customer: {
    excellent: "고객 만족도가 매우 높고 충성 고객이 많아요",
    good: "고객 수가 안정적으로 증가하고 있습니다",
    fair: "고객 수가 평균 수준을 유지하고 있어요",
    average: "고객 수가 정체되어 있습니다",
    caution: "고객 수가 소폭 감소하는 추세입니다",
    warning: "고객 수가 감소하고 있어요. 고객 유지 전략이 필요합니다",
    danger: "고객 이탈이 심각합니다. 긴급 대응이 필요해요",
  },
  market: {
    excellent: "시장 경쟁력이 매우 우수하고 입지가 탁월합니다",
    good: "시장에서 안정적인 위치를 확보하고 있어요",
    fair: "지역 시장에서 평균적인 경쟁력을 보이고 있습니다",
    average: "시장 경쟁이 다소 치열해지고 있어요",
    caution: "지역 시장 경쟁이 증가하고 있습니다",
    warning: "경쟁 심화로 시장 점유율이 감소하고 있어요",
    danger: "시장 경쟁에서 밀리고 있습니다. 차별화 전략이 시급해요",
  },
};

/**
 * 점수에 따른 설명 문구를 생성하는 함수
 */
export function getScoreDescription(type: RiskType, score: number): string {
  const level = getScoreLevel(score);
  return scoreMessages[type][level];
}

