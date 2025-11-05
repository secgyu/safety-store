import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useToast } from "@/shared/hooks/use-toast";
import { client } from "@/shared/lib/api-client";

type AlertLevel = "GREEN" | "YELLOW" | "ORANGE" | "RED";

export type ResultData = {
  p_final: number;
  alert: AlertLevel;
  risk_components: {
    sales_risk: number;
    customer_risk: number;
    market_risk: number;
  };
  recommendations: Array<{
    title: string;
    description: string;
    priority: "high" | "medium" | "low";
  }>;
  revenue_ratio?: number;
};

export type DiagnosisInfo = {
  encoded_mct: string;
  business_name: string;
};

export function useResultData() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [resultData, setResultData] = useState<ResultData | null>(null);
  const [diagnosisInfo, setDiagnosisInfo] = useState<DiagnosisInfo | null>(null);
  const [encodedMct, setEncodedMct] = useState<string>("");

  useEffect(() => {
    const loadDiagnosisResult = async () => {
      try {
        setLoading(true);

        // 1단계: 내가 진단한 기록이 있는지 API로 확인
        const recentResponse = await client.GET("/api/diagnose/recent");

        if (!recentResponse.data || !recentResponse.data.encodedMct) {
          // 진단 기록이 없으면 진단 페이지로
          toast({
            title: "진단 기록 없음",
            description: "진단을 먼저 진행해주세요.",
            variant: "default",
          });
          navigate("/diagnose");
          return;
        }

        const { encodedMct: mctCode, businessName } = recentResponse.data;
        setEncodedMct(mctCode);

        // 2단계: encoded_mct로 실제 진단 결과 조회
        const diagnosisResponse = await client.POST("/api/diagnose/predict", {
          body: { encodedMct: mctCode },
        });

        const apiResult = diagnosisResponse.data;

        if (!apiResult) {
          throw new Error("진단 결과를 받아오지 못했습니다.");
        }

        // API 응답을 ResultData 형식으로 매핑
        const mappedResult: ResultData = {
          p_final: apiResult.overallScore || 0,
          alert: (apiResult.riskLevel || "GREEN") as AlertLevel,
          risk_components: {
            sales_risk: apiResult.components?.sales?.score || 0,
            customer_risk: apiResult.components?.customer?.score || 0,
            market_risk: apiResult.components?.market?.score || 0,
          },
          recommendations: (apiResult.recommendations || []).map((r) => ({
            ...r,
            priority: r.priority as "high" | "medium" | "low",
          })),
          revenue_ratio: apiResult.revenueRatio ?? undefined,
        };

        // diagnosisInfo 설정
        setDiagnosisInfo({
          encoded_mct: mctCode,
          business_name: businessName,
        });

        setResultData(mappedResult);
        setLoading(false);
      } catch (error) {
        console.error("[ERROR] Failed to load diagnosis:", error);
        toast({
          title: "오류 발생",
          description: "진단 결과를 불러오는데 실패했습니다.",
          variant: "destructive",
        });
        setLoading(false);
        navigate("/diagnose");
      }
    };

    loadDiagnosisResult();
  }, [navigate, toast]);

  return { loading, resultData, diagnosisInfo, encodedMct };
}

